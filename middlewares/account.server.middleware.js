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
            password: req.body.password,
            // await - put outside and put await??
            permissions: Services.Permission.getDefaultPermission("Hacker"),
            dietaryRestrictions: req.body.dietaryRestrictions,
            shirtSize: req.body.shirtSize
        };

        // TODO
        // delete all the things from body
        // and add accoutnDetails to body

        next();
    }
}

