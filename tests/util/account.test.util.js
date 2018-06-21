"use strict";
const Util = {
    Permission: require("./permission.test.util")
}
const Account = require("../../models/account.model");
const mongoose = require("mongoose");
const logger = require("../../services/logger.service");
const TAG = "[ PERMISSION.TEST.UTIL.JS ]";

module.exports = {
    Account1: {
        "_id": mongoose.Types.ObjectId(),
        "firstName": "ABC",
        "lastName": "DEF",
        "email": "abc.def1@blahblah.com",
        "password": "probsShouldBeHashed1",
        "permissions": [Util.Permission.Permission1._id, Util.Permission.permission6._id],
        "dietaryRestrictions": [],
        "shirtSize": "S"
    },
    Account2: {
        "_id": mongoose.Types.ObjectId(),
        "firstName": "abc",
        "lastName": "def",
        "email": "abc.def2@blahblah.com",
        "password": "probsShouldBeHashed2",
        "permissions": [Util.Permission.Permission2._id, Util.Permission.Permission7._id],
        "dietaryRestrictions": ["vegetarian"],
        "shirtSize": "M"
    },
    Account3: {
        "_id": mongoose.Types.ObjectId(),
        "firstName": "XYZ",
        "lastName": "UST",
        "email": "abc.def3@blahblah.com",
        "password": "probsShouldBeHashed3",
        "permissions": [Util.Permission.Permission3._id, Util.Permission.Permission8._id],
        "dietaryRestrictions": ["vegan"],
        "shirtSize": "L"
    },
    Account4: {
        "_id": mongoose.Types.ObjectId(),
        "firstName": "xyz",
        "lastName": "ust",
        "email": "abc.def4@blahblah.com",
        "password": "probsShouldBeHashed4",
        "permissions": [Util.Permission.Permission4._id, Util.Permission.Permission9._id],
        "dietaryRestrictions": ["vegetarian", "lactose intolerant"],
        "shirtSize": "XL"
    },
    Account5: {
        "_id": mongoose.Types.ObjectId(),
        "firstName": "LMAO",
        "lastName": "ROFL",
        "email": "abc.def5@blahblah.com",
        "password": "probsShouldBeHashed5",
        "permissions": [Util.Permission.Permission5._id, Util.Permission.Permission10._id],
        "dietaryRestrictions": ["something1", "something2"],
        "shirtSize": "XXL"
    },
    storeAll: storeAll,
    dropAll: dropAll
};

function storeAll(attributes, callback) {
    const acctDocs = [];
    for (var i = 0; i < attributes.length; i++) {
        acctDocs.push(new Account(attributes[i]));
    }
    const permissionNames = attributes.map((val) => {
        return val.name + ",";
    });
    Account.collection.insertMany(acctDocs).then(
        () => {
            logger.info(`${TAG} saved Account:${permissionNames.join(",")}`);
            callback();
        },
        (reason) => {
            logger.error(`${TAG} could not store Account ${permissionNames.join(",")}. Error: ${JSON.stringify(reason)}`);
            callback(reason);
        }
    );
}
function dropAll(callback) {
    Account.collection.drop().then(
        () => {
            logger.info(`dropped table Account`);
            callback();
        },
        (err) => {
            logger.error(`could not drop Account. Error: ${JSON.stringify(err)}`);
            callback(err);
        }
    );
}