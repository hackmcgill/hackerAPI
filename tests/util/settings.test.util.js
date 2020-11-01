const Settings = require("../../models/settings.model");
const logger = require("../../services/logger.service");

const settingApplicationNotYetOpen = {
    openTime: new Date(Date.now() + 100000000000),
    closeTime: new Date(Date.now() + 10000000000000000),
    confirmTime: new Date(Date.now() + 100000000000000000)
};

const settingApplicationOpen = {
    openTime: new Date(Date.now() - 100),
    closeTime: new Date(Date.now() + 10000000000),
    confirmTime: new Date(Date.now() + 100000000000000)
};

const settingApplicationClosed = {
    openTime: new Date(Date.now() - 100),
    closeTime: new Date(Date.now() - 1000),
    confirmTime: new Date(Date.now() + 100000000000000)
};

const settingConfirmClosed = {
    openTime: new Date(Date.now() - 10000),
    closeTime: new Date(Date.now() - 1000),
    confirmTime: new Date(Date.now() - 100)
};

const settingRemoteHackathon = {
    openTime: new Date(Date.now() - 100),
    closeTime: new Date(Date.now() + 10000000000),
    confirmTime: new Date(Date.now() + 100000000000000),
    isRemote: true
};

async function storeAll() {
    const toStore = new Settings(settingApplicationOpen);
    Settings.collection.insertOne(toStore);
}

async function setApplicationClosed() {
    await dropAll();
    const toStore = new Settings(settingApplicationClosed);
    Settings.collection.insertOne(toStore);
}

async function setApplicationNotYetOpen() {
    await dropAll();
    const toStore = new Settings(settingApplicationNotYetOpen);
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
    setApplicationNotYetOpen: setApplicationNotYetOpen,
    settingApplicationNotYetOpen: settingApplicationNotYetOpen,
    settingApplicationOpen: settingApplicationOpen,
    settingApplicationClosed: settingApplicationClosed,
    settingConfirmClosed: settingConfirmClosed,
    settingRemoteHackathon: settingRemoteHackathon
};
