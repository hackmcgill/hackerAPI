"use strict";

const Services = {
    Auth: require("../services/auth.service"),
    ResetPasswordToken: require("../services/resetPassword.service")
};

const Middleware = {
    Util: require("./util.middleware")
};

module.exports = {
    //for each route, set up an authentication middleware for that route, with the permission id.
    ensureAuthenticated: ensureAuthenticated,
    sendResetPasswordEmailMiddleware: Middleware.Util.asyncMiddleware(sendResetPasswordEmailMiddleware)
};

/**
 *
 * @param {string | undefined} routeName the name of the route that the user must be authenticated for, or undefined if 
 * the only requirement is to be logged in.
 * @returns {fn} the middleware that will check that the user is properly authenticated.
 * Calls next() if the user is properly authenticated.
 */
function ensureAuthenticated(routeName) {
    return function(req, res, next) {
        Services.Auth.ensureAuthenticated(req, routeName).then(
            (isAuthenticated) => {
                if(isAuthenticated) {
                    next();
                } else {
                    next({
                        message: "Not Authenticated",
                        data: {
                            route: routeName
                        }
                    });        
                }
            }
        ).catch((reason) => {
            next(reason);        
        });
    };
}

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
        const mailData = Services.ResetPasswordToken.generateResetPasswordEmail(req, ResetPasswordTokenModel.id, user.id);
        if (mailData !== undefined) {
            Services.Mailgun.sendMime(mailData, (err) => {
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
        next();
    }
}