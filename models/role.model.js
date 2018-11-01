"use strict";
const mongoose = require("mongoose");
const Constants = require("../constants");
/**
 * The name is descriptive of the role
 * Each role may have different routes, where route parameters in the uri are replaced with :self or :all
 */
const RoleSchema = new mongoose.Schema({
    // The name should be something like "hacker", or "sponsor".
    // For roles with singular routes, the name of the role will be the name of the route plus the api route
    // For example, "getSelfAccount"
    name: {
        type: String,
        unique: true,
        required: true
    },
    //The array of routes that this Role should have access to.
    routes: [{
        uri: {
            type: String
        },
        requestType: {
            type: String,
            enum: Object.entries(Constants.REQUEST_TYPES)
        },
    }]
});

RoleSchema.methods.toJSON = function () {
    const ps = this.toObject();
    delete ps.__v;
    ps.id = ps._id;
    delete ps._id;
    return ps;
};
//export the model
module.exports = mongoose.model("Role", RoleSchema);