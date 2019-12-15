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
    auth: require("./util/auth.test.util")
};

const Constants = {
    Error: require("../constants/error.constant"),
    Success: require("../constants/success.constant")
};

const Admin0 = util.account.adminAccounts.stored[0];
const Hacker0 = util.account.hackerAccounts.stored.team[0];

describe("POST create role", function() {
    it("should Fail to create a role because admin is not logged in", function(done) {
        chai.request(server.app)
            .post(`/api/role/`)
            .type("application/json")
            .send(util.role.newRole1)
            .end(function(err, res) {
                res.should.have.status(401);
                res.should.be.json;
                res.body.should.have.property("message");
                res.body.message.should.equal(Constants.Error.AUTH_401_MESSAGE);

                done();
            });
    });

    // should succeed on logged in admin
    it("should SUCCEED and add new role", function(done) {
        util.auth.login(agent, Admin0, (error) => {
            if (error) {
                agent.close();
                return done(error);
            }
            return agent
                .post(`/api/role/`)
                .type("application/json")
                .send(util.role.newRole1)
                .end(function(err, res) {
                    res.should.have.status(200);
                    res.should.be.json;
                    res.body.should.have.property("message");
                    res.body.message.should.equal(
                        Constants.Success.ROLE_CREATE
                    );

                    res.body.should.have.property("data");

                    // create JSON version of model
                    // delete id as they will be different between model objects
                    // delete ids of route objects in 'routes'
                    const role = new Role(util.role.newRole1).toJSON();
                    delete res.body.data.id;
                    for (var route of res.body.data.routes) {
                        delete route._id;
                    }
                    delete role.id;
                    for (route of role.routes) {
                        delete route._id;
                    }

                    chai.assert.equal(
                        JSON.stringify(res.body.data),
                        JSON.stringify(role)
                    );
                    done();
                });
        });
    });

    // should FAIL due to lack of authorization
    it("should Fail to add new role due to lack of authorization", function(done) {
        util.auth.login(agent, Hacker0, (error) => {
            if (error) {
                agent.close();
                return done(error);
            }
            return agent
                .post(`/api/role/`)
                .type("application/json")
                .send(util.role.newRole1)
                .end(function(err, res) {
                    res.should.have.status(403);
                    res.should.be.json;
                    res.body.should.have.property("message");
                    res.body.message.should.equal(
                        Constants.Error.AUTH_403_MESSAGE
                    );
                    done();
                });
        });
    });

    // should succeed despite duplicate routes
    it("should Suceed to add new role despite to duplicate routes", function(done) {
        util.auth.login(agent, Admin0, (error) => {
            if (error) {
                agent.close();
                return done(error);
            }
            return agent
                .post(`/api/role/`)
                .type("application/json")
                .send(util.role.duplicateRole1)
                .end(function(err, res) {
                    res.should.have.status(200);
                    res.should.be.json;
                    res.body.should.have.property("message");
                    res.body.message.should.equal(
                        Constants.Success.ROLE_CREATE
                    );
                    done();
                });
        });
    });
});
