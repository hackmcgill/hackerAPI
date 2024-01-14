"use strict";

const mongoose = require("mongoose");

const team1Id = new mongoose.Types.ObjectId();
const team2Id = new mongoose.Types.ObjectId();
const team3Id = new mongoose.Types.ObjectId();

const hackerAId = new mongoose.Types.ObjectId();
const hackerBId = new mongoose.Types.ObjectId();
const hackerCId = new mongoose.Types.ObjectId();
const hackerDId = new mongoose.Types.ObjectId();
const hackerEId = new mongoose.Types.ObjectId();
const hackerFId = new mongoose.Types.ObjectId();
const hackerGId = new mongoose.Types.ObjectId();
const hackerHId = new mongoose.Types.ObjectId();

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
