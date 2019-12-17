"use strict";

const Success = require("../constants/success.constant");

/**
 * @function gotSettings
 * @param {{body: {settingsDetails: Object}}} req
 * @param {*} res
 * @return {JSON} Success status and settings object
 * @description Returns the JSON of settings object located in req.body.settingsDetails
 */
function gotSettings(req, res) {
    return res.status(200).json({
        message: Success.SETTINGS_GET,
        data: req.body.settingsDetails.toJSON()
    });
}

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
        data: req.body.settingsDetails
    });
}

module.exports = {
    gotSettings: gotSettings,
    patchedSettings: patchedSettings
};
