"use strict";
const Hacker = require("../models/hacker.model");
const logger = require("./logger.service");

// untested
async function update(id, hackerDetails) {
    const TAG = `[Hacker Service # update ]:`;

    const query = {
        _id: id
    };

    const success = await Hacker.findOneAndUpdate(query, hackerDetails, function (error, user) {
        if (error) {
            logger.error(`${TAG} failed to change hacker`);
        } else if (!user) {
            logger.error(`${TAG} failed to find hacker in database`);
        } else {
            logger.debug(`${TAG} changed hacker information`);
        }
    });

    return !!(success);
}

module.exports = {
    update: update
};
