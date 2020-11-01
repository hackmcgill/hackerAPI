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
 * @function confirmValidPatch
 * @param {{body:{settingsDetails:{openTime:Date, closeTime:Date, confirmTime:Date, isRemote: Boolean}}}} req
 * @param {*} res
 * @param {*} next
 * @return {void}
 * @description Confirms that openTime < closeTime < confirmTime
 */
function confirmValidPatch(req, res, next) {
    const openTime = new Date(req.body.settingsDetails.openTime);
    const closeTime = new Date(req.body.settingsDetails.closeTime);
    const confirmTime = new Date(req.body.settingsDetails.confirmTime);
    if (openTime < closeTime && closeTime < confirmTime) {
        return next();
    }
    return next({
        status: 422,
        message: Constants.Error.SETTINGS_422_MESSAGE,
        error: req.body.settingsDetails
    });
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

/**
 * @function confirmAppsOpen
 * @param {*} req
 * @param {*} res
 * @param {*} next
 * @description Only succeeds if the currentTime > openTime, and currentTime < closeTime
 */
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
        const closeTime = new Date(settings.closeTime);
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
    confirmValidPatch: confirmValidPatch,
    confirmAppsOpen: Middleware.Util.asyncMiddleware(confirmAppsOpen),
    updateSettings: Middleware.Util.asyncMiddleware(updateSettings),
    getSettings: Middleware.Util.asyncMiddleware(getSettings)
};
