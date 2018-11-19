"use strict";
const Skill = require("../../models/skill.model");
const mongoose = require("mongoose");

const Skill1 = {
    "_id": mongoose.Types.ObjectId(),
    "name": "Tech1",
    "category": "category1"
};
const Skill2 = {
    "_id": mongoose.Types.ObjectId(),
    "name": "Tech2",
    "category": "category2"
};
const Skill3 = {
    "_id": mongoose.Types.ObjectId(),
    "name": "Tech3",
    "category": "category3"
};
const Skill4 = {
    "_id": mongoose.Types.ObjectId(),
    "name": "Tech4",
    "category": "category1"
};
const Skill5 = {
    "_id": mongoose.Types.ObjectId(),
    "name": "Tech5",
    "category": "category2"
};
const Skill6 = {
    "_id": mongoose.Types.ObjectId(),
    "name": "Tech6",
    "category": "category3"
};
const Skill7 = {
    "_id": mongoose.Types.ObjectId(),
    "name": "Tech7",
    "category": "category1"
};
const Skill8 = {
    "_id": mongoose.Types.ObjectId(),
    "name": "Tech8",
    "category": "category2"
};
const Skills = [
    Skill1,
    Skill2,
    Skill3,
    Skill4,
    Skill5,
    Skill6,
    Skill7,
    Skill8,
];

function storeAll(attributes) {
    const skillDocs = [];
    const skillNames = [];
    attributes.forEach((attribute) => {
        skillDocs.push(new Skill(attribute));
        skillNames.push(attribute.name);
    });

    return Skill.collection.insertMany(skillDocs);
}

function dropAll() {
    return Skill.collection.drop();
}

module.exports = {
    Skill1: Skill1,
    Skill2: Skill2,
    Skill3: Skill3,
    Skill4: Skill4,
    Skill5: Skill5,
    Skill6: Skill6,
    Skill7: Skill7,
    Skill8: Skill8,
    Skills: Skills,
    storeAll: storeAll,
    dropAll: dropAll,
};