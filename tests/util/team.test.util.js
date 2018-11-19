"use strict";
const Util = {
    Hacker: require("./hacker.test.util"),
};
const Team = require("../../models/team.model");
const mongoose = require("mongoose");

const newTeam1 = {
    "name": "BronzeTeam",
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
const Teams = [
    Team1,
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

function dropAll() {
    return Team.collection.drop();
}

module.exports = {
    newTeam1: newTeam1,
    Team1: Team1,
    Teams: Teams,
    storeAll: storeAll,
    dropAll: dropAll,
};