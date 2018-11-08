"use strict";
const Constants = require("../../constants");
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
    "shirtSize": "S",
    "confirmed": true,
    "accountType": Constants.Hacker,
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
const Admin1 = {
    "_id": mongoose.Types.ObjectId(),
    "firstName": "Admin1",
    "lastName": "Admin1",
    "email": "Admin1@blahblah.com",
    "password": "Admin1",
    "dietaryRestrictions": ["none"],
    "shirtSize": "S",
    "confirmed": true,
    "accountType": Constants.GODSTAFF,
};
// hacker
const Account1 = {
    "_id": mongoose.Types.ObjectId(),
    "firstName": "ABC",
    "lastName": "DEF",
    "email": "abc.def1@blahblah.com",
    "password": "probsShouldBeHashed1",
    "dietaryRestrictions": ["none"],
    "shirtSize": "S",
    "confirmed": true,
    "accountType": Constants.HACKER
};
// hacker
const Account2 = {
    "_id": mongoose.Types.ObjectId(),
    "firstName": "abc",
    "lastName": "def",
    "email": "abc.def2@blahblah.com",
    "password": "probsShouldBeHashed2",
    "dietaryRestrictions": ["vegetarian"],
    "shirtSize": "M",
    "confirmed": true,
    "accountType": Constants.Hacker,
};
// sponsor
const Account3 = {
    "_id": mongoose.Types.ObjectId(),
    "firstName": "XYZ",
    "lastName": "UST",
    "email": "abc.def3@blahblah.com",
    "password": "probsShouldBeHashed3",
    "dietaryRestrictions": ["vegan"],
    "shirtSize": "L",
    "confirmed": true,
    "accountType": Constants.SPONSOR,
};
// volunteer
const Account4 = {
    "_id": mongoose.Types.ObjectId(),
    "firstName": "xyz",
    "lastName": "ust",
    "email": "abc.def4@blahblah.com",
    "password": "probsShouldBeHashed4",
    "dietaryRestrictions": ["vegetarian", "lactose intolerant"],
    "shirtSize": "XL",
    "confirmed": true,
    "accountType": Constants.VOLUNTEER,
};
// sponsor
const Account5 = {
    "_id": mongoose.Types.ObjectId(),
    "firstName": "LMAO",
    "lastName": "ROFL",
    "email": "abc.def0@blahblah.com",
    "password": "probsShouldBeHashed5",
    "dietaryRestrictions": ["something1", "something2"],
    "shirtSize": "XXL",
    "confirmed": true,
    "accountType": Constants.SPONSOR,
};

// non confirmed account for hacker
const NonConfirmedAccount1 = {
    "_id": mongoose.Types.ObjectId(),
    "firstName": "LMAO",
    "lastName": "ROFL",
    "email": "notconfirmed1@blahblah.com",
    "password": "probsShouldBeHashed5",
    "dietaryRestrictions": ["something1", "something2"],
    "shirtSize": "XXL",
    "confirmed": false,
    "accountType": Constants.SPONSOR,
};

const NonConfirmedAccount2 = {
    "_id": mongoose.Types.ObjectId(),
    "firstName": "LMAO",
    "lastName": "ROFL",
    "email": "notconfirmed2@blahblah.com",
    "password": "probsShouldBeHashed5",
    "dietaryRestrictions": ["something1", "something2"],
    "shirtSize": "XXL",
    "confirmed": false,
    "accountType": Constants.HACKER,
};

const customAccounts = [
    Admin1,
    Account1,
    Account2,
    Account3,
    Account4,
    Account5,
    NonConfirmedAccount1,
    NonConfirmedAccount2
];

const generatedAccounts = generateAccounts(20);
// 1-5 Are for admins
// 6-10 Are for hackers (6 and 7 are new)
// 11-15 Are for sponsors
// 16-20 Are for volunteers


const allAccounts = customAccounts.concat(generatedAccounts);

module.exports = {
    nonAccount1: nonAccount1,
    newAccount1: newAccount1,
    NonConfirmedAccount1: NonConfirmedAccount1,
    NonConfirmedAccount2: NonConfirmedAccount2,
    Admin1: Admin1,
    Account1: Account1,
    Account2: Account2,
    Account3: Account3,
    Account4: Account4,
    Account5: Account5,
    customAccounts: customAccounts,
    generatedAccounts: generatedAccounts,
    allAccounts: allAccounts,
    storeAll: storeAll,
    dropAll: dropAll,
    equals: equals
};

function generateRandomShirtSize() {
    return Constants.SHIRT_SIZES[Math.floor(Math.random() * Constants.SHIRT_SIZES.length)];
}

function generateAccounts(n) {
    let accounts = [];
    for (let i = 0; i < n; i++) {
        let acc = {
            "_id": mongoose.Types.ObjectId(),
            "firstName": "first" + String(i),
            "lastName": "last" + String(i),
            "email": "test" + String(i) + "@blahblah.com",
            "password": "probsShouldBeHashed" + String(i),
            "dietaryRestrictions": [],
            "shirtSize": generateRandomShirtSize(),
            "confirmed": true
        };

        if (i < n / 4) {
            acc.accountType = Constants.GODSTAFF;
        } else if (i >= n / 4 && i < (n / 4) * 2) {
            acc.accountType = Constants.HACKER;
        } else if (i >= (n / 4) * 2 && i < (n / 4) * 3) {
            acc.accountType = Constants.SPONSOR;
        } else {
            acc.accountType = Constants.VOLUNTEER;
        }

        accounts.push(acc);
    }
    return accounts;
}

function encryptPassword(user) {
    let encryptedUser = JSON.parse(JSON.stringify(user));
    encryptedUser.password = bcrypt.hashSync(user.password, 10);
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
    return [id, firstName, lastName, email, dietaryRestrictions, shirtSize];
}

function convertMongoIdToString(id) {
    return (typeof id === "string") ? id : id.valueOf();
}