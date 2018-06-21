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
                //NEEDS TO REFERENCE SKILL
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
                //NEEDS TO REFERENCE SKILL
            ],    
        }
    },
    storeAll: storeAll,
    dropAll: dropAll
};

function storeAll(attributes, callback) {
    const acctDocs = [];
    for (var i = 0; i < attributes.length; i++) {
        acctDocs.push(new Hacker(attributes[i]));
    }
    const permissionNames = attributes.map((val) => {
        return val.name + ",";
    });
    Hacker.collection.insertMany(acctDocs).then(
        () => {
            logger.info(`${TAG} saved Hacker: ${permissionNames.join(",")}`);
            callback();
        },
        (reason) => {
            logger.error(`${TAG} could not store Hackers ${permissionNames.join(",")}. Error: ${JSON.stringify(reason)}`);
            callback(reason);
        }
    );
}

function dropAll(callback) {
    Hacker.collection.drop().then(
        () => {
            logger.info(`dropped table Bus`);
            callback();
        },
        (err) => {
            logger.error(`could not drop Buses. Error: ${JSON.stringify(err)}`);
            callback(err);
        }
    );
}