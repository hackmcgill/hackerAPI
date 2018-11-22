"use strict";
const Constants = {
    Role: require("../constants/role.constant")
};

const Seed = {
    Roles: require("./roles.seed")
};

const db = require("../services/database.service");

db.connect(undefined, onConnected);

function onConnected() {
    storeAll().then(() => {
        console.log("Finished seeding");
    }).catch((error) => {
        console.log(error);
    });
}

async function storeAll() {
    await Seed.Roles.dropAll();
    await Seed.Roles.storeAll(Constants.Role.allRolesArray);
}