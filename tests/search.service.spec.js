"use strict";

const chai = require("chai");
const chaiHttp = require("chai-http");
chai.use(chaiHttp);
const server = require("../app");

const agent = chai.request.agent(server.app);
const assert = require("chai").assert;
const should = chai.should();
const logger = require("../services/logger.service");

const Constants = {
    Error: require("../constants/error.constant"),
};

const util = {
    hacker: require("./util/hacker.test.util"),
    account: require("./util/account.test.util"),
    auth: require("./util/auth.test.util")
};

const queryToExecute = [{
    param: "gender",
    operation: "equals",
    value: "Female"
}];

const query2 = [{
    param: "school",
    operation: "ne",
    value: "McGill"
}];

const badQuery = [{
    param: "password",
    operation: "equals",
    value: "passowrd"
}];

const Admin0 = util.account.staffAccounts[0];

const noTeamHackerAccount0 = util.account.hackerAccounts.stored.noTeam[0];

describe("Searching for hackers", function () {
    it("Should FAIL to search due to invalid authentication", function (done) {
        util.auth.login(agent, {
            email: "abc",
            password: "def"
        }, (error) => {
            if (error) {
                agent.close();
                return done(error);
            }
            return agent
                .get("/api/search")
                .query({
                    model: "hacker",
                    q: JSON.stringify(queryToExecute)
                })
                .end(function (err, res) {
                    res.should.have.status(401);
                    res.body.message.should.equal(Constants.Error.AUTH_401_MESSAGE);
                    res.body.should.have.property("data");
                    done();
                });
        });
    });

    it("Should FAIL to search due to invalid authorization", function (done) {
        util.auth.login(agent, noTeamHackerAccount0, (error) => {
            if (error) {
                agent.close();
                return done(error);
            }
            return agent
                .get("/api/search")
                .query({
                    model: "hacker",
                    q: JSON.stringify(queryToExecute)
                })
                .end(function (err, res) {
                    res.should.have.status(403);
                    res.body.message.should.equal(Constants.Error.AUTH_403_MESSAGE);
                    res.body.should.have.property("data");
                    done();
                });
        });
    });
    it("Should return all female hackers", function (done) {
        util.auth.login(agent, Admin0, (error) => {
            if (error) {
                agent.close();
                return done(error);
            }
            return agent
                .get("/api/search")
                .query({
                    model: "hacker",
                    q: JSON.stringify(queryToExecute)
                })
                .end(function (err, res) {
                    res.should.have.status(200);
                    res.body.should.have.property("data");
                    res.body.data.should.have.length(6);
                    done();
                });
        });
    });
    it("Should return an error as hackers don't have password stored", function (done) {
        util.auth.login(agent, Admin0, (error) => {
            if (error) {
                agent.close();
                return done(error);
            }
            return agent
                .get("/api/search")
                .query({
                    model: "hacker",
                    q: JSON.stringify(badQuery)
                })
                .end(function (err, res) {
                    res.should.have.status(422);
                    done();
                });
        });
    });

    it("Should return an error as staff aren't searchable", function (done) {
        util.auth.login(agent, Admin0, (error) => {
            if (error) {
                agent.close();
                return done(error);
            }
            return agent
                .get("/api/search")
                .query({
                    model: "staff",
                    q: JSON.stringify(badQuery)
                })
                .end(function (err, res) {
                    res.should.have.status(422);
                    res.body.data.model.msg.should.equal("Must be a valid searchable model");
                    done();
                });
        });
    });
    it("Should throw an error because model is not lowercase", function (done) {
        util.auth.login(agent, Admin0, (error) => {
            if (error) {
                agent.close();
                return done(error);
            }
            return agent
                .get("/api/search")
                .query({
                    model: "Hacker",
                    q: JSON.stringify(query2)
                })
                .end(function (err, res) {
                    res.should.have.status(422);
                    res.body.data.model.msg.should.equal("Model must be lower case");
                    done();
                });
        });
    });
    it("Should throw an error because out of a fake model", function (done) {
        util.auth.login(agent, Admin0, (error) => {
            if (error) {
                agent.close();
                return done(error);
            }
            return agent
                .get("/api/search")
                .query({
                    model: "hackerz",
                    q: JSON.stringify(query2)
                })
                .end(function (err, res) {
                    res.should.have.status(422);
                    res.body.data.model.msg.should.equal("Must be a valid searchable model");
                    done();
                });
        });
    });
    it("Should only return 1 hacker (page size)", function (done) {
        util.auth.login(agent, Admin0, (error) => {
            if (error) {
                agent.close();
                return done(error);
            }
            return agent
                .get("/api/search")
                .query({
                    model: "hacker",
                    q: JSON.stringify(query2),
                    limit: 1
                })
                .end(function (err, res) {
                    res.should.have.status(200);
                    res.body.data.should.have.length(1);
                    done();
                });
        });
    });
    it("Should only return 1 hacker (pagination)", function (done) {
        util.auth.login(agent, Admin0, (error) => {
            if (error) {
                agent.close();
                return done(error);
            }
            return agent
                .get("/api/search")
                //There are two test samples so by making limit 1, there will be something on the second page
                .query({
                    model: "hacker",
                    q: JSON.stringify(query2),
                    limit: 1,
                    page: 1
                })
                .end(function (err, res) {
                    res.should.have.status(200);
                    res.body.data.should.have.length(1);
                    done();
                });
        });
    });
    it("Should throw an error because out of bounds (page size)", function (done) {
        util.auth.login(agent, Admin0, (error) => {
            if (error) {
                agent.close();
                return done(error);
            }
            return agent
                .get("/api/search")
                .query({
                    model: "hacker",
                    q: JSON.stringify(query2),
                    limit: 5000
                })
                .end(function (err, res) {
                    res.should.have.status(422);
                    done();
                });
        });
    });
    it("Should throw an error because out of bounds (pagination)", function (done) {
        util.auth.login(agent, Admin0, (error) => {
            if (error) {
                agent.close();
                return done(error);
            }
            return agent
                .get("/api/search")
                .query({
                    model: "hacker",
                    q: JSON.stringify(query2),
                    limit: 1,
                    page: -1
                })
                .end(function (err, res) {
                    res.should.have.status(422);
                    done();
                });
        });
    });

    it("Should expand the accountId when expand is set to true", function (done) {
        util.auth.login(agent, Admin0, (error) => {
            if (error) {
                agent.close();
                return done(error);
            }
            return agent
                .get("/api/search")
                .query({
                    model: "hacker",
                    q: JSON.stringify(queryToExecute),
                    expand: true
                })
                .end(function (err, res) {
                    res.should.have.status(200);
                    res.body.should.have.property("data");
                    res.body.data.should.have.length(6);
                    res.body.data[0].should.have.property("accountId");
                    res.body.data[0].accountId.should.have.property("email");
                    done();
                });
        });
    });
});