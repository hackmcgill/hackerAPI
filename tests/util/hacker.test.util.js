"use strict";
const Util = {
    Account: require("./account.test.util"),
    Skill: require("./skill.test.util")
};

const Hacker = require("../../models/hacker.model");
const logger = require("../../services/logger.service");
const TAG = "[ HACKER.TEST.UTIL.JS ]";

module.exports = {
    hackerA: {
        accountId: Util.Account.Account1._id,
        status: "Applied",
        school: "University of Blah",
        gender: "Male",
        needsBus: true,
        application: {
            portfolioURL: {
                //gcloud bucket link
                resume: "www.gcloud.com/myResume100",
                github: "www.github.com/Person1",
                dropler: undefined,
                personal: "www.person1.com",
                linkedIn: "www.linkedin.com/in/Person1",
                other: undefined
            },
            jobInterest: "Full-time",
            skills: [
                Util.Skill.skills[0]._id,
                Util.Skill.skills[4]._id,
                Util.Skill.sKills[7]._id,
            ],    
        }
    },
    hackerB: {
        accountId: Util.Account.Account4._id,
        status: "Accepted",
        school: "University of Blah1",
        gender: "Female",
        needsBus: false,
        application: {
            portfolioURL: {
                //gcloud bucket link
                resume: "www.gcloud.com/myResume1",
                github: "www.github.com/Person4",
                dropler: undefined,
                personal: undefined,
                linkedIn: undefined,
                other: undefined
            },
            jobInterest: "Internship",
            skills: [
                Util.Skill.skills[1]._id,
                Util.Skill.skills[3]._id,
                Util.Skill.sKills[6]._id,
            ],    
        }
    },
    storeAll: storeAll,
    dropAll: dropAll
};

function storeAll(attributes, callback) {
    const hackerDocs = [];
    const hackerNames = [];
    for (var i = 0; i < attributes.length; i++) {
        hackerDocs.push(new Hacker(attributes[i]));
        hackerNames.push(attributes[i].name);
    }

    Hacker.collection.insertMany(hackerDocs).then(
        () => {
            logger.info(`${TAG} saved Hackers: ${hackerNames.join(",")}`);
            callback();
        },
        (reason) => {
            logger.error(`${TAG} could not store Hackers ${hackerNames.join(",")}. Error: ${JSON.stringify(reason)}`);
            callback(reason);
        }
    );
}

function dropAll(callback) {
    Hacker.collection.drop().then(
        () => {
            logger.info(`Dropped table Hacker`);
            callback();
        },
        (err) => {
            logger.error(`Could not drop Hacker. Error: ${JSON.stringify(err)}`);
            callback(err);
        }
    );
}