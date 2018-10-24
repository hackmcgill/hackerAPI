"use strict";
const Account = require("../../models/account.model");
const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const logger = require("../../services/logger.service");
const TAG = "[ ACCOUNT.TEST.UTIL.JS ]";

const newAccount1 = {
    "_id": mongoose.Types.ObjectId(),
    "firstName": "NEW",
    "lastName": "Account",
    "email": "newexist@blahblah.com",
    "password": "1234567890",
    "dietaryRestrictions": ["none"],
    "shirtSize": "S"
};
const nonAccount1 = {
    "_id": mongoose.Types.ObjectId(),
    "firstName": "non",
    "lastName": "Account",
    "email": "notexist@blahblah.com",
    "password": "12345789",
    "dietaryRestrictions": ["none"],
    "shirtSize": "S",
};
const Account1 = {
    "_id": mongoose.Types.ObjectId(),
    "firstName": "ABC",
    "lastName": "DEF",
    "email": "abc.def1@blahblah.com",
    "password": "probsShouldBeHashed1",
    "dietaryRestrictions": ["none"],
    "shirtSize": "S"
};
const Account2 = {
    "_id": mongoose.Types.ObjectId(),
    "firstName": "abc",
    "lastName": "def",
    "email": "abc.def2@blahblah.com",
    "password": "probsShouldBeHashed2",
    "dietaryRestrictions": ["vegetarian"],
    "shirtSize": "M"
};
const Account3 = {
    "_id": mongoose.Types.ObjectId(),
    "firstName": "XYZ",
    "lastName": "UST",
    "email": "abc.def3@blahblah.com",
    "password": "probsShouldBeHashed3",
    "dietaryRestrictions": ["vegan"],
    "shirtSize": "L"
};
const Account4 = {
    "_id": mongoose.Types.ObjectId(),
    "firstName": "xyz",
    "lastName": "ust",
    "email": "abc.def4@blahblah.com",
    "password": "probsShouldBeHashed4",
    "dietaryRestrictions": ["vegetarian", "lactose intolerant"],
    "shirtSize": "XL"
};
const Account5 = {
    "_id": mongoose.Types.ObjectId(),
    "firstName": "LMAO",
    "lastName": "ROFL",
    "email": "abc.def5@blahblah.com",
    "password": "probsShouldBeHashed5",
    "dietaryRestrictions": ["something1", "something2"],
    "shirtSize": "XXL"
};
const Account6 = {
    "_id": mongoose.Types.ObjectId(),
    "firstName": "first6",
    "lastName": "last6",
    "email": "test6@blahblah.com",
    "password": "probsShouldBeHashed6",
    "dietaryRestrictions": [],
    "shirtSize": "M"
};
const Account7 = {
    "_id": mongoose.Types.ObjectId(),
    "firstName": "first7",
    "lastName": "last7",
    "email": "test7@blahblah.com",
    "password": "probsShouldBeHashed7",
    "dietaryRestrictions": [],
    "shirtSize": "M"
};
const Account8 = {
    "_id": mongoose.Types.ObjectId(),
    "firstName": "first8",
    "lastName": "last8",
    "email": "test8@blahblah.com",
    "password": "probsShouldBeHashed8",
    "dietaryRestrictions": [],
    "shirtSize": "M"
};
const Account9 = {
    "_id": mongoose.Types.ObjectId(),
    "firstName": "first9",
    "lastName": "last9",
    "email": "test9@blahblah.com",
    "password": "probsShouldBeHashed9",
    "dietaryRestrictions": [],
    "shirtSize": "M"
};
const Account10 = {
    "_id": mongoose.Types.ObjectId(),
    "firstName": "first10",
    "lastName": "last10",
    "email": "test10@blahblah.com",
    "password": "probsShouldBeHashed10",
    "dietaryRestrictions": [],
    "shirtSize": "M"
};
const Account11 = {
    "_id": mongoose.Types.ObjectId(),
    "firstName": "first11",
    "lastName": "last11",
    "email": "test11@blahblah.com",
    "password": "probsShouldBeHashed11",
    "dietaryRestrictions": [],
    "shirtSize": "M"
};
const Account12 = {
    "_id": mongoose.Types.ObjectId(),
    "firstName": "first12",
    "lastName": "last12",
    "email": "test12@blahblah.com",
    "password": "probsShouldBeHashed12",
    "dietaryRestrictions": [],
    "shirtSize": "M"
};
const Account13 = {
    "_id": mongoose.Types.ObjectId(),
    "firstName": "first13",
    "lastName": "last13",
    "email": "test13@blahblah.com",
    "password": "probsShouldBeHashed13",
    "dietaryRestrictions": [],
    "shirtSize": "M"
};
const Account14 = {
    "_id": mongoose.Types.ObjectId(),
    "firstName": "first14",
    "lastName": "last14",
    "email": "test14@blahblah.com",
    "password": "probsShouldBeHashed14",
    "dietaryRestrictions": [],
    "shirtSize": "M"
};
const Accounts = [
    Account1,
    Account2,
    Account3,
    Account4,
    Account5,
    Account6,
    Account7,
    Account8,
    Account9,
    Account10,
    Account11,
    Account12,
    Account13,
    Account14,
];

