/* eslint-disable no-console */
"use strict";
const Constants = {
    Role: require("../constants/role.constant")
};

const Seed = {
    Roles: require("./roles.seed")
};

const db = require("../services/database.service");
//connect to db
db.connect(undefined, onConnected);

//called when the db is connected
function onConnected() {
    dropAll().then(() => {
        console.log("Finished dropping");
        storeAll().then(() => {
            console.log("Finished seeding");
        }).catch((error) => {
            console.log(error);
        });
    }, (err) => {
        console.error(err);
    });

}

async function dropAll() {
    await Seed.Roles.dropAll();
}

async function storeAll() {
    await Seed.Roles.storeAll(Constants.Role.allRolesArray);
}