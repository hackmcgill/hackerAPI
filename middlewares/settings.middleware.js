const Services = {
    Settings: require("../services/settings.service"),
    Account: require("../services/account.service"),
    ParsePatch: require("../services/parsePatch.service")
};
const Middleware = {
    Util: require("./util.middleware")
};
const Constants = {
    Error: require("../constants/error.constant"),
};
const Model = {
    Settings: require("../models/settings.model")
}

/**
 * @function parsePatch
 * @param {body: *} req 
 * @param {*} res 
 * @param {(err?) => void} next 
 * @return {void}
 * @description Put relevent settings attributes into settingsDetails
 */
function parsePatch(req, res, next) {
    Services.parsePatch(Model.Settings, "settingDetails");
    return next();
}

/**
 * @function updateSettings
 * @param {body: *} req 
 * @param {*} res 
 * @param {(err?) => void} next 
 * @return {void}
 * @description Update settings object
 */
async function updateSettings(req, res, next) {
    const settings = await Services.Settings.updateSettings(req.body.settingDetails);
    if (!settings) {
        return next({
            status: 500,
            message: Constants.Error.GENERIC_500_MESSAGE
        });
    } else {
        next();
    }
}

/**
 * @function updateSettings
 * @param {*} req 
 * @param {*} res 
 * @param {(err?) => void} next 
 * @return {void}
 * @description get the settings object and puts it in the settingsDetails.
 */
async function getSettings(req, res, next) {
    const settings = await Services.Settings.getSettings();
    if (!settings) {
        return next({
            status: 404,
            message: Constants.Error.SETTINGS_404_MESSAGE
        });
    } else {
        req.body.settingDetails = settings;
        next();
    }
}

module.exports = {
    parsePatch: parsePatch,
    updateSettings: Middleware.Util.asyncMiddleware(updateSettings),
    getSettings: Middleware.Util.asyncMiddleware(getSettings),
}