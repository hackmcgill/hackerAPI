"use strict";
const mongoose = require("mongoose");
/**
 * The permission name is going to be the full route. 
 * For example, if a given route "/a/b/c" has a permission, then
 * the name of the permission will be "/a/b/c".
 */
const PermissionSchema = new mongoose.Schema({
    name: {
        type: String,
        unique: true,
        required: true
    }
});

PermissionSchema.methods.toJSON = function () {
    const ps = this.toObject();
    delete ps.__v;
    ps.id = ps._id;
    delete ps._id;
    return ps;
};
//export the model
module.exports = mongoose.model("Permission", PermissionSchema);