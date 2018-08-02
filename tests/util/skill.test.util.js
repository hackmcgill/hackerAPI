"use strict";
const Skill = require("../../models/skill.model");
const mongoose = require("mongoose");
const logger = require("../../services/logger.service");
const TAG = "[ SKILL.TEST.UTIL.JS ]";

const skills = [
    {
        "_id": mongoose.Types.ObjectId(),
        "name": "Tech1", 
        "category": "category1"
    },
    {
        "_id": mongoose.Types.ObjectId(),
        "name": "Tech2", 
        "category": "category2"
    },
    {
        "_id": mongoose.Types.ObjectId(),
        "name": "Tech3",
        "category": "category3"},
    {
        "_id": mongoose.Types.ObjectId(),
        "name": "Tech4",
        "category": "category1"},
    {
        "_id": mongoose.Types.ObjectId(),
        "name": "Tech5",
        "category": "category2"},
    {
        "_id": mongoose.Types.ObjectId(),
        "name": "Tech6",
        "category": "category3"},
    {
        "_id": mongoose.Types.ObjectId(),
        "name": "Tech7",
        "category": "category1"},
    {
        "_id": mongoose.Types.ObjectId(),
        "name": "Tech8",
        "category": "category2"}
];

function storeAll(attributes, callback) {
    const skillDocs = [];
    const skillNames = [];
    attributes.forEach((attribute) => {
        skillDocs.push(new Skill(attribute));
        skillNames.push(attribute.name);
    });

    Skill.collection.insertMany(skillDocs).then(
        () => {
            logger.info(`${TAG} saved Skills: ${skillNames.join(",")}`);
            callback();
        },
        (reason) => {
            logger.error(`${TAG} could not store Account ${skillNames.join(",")}. Error: ${JSON.stringify(reason)}`);
            callback(reason);
        }
    );
}

function dropAll(callback) {
    Skill.collection.drop().then(
        () => {
            logger.info(`Dropped table Skill`);
            callback();
        },
        (err) => {
            logger.error(`Could not drop Skill. Error: ${JSON.stringify(err)}`);
            callback(err);
        }
    );
}

module.exports = {
    skills: skills,
    storeAll: storeAll,
    dropAll: dropAll,
}

