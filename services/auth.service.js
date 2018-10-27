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
    ensureAuthorized: ensureAuthorized
};

/**
 * 
 * @param {{isUnauthenticated:()=>boolean, path: string, user: {id: string}}} req request object passed in by Express.js
 * @param {string} findByIdFns Functions that will return accounts given ids from route parameters.
 */

// assuming that routes are strings, not objects
// assuming that the route subtypes are :self and :all
// assuming that the route params (resource ids) are in 

// to check for :all, just replace :all with the paramID (AKA resource ID)
async function ensureAuthorized(req, findByIdFns) {
    // the requested route is given by req.baseUrl+req.path, to remove ? and other params
    const path = req.baseUrl + req.path;
    // splitPath[0] will be '', but assuming that routes will also start with '/', splitRoles will start with '' as well
    const splitPath = path.split("/");

    // if account doesn't have a role binding, then not authenticated
    const roleBinding = await RoleBinding.getRoleBindingForAcct(req.user.id);
    if (!roleBinding) {
        return false;
    }

    // get the route ids
    const twoDRoutes = roleBinding.roles.map((role) => {
        return role.routes;
    });
    const routes = [].concat(...twoDRoutes);

    // each route is an object with an uri and a request type
    // for each uri, separate by '/', check each section to see if it's the same as requested uri
    // if the uri at a section has ':all', mark it as valid
    // if the uri at a section has ':self', use the findByIdFns at particular index to check if accId matches
    // the request type of the incoming request and the matching request type of the route must be the same
    for (const route of routes) {
        // if the request types are different, go to next
        // the incoming request type is in req.method according to node v10.12.0 api
        if (route.requestType !== req.method)  {
            continue;
        }

        let splitRoute = route.uri.split("/");

        // if lengths are different, go to next
        if (splitRoute.length !== splitPath.length) {
            continue;
        }

        // keeps track of which function to use in findByIdFns
        let findByParamCount = 0;
        let validRoute = true;
        for (let i = 0; i < splitPath.length; i++) {
            // checks whether the current chunk in the route path is a parameter
            const isParam = Object.values(req.params).indexOf(splitPath[i]) > -1;
            // if the chunk is a parameter and there are no findByIdFns, continue
            if (isParam && !findByIdFns) {
                validRoute = false;
            }
            // checks if there is a valid findByIdFn, and that it returns the right accoutn id
            else if (splitRoute[i] === ":self" && isParam) {
                if (findByIdFns.length <= findByParamCount) {
                    validRoute = false;
                }
                else {
                    const object = await findByIdFns[findByParamCount](splitPath[i]);

                    // if the object doesn't exist
                    if (!object) {
                        validRoute = false;
                    }
                    // if the accountId isn't the same as users, and if the object isn't an account that's the user's
                    else if (object.accountId.toString() !== req.user.id && object._id.toString() !== req.user.id) {
                        validRoute = false;
                    }

                    findByParamCount += 1;
                }
            }
            // rest of the fail case:
            // the route portions cannot be the same and
            // the route portion from role binding cannot be a valid :all case
            else if (
                splitRoute[i] !== splitPath[i] &&
                !(splitRoute[i] === ":all" && isParam)
            ) {
                validRoute = false;
            }

            // if current route isn't valid, move on to next
            if (!validRoute) {
                break;
            }
        }

        if (validRoute) {
            return validRoute;
        }
    }
    return false;
}