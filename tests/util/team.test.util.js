"use strict";
const Util = {
    Hacker: require("./hacker.test.util"),
};
const Team = require("../../models/team.model");
const mongoose = require("mongoose");
const logger = require("../../services/logger.service");
const TAG = "[ TEAM.TEST.UTIL.JS ]";

const teams = [
    {
        "_id": mongoose.Types.ObjectId(),
        "name": "BronzeTeam",
        "members": {
            "type": [Util.Hacker.hackerA],
        },
        "hackSubmitted": false,
        "devpostURL": "justanother.post",
        "projectName": "YetAnotherProject"
    }
];

function storeAll(attributes, callback) {
    const teamDocs = [];
    const teamNames = [];
    attributes.forEach((attribute) => {
        teamDocs.push(new Team(attribute));
        teamNames.push(attribute.name);
    });

    Team.collection.insertMany(teamDocs).then(
        () => {
            logger.info(`${TAG} saved Team: ${teamNames.join(",")}`);
            callback();
        },
        (reason) => {
            logger.error(`${TAG} could not store Team ${teamNames.join(",")}. Error: ${JSON.stringify(reason)}`);
            callback(reason);
        }
    );
}

function dropAll(callback) {
    Team.collection.drop().then(
        () => {
            logger.info(`dropped table Team`);
            callback();
        },
        (err) => {
            logger.infor(`Could not drop Team. Error: ${JSON.stringify(err)}`);
            callback();
        }
    );
}

module.exports = {
    teams: teams,
    storeAll: storeAll,
    dropAll: dropAll,
};