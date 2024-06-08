"use strict";
const mongoose = require("mongoose");
//describes the data type
const roleBinding = new mongoose.Schema({
    accountId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Account",
        required: true,
        unique: true
    },
    roles: {
        type: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: "Role",
                required: true
            }
        ]
    }
});

roleBinding.methods.toJSON = function(options) {
    const rb = this.toObject(options);
    delete rb.__v;
    rb.id = rb._id;
    delete rb._id;
    return rb;
};
//export the model
module.exports = mongoose.model("RoleBinding", roleBinding);
