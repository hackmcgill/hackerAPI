"use strict";
const chai = require("chai");
const chaiHttp = require("chai-http");
chai.use(chaiHttp);
const server = require("../app");
const agent = chai.request.agent(server.app);
chai.should();
const util = {
    account: require("./util/account.test.util"),
    auth: require("./util/auth.test.util"),
    settings: require("./util/settings.test.util"),
    role: require("./util/role.test.util"),
    roleBinding: require("./util/roleBinding.test.util")
};

const Constants = {
    Success: require("../constants/success.constant"),
    Error: require("../constants/error.constant"),
    Settings: require("../constants/settings.constant")
};

const invalidAccount = util.account.hackerAccounts.stored.noTeam[0];
const Admin = util.account.staffAccounts.stored[0];

describe("GET settings", function() {
    async function storeAll() {
        await util.account.storeHackerStaffExtraAccount();
        await util.settings.storeAll();
        await util.role.storeAll();
        await util.roleBinding.storeAll();
    }
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
    it("should get the current settings", function(done) {
        chai.request(server.app)
            .get(`/api/settings/`)
            // does not have password because of to stripped json
            .end(function(err, res) {
                res.should.have.status(200);
                res.should.be.json;
                res.body.should.have.property("message");
                res.body.message.should.equal(Constants.Success.SETTINGS_GET);
                done();
            });
    });
});

describe("PATCH settings", function() {
    async function storeAll() {
        await util.account.storeHackerStaffExtraAccount();
        await util.settings.storeAll();
        await util.role.storeAll();
        await util.roleBinding.storeAll();
    }
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
    it("should FAIL to update the settings due to lack of authentication", function(done) {
        chai.request(server.app)
            .patch(`/api/settings/`)
            // does not have password because of to stripped json
            .end(function(err, res) {
                res.should.have.status(401);
                res.should.be.json;
                res.body.should.have.property("message");
                res.body.message.should.equal(Constants.Error.AUTH_401_MESSAGE);
                done();
            });
    });
    it("should FAIL to update the settings due to lack of authorization", function(done) {
        util.auth.login(agent, invalidAccount, (error) => {
            if (error) {
                agent.close();
                return done(error);
            }
            return (
                agent
                    .patch(`/api/settings/`)
                    .type("application/json")
                    .send({
                        openTime: new Date().toString(),
                        closeTime: new Date().toString(),
                        confirmTime: new Date().toString()
                    })
                    // does not have password because of to stripped json
                    .end(function(err, res) {
                        res.should.have.status(403);
                        res.should.be.json;
                        res.body.should.have.property("message");
                        res.body.message.should.equal(
                            Constants.Error.AUTH_403_MESSAGE
                        );
                        done();
                    })
            );
        });
    });
    it("should succeed to update the settings", function(done) {
        util.auth.login(agent, Admin, (error) => {
            if (error) {
                agent.close();
                return done(error);
            }
            return (
                agent
                    .patch(`/api/settings/`)
                    .type("application/json")
                    .send(Constants.Settings.CONFIRM_CLOSED)
                    .end(function(err, res) {
                        res.should.have.status(200);
                        res.should.be.json;
                        res.body.should.have.property("message");
                        res.body.message.should.equal(
                            Constants.Success.SETTINGS_PATCH
                        );
                        done();
                    })
            );
        });
    });
    it("should succeed to make the hackathon remote", function(done) {
        util.auth.login(agent, Admin, (error) => {
            if (error) {
                agent.close();
                return done(error);
            }
            return (
                agent
                    .patch(`/api/settings/`)
                    .type("application/json")
                    .send(Constants.Settings.REMOTE_HACKATHON)
                    .end(function(err, res) {
                        res.should.have.status(200);
                        res.should.be.json;
                        res.body.should.have.property("message");
                        res.body.message.should.equal(
                            Constants.Success.SETTINGS_PATCH
                        );
                        done();
                    })
            );
        });
    });
});
