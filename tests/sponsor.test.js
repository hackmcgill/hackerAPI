"use strict";
const chai = require("chai");
const chaiHttp = require("chai-http");
chai.use(chaiHttp);
const server = require("../app");
const agent = chai.request.agent(server.app);
const Sponsor = require("../models/sponsor.model");
const should = chai.should();
const mongoose = require("mongoose");

const util = {
    sponsor: require("./util/sponsor.test.util"),
    auth: require("./util/auth.test.util"),
    account: require("./util/account.test.util"),
};

// associated account
let storedAccount = util.account.Account3;
// configure sponsor data to be the same as output from query
// stringify and parse for deep copy
let storedSponsor = JSON.parse(JSON.stringify(util.sponsor.Sponsor1));
storedSponsor.id = storedSponsor._id;
delete storedSponsor._id;
let duplicateSponsor = util.sponsor.duplicateAccountLinkSponsor1;

let authorizationFailAccount = util.account.Account1;

const Admin1 = util.account.Admin1;
const newSponsor = util.sponsor.newSponsor1;
const hackerAccount1 = util.account.Account1;

describe("GET user sponsor", function () {
    it("should fail list a sponsor's information due to authentication from /api/sponsor/:id GET", function (done) {
        chai.request(server.app)
            .get(`/api/sponsor/` + util.sponsor.Sponsor1._id)
            // does not have password because of to stripped json
            .end(function (err, res) {
                res.should.have.status(401);
                res.should.be.json;
                res.body.should.have.property("message");
                res.body.message.should.equal("Not Authenticated");

                done();
            });
    });

    // admin success
    it("should succeed to list a sponsor's info using admin power on /api/sponsor/:id GET", function (done) {
        util.auth.login(agent, Admin1, (error) => {
            if (error) {
                agent.close();
                return done(error);
            }
            return agent
                .get(`/api/sponsor/${util.sponsor.Sponsor1._id}`)
                .end(function (err, res) {
                    if (err) {
                        return done(err);
                    }
                    res.should.have.status(200);
                    res.should.be.json;
                    res.body.should.have.property("message");
                    res.body.message.should.equal("Successfully retrieved sponsor information");
                    res.body.should.have.property("data");
                    res.body.data.should.be.a("object");

                    chai.expect(res.body.data).to.deep.equal(storedSponsor);
                    done();
                });
        });
    });

    // regular user access success
    it("should succeed to list a user's sponsor info on /api/sponsor/:id GET", function (done) {
        util.auth.login(agent, storedAccount, (error) => {
            if (error) {
                agent.close();
                return done(error);
            }
            return agent
                .get(`/api/sponsor/${util.sponsor.Sponsor1._id}`)
                .end(function (err, res) {
                    if (err) {
                        return done(err);
                    }
                    res.should.have.status(200);
                    res.should.be.json;
                    res.body.should.have.property("message");
                    res.body.message.should.equal("Successfully retrieved sponsor information");
                    res.body.should.have.property("data");
                    res.body.data.should.be.a("object");

                    chai.expect(res.body.data).to.deep.equal(storedSponsor);
                    done();
                });
        });
    });

    // failure due to lack of auth
    it("should fail to list a user's sponsor info due to lack of authorization /api/sponsor/:id GET", function (done) {
        util.auth.login(agent, authorizationFailAccount, (error) => {
            if (error) {
                agent.close();
                return done(error);
            }
            return agent
                .get(`/api/sponsor/${util.sponsor.Sponsor1._id}`)
                .end(function (err, res) {
                    if (err) {
                        return done(err);
                    }
                    res.should.have.status(401);
                    res.should.be.json;
                    res.body.should.have.property("message");
                    res.body.message.should.equal("Not Authorized for this route");
                    res.body.should.have.property("data");

                    done();
                });
        });
    });

    // failure due to lack of this sponsor
    it("should fail to list non existant info on /api/sponsor/:id GET", function (done) {
        util.auth.login(agent, Admin1, (error) => {
            if (error) {
                agent.close();
                return done(error);
            }
            return agent
                .get(`/api/sponsor/${mongoose.Types.ObjectId()}`)
                .end(function (err, res) {
                    if (err) {
                        return done(err);
                    }
                    res.should.have.status(400);
                    res.should.be.json;
                    res.body.should.have.property("message");
                    res.body.message.should.equal("Issue with retrieving sponsor information");
                    res.body.should.have.property("data");

                    done();
                });
        });
    });
});

describe("POST create sponsor", function () {
    it("should fail to create a new sponsor due to lack of authentication", function (done) {
        chai.request(server.app)
            .post(`/api/sponsor`)
            .type("application/json")
            .send(util.sponsor.newSponsor)
            .end(function (err, res) {
                res.should.have.status(401);
                res.should.be.json;
                res.body.should.have.property("message");
                res.body.message.should.equal("Not Authenticated");

                done();
            });
    });

    // success case with admin - there is no :self case
    it("should SUCCEED and create a new sponsor", function (done) {
        util.auth.login(agent, Admin1, (error) => {
            if (error) {
                agent.close();
                return done(error);
            }
            return agent
                .post(`/api/sponsor/`)
                .type("application/json")
                .send(newSponsor)
                .end(function (err, res) {
                    res.should.have.status(200);
                    res.should.be.json;
                    res.body.should.have.property("message");
                    res.body.message.should.equal("Sponsor creation successful");
                    res.body.should.have.property("data");

                    // deleting _id because that was generated, and not part of original data
                    delete res.body.data._id;
                    chai.assert.equal(JSON.stringify(res.body.data), JSON.stringify(newSponsor));
                    done();
                });
        });
    });

    // fail case - duplicate accountId
    it("should fail to create a sponsor due to duplicate accountId", function (done) {
        util.auth.login(agent, Admin1, (error) => {
            if (error) {
                agent.close();
                return done(error);
            }
            return agent
                .post(`/api/sponsor/`)
                .type("application/json")
                .send(duplicateSponsor)
                .end(function (err, res) {
                    res.should.have.status(404);
                    res.body.should.have.property("message");
                    res.body.message.should.equal("Hacker with same accountId link found");
                    res.body.should.have.property("data");
                    done();
                });
        });
    });

    // unauthorized case
    it("should FAIL to create a new sponsor", function (done) {
        util.auth.login(agent, hackerAccount1, (error) => {
            if (error) {
                agent.close();
                return done(error);
            }
            return agent
                .post(`/api/sponsor/`)
                .type("application/json")
                .send(newSponsor)
                .end(function (err, res) {
                    res.should.have.status(401);
                    res.should.be.json;
                    res.body.should.have.property("message");
                    res.body.message.should.equal("Not Authorized for this route");
                    res.body.should.have.property("data");

                    done();
                });
        });
    });
});