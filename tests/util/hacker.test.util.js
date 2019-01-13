"use strict";
const Util = {
    Account: require("./account.test.util"),
};
const Constants = {
    MongoId: require("../../constants/testMongoId.constant"),
};

const mongoose = require("mongoose");
const Hacker = require("../../models/hacker.model");
const logger = require("../../services/logger.service");

const invalidHacker1 = {
    "_id": mongoose.Types.ObjectId(),
    // invalid mongoID
    "accountId": "UtilAccountAccount1_id",
    // invalid missing school attribute
    "degree": "Undersaduate",
    "gender": "Female",
    "needsBus": true,
    "application": {
        // invalid portflio with no resume
        "portfolioURL": {},
        // invalid jobInterest
        "jobInterest": "ASDF",
    },
    "ethnicity": ["Asian", "Caucasian"],
    "major": "CS",
    "graduationYear": 2020,
    "codeOfConduct": true,
};

// duplicate of newHack1, but with false for code of conduct
const badCodeOfConductHacker1 = {
    "accountId": Util.Account.generatedAccounts[6]._id,
    "school": "University of ASDF",
    "degree": "Masters",
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
    "ethnicity": ["Caucasian"],
    "major": "EE",
    "graduationYear": 2019,
    "codeOfConduct": false,
};

const duplicateAccountLinkHacker1 = {
    "_id": mongoose.Types.ObjectId(),
    "accountId": Util.Account.hackerAccounts.stored.team[0],
    "status": "Applied",
    "school": "University of Blah",
    "degree": "Undergraduate",
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
    "ethnicity": ["Caucasian"],
    "major": "CS",
    "graduationYear": 2019,
    "codeOfConduct": true,
};

const newHacker1 = {
    "accountId": Util.Account.generatedAccounts[6]._id,
    "school": "University of ASDF",
    "degree": "Masters",
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
    "ethnicity": ["Caucasian"],
    "major": "EE",
    "graduationYear": 2019,
    "codeOfConduct": true,
};

const newHacker2 = {
    "accountId": Util.Account.NonConfirmedAccount1._id,
    "school": "University of YIKES",
    "degree": "PhD",
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
    "ethnicity": ["African American"],
    "major": "EE",
    "graduationYear": 2019,
    "codeOfConduct": true,
};

const HackerA = {
    "_id": Constants.MongoId.hackerAId,
    "accountId": Util.Account.hackerAccounts.stored.team[0],
    "status": "Confirmed",
    "school": "University of Blah",
    "degree": "Masters",
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
    "ethnicity": ["Native American"],
    "major": "EE",
    "graduationYear": 2019,
    "codeOfConduct": true,
    "teamId": Constants.MongoId.team1Id,
};
const HackerB = {
    "_id": Constants.MongoId.hackerBId,
    "accountId": Util.Account.Account2._id,
    "status": "Accepted",
    "school": "University of Blah1",
    "degree": "Masters",
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
    "ethnicity": ["European"],
    "major": "EE",
    "graduationYear": 2019,
    "codeOfConduct": true,
};

const HackerC = {
    "_id": Constants.MongoId.hackerCId,
    "accountId": Util.Account.Hacker3._id,
    "status": "Waitlisted",
    "school": "University of Blah1",
    "degree": "Masters",
    "gender": "Female",
    "needsBus": false,
    "application": {
        "portfolioURL": {
            //gcloud bucket link
            "resume": "www.gcloud.com/myResume2",
            "github": "www.github.com/Personasdf",
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
    "teamId": Constants.MongoId.team2Id,
};

const HackerD = {
    "_id": Constants.MongoId.hackerDId,
    "accountId": Util.Account.Hacker4._id,
    "status": "Waitlisted",
    "school": "University of Blah1",
    "degree": "Masters",
    "gender": "Female",
    "needsBus": false,
    "application": {
        "portfolioURL": {
            //gcloud bucket link
            "resume": "www.gcloud.com/myResume2",
            "github": "www.github.com/Personasdf",
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
    "teamId": Constants.MongoId.team3Id,
};

const HackerE = {
    "_id": Constants.MongoId.hackerEId,
    "accountId": Util.Account.Hacker5._id,
    "status": "Waitlisted",
    "school": "University of Blah1",
    "degree": "Masters",
    "gender": "Female",
    "needsBus": false,
    "application": {
        "portfolioURL": {
            //gcloud bucket link
            "resume": "www.gcloud.com/myResume2",
            "github": "www.github.com/Personasdf",
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
    "teamId": Constants.MongoId.team3Id,
};

const HackerF = {
    "_id": Constants.MongoId.hackerFId,
    "accountId": Util.Account.Hacker6._id,
    "status": "Waitlisted",
    "school": "University of Blah1",
    "degree": "Masters",
    "gender": "Female",
    "needsBus": false,
    "application": {
        "portfolioURL": {
            //gcloud bucket link
            "resume": "www.gcloud.com/myResume2",
            "github": "www.github.com/Personasdf",
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
    "teamId": Constants.MongoId.team3Id,
};

const HackerG = {
    "_id": Constants.MongoId.hackerGId,
    "accountId": Util.Account.Hacker7._id,
    "status": "Waitlisted",
    "school": "University of Blah1",
    "degree": "Masters",
    "gender": "Female",
    "needsBus": false,
    "application": {
        "portfolioURL": {
            //gcloud bucket link
            "resume": "www.gcloud.com/myResume2",
            "github": "www.github.com/Personasdf",
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
    "teamId": Constants.MongoId.team3Id,
};

const Hackers = [
    HackerA,
    HackerB,
    HackerC,
    HackerD,
    HackerE,
    HackerF,
    HackerG,
];

module.exports = {
    duplicateAccountLinkHacker1: duplicateAccountLinkHacker1,
    invalidHacker1: invalidHacker1,
    newHacker1: newHacker1,
    newHacker2: newHacker2,
    badCodeOfConductHacker1: badCodeOfConductHacker1,
    HackerA: HackerA,
    HackerB: HackerB,
    HackerC: HackerC,
    HackerD: HackerD,
    HackerE: HackerE,
    HackerF: HackerF,
    HackerG: HackerG,
    Hackers: Hackers,
    storeAll: storeAll,
    dropAll: dropAll
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