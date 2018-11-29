"use strict";
const jwt = require("jsonwebtoken");
const passport = require("passport");

const Services = {
    Auth: require("../services/auth.service"),
    ResetPasswordToken: require("../services/resetPassword.service"),
    Account: require("../services/account.service"),
    Email: require("../services/email.service"),
    AccountConfirmation: require("../services/accountConfirmation.service"),
    Role: require("../services/role.service"),
    RoleBinding: require("../services/roleBinding.service")
};

const Middleware = {
    Util: require("./util.middleware")
};

const Constants = {
    General: require("../constants/general.constant"),
    Error: require("../constants/error.constant"),
};

/**
 * @param {*} req
 * @param {*} res
 * @param {(err?)=>void} next 
 * Calls passport.authenticate with a custom error handler. Errors during authentication will return res with a generic 500 error, 
 * Failed authentication returns a AUTH 401 error, and errors during login will return res with a LOGIN 500 error.
 */
function login(req, res, next) {
    passport.authenticate("emailAndPass",
        function (err, user) {
            if (err) {
                return next({
                    status: 500,
                    message: Constants.Error.GENERIC_500_MESSAGE,
                    error: {}
                });
            }
            if (!user) {
                return next({
                    status: 401,
                    message: Constants.Error.AUTH_401_MESSAGE,
                    error: {}
                });
            }
            req.login(user, (loginErr) => {
                if (loginErr) {
                    return next({
                        status: 500,
                        message: Constants.Error.LOGIN_500_MESSAGE,
                        error: {}
                    });
                }
                next();
            });
        })(req, res, next);
}

/**
 * @returns {Fn} the middleware that will check that the user is properly authenticated.
 * Calls next() if the user is properly authenticated.
 */
function ensureAuthenticated() {
    return function (req, res, next) {
        if (req.isUnauthenticated()) {
            next({
                status: 401,
                message: Constants.Error.AUTH_401_MESSAGE,
                error: {
                    route: req.path
                }
            });
        } else {
            next();
        }
    };
}

/**
 * @param {((paramId) => {Account})[]} findByIdFns the request object
 * @returns {Fn} the middleware that will check that the user is properly authorized.
 * Calls next() if the user is properly authorized.
 */
function ensureAuthorized(findByIdFns) {
    return function (req, res, next) {
        Services.Auth.ensureAuthorized(req, findByIdFns).then(
            (auth) => {
                if (!auth) {
                    next({
                        status: 403,
                        message: Constants.Error.AUTH_403_MESSAGE,
                        error: {
                            route: req.path
                        }
                    });
                } else {
                    next();
                }
            },
            (err) => {
                next(err);
            }
        );
    };
}

/**
 * Middleware which retrieves the rolebindings for an account
 * @param {{body: {param: {id:string}}}} req 
 * @param {*} res 
 * @param {(err?)=>void} next 
 */
async function retrieveRoleBindings(req, res, next) {
    const roleBindings = await Services.RoleBinding.getRoleBindingForAcct(req.params.id);
    if (!roleBindings) {
        return next({
            status: 404,
            message: "Role Bindings not found"
        })
    }
    req.roleBindings = roleBindings;
    next();
}

/**
 * Middleware that sends an email to reset the password for the inputted email address.
 * @param {{body: {email:String}}} req the request object
 * @param {*} res 
 * @param {(err?)=>void} next 
 */
async function sendResetPasswordEmailMiddleware(req, res, next) {
    const user = await Services.Account.findByEmail({
        email: req.body.email
    });
    if (user) {
        //create the reset password token
        await Services.ResetPasswordToken.create(user.id);
        //find the thing we just created
        const ResetPasswordTokenModel = await Services.ResetPasswordToken.findByAccountId(user.id);
        //generate email
        const token = Services.ResetPasswordToken.generateToken(ResetPasswordTokenModel.id, user.id);
        const mailData = Services.ResetPasswordToken.generateResetPasswordEmail(req.hostname, req.body.email, token);
        if (mailData !== undefined) {
            Services.Email.send(mailData, (err) => {
                if (err) {
                    next(err);
                } else {
                    next();
                }
            });
        } else {
            return next({
                message: Constants.Error.EMAIL_500_MESSAGE,
            });
        }
    } else {
        //Didn't find the user, but we don't want to throw an error because someone might be trying to see who has an account.
        next();
    }
}

/**
 * Middleware that sends an email to confirm the account for the inputted email address.
 * This is only sent on account creation for HACKERS as other users are sent an invite email
 * which confirms their account, if a user is another type they should be confirmed so an email is not
 * @param {{body: {email:String}}} req the request object
 * @param {*} res
 * @param {(err?)=>void} next
 */
