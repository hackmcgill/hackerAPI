"use strict";
const mongoose = require("mongoose");
const Constants = {
    General: require("../constants/general.constant")
};

const AccountConfirmationSchema = new mongoose.Schema({
    accountId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Account",
        required: false
    },
    accountType: {
        type: String,
        enum: Constants.General.EXTENDED_USER_TYPES,
        default: Constants.General.HACKER
    },
    email: {
        type: String,
        required: true
    }
});

AccountConfirmationSchema.methods.toJSON = function() {
    const resetObj = this.toObject();
    delete resetObj.__v;
    resetObj.id = resetObj._id;
    delete resetObj._id;
    return resetObj;
};

module.exports = mongoose.model(
    "AccountConfirmationToken",
    AccountConfirmationSchema
);
