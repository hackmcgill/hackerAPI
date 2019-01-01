"use strict";
const Util = {
    Hacker: require("./hacker.test.util"),
};
const Team = require("../../models/team.model");
const mongoose = require("mongoose");
const logger = require("../../services/logger.service");

const duplicateTeamName1 = {
    "name": "SilverTeam",
    "projectName": "AProject"
};

const newTeam1 = {
    "name": "BronzeTeam1",
    "projectName": "YetAnotherProject"
};

const createdNewTeam1 = {
    "name": "BronzeTeam1",
    "members": [Util.Hacker.HackerB._id],
    "projectName": "YetAnotherProject"
};

const Team1 = {
    "_id": mongoose.Types.ObjectId(),
    "name": "BronzeTeam",
    "members": [Util.Hacker.HackerA._id],
    "devpostURL": "justanother.devpost.com",
    "projectName": "YetAnotherProject"
};

const Team2 = {
    "_id": mongoose.Types.ObjectId(),
    "name": "SilverTeam",
    "members": [Util.Hacker.HackerC._id],
    "devpostURL": "watwatwat.devpost.com",
    "projectName": "WatWatWat",
};

const Team3 = {
    "_id": mongoose.Types.ObjectId(),
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
    const teamNames = [];
    attributes.forEach((attribute) => {
        teamDocs.push(new Team(attribute));
        teamNames.push(attribute.name);
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
    createdNewTeam1: createdNewTeam1,
    duplicateTeamName1: duplicateTeamName1,
    Team1: Team1,
    Team2: Team2,
    Team3: Team3,
    Teams: Teams,
    storeAll: storeAll,
    dropAll: dropAll,
};