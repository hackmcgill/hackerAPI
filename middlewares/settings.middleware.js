const Services = {
    Settings: require("../services/settings.service"),
    Account: require("../services/account.service")
};
const Middleware = {
    Util: require("./util.middleware")
};
const Constants = {
    Error: require("../constants/error.constant")
};
const Settings = require("../models/settings.model");

/**
 * @function parsePatch
 * @param {body: *} req
 * @param {*} res
 * @param {(err?) => void} next
 * @return {void}
 * @description Put relevent settings attributes into settingsDetails
 */
function parsePatch(req, res, next) {
    let settingsDetails = {};

    for (const val in req.body) {
        // use .hasOwnProperty instead of 'in' to get rid of inherited properties such as 'should'
        if (Settings.schema.paths.hasOwnProperty(val)) {
            settingsDetails[val] = req.body[val];
            delete req.body[val];
        }
    }

    req.body.settingsDetails = settingsDetails;
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
    const settings = await Services.Settings.updateSettings(
        req.body.settingsDetails
    );
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
        req.body.settingsDetails = settings;
        next();
    }
}

async function confirmAppsOpen(req, res, next) {
    const settings = await Services.Settings.getSettings();
    if (!settings) {
        return next({
            status: 500,
            message: Constants.Error.GENERIC_500_MESSAGE
        });
    } else {
        const now = Date.now();
        const openTime = new Date(settings.openTime);
        const closeTime = new Date(settings.openTime);
        if (openTime < now && closeTime > now) {
            return next();
        }
        return next({
            status: 403,
            message: Constants.Error.SETTINGS_403_MESSAGE
        });
    }
}

module.exports = {
    parsePatch: parsePatch,
    confirmAppsOpen: Middleware.Util.asyncMiddleware(confirmAppsOpen),
    updateSettings: Middleware.Util.asyncMiddleware(updateSettings),
    getSettings: Middleware.Util.asyncMiddleware(getSettings)
};
