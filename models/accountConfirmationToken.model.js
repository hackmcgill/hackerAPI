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
    },
    confirmationType: {
        type: String,
        enum: Constants.General.CONFIRMATION_TYPES,
        default: Constants.General.CONFIRMATION_TYPE_ORGANIC
    }
});

AccountConfirmationSchema.methods.toJSON = function(options) {
    const acs = this.toObject(options);
    delete acs.__v;
    acs.id = acs._id;
    delete acs._id;
    return acs;
};

module.exports = mongoose.model(
    "AccountConfirmationToken",
    AccountConfirmationSchema
);
