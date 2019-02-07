"use strict";
const Settings = require("../models/settings.model");
const logger = require("./logger.service");

/**
 * @function updateSettings
 * @param {{_id: ObjectId, openTime: Date, closeTime: Date, confirmTime: Date}} settingsDetails 
 * @return {Promise<Settings>} The promise will resolve to a Settings object if save was successful.
 * @description Adds a new setting to database.
 */
function updateSettings(settingsDetails) {
    const TAG = "[Setting service # updateSettings]:";
    const existingSetting = await getSettings();
    if (existingSetting) {
        return Settings.findOneAndUpdate({}, settingsDetails, logger.queryCallbackFactory(TAG, "settings", {}))
    } else {
        const setting = new Settings(settingsDetails);
        return setting.save();
    }
}

/**
 * @function getRole
 * @description 
 * Returns the setting item
 */
function getSettings() {
    const TAG = "[Setting service # getSettings]:";
    return Settings.findOne({}, logger.queryCallbackFactory(TAG, "settings", {}));
}

module.exports = {
    updateSettings: updateSettings,
    getSettings: getSettings,
};