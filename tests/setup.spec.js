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
    Sponsor: require("./util/sponsor.test.util"),
    Staff: require("./util/staff.test.util"),
    Team: require("./util/team.test.util"),
    Volunteer: require("./util/volunteer.test.util"),
    AccountConfirmation: require("./util/accountConfirmation.test.util"),
    ResetPassword: require("./util/resetPassword.test.util.js")
};


//make sure that we are connected to the database
before(function (done) {
    this.timeout(60000);
    server.app.on("event:connected to db", done);
});

beforeEach(function (done) {
    this.timeout(60000);
    storeAll().then(() => {
        done();
    }).catch((error) => {
        done(error);
    });
});

afterEach(function (done) {
    this.timeout(60000);
    dropAll().then(() => {
        done();
    }).catch((error) => {
        done(error);
    });
});
async function storeAll() {
    await Util.Account.storeAll(Util.Account.allAccounts);
    await Util.Hacker.storeAll(Util.Hacker.Hackers);
    await Util.Sponsor.storeAll(Util.Sponsor.Sponsors);
    await Util.Team.storeAll(Util.Team.Teams);
    await Util.Staff.storeAll(Util.Staff.Staffs);
    await Util.AccountConfirmation.storeAll(Util.AccountConfirmation.AccountConfirmationTokens);
    await Util.ResetPassword.storeAll(Util.ResetPassword.ResetPasswords);
    await Util.Bus.storeAll(Util.Bus.Busses);
    await Util.Volunteer.storeAll(Util.Volunteer.Volunteers);
    await Util.Role.storeAll(Util.Role.allRolesArray);
    await Util.RoleBinding.storeAll(Util.RoleBinding.RoleBindings);
}

async function dropAll() {
    await Util.RoleBinding.dropAll();
    await Util.Role.dropAll();
    await Util.ResetPassword.dropAll();
    await Util.AccountConfirmation.dropAll();
    await Util.Volunteer.dropAll();
    await Util.Staff.dropAll();
    await Util.Team.dropAll();
    await Util.Sponsor.dropAll();
    await Util.Bus.dropAll();
    await Util.Hacker.dropAll();
    await Util.Account.dropAll();
}