async function sendConfirmAccountEmailMiddleware(req, res, next) {
    const account = req.body.account;
    if(account.confirmed){
        return next();
    }
    await Services.AccountConfirmation.create(Constants.General.HACKER, account.email, account.id);
    const accountConfirmationToken = await Services.AccountConfirmation.findByAccountId(account.id);
    const token = Services.AccountConfirmation.generateToken(accountConfirmationToken.id, account.id);
    const mailData = Services.AccountConfirmation.generateAccountConfirmationEmail(req.hostname, account.email, Constants.General.HACKER, token);
    if (mailData !== undefined) {
        Services.Email.send(mailData, (err) => {
            if (err) {
                next(err);
            } else {
                next();
            }
        });
    } else {
        return next({
            message: Constants.Error.EMAIL_500_MESSAGE,
        });
    }
}

/**
 * Middleware that resends an email to confirm the account for the inputted email address.
 * @param {{user {id : String}}} req the request object
 * @param {*} res
 * @param {(err?)=>void} next
 */
async function resendConfirmAccountEmail(req, res, next) {
    const account = await Services.Account.findById(req.user.id);
    if (account.confirmed) {
        return next({
            status: 422,
            message: "Account already confirmed"
        })
    }
    const accountConfirmationToken = await Services.AccountConfirmation.findByAccountId(account.id);
    if (!accountConfirmationToken) {
        return next({
            status: 428,
            message: "Account confirmation token does not exist"
        })
    }
    const token = Services.AccountConfirmation.generateToken(accountConfirmationToken.id, account.id);
    const mailData = Services.AccountConfirmation.generateAccountConfirmationEmail(req.hostname, account.email, accountConfirmationToken.accountType, token);
    if (mailData !== undefined) {
        Services.Email.send(mailData, (err) => {
            if (err) {
                next(err);
            } else {
                next();
            }
        });
    } else {
        return next({
            message: "Error while generating email"
        });
    }
}

/**
 * Attempts to parse the jwt token that is found in req.body.token using process.env.JWT_RESET_PWD_SECRET as the key.
 * Places the parsed object into req.body.decodedToken.
 * @param {{body:{token:string}}} req 
 * @param {any} res 
 * @param {(err?)=>void} next 
 */
function parseResetToken(req, res, next) {
    jwt.verify(req.body['x-reset-token'], process.env.JWT_RESET_PWD_SECRET, function (err, decoded) {
        if (err) {
            next(err);
        } else {
            req.body.decodedToken = decoded;
            next();
        }
    });
}

/**
 * Attempts to parse the jwt token that is found in req.body.token using process.env.JWT_CONFIRM_ACC_SECRET as the key.
 * Places the parsed object into req.body.decodedToken
 * If the token does not exist it just continues flow
 * @param {{body:{token:string}}} req 
 * @param {any} res 
 * @param {(err?)=>void} next 
 */
function parseAccountConfirmationToken(req, res, next) {
    if (!!req.body.token) {
        jwt.verify(req.body.token, process.env.JWT_CONFIRM_ACC_SECRET, function (err, decoded) {
            if (err) {
                next(err);
            } else {
                req.body.decodedToken = decoded;
            }
        });
    }
    next();
}

/**
 * Returns the type of account based on the confirmation token
 * @param {{body:{decodedToken:{accountConfirmationId:string, accountId:string}}}} req 
 * @param {any} res 
 * @param {(err?)=>void} next 
 */
async function getAccountTypeFromConfirmationToken(req, res, next) {
    const confirmationObj = await Services.AccountConfirmation.findById(req.body.decodedToken.accountConfirmationId);
    if (confirmationObj) {
        req.body.accountType = confirmationObj.accountType;
        next();
    } else {
        //Either the token was already used, it's invalid, or user does not exist.
        next({
            status: 401,
            message: Constants.Error.ACCOUNT_TOKEN_401_MESSAGE,
            error: {}
        });
    }
}

/**
 * Verifies that the resetId exists, and that the accountId exists.
 * @param {{body:{decodedToken:{resetId:string, accountId:string}}}} req 
 * @param {any} res 
 * @param {(err?)=>void} next 
 */
async function validateResetToken(req, res, next) {
    const resetObj = await Services.ResetPasswordToken.findById(req.body.decodedToken.resetId);
    const userObj = await Services.Account.findById(req.body.decodedToken.accountId);
    if (resetObj && userObj) {
        req.body.user = userObj;
        next();
    } else {
        //Either the token was already used, it's invalid, or user does not exist.
        next({
            status: 401,
            message: Constants.Error.ACCOUNT_TOKEN_401_MESSAGE,
            error: {}
        });
    }
}

