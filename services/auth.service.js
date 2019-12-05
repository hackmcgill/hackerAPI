"use strict";
const LocalStrategy = require("passport-local").Strategy;
const Account = require("../services/account.service");
const RoleBinding = require("../services/roleBinding.service");
const logger = require("./logger.service");

module.exports = {
    emailAndPassStrategy: new LocalStrategy(
        {
            usernameField: "email",
            passwordField: "password"
        },
        function(email, password, done) {
            email = email.toLowerCase();
            Account.getAccountIfValid(email, password).then(
                (account) => {
                    if (account) {
                        done(null, account);
                    } else {
                        done(null, false);
                    }
                },
                (reason) => {
                    done(reason, false);
                }
            );
        }
    ),
    /**
     * Takes as input the id of the user. If the user id exists, it passes the user object to the callback
     * (done). The two arguments of the callback must be (failureReason, userObject). If there is no user,
     * then the userObject will be undefined.
     */
    deserializeUser: function(id, done) {
        Account.findById(id).then(
            (user) => {
                done(null, user);
            },
            (reason) => {
                done(reason);
            }
        );
    },
    serializeUser: function(user, done) {
        done(null, user.id);
    },
    ensureAuthorized: ensureAuthorized
};

/**
 * @param {{params: string[], baseUrl: string, path: string, user: {id: string}}} req request object passed in by Express.js
 * @param {((param: string) => object)[]} findByIdFns Functions that will return accounts given ids from route parameters.
 * @return {boolean} Whether the user has permission to access the route
 */

// assuming that routes are strings, not objects
// assuming that the route subtypes are :self and :all
// assuming that the route params (resource ids) are in
// size of findByIdFns needs to match the number of route parameters

// to check for :all, just replace :all with the paramID (AKA resource ID)
async function ensureAuthorized(req, findByIdFns) {
    // if number of params doesn't match number of findById functions, fail
    if (!verifyParamsFunctions(req.params, findByIdFns)) {
        return false;
    }

    // the requested route is given by req.baseUrl+req.path, to remove ? and other params
    let path = req.baseUrl + req.path;
    // Make sure all paths end in '/'. This is important as we split the path by "/" and check the array length.
    if (path.slice(-1) !== "/") {
        path += "/";
    }
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
        if (route.requestType !== req.method) {
            continue;
        }

        let routeUri = route.uri;
        // Make sure all paths end in '/'. This is important as we split the path by "/" and check the array length.
        if (routeUri.slice(-1) !== "/") {
            routeUri += "/";
        }
        const splitRoute = routeUri.split("/");

        // keeps track of which function to use in findByIdFns
        let findByParamCount = 0;
        let currentlyValid = true;
        for (let i = 0; i < splitPath.length; i++) {
            // checks whether the current chunk in the route path is a parameter
            const isParam =
                Object.values(req.params).indexOf(splitPath[i]) > -1;

            // if current chunk isn't a parameter, then check whether auth route and request path are the same
            if (!isParam) {
                currentlyValid = splitRoute[i] === splitPath[i];
            } else {
                switch (splitRoute[i]) {
                    case ":all":
                        currentlyValid = true;
                        break;
                    case ":self":
                        currentlyValid = await verifySelfCase(
                            findByIdFns[findByParamCount],
                            splitPath[i],
                            req.user.id
                        );
                        findByParamCount += 1;
                        break;
                    default:
                        currentlyValid = false;
                        break;
                }
            }

            // if current route isn't valid, move on to next
            if (!currentlyValid) {
                break;
            }
        }

        if (currentlyValid) {
            return currentlyValid;
        }
    }
    return false;
}

/**
 * Makes sure that the number of params matches the number of id functions. If there are no route params, idFns should be null or an empty array.
 * @param {((param: string) => object)[]} idFns An array of functions that take as input a parameter, and return an object
 * @param {string[]} params List of route parameters
 * @return {boolean} Whether the number of route parameters matches with the number of idFns
 */
function verifyParamsFunctions(params, idFns) {
    let numParams = Object.values(params).length;
    let validRoute = true;

    if (numParams === 0) {
        validRoute = !idFns || idFns.length === 0;
    } else {
        validRoute = numParams === idFns.length;
    }

    return validRoute;
}

/**
 * Uses param with idFunction to check whether the returned object is the user account, or is linked to the user's account
 * @param {(string) => object} idFunction A function that will take a string and return an object
 * @param {string} param The route parameter
 * @param {ObjectId} userId The id of the user
 * @return {boolean} Whether the object found by the idFunction is the user's account or linked to the user's account
 */
async function verifySelfCase(idFunction, param, userId) {
    const object = await idFunction(param);
    if (!object) {
        return false;
    }

    // if the accountId exists (all cases except when object is an account)
    if (object.accountId) {
        return object.accountId.toString() === userId;
    }
    // no accountId so object is an account
    else {
        return object._id.toString() === userId;
    }
}
