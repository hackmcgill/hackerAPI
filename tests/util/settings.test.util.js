const Settings = require("../../models/settings.model");
const logger = require("../../services/logger.service");
const Constants = {
    Settings: require("../../constants/settings.constant")
};

async function storeAll() {
    const toStore = new Settings(Constants.Settings.APP_OPEN);
    Settings.collection.insertOne(toStore);
}

async function setApplicationClosed() {
    await dropAll();
    const toStore = new Settings(Constants.Settings.APP_CLOSED);
    Settings.collection.insertOne(toStore);
}

async function setApplicationNotYetOpen() {
    await dropAll();
    const toStore = new Settings(Constants.Settings.APP_NOT_YET_OPEN);
    Settings.collection.insertOne(toStore);
}

async function dropAll() {
    try {
        await Settings.collection.drop();
    } catch (e) {
        if (e.code === 26) {
            logger.info("namespace %s not found", Settings.collection.name);
        } else {
            throw e;
        }
    }
}
module.exports = {
    storeAll: storeAll,
    dropAll: dropAll,
    setApplicationClosed: setApplicationClosed,
    setApplicationNotYetOpen: setApplicationNotYetOpen
};