module.exports = {
    nonAccount1: nonAccount1,
    newAccount1: newAccount1,
    Account1: Account1,
    Account2: Account2,
    Account3: Account3,
    Account4: Account4,
    Account5: Account5,
    Account6: Account6,
    Account7: Account7,
    Account8: Account8,
    Account9: Account9,
    Account10: Account10,
    Account11: Account11,
    Account12: Account12,
    Account13: Account13,
    Account14: Account14,
    Accounts: Accounts,
    storeAll: storeAll,
    dropAll: dropAll,
    equals: equals
};

function encryptPassword(user) {
    let encryptedUser = JSON.parse(JSON.stringify(user));
    encryptedUser.password = bcrypt.hashSync(user.password,10);
    return encryptedUser;
}

function storeAll(attributes, callback) {
    const acctDocs = [];
    const acctNames = [];
    for (var i = 0; i < attributes.length; i++) {
        const encryptedUser = encryptPassword(attributes[i]);
        acctDocs.push(new Account(encryptedUser));
        acctNames.push(attributes[i].firstName + "," + attributes[i].lastName);
    }

    Account.collection.insertMany(acctDocs).then(
        () => {
            logger.info(`${TAG} saved Account:${acctNames.join(",")}`);
            callback();
        },
        (reason) => {
            logger.error(`${TAG} could not store Account ${acctNames.join(",")}. Error: ${JSON.stringify(reason)}`);
            callback(reason);
        }
    );
}
function dropAll(callback) {
    Account.collection.drop().then(
        () => {
            logger.info(`Dropped table Account`);
            callback();
        },
        (err) => {
            logger.error(`Could not drop Account. Error: ${JSON.stringify(err)}`);
            callback(err);
        }
    ).catch((error) => {
        logger.error(error);
        callback();
    });
}

/**
 * Compare two accounts
 * @param {Account} acc1 
 * @param {Account} acc2 
 */
function equals(acc1, acc2) {
    const id1 = (typeof acc1._id === "string") ? acc1._id : acc1._id.valueOf();
    const id2 = (typeof acc2._id === "string") ? acc1._id : acc1._id.valueOf();
    const id = (id1 === id2);
    const firstName = (acc1.firstName === acc2.firstName);
    const lastName = (acc1.lastName === acc2.lastName);
    const email = (acc1.email === acc2.email);
    const dietaryRestrictions = (acc1.dietaryRestrictions.join(",") === acc2.dietaryRestrictions.join(","));
    const shirtSize = (acc1.shirtSize === acc2.shirtSize);
    return [id,firstName,lastName,email,dietaryRestrictions,shirtSize];
}

function convertMongoIdToString(id) {
    return (typeof id === "string") ? id : id.valueOf();
}