"use strict";
const Skill = require("../models/skill.model");
const logger = require("./logger.service");
const bcrypt = require("bcrypt");

async function findById(id) {
    const TAG = `[Skill Service # findById]:`;
    const query = {
        _id: id
    };
    return await Skill.findById(query, function (error, skill) {
        if (error) {
            logger.error(`${TAG} Failed to verify if skill exist or not using ${JSON.stringify(query)}`, error);
        } else if (skill) {
            logger.debug(`${TAG} skill using ${JSON.stringify(query)} exist in the database`);
        } else {
            logger.debug(`${TAG} skill using ${JSON.stringify(query)} do not exist in the database`);
        }
    });
}

async function isSkillIdValid(id) {
    const skill = await findById(id);
    return !!skill;
}

module.exports = {
    isSkillIdValid: isSkillIdValid,
};