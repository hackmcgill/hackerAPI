"use strict";
const mongoose = require("mongoose");
const Constants = require("../constants/general.constant");
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
    routes: [
        {
            uri: {
                type: String
            },
            requestType: {
                type: String,
                enum: Object.values(Constants.REQUEST_TYPES)
            }
        }
    ]
});

RoleSchema.methods.toJSON = function(options) {
    const rs = this.toObject(options);
    delete rs.__v;
    rs.id = rs._id;
    delete rs._id;
    return rs;
};
//export the model
module.exports = mongoose.model("Role", RoleSchema);
