"use strict";
const Util = {
    Account: require("./account.test.util"),
};

const mongoose = require("mongoose");
const Hacker = require("../../models/hacker.model");
const logger = require("../../services/logger.service");

const invalidHacker1 = {
    "_id": mongoose.Types.ObjectId(),
    // invalid mongoID
    "accountId": "UtilAccountAccount1_id",
    // invalid missing school attribute
    "gender": "Female",
    "needsBus": true,
    "application": {
        // invalid portflio with no resume
        "portfolioURL": {},
        // invalid jobInterest
        "jobInterest": "ASDF",
    },
    "ethnicity": "Asian",
    "major": "CS",
    "graduationYear": 2020,
    "codeOfConduct": true,
};

const duplicateAccountLinkHacker1 = {
    "_id": mongoose.Types.ObjectId(),
    "accountId": Util.Account.Account1._id,
    "status": "Applied",
    "school": "University of Blah",
    "gender": "Male",
    "needsBus": true,
    "application": {
        "portfolioURL": {
            //gcloud bucket link
            "resume": "www.gcloud.com/myResume100",
            "github": "www.github.com/Person1",
            "dropler": undefined,
            "personal": "www.person1.com",
            "linkedIn": "www.linkedin.com/in/Person1",
            "other": undefined
        },
        "jobInterest": "Full-time",
        "skills": ["CSS", "HTML", "JS"],
    },
    "ethnicity": "Caucasian",
    "major": "CS",
    "graduationYear": 2019,
    "codeOfConduct": true,
};

const newHacker1 = {
    "accountId": Util.Account.generatedAccounts[6]._id,
    "school": "University of ASDF",
    "gender": "Female",
    "needsBus": true,
    "application": {
        "portfolioURL": {
            //gcloud bucket link
            "resume": "www.gcloud.com/myResume100",
            "github": "www.github.com/Person1",
            "dropler": undefined,
            "personal": "www.person1.com",
            "linkedIn": "www.linkedin.com/in/Person1",
            "other": undefined
        },
        "jobInterest": "Full-time",
        "skills": ["CSS", "HTML", "JS"],
    },
    "ethnicity": "Caucasian",
    "major": "EE",
    "graduationYear": 2019,
    "codeOfConduct": true,
};

const newHacker2 = {
    "accountId": Util.Account.NonConfirmedAccount1._id,
    "school": "University of YIKES",
    "gender": "Female",
    "needsBus": true,
    "application": {
        "portfolioURL": {
            //gcloud bucket link
            "resume": "www.gcloud.com/myResume100",
            "github": "www.github.com/Person1",
            "dropler": undefined,
            "personal": "www.person1.com",
            "linkedIn": "www.linkedin.com/in/Person1",
            "other": undefined
        },
        "jobInterest": "Full-time",
        "skills": ["CSS", "HTML", "JS"],
    },
    "ethnicity": "African American",
    "major": "EE",
    "graduationYear": 2019,
    "codeOfConduct": true,
};

const HackerA = {
    "_id": mongoose.Types.ObjectId(),
    "accountId": Util.Account.Account1._id,
    "status": "Applied",
    "school": "University of Blah",
    "gender": "Male",
    "needsBus": true,
    "application": {
        "portfolioURL": {
            //gcloud bucket link
            "resume": "www.gcloud.com/myResume100",
            "github": "www.github.com/Person1",
            "dropler": undefined,
            "personal": "www.person1.com",
            "linkedIn": "www.linkedin.com/in/Person1",
            "other": undefined
        },
        "jobInterest": "Full-time",
        "skills": ["CSS", "HTML", "JS"],
    },
    "ethnicity": "Native American",
    "major": "EE",
    "graduationYear": 2019,
    "codeOfConduct": true,
};
const HackerB = {
    "_id": mongoose.Types.ObjectId(),
    "accountId": Util.Account.Account2._id,
    "status": "Accepted",
    "school": "University of Blah1",
    "gender": "Female",
    "needsBus": false,
    "application": {
        "portfolioURL": {
            //gcloud bucket link
            "resume": "www.gcloud.com/myResume1",
            "github": "www.github.com/Person4",
            "dropler": undefined,
            "personal": undefined,
            "linkedIn": undefined,
            "other": undefined
        },
        "jobInterest": "Internship",
        "skills": ["CSS", "HTML", "JS"],
    },
    "ethnicity": "European",
    "major": "EE",
    "graduationYear": 2019,
    "codeOfConduct": true,
};
const Hackers = [
    HackerA,
    HackerB,
];

module.exports = {
    duplicateAccountLinkHacker1: duplicateAccountLinkHacker1,
    invalidHacker1: invalidHacker1,
    newHacker1: newHacker1,
    newHacker2: newHacker2,
    HackerA: HackerA,
    HackerB: HackerB,
    Hackers: Hackers,
    storeAll: storeAll,
    dropAll: dropAll
};

function storeAll(attributes) {
    const hackerDocs = [];
    const hackerIds = [];
    for (var i = 0; i < attributes.length; i++) {
        hackerDocs.push(new Hacker(attributes[i]));
        hackerIds.push(attributes[i]._id);
    }

    return Hacker.collection.insertMany(hackerDocs);
}

async function dropAll() {
    try {
        await Hacker.collection.drop();
    } catch (e) {
        if (e.code === 26) {
            logger.info("namespace %s not found", Hacker.collection.name);
        } else {
            throw e;
        }
    }
}