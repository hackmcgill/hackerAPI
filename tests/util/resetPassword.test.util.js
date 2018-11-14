"use strict";
const Util = {
    Account: require("./account.test.util"),
    Skill: require("./skill.test.util")
};

const Services = {
    resetPassword: require("../../services/resetPassword.service")
};

const mongoose = require("mongoose");
const ResetPassword = require("../../models/passwordResetToken.model");

//const ResetPasswordToken = mongoose.model("ResetPasswordToken");

const Constants = require('../../constants/general.constant');
const logger = require("../../services/logger.service");

const ResetPasswordToken1 = {
    "_id": mongoose.Types.ObjectId(),
    "accountId": Util.Account.Account1._id
}

const ResetToken = Services.resetPassword.generateToken(ResetPasswordToken1._id, ResetPasswordToken1.accountId);

const ResetPasswords = [
    ResetPasswordToken1
]

function storeAll(attributes, callback) {
    const resetPasswordDocs = [];
    const resetPasswordIds = [];
    for (var i = 0; i < attributes.length; i++) {
        resetPasswordDocs.push(new ResetPassword(attributes[i]));
        resetPasswordIds.push(attributes[i]._id);
    }
    ResetPassword.collection.insertMany(resetPasswordDocs).then(
        () => {
            //Flip these two when there are more than one doc
            callback();
            logger.info(`${TAG} saved Reset Password Tokens: ${resetPasswordIds.join(",")}`);
        },
        (reason) => {
            logger.error(`${TAG} could not store Reset Password Tokens ${resetPasswordIds.join(",")}. Error: ${JSON.stringify(reason)}`);
            callback(reason);
        }
    );
}

function dropAll(callback) {
    ResetPassword.collection.drop().then(
        () => {
            logger.info(`Dropped table resetPasswordToken`);
            callback();
        },
        (err) => {
            logger.error(`Could not drop resetPasswordToken. Error: ${JSON.stringify(err)}`);
            callback(err);
        }
    ).catch((error) => {
        logger.error(error);
        callback();
    });
}


module.exports = {
    ResetToken: ResetToken,
    ResetPasswords: ResetPasswords,
    storeAll: storeAll,
    dropAll: dropAll
};