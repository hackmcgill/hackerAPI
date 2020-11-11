"use strict";
const Settings = require("../models/settings.model");

/**
 * Drops all elements in Role
 */
function drop() {
    return Settings.deleteMany({});
}

/**
 * Stores all of the roles in the db
 * @param {Settings} setting the setting that we want to seed
 */
function store(setting) {
    return Settings.collection.insertOne(new Settings(setting));
}

module.exports = {
    store: store,
    drop: drop
};
