"use strict";

const Success = require("../constants/success.constant");

/**
 * @function patchedSettings
 * @param {{body: {settingsDetails: Object}}} req
 * @param {*} res
 * @return {JSON} Success status and settings object
 * @description Returns the JSON of settings object located in req.body.settingsDetails
 */
function patchedSettings(req, res) {
    return res.status(200).json({
        message: Success.SETTINGS_PATCH,
        data: req.body.settingsDetails.toJSON(),
    });
}

/**
 * @function createdSettings
 * @param {{body: {settingsDetails: Object}}} req
 * @param {*} res
 * @return {JSON} Success status and settings object
 * @description Returns the JSON of settings object located in req.body.settingsDetails
 */
function createdSettings(req, res) {
    return res.status(200).json({
        message: Success.SETTINGS_CREATE,
        data: req.body.settingsDetails.toJSON(),
    });
}

module.exports = {
    patchedSettings: patchedSettings,
    createdSettings: createdSettings
};