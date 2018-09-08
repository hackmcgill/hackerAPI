"use strict";
const Skill = require("../models/skill.model");
const logger = require("./logger.service");
const bcrypt = require("bcrypt");

/**
 * @function findById
 * @param {string} id
 * @return {Skill | null} either Skill or null
 * @description Finds a skill by its mongoID.
 */
function findById(id) {
    const TAG = `[Skill Service # findById]:`;
    const query = {
        _id: id
    };
    return Skill.findById(query, logger.queryCallbackFactory(TAG, "skill", query));
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