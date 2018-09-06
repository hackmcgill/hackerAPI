"use strict";
const Services = {
    Auth : require("../services/auth.service")
};

module.exports = {
    //for each route, set up an authentication middleware for that route, with the permission id.
    ensureAuthenticated: function(req, res, next) {
        const permissionId = ""; //fill in
        if(Services.Auth.ensureAuthenticated(req, permissionId)) {
            next();
        }
        else {
            next({
                message: "Not Authenticated",
                data: {}
            });
        }
    }
};