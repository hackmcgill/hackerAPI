"use strict";
const Util = {
    Account: require("./account.test.util")
};

const Services = {
    resetPassword: require("../../services/resetPassword.service")
};

const mongoose = require("mongoose");
const ResetPassword = require("../../models/passwordResetToken.model");

const logger = require("../../services/logger.service");

const ResetPasswordToken1 = {
    _id: new mongoose.Types.ObjectId(),
    accountId: Util.Account.hackerAccounts.stored.team[0]._id
};

const ResetToken = Services.resetPassword.generateToken(
    ResetPasswordToken1._id,
    ResetPasswordToken1.accountId
);

const ResetPasswords = [ResetPasswordToken1];

function store(attributes) {
    const resetPasswordDocs = [];
    const resetPasswordIds = [];
    for (var i = 0; i < attributes.length; i++) {
        resetPasswordDocs.push(new ResetPassword(attributes[i]));
        resetPasswordIds.push(attributes[i]._id);
    }
    return ResetPassword.collection.insertMany(resetPasswordDocs);
}

async function storeAll() {
    await store(ResetPasswords);
}

async function dropAll() {
    try {
        await ResetPassword.collection.drop();
    } catch (e) {
        if (e.code === 26) {
            logger.info(
                "namespace %s not found",
                ResetPassword.collection.name
            );
        } else {
            throw e;
        }
    }
}

module.exports = {
    ResetToken: ResetToken,
    ResetPasswords: ResetPasswords,
    storeAll: storeAll,
    dropAll: dropAll
};
