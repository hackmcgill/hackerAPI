"use strict";
const chai = require("chai");
const chaiHttp = require("chai-http");
chai.use(chaiHttp);
const server = require("../app");
const agent = chai.request.agent(server.app);
chai.should();
const Util = {
    Account: require("./util/account.test.util"),
    Auth: require("./util/auth.test.util"),
};

const Constants = {
    Success: require("../constants/success.constant"),
    Error: require("../constants/error.constant"),
};

const invalidAccount = Util.Account.hackerAccounts.stored.noTeam[0];
const Admin = Util.Account.staffAccounts.stored[0];

const agent = chai.request.agent(server.app);


describe("GET settings", function () {
    it("should get the current settings", function (done) {
        chai.request(server.app)
            .get(`/api/settings/`)
            // does not have password because of to stripped json
            .end(function (err, res) {
                res.should.have.status(200);
                res.should.be.json;
                res.body.should.have.property("message");
                res.body.message.should.equal(Constants.Success.SETTINGS_GET);
                done();
            });
    });
});

describe("PATCH settings", function () {
    it("should fail to update the settings due to lack of authentication", function (done) {
        chai.request(server.app)
            .patch(`/api/settings/`)
            // does not have password because of to stripped json
            .end(function (err, res) {
                res.should.have.status(200);
                res.should.be.json;
                res.body.should.have.property("message");
                res.body.message.should.equal(Constants.Success.SETTINGS_GET);
                done();
            });
    });
    it("should fail to update the settings due to lack of authorization", function (done) {
        util.auth.login(agent, invalidAccount, (error) => {
            if (error) {
                agent.close();
                return done(error);
            }
            return agent.patch(`/api/settings/`)
                .type("application/json")
                .send({
                    openTime: new Date().toString(),
                    closeTime: new Date().toString(),
                    confirmTime: new Date().toString(),
                })
                // does not have password because of to stripped json
                .end(function (err, res) {
                    res.should.have.status(401);
                    res.should.be.json;
                    res.body.should.have.property("message");
                    res.body.message.should.equal(Constants.Error.AUTH_403_MESSAGE);
                    done();
                });
        });
    });
    it("should succeed to update the settings", function (done) {
        util.auth.login(agent, Admin, (error) => {
            if (error) {
                agent.close();
                return done(error);
            }
            return agent.patch(`/api/settings/`)
                .patch(`/api/settings/`)
                .type("application/json")
                .send({
                    openTime: new Date().toString(),
                    closeTime: new Date().toString(),
                    confirmTime: new Date().toString(),
                })
                // does not have password because of to stripped json
                .end(function (err, res) {
                    res.should.have.status(200);
                    res.should.be.json;
                    res.body.should.have.property("message");
                    res.body.message.should.equal(Constants.Success.SETTINGS_PATCH);
                    done();
                });
        });

    });

})