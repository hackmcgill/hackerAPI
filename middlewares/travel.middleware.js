"use strict";

const TAG = `[ TRAVEL.MIDDLEWARE.js ]`;
const mongoose = require("mongoose");
const Services = {
    Travel: require("../services/travel.service")
    //Hacker: require("../services/hacker.service"),
    //Storage: require("../services/storage.service"),
    //Email: require("../services/email.service"),
    //Account: require("../services/account.service"),
    //Env: require("../services/env.service")
};
const Middleware = {
    Util: require("./util.middleware")
};
const Constants = {
    General: require("../constants/general.constant"),
    Error: require("../constants/error.constant")
};

/**
 * Finds the travel information of the logged in user
 * and places that information in req.body.travel
 * @param {{user: {id: string}}} req
 * @param {*} res
 * @param {(err?)=>void} next
 */
async function findSelf(req, res, next) {
    if (
        req.user.accountType != Constants.General.HACKER ||
        !req.user.confirmed
    ) {
        return next({
            status: 409,
            message: Constants.Error.ACCOUNT_TYPE_409_MESSAGE,
            error: {
                id: req.user.id
            }
        });
    }

    const travel = await Services.Travel.findByAccountId(req.user.id);

    if (!!travel) {
        req.body.travel = travel;
        return next();
    } else {
        return next({
            status: 409,
            message: Constants.Error.TRAVEL_404_MESSAGE,
            error: {
                id: req.user.id
            }
        });
    }
}

module.exports = {
    findSelf: Middleware.Util.asyncMiddleware(findSelf)
};
