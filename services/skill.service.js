"use strict";
const Skill = require("../models/skill.model");
const logger = require("./logger.service");
const bcrypt = require("bcrypt");

/**
 * @async
 * @function findById
 * @param {string} id
 * @return {Skill | null} either Skill or null
 * @description Finds a skill by its mongoID.
 */
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

/**
 * @async
 * @function isSkillIdValid
 * @param {string} id
 * @return {boolean}
 * @description Checks whether a Skill with the specified mongoID exists.
 */
async function isSkillIdValid(id) {
    const skill = await findById(id);
    return !!skill;
}

module.exports = {
    isSkillIdValid: isSkillIdValid,
};