"use strict";
const Constants = {
    Role: require("../constants/role.constant")
};

const Seed = {
    Roles: require("./roles.seed")
};

const db = require("../services/database.service");
//connect to db
db.connect(undefined, () => {
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
}

async function storeAll() {
    await Seed.Roles.storeAll(Constants.Role.allRolesArray);
}
