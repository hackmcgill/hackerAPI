"use strict";
const DefaultPermission = require("../models/defaultPermission.model");
const Permission = require("../models/permission.model");
const logger = require("./logger.service");

// untested
async function getDefaultPermission(defaultUserType) {
    const TAG = `[Permission Service # getDefaultPermission]:`;
    const query = {
        userType: defaultUserType
    };

    return await DefaultPermission.findOne(query, function (error, permission) {
        if (error) {
            logger.error(`${TAG} Failed to verify if default permission exists or not using ${JSON.stringify(query)}`, error);
        } else if (permission) {
            logger.debug(`${TAG} default permission using ${JSON.stringify(query)} exist in database`);
        } else {
            logger.debug(`${TAG} default permission using ${JSON.stringify(query)} do not exist in the database`);
        }
    }).select("permissions");
}

module.exports = {
    getDefaultPermission: getDefaultPermission
}