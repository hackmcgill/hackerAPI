"use strict";
const LocalStrategy = require("passport-local").Strategy;
const Account = require("../services/account.service");
const RoleBinding = require("../services/roleBinding.service");
const logger = require("./logger.service");

module.exports = {
    emailAndPassStrategy: new LocalStrategy({
        usernameField: "email",
        passwordField: "password"
    }, function (email, password, done) {
        email = email.toLowerCase();
        Account.getAccountIfValid(email, password).then(
            (account) => {
                if(!!account) {
                    done(null, account);
                } else {
                    done("Invalid email or password.", false);
                }
            },
            (reason) => {
                done(reason, false);
            }
        );
    }),
    /**
     * Takes as input the id of the user. If the user id exists, it passes the user object to the callback 
     * (done). The two arguments of the callback must be (failureReason, userObject). If there is no user,
     * then the userObject will be undefined.
     */
    deserializeUser: function (id, done) {
        Account.findById(id).then(
            (user) => {
                done(null, user);
            },
            (reason) => {
                done(reason);
            }
        );
    },
    serializeUser: function (user, done) {
        done(null, user.id);
    },
    ensureAuthenticated: ensureAuthenticated 
};

/**
 * 
 * @param {{isUnauthenticated:()=>boolean, path: string, user: {id: string}}} req request object passed in by Express.js
 * @param {string} routePermissionId the route name.
 */
async function ensureAuthenticated(req) {
    if (req.isUnauthenticated()) {
        return false;
    }
    const path = req.path;
    //get the roleBinding for a given user
    const roleBinding = await RoleBinding.getRoleBindingForAcct(req.user.id);
    if(!roleBinding) {
        //roleBinding doesn't exist
        return false;
    } else {
        const twoDRoutes = roleBinding.roles.map((role) => {
            return role.routes;
        });
        const routes = [].concat(...twoDRoutes);
        routes.forEach((route) => {
            //check if the current path matches the regex of this route.
            const parsedRoute = parseRoute(req, route);
            //do regex on parsedRoute with path
            //if valid, return true, else continue
        });
    }
    //for the roleBinding, iterate through the roles, and then through the routes.
}

/**
 * @param {string} userId the account ID
 * @param {string} route The route name that needs to be parsed
 * @returns {string} the parsed route with all tokens replaced
 */
function parseRoute(userId, route) {
    /**
     * Wildcards:
     * ":self:" replaced with the user's own id.
     * ":any:" replaced with [^\/]+
     * "/" replaced with \/ (for regular expression escaping)
     */
    let parsed = route;
    parsed = parsed.replace(":self:", userId);
    parsed = parsed.replace(":any:", "[^\/]+");
    parsed = parsed.replace("/", "\/");
    return parsed;
}
