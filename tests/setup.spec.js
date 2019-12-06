"use strict";
const winston = require("winston");
winston.remove(winston.transports.Console);
const server = require("../app.js");
const Util = {
    Account: require("./util/account.test.util"),
    Bus: require("./util/bus.test.util"),
    Hacker: require("./util/hacker.test.util"),
    Role: require("./util/role.test.util"),
    RoleBinding: require("./util/roleBinding.test.util"),
    Settings: require("./util/settings.test.util"),
    Sponsor: require("./util/sponsor.test.util"),
    Staff: require("./util/staff.test.util"),
    Team: require("./util/team.test.util"),
    Volunteer: require("./util/volunteer.test.util"),
    AccountConfirmation: require("./util/accountConfirmation.test.util"),
    ResetPassword: require("./util/resetPassword.test.util.js")
};
const logger = require("../services/logger.service");

//make sure that we are connected to the database
before(function(done) {
    this.timeout(60000);

    server.app.on("event:connected to db", () => {
        /**
         * Give the database time to create an index on existing schemas before we delete them.
         * Hacky way to get around a new error.
         */
        setTimeout(() => {
            dropAll()
                .then(done)
                .catch(done);
        }, 1000);
    });
});

beforeEach(function(done) {
    this.timeout(60000);
    storeAll()
        .then(() => {
            done();
        })
        .catch((error) => {
            done(error);
        });
});

afterEach(function(done) {
    this.timeout(60000);
    dropAll()
        .then(() => {
            done();
        })
        .catch((error) => {
            done(error);
        });
});
async function storeAll() {
    await Util.Account.storeAll();
    await Util.Settings.storeAll();
    await Util.Hacker.storeAll();
    await Util.Sponsor.storeAll();
    await Util.Team.storeAll();
    await Util.Staff.storeAll();
    await Util.AccountConfirmation.storeAll();
    await Util.ResetPassword.storeAll();
    await Util.Bus.storeAll();
    await Util.Volunteer.storeAll();
    await Util.Role.storeAll();
    await Util.RoleBinding.storeAll();
}

async function dropAll() {
    await Util.RoleBinding.dropAll();
    await Util.Role.dropAll();
    await Util.ResetPassword.dropAll();
    await Util.AccountConfirmation.dropAll();
    await Util.Volunteer.dropAll();
    await Util.Settings.dropAll();
    await Util.Staff.dropAll();
    await Util.Team.dropAll();
    await Util.Sponsor.dropAll();
    await Util.Bus.dropAll();
    await Util.Hacker.dropAll();
    await Util.Account.dropAll();
}
