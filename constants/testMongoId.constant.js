"use strict";

const mongoose = require("mongoose");
const shortid = require("shortid");
const team1Id = shortid.generate();
const team2Id = shortid.generate();
const team3Id = shortid.generate();

const hackerAId = mongoose.Types.ObjectId();
const hackerBId = mongoose.Types.ObjectId();
const hackerCId = mongoose.Types.ObjectId();
const hackerDId = mongoose.Types.ObjectId();
const hackerEId = mongoose.Types.ObjectId();
const hackerFId = mongoose.Types.ObjectId();
const hackerGId = mongoose.Types.ObjectId();
const hackerHId = mongoose.Types.ObjectId();

module.exports = {
    team1Id: team1Id,
    team2Id: team2Id,
    team3Id: team3Id,
    hackerAId: hackerAId,
    hackerBId: hackerBId,
    hackerCId: hackerCId,
    hackerDId: hackerDId,
    hackerEId: hackerEId,
    hackerFId: hackerFId,
    hackerGId: hackerGId,
    hackerHId: hackerHId
};
