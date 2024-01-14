"use strict";
const Constants = {
    Role: require("../constants/role.constant"),
    Settings: require("../constants/settings.constant")
};

const Seed = {
    Roles: require("./roles.seed"),
    Settings: require("./settings.seed")
};

const Services = {
    env: require("../services/env.service")
};
const path = require("path");

const envLoadResult = Services.env.load(path.join(__dirname, "../.env"));
if (envLoadResult.error) {
    Services.log.error(envLoadResult.error);
}

const db = require("../services/database.service");
//connect to db
db.connect(() => {
    onConnected()
        .catch((reason) => {
            console.error(reason);
            process.exit(1);
        })
        .then(() => {
            process.exit(0);
        });
});

//called when the db is connected
async function onConnected() {
    await dropAll();
    console.log("Finished dropping");
    await storeAll();
    console.log("Finished seeding");
}

async function dropAll() {
    await Seed.Roles.dropAll();
    await Seed.Settings.drop();
}

async function storeAll() {
    await Seed.Roles.storeAll(Constants.Role.allRolesArray);
    await Seed.Settings.store();
}