/**
 * Verifies that the confirm account exists, and that the accountId exists.
 * @param {{body:{decodedToken:{accountConfirmationId: String, accountId: String}}}} req 
 * @param {any} res 
 * @param {(err?)=>void} next 
 */
async function validateConfirmationToken(req, res, next) {
    const confirmationObj = await Services.AccountConfirmation.findById(req.body.decodedToken.accountConfirmationId);
    const userObj = await Services.Account.findById(req.body.decodedToken.accountId);
    if (confirmationObj && userObj && (confirmationObj.accountId == userObj.id)) {
        userObj.confirmed = true;
        userObj.accountType = confirmationObj.accountType;
        await Services.Account.changeOneAccount(confirmationObj.accountId, userObj);
        req.body.user = userObj;
        next();
    } else {
        //Either the token was already used, it's invalid, or user does not exist.
        next({
            status: 401,
            message: Constants.Error.ACCOUNT_TOKEN_401_MESSAGE,
            error: {}
        });
    }
}

/**
 * 
 * @param {body: {decodedToken:{accountConfirmationId: String}}} req 
 * @param {*} res 
 * @param {*} next 
 */
async function validateConfirmationTokenWithoutAccount(req, res, next) {
    if (!!req.body.decodedToken) {
        const confirmationObj = await Services.AccountConfirmation.findById(req.body.decodedToken.accountConfirmationId);
        if (!confirmationObj.accountId) {
            req.body.accountDetails.confirmed = true;
            req.body.accountDetails.accountType = confirmationObj.accountType;
        }
    }
    next();
}


/**
 * Middleware that deletes the reset token in the db
 * @param {{body: {decodedToken:{resetId:String}}}} req the request object
 * @param {*} res 
 * @param {(err?)=>void} next 
 */
function deleteResetToken(req, res, next) {
    Services.ResetPasswordToken.deleteToken(req.body.decodedToken.resetId).then(
        () => {
            next();
        },
        (err) => {
            next(err);
        }
    );
}

/**
 * Middleware that creates rolebinding to access POST route for respective account
 * @param {{body: {account:{accountType:String, id: ObjectId}}}} req the request object
 * @param {*} res 
 * @param {(err?)=>void} next 
 */
async function addCreationRoleBindings(req, res, next) {
    // Get the default role for the account type given
    const roleName = Constants.General.POST_ROLES[req.body.account.accountType];
    await Services.RoleBinding.createRoleBindingByRoleName(req.body.account.id, roleName);
    await Services.RoleBinding.createRoleBindingByRoleName(req.body.account.id, "account");
    next();
}

/**
 * Adds proper account rolebindings on account creation
 * @param {string} roleName name of the role to be added to account
 */
function createRoleBindings(roleName = undefined) {
    return async (req, res, next) => {
        await Services.RoleBinding.createRoleBindingByRoleName(req.user.id, roleName);
        next();
    }
}

module.exports = {
    //for each route, set up an authentication middleware for that route
    login: login,
    ensureAuthenticated: ensureAuthenticated,
    ensureAuthorized: ensureAuthorized,
    sendResetPasswordEmailMiddleware: Middleware.Util.asyncMiddleware(sendResetPasswordEmailMiddleware),
    parseResetToken: parseResetToken,
    validateResetToken: Middleware.Util.asyncMiddleware(validateResetToken),
    deleteResetToken: deleteResetToken,
    sendConfirmAccountEmailMiddleware: Middleware.Util.asyncMiddleware(sendConfirmAccountEmailMiddleware),
    parseAccountConfirmationToken: parseAccountConfirmationToken,
    validateConfirmationToken: Middleware.Util.asyncMiddleware(validateConfirmationToken),
    getAccountTypeFromConfirmationToken: Middleware.Util.asyncMiddleware(getAccountTypeFromConfirmationToken),
    validateConfirmationTokenWithoutAccount: Middleware.Util.asyncMiddleware(validateConfirmationTokenWithoutAccount),
    createRoleBindings: createRoleBindings,
    addCreationRoleBindings: Middleware.Util.asyncMiddleware(addCreationRoleBindings),
    resendConfirmAccountEmail: Middleware.Util.asyncMiddleware(resendConfirmAccountEmail),
    retrieveRoleBindings: Middleware.Util.asyncMiddleware(retrieveRoleBindings),
    retrieveRoles: Middleware.Util.asyncMiddleware(retrieveRoles)
};