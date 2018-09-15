"use strict";
const Skill = require("../models/skill.model");
const logger = require("./logger.service");

/**
 * @function findById
 * @param {ObjectId} id
 * @return {DocumentQuery} The document query will either resolve to a skill or null.
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
 * @param {ObjectId} id
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