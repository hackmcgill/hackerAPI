"use strict";
const mongoose = require("mongoose");
const Constants = require("../constants");
/**
 * The permission name is going to be the full route. 
 * For example, if a given route "/a/b/c" has a permission, then
 * the name of the permission will be "/a/b/c".
 */
const RoleSchema = new mongoose.Schema({
    //The name should be something like "Hacker", or "Sponsor"
    name: {
        type: String,
        unique: true,
        required: true
    },
    //The array of routes that this Role should have access to. It might be some 
    //regular expression, such as: /a/*/c/*, which represents anything under /a/.../c/...
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