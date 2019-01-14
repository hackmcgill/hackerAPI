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

const duplicateTeamName1 = {
    "name": "SilverTeam",
    "projectName": "AProject"
};

const newTeam1 = {
    "_id": mongoose.Types.ObjectId(),
    "name": "BronzeTeam1",
    "projectName": "YetAnotherProject"
};

const createdNewTeam1 = {
    "name": "BronzeTeam1",
    "members": [Util.Hacker.NoTeamHacker0._id],
    "projectName": "YetAnotherProject"
};

const Team1 = {
    "_id": Constants.MongoId.team1Id,
    "name": "BronzeTeam",
    "members": [Util.Hacker.TeamHacker0._id],
    "devpostURL": "justanother.devpost.com",
    "projectName": "YetAnotherProject"
};

const Team2 = {
    "_id": Constants.MongoId.team2Id,
    "name": "SilverTeam",
    "members": [Util.Hacker.waitlistedHacker0._id],
    "devpostURL": "watwatwat.devpost.com",
    "projectName": "WatWatWat",
};

const Team3 = {
    "_id": Constants.MongoId.team3Id,
    "name": "FullTeam",
    "members": [Util.Hacker.TeamHacker1._id, Util.Hacker.TeamHacker2._id, Util.Hacker.TeamHacker3._id, Util.Hacker.TeamHacker4._id]
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
    createdNewTeam1: createdNewTeam1,
    duplicateTeamName1: duplicateTeamName1,
    Team1: Team1,
    Team2: Team2,
    Team3: Team3,
    Teams: Teams,
    storeAll: storeAll,
    dropAll: dropAll,
};