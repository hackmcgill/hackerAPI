"use strict";
const mongoose = require("mongoose");
const Constants = require("../constants");

const AccountConfirmationSchema = new mongoose.Schema({
    accountId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Account",
        required: false
    },
    accountType: {
        type:String,
        enum: Constants.EXTENDED_USER_TYPES,
        default: Constants.HACKER
    },
    email: {
        type:String,
        required: true
    }
});

AccountConfirmationSchema.methods.toJSON = function () {
    const resetObj = this.toObject();
    delete resetObj.__v;
    resetObj.id = resetObj._id;
    delete resetObj._id;
    return resetObj;
}

module.exports = mongoose.model("AccountConfirmationToken", AccountConfirmationSchema);