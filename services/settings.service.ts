import { UpdateResult } from "typeorm";
import Settings from "../models/settings.model";
const logger = require("./logger.service");

/**
 * @function updateSettings
 * @param {{_id: ObjectId, openTime: Date, closeTime: Date, confirmTime: Date}} settingsDetails
 * @return {Promise<Settings>} The promise will resolve to a Settings object if save was successful.
 * @description Adds a new setting to database.
 */
async function updateSettings(settingsDetails: Object) {
    const TAG = "[Setting service # updateSettings]:";
    const existingSetting = await getSettings();
    if (existingSetting) {
        return Settings.update({}, settingsDetails).then(
            (value: UpdateResult) => {
                logger.queryCallbackFactory(TAG, "settings", {});
                return value;
            }
        );
    } else {
        const setting = Settings.create(settingsDetails);
        return await setting.save();
    }
}

/**
 * @function getSettings
 * @return {Promise<Settings>} The promise will resolve to a Settings object if retrieval was successful.
 * @description Returns the setting item
 */
function getSettings() {
    const TAG = "[Setting service # getSettings]:";
    return Settings.findOne(
        {},
        logger.queryCallbackFactory(TAG, "settings", {})
    );
}

module.exports = {
    updateSettings: updateSettings,
    getSettings: getSettings
};
