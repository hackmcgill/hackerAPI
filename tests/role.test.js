"use strict";
const chai = require("chai");
const chaiHttp = require("chai-http");
chai.use(chaiHttp);
const server = require("../app");
const Role = require("../models/role.model");
const agent = chai.request.agent(server.app);
const should = chai.should();

const util = {
    role: require("./util/role.test.util"),
    account: require("./util/account.test.util"),
    auth: require("./util/auth.test.util"),
};

const Constants = {
    Error: require("../constants/error.constant"),
};

describe("POST create role", function () {
    it("should Fail to create a role because staff is not logged in", function (done) {
        chai.request(server.app)
            .post(`/api/role/`)
            .type("application/json")
            .send(util.role.newRole1)
            .end(function (err, res) {
                res.should.have.status(401);
                res.should.be.json;
                res.body.should.have.property("message");
                res.body.message.should.equal(Constants.Error.AUTH_401_MESSAGE);

                done()
            });
    });

    // should succeed on logged in admin
    it("should SUCCEED and update the user's hacker info", function (done) {
        util.auth.login(agent, util.account.Admin1, (error) => {
            if (error) {
                agent.close();
                return done(error);
            }
            return agent
                .post(`/api/role/`)
                .type("application/json")
                .send(util.role.newRole1)
                .end(function (err, res) {
                    res.should.have.status(200);
                    res.should.be.json;
                    res.body.should.have.property("message");
                    res.body.message.should.equal("Create role successful.");

                    res.body.should.have.property("data");

                    // deleting _id because that was generated, and not part of original data
                    delete res.body.data._id;
                    chai.assert.equal(JSON.stringify(res.body.data), JSON.stringify(util.role.newRole1));
                    done();
                });
        });
    });

    // should fail due to lack of authorization

    // should fail due to duplicate routes

});