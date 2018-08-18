"use strict";
const DefaultPermission = require("../models/defaultPermission.model");
const Permission = require("../models/permission.model");
const logger = require("./logger.service");

/**
 * Update the permissions for a given userType.
 * @param {string} defaultUserName name of the default user type
 * @param {ObjectId[]} newPermissions array of permission object ids.
 */
async function changeUserTypePermissions(defaultUserName, newPermissions) {
    const TAG = `[Permission Service # changeUserTypePermissions]:`;
    const query = {
        userType: defaultUserName
    };
    return await DefaultPermission.findOneAndUpdate(query, {permissions: newPermissions}, (error, doc, result) => {
        if(error) {
            logger.error(`${TAG} Could not update user type`, error);
        } else {
            logger.info(`${TAG} Updated user type`, {doc: doc, result: result});
        }
    });
}


/**
 * Helper method that facilitates the creation of default users by returning the permission ids of a given user type.
 * @param {string} defaultUserName one of ['Hacker', 'Volunteer', 'Staff', 'GodStaff', 'Sponsor']
 * @returns {ObjectId[]} the list of objectIds of permissions for a given default user type.
 */
async function getDefaultPermission(defaultUserName) {
    const TAG = `[Permission Service # getDefaultPermission]:`;
    const query = {
        userType: defaultUserName
    };

    return await DefaultPermission.findOne(query, function (error, defaultPermission) {
        if (error) {
            logger.error(`${TAG} Failed to verify if default permission exists or not using ${JSON.stringify(query)}`, error);
        } else if (defaultPermission) {
            logger.debug(`${TAG} default permission using ${JSON.stringify(query)} exist in database`);
        } else {
            logger.debug(`${TAG} default permission using ${JSON.stringify(query)} do not exist in the database`);
        }
    }).select("permissions");
}

/**
 * Return the permissionName from the permissionId.
 * @param {*} permissionId the permission id
 * @returns {Promise<string>} returns the name of the permission
 */
async function getPermissionName(permissionId) {
    const TAG = `[Permission Service # getPermissionName]:`;
    return await Permission.findById(permissionId, function (error, result) {
        if(error) {
            logger.error(`${TAG} Failed to verify if default permission exists or not using ${JSON.stringify(permissionId)}`, error);
        } else if (!result) {
            logger.debug(`${TAG} permission ${JSON.stringify(permissionId)} does not exist in the database`);
        }
    }).select("name");
}
/**
 * Return the permissionId from the permissionName.
 * @param {string} permissionName the permission name
 * @returns {Promise<string>} resolves to the permissionId
 */
async function getPermissionId(permissionName) {
    const TAG = `[Permission Service # getPermissionId]:`;
    return await Permission.findOne({name:permissionName}, function (error, result) {
        if(error) {
            logger.error(`${TAG} Failed to verify if default permission exists or not using ${permissionName}`, error);
        } else if (!result) {
            logger.debug(`${TAG} permission ${permissionName} does not exist in the database`);
        }
    }).select("_id");
}

module.exports = {
    getDefaultPermission: getDefaultPermission,
    getPermissionName: getPermissionName,
    changeUserTypePermissions: changeUserTypePermissions,
    getPermissionId: getPermissionId
};