"use strict";
const jwt = require("jsonwebtoken");

const Services = {
    Auth: require("../services/auth.service"),
    ResetPasswordToken: require("../services/resetPassword.service"),
    Account: require("../services/account.service"),
    Email: require("../services/email.service"),
    AccountConfirmation: require("../services/accountConfirmation.service")
};

const Middleware = {
    Util: require("./util.middleware")
};

const Constants = require("../constants");
/**
 * @returns {Fn} the middleware that will check that the user is properly authenticated.
 * Calls next() if the user is properly authenticated.
 */
function ensureAuthenticated() {
    return function (req, res, next) {
        if (req.isUnauthenticated()) {
            next({
                status: 401,
                message: "Not Authenticated",
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
                        status: 401,
                        message: "Not Authorized for this route",
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
    }
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
                message: "error while generating email"
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
 * which confirms their account
 * @param {{body: {email:String}}} req the request object
 * @param {*} res
 * @param {(err?)=>void} next
 */
async function sendConfirmAccountEmailMiddleware(req, res, next) {
    const account = req.body.account;
    await Services.AccountConfirmation.create(Constants.HACKER, account.email, account.id);
    const accountConfirmationToken = await Services.AccountConfirmation.findByAccountId(account.id);
    const token = Services.AccountConfirmation.generateToken(accountConfirmationToken.id, account.id);
    const mailData = Services.AccountConfirmation.generateAccountConfirmationEmail(req.hostname, account.email, Constants.HACKER, token);
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
 * @param {{body:{token:string}}} req 
 * @param {any} res 
 * @param {(err?)=>void} next 
 */
function parseAccountConfirmationToken(req, res, next) {
    jwt.verify(req.body.token, process.env.JWT_CONFIRM_ACC_SECRET, function (err, decoded) {
        if (err) {
            next(err);
        } else {
            req.body.decodedToken = decoded;
            next();
        }
    });
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
            status: 422,
            message: "Invalid token for confirming account",
            error: {}
        })
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
            status: 422,
            message: "invalid token",
            error: {}
        });
    }
}

/**
 * Verifies that the confirm account exists, and that the accountId exists.
 * @param {{body:{decodedToken:{accountConfirmationId:string, accountId:string}}}} req 
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
            status: 422,
            message: "Invalid token for confirming account",
            error: {}
        });
    }
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

module.exports = {
    //for each route, set up an authentication middleware for that route
    ensureAuthenticated: ensureAuthenticated,
    ensureAuthorized: ensureAuthorized,
    sendResetPasswordEmailMiddleware: Middleware.Util.asyncMiddleware(sendResetPasswordEmailMiddleware),
    parseResetToken: parseResetToken,
    validateResetToken: Middleware.Util.asyncMiddleware(validateResetToken),
    deleteResetToken: deleteResetToken,
    sendConfirmAccountEmailMiddleware: Middleware.Util.asyncMiddleware(sendConfirmAccountEmailMiddleware),
    parseAccountConfirmationToken: parseAccountConfirmationToken,
    validateConfirmationToken: Middleware.Util.asyncMiddleware(validateConfirmationToken),
    getAccountTypeFromConfirmationToken: Middleware.Util.asyncMiddleware(getAccountTypeFromConfirmationToken)
};