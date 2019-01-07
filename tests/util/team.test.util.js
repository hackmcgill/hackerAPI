"use strict";
const Util = {
    Hacker: require("./hacker.test.util"),
};
const Constants = {
    MongoId: require("../../constants/testMongoId.constant"),
};
const Team = require("../../models/team.model");
const mongoose = require("mongoose");
const logger = require("../../services/logger.service");

const newTeam1 = {
    "name": "BronzeTeam",
    "members": [Util.Hacker.HackerB._id],
    "projectName": "YetAnotherProject"
};

const Team1 = {
    "_id": Constants.MongoId.team1Id,
    "name": "BronzeTeam",
    "members": [Util.Hacker.HackerA._id],
    "devpostURL": "justanother.devpost.com",
    "projectName": "YetAnotherProject"
};

const Team2 = {
    "_id": Constants.MongoId.team2Id,
    "name": "SilverTeam",
    "members": [Util.Hacker.HackerC._id],
    "devpostURL": "watwatwat.devpost.com",
    "projectName": "WatWatWat",
};

const Team3 = {
    "_id": Constants.MongoId.team3Id,
    "name": "FullTeam",
    "members": [Util.Hacker.HackerD._id, Util.Hacker.HackerE._id, Util.Hacker.HackerF._id, Util.Hacker.HackerG._id]
};

const Teams = [
    Team1,
    Team2,
    Team3
];

function storeAll(attributes) {
    const teamDocs = [];
    const names = [];
    attributes.forEach((attribute) => {
        teamDocs.push(new Team(attribute));
        names.push(attribute.name);
    });

    return Team.collection.insertMany(teamDocs);
}

async function dropAll() {
    try {
        await Team.collection.drop();
    } catch (e) {
        if (e.code === 26) {
            logger.info("namespace %s not found", Team.collection.name);
        } else {
            throw e;
        }
    }
}

module.exports = {
    newTeam1: newTeam1,
    Team1: Team1,
    Team2: Team2,
    Team3: Team3,
    Teams: Teams,
    storeAll: storeAll,
    dropAll: dropAll,
};