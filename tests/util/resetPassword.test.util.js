"use strict";
const Util = {
    Account: require("./account.test.util"),
};

const Services = {
    resetPassword: require("../../services/resetPassword.service")
};

const mongoose = require("mongoose");
const ResetPassword = require("../../models/passwordResetToken.model");

const Constants = require('../../constants/general.constant');

const ResetPasswordToken1 = {
    "_id": mongoose.Types.ObjectId(),
    "accountId": Util.Account.Account1._id
};

const ResetToken = Services.resetPassword.generateToken(ResetPasswordToken1._id, ResetPasswordToken1.accountId);

const ResetPasswords = [
    ResetPasswordToken1
];

function storeAll(attributes) {
    const resetPasswordDocs = [];
    const resetPasswordIds = [];
    for (var i = 0; i < attributes.length; i++) {
        resetPasswordDocs.push(new ResetPassword(attributes[i]));
        resetPasswordIds.push(attributes[i]._id);
    }
    return ResetPassword.collection.insertMany(resetPasswordDocs);
}

function dropAll() {
    ResetPassword.collection.drop();
}


module.exports = {
    ResetToken: ResetToken,
    ResetPasswords: ResetPasswords,
    storeAll: storeAll,
    dropAll: dropAll
};