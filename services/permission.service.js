"use strict";
const DefaultPermission = require("../models/defaultPermission.model");
const logger = require("./logger.service");

/**
 * @async
 * @function getDefaultPermission
 * @param {JSON} defaultUserType The type of user for which to get default permissions for.
 * @return {Array} Array of ids of specific permissions
 * @description 
 * Gets the default permission of a type of user.
 * Currently under WIP while new permission system is being created.
 */
async function getDefaultPermission(defaultUserType) {
    const TAG = `[Permission Service # getDefaultPermission]:`;
    const query = {
        userType: defaultUserType
    };

    const permissions = await DefaultPermission.findOne(query, function (error, permission) {
        if (error) {
            logger.error(`${TAG} Failed to verify if default permission exists or not using ${JSON.stringify(query)}`, error);
        } else if (permission) {
            logger.debug(`${TAG} default permission using ${JSON.stringify(query)} exist in database`);
        } else {
            logger.debug(`${TAG} default permission using ${JSON.stringify(query)} do not exist in the database`);
        }
    }).select("permissions");
    return permissions.permissions;
}

module.exports = {
    getDefaultPermission: getDefaultPermission
};