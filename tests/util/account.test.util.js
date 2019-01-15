"use strict";
const Constants = require("../../constants/general.constant");
const Account = require("../../models/account.model");
const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const logger = require("../../services/logger.service");

let counters = {
    emailCounter: 0,
};

function incrementCounters() {
    for (const key in counters) {
        if (counters.hasOwnProperty(key)) {
            counters[key] = counters[key] + 1;
        }
    }
}

function extractAccountInfo(acc) {
    let accDetails = {};

    for (const val in acc) {
        // use .hasOwnProperty instead of 'in' to get rid of inherited properties such as 'should'
        if (Account.schema.paths.hasOwnProperty(val)) {
            accDetails[val] = acc[val];
        }
    }

    return accDetails;
}

function generateRandomValue(atr) {
    switch (atr) {
        case "_id":
            return mongoose.Types.ObjectId();
        case "firstName":
            // generates a random string between length 5 and 10 of random characters from a-z
            return Math.random().toString(36).replace(/[^a-z]+/g, "").substr(0, Math.floor(Math.random() * 6 + 5));
        case "lastName":
            return Math.random().toString(36).replace(/[^a-z]+/g, "").substr(0, Math.floor(Math.random() * 6 + 5));
        case "pronoun":
            // generate random string between length 2 and 4
            return Math.random().toString(36).replace(/[^a-z]+/g, "").substr(0, Math.floor(Math.random() * 3 + 2));
        case "email":
            const email = `abc.def${counters.emailCounter}@blahblah.com`;
            return email;
        case "password":
            return Math.random().toString(36).substr(0, 10);
        case "dietaryRestrictions":
            return [Constants.SAMPLE_DIET_RESTRICTIONS[Math.floor(Math.random() * Constants.SAMPLE_DIET_RESTRICTIONS.length)]];
        case "shirtSize":
            return Constants.SHIRT_SIZES[Math.floor(Math.random() * Constants.SHIRT_SIZES.length)];
        case "confirmed":
            // return false, because if an account is confirmed there should be a document of that account type, 
            // which this does not create
            return Math.random() < 0.5;
        case "accountType":
            return Constants.EXTENDED_USER_TYPES[Math.floor(Math.random() * Constants.EXTENDED_USER_TYPES.length)];
        case "birthDate":
            return new Date();
        case "phoneNumber":
            return Math.floor(Math.random() * 10000000000);
    }
}

function createAccount(acc = {}) {
    incrementCounters();

    const extractedAcc = extractAccountInfo(acc);

    for (const atr in Account.schema.paths) {
        if (!Account.schema.paths.hasOwnProperty(atr)) {
            continue;
        }

        // if this value has been passed in, continue
        if (extractedAcc[atr] !== undefined) {
            continue;
        }

        extractedAcc[atr] = generateRandomValue(atr);
    }

    return extractedAcc;
}

function createNAccounts(n, acc = {}) {
    let accounts = [];
    for (let i = 0; i < n; i++) {
        accounts.push(createAccount(acc));
    }

    return accounts;
}

let hackerAccounts = {
    new: createNAccounts(10, {
        "accountType": Constants.HACKER,
        "confirmed": true,
    }),
    stored: {
        team: createNAccounts(10, {
            "accountType": Constants.HACKER,
            "confirmed": true,
        }),
        noTeam: createNAccounts(10, {
            "accountType": Constants.HACKER,
            "confirmed": true,
        }),
    },
    invalid: createNAccounts(10, {
        "accountType": Constants.HACKER
    })
};

let volunteerAccounts = {
    new: createNAccounts(5, {
        "accountType": Constants.VOLUNTEER,
        "confirmed": true,
    }),
    stored: createNAccounts(5, {
        "accountType": Constants.VOLUNTEER,
        "confirmed": true,
    }),
    invalid: createNAccounts(5, {
        "accountType": Constants.VOLUNTEER
    }),
};

let staffAccounts = {
    stored: createNAccounts(5, {
        "accountType": Constants.STAFF,
        "confirmed": true,
    })
};

let sponsorT1Accounts = {
    new: createNAccounts(5, {
        "accountType": Constants.SPONSOR_T1,
        "confirmed": false,
    }),
    stored: createNAccounts(5, {
        "accountType": Constants.SPONSOR_T1,
        "confirmed": true,
    }),
    invalid: createNAccounts(5, {
        "accountType": Constants.SPONSOR_T1
    })
};

let sponsorT2Accounts = {
    new: createNAccounts(5, {
        "accountType": Constants.SPONSOR_T2,
        "confirmed": true,
    }),
    stored: createNAccounts(5, {
        "accountType": Constants.SPONSOR_T2,
        "confirmed": true,
    }),
    invalid: createNAccounts(5, {
        "accountType": Constants.SPONSOR_T2
    })
};

let sponsorT3Accounts = {
    new: createNAccounts(5, {
        "accountType": Constants.SPONSOR_T3,
        "confirmed": true,
    }),
    stored: createNAccounts(5, {
        "accountType": Constants.SPONSOR_T3,
        "confirmed": true,
    }),
    invalid: createNAccounts(5, {
        "accountType": Constants.SPONSOR_T3
    })
};

let sponsorT4Accounts = {
    new: createNAccounts(5, {
        "accountType": Constants.SPONSOR_T4,
        "confirmed": true,
    }),
    stored: createNAccounts(5, {
        "accountType": Constants.SPONSOR_T4,
        "confirmed": true,
    }),
    invalid: createNAccounts(5, {
        "accountType": Constants.SPONSOR_T4
    })
};

let sponsorT5Accounts = {
    new: createNAccounts(5, {
        "accountType": Constants.SPONSOR_T5,
        "confirmed": true,
    }),
    stored: createNAccounts(5, {
        "accountType": Constants.SPONSOR_T5,
        "confirmed": true,
    }),
    invalid: createNAccounts(5, {
        "accountType": Constants.SPONSOR_T5
    })
};

let unlinkedAccounts = {
    new: [createAccount({
        "accountType": Constants.HACKER,
        "confirmed": false,
    })],
    invalid: [createAccount()],
    stored: [createAccount({
        "accountType": Constants.HACKER
    }), createAccount({
        "accountType": Constants.HACKER
    })]
};

const waitlistedHacker0 = {
    "_id": mongoose.Types.ObjectId(),
    "firstName": "abcd",
    "lastName": "defg3",
    "pronoun": "They/Them",
    "email": "waitlisted1@blahblah.com",
    "password": "probsShouldBeHashed2",
    "dietaryRestrictions": ["vegetarian"],
    "shirtSize": "M",
    "confirmed": true,
    "accountType": Constants.HACKER,
    "birthDate": "1990-01-04",
    "phoneNumber": 1000000004,
};

// non confirmed account for hacker
const NonConfirmedAccount1 = {
    "_id": mongoose.Types.ObjectId(),
    "firstName": "LMAO",
    "lastName": "ROFL",
    "pronoun": "Ey/Em",
    "email": "notconfirmed1@blahblah.com",
    "password": "probsShouldBeHashed5",
    "dietaryRestrictions": ["something1", "something2"],
    "shirtSize": "XXL",
    "confirmed": false,
    "birthDate": "1980-07-30",
    "phoneNumber": 1001230236,
    "accountType": Constants.HACKER
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

const NonConfirmedAccount3 = createAccount({
    "confirmed": false,
    "accountType": Constants.HACKER,
    "email": "notconfirmed3@blahblah.com"
});

const extraAccounts = [waitlistedHacker0, NonConfirmedAccount1, NonConfirmedAccount2, NonConfirmedAccount3];

module.exports = {
    hackerAccounts: hackerAccounts,
    volunteerAccounts: volunteerAccounts,
    staffAccounts: staffAccounts,
    sponsorT1Accounts: sponsorT1Accounts,
    sponsorT2Accounts: sponsorT2Accounts,
    sponsorT3Accounts: sponsorT3Accounts,
    sponsorT4Accounts: sponsorT4Accounts,
    sponsorT5Accounts: sponsorT5Accounts,
    unlinkedAccounts: unlinkedAccounts,

    waitlistedHacker0: waitlistedHacker0,
    NonConfirmedAccount1: NonConfirmedAccount1,
    NonConfirmedAccount2: NonConfirmedAccount2,
    NonConfirmedAccount3: NonConfirmedAccount3,

    extraAccounts: extraAccounts,

    storeAll: storeAll,
    dropAll: dropAll,
    equals: equals,
};

function encryptPassword(user) {
    let encryptedUser = JSON.parse(JSON.stringify(user));
    encryptedUser.password = bcrypt.hashSync(user.password, 10);
    return encryptedUser;
}

function store(attributes) {
    const acctDocs = [];
    const acctNames = [];
    for (var i = 0; i < attributes.length; i++) {
        const encryptedUser = encryptPassword(attributes[i]);
        acctDocs.push(new Account(encryptedUser));
        acctNames.push(attributes[i].firstName + "," + attributes[i].lastName);
    }

    return Account.collection.insertMany(acctDocs);
}

async function storeAll() {
    await store(hackerAccounts.stored.team);
    await store(hackerAccounts.stored.noTeam);
    await store(volunteerAccounts.stored);
    await store(staffAccounts.stored);
    await store(sponsorT1Accounts.stored);
    await store(sponsorT2Accounts.stored);
    await store(sponsorT3Accounts.stored);
    await store(sponsorT4Accounts.stored);
    await store(sponsorT5Accounts.stored);
    await store(unlinkedAccounts.stored);

    await store(hackerAccounts.new);
    await store(volunteerAccounts.new);
    await store(sponsorT1Accounts.new);
    await store(sponsorT2Accounts.new);
    await store(sponsorT3Accounts.new);
    await store(sponsorT4Accounts.new);
    await store(sponsorT5Accounts.new);

    await store(extraAccounts);
}

async function dropAll() {
    try {
        await Account.collection.drop();
    } catch (e) {
        if (e.code === 26) {
            logger.info("namespace %s not found", Account.collection.name);
        } else {
            throw e;
        }
    }
}

// Try deleting this and see if anything fucks up

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
    const pronoun = (acc1.pronoun === acc2.pronoun);
    const email = (acc1.email === acc2.email);
    const dietaryRestrictions = (acc1.dietaryRestrictions.join(",") === acc2.dietaryRestrictions.join(","));
    const shirtSize = (acc1.shirtSize === acc2.shirtSize);
    return [id, firstName, lastName, email, dietaryRestrictions, shirtSize, pronoun];
}