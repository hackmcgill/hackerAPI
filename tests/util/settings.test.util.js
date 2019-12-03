const Settings = require('../../models/settings.model');
const logger = require('../../services/logger.service');

const settingRegistrationNotYetOpen = {
  openTime: new Date(Date.now() + 100000000000),
  closeTime: new Date(Date.now() + 10000000000000000),
  confirmTime: new Date(Date.now() + 100000000000000000),
};

const settingRegistrationOpen = {
  openTime: new Date(Date.now() - 100),
  closeTime: new Date(Date.now() + 10000000000),
  confirmTime: new Date(Date.now() + 100000000000000),
};

const settingRegistrationClosed = {
  openTime: new Date(Date.now() - 100),
  closeTime: new Date(Date.now() - 1000),
  confirmTime: new Date(Date.now() + 100000000000000),
};

const settingConfirmClosed = {
  openTime: new Date(Date.now() - 10000),
  closeTime: new Date(Date.now() - 1000),
  confirmTime: new Date(Date.now() - 100),
};

async function storeAll() {
  const toStore = new Settings(settingRegistrationClosed);
  Settings.collection.insertOne(toStore);
}
async function dropAll() {
  try {
    await Settings.collection.drop();
  } catch (e) {
    if (e.code === 26) {
      logger.info('namespace %s not found', Settings.collection.name);
    } else {
      throw e;
    }
  }
}
module.exports = {
  storeAll: storeAll,
  dropAll: dropAll,
  settingRegistrationNotYetOpen: settingRegistrationNotYetOpen,
  settingRegistrationOpen: settingRegistrationOpen,
  settingRegistrationClosed: settingRegistrationClosed,
  settingConfirmClosed: settingConfirmClosed,
};
