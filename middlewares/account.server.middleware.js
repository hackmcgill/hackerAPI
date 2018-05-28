"use strict"

const TAG = `[ ADDRESS.SERVER.MIDDLEWARE.js ]`
const Services = {
    Permission: require("../services/permission.service"),
    Logger: require("../services/logger.service")
}

module.exports = {
    // untested
    parseAccount: function(req, res, next) {

        const accountDetails =
        {
            _id: new mongoose.ObjectID(),
            firstName: req.body.firstName,
            lastName: req.body.lastName,
            email: req.body.email,
            // hash here??
            password: req.body.password,
            // await - put outside and put await??
            permissions: Services.Permission.getDefaultPermission("Hacker"),
            dietaryRestrictions: req.body.dietaryRestrictions,
            shirtSize: req.body.shirtSize
        };

        delete req.body.firstName;
        delete req.body.lastName;
        delete req.body.email;
        delete req.body.password;
        delete req.body.dietaryRestrictions;
        delete req.body.shirtSize;

        req.body.accountDetails = accountDetails;

        next();
    }
}

