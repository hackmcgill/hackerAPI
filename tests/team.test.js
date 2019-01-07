"use strict";
const chai = require("chai");
const chaiHttp = require("chai-http");
const should = chai.should();
chai.use(chaiHttp);
const server = require("../app");
const Team = require("../models/team.model");

const util = {
    team: require("./util/team.test.util"),
    hacker: require("./util/hacker.test.util"),
    account: require("./util/account.test.util"),
    auth: require("./util/auth.test.util"),
};

const Constants = {
    Success: require("../constants/success.constant"),
    Error: require("../constants/error.constant"),
};

const agent = chai.request.agent(server.app);

describe("GET team", function () {
    it("should FAIL to list a team's information due to lack of authentication", function (done) {
        chai.request(server.app)
            .get(`/api/team/${util.team.Team3._id}`)
            .end(function (err, res) {
                res.should.have.status(401);
                res.should.be.json;
                res.body.should.have.property("message");
                res.body.message.should.equal(Constants.Error.AUTH_401_MESSAGE);
                res.body.should.have.property("data");

                done();
            });
    });

    it("should Fail and list a team's information from /api/team/ GET due to non existant team id", function (done) {
        util.auth.login(agent, util.account.Hacker4, (error) => {
            if (error) {
                agent.close();
                return done(error);
            }
            return agent
                .get(`/api/team/${util.team.newTeam1._id}`)
                .end(function (err, res) {
                    res.should.have.status(404);
                    res.should.be.json;
                    res.body.should.have.property("message");
                    res.body.message.should.equal(Constants.Error.TEAM_404_MESSAGE);
                    res.body.should.have.property("data");

                    done();
                });
        });
    });

    it("should SUCCEED and list a team's information from /api/team/ GET", function (done) {
        util.auth.login(agent, util.account.Hacker3, (error) => {
            if (error) {
                agent.close();
                return done(error);
            }
            return agent
                .get(`/api/team/${util.team.Team3._id}`)
                .end(function (err, res) {
                    res.should.have.status(200);
                    res.should.be.json;
                    res.body.should.have.property("message");
                    res.body.message.should.equal(Constants.Success.TEAM_READ);
                    res.body.should.have.property("data");
                    res.body.data.should.have.property("team");
                    res.body.data.team.name.should.equal("FullTeam");
                    res.body.data.should.have.property("members");
                    res.body.data.members[0].firstName.should.equal("abcd");
                    res.body.data.members[0].lastName.should.equal("defg4");
                    res.body.data.members[1].firstName.should.equal("abcd");
                    res.body.data.members[1].lastName.should.equal("defg5");
                    res.body.data.members[2].firstName.should.equal("abcd");
                    res.body.data.members[2].lastName.should.equal("defg6");
                    res.body.data.members[3].firstName.should.equal("abcd");
                    res.body.data.members[3].lastName.should.equal("defg7");

                    done();
                });
        });
    });
});

describe("POST create team", function () {
    it("should FAIL to create a new team due to lack of authentication", function (done) {
        chai.request(server.app)
            .post(`/api/team/`)
            .type("application/json")
            .send(util.team.newTeam1)
            .end(function (err, res) {
                res.should.have.status(401);
                res.should.be.json;
                res.body.should.have.property("message");
                res.body.message.should.equal(Constants.Error.AUTH_401_MESSAGE);
                res.body.should.have.property("data");

                done();
            });
    });

    it("should FAIL to create a new team due to lack of authorization", function (done) {
        util.auth.login(agent, util.account.Account3, (error) => {
            if (error) {
                agent.close();
                return done(error);
            }
            return agent
                .post(`/api/team/`)
                .type("application/json")
                .send(util.team.newTeam1)
                .end(function (err, res) {
                    res.should.have.status(403);
                    res.should.be.json;
                    res.body.should.have.property("message");
                    res.body.message.should.equal(Constants.Error.AUTH_403_MESSAGE);
                    res.body.should.have.property("data");

                    done();
                });
        });
    });

    it("should FAIL to create a new team due to logged in user not being a hacker", function (done) {
        util.auth.login(agent, util.account.Admin1, (error) => {
            if (error) {
                agent.close();
                return done(error);
            }
            return agent
                .post(`/api/team/`)
                .type("application/json")
                .send(util.team.newTeam1)
                .end(function (err, res) {
                    res.should.have.status(404);
                    res.should.be.json;
                    res.body.should.have.property("message");
                    res.body.message.should.equal(Constants.Error.HACKER_404_MESSAGE);
                    res.body.should.have.property("data");

                    done();
                });
        });
    });

    it("should FAIL to create a new team due to duplicate team name", function (done) {
        util.auth.login(agent, util.account.Account2, (error) => {
            if (error) {
                agent.close();
                return done(error);
            }
            return agent
                .post(`/api/team/`)
                .type("application/json")
                .send(util.team.duplicateTeamName1)
                .end(function (err, res) {
                    res.should.have.status(409);
                    res.should.be.json;
                    res.body.should.have.property("message");
                    res.body.message.should.equal(Constants.Error.TEAM_NAME_409_MESSAGE);
                    res.body.should.have.property("data");
                    res.body.data.should.equal(util.team.duplicateTeamName1.name);

                    done();
                });
        });
    });

    it("should Fail to create a new team due to hacker already being in a team", function (done) {
        util.auth.login(agent, util.account.Account1, (error) => {
            if (error) {
                agent.close();
                return done(error);
            }
            return agent
                .post(`/api/team/`)
                .type("application/json")
                .send(util.team.newTeam1)
                .end(function (err, res) {
                    res.should.have.status(409);
                    res.should.be.json;
                    res.body.should.have.property("message");
                    res.body.message.should.equal(Constants.Error.TEAM_MEMBER_409_MESSAGE);
                    res.body.should.have.property("data");
                    done();
                });
        });
    });

    it("should SUCCEED and create a new team", function (done) {
        util.auth.login(agent, util.account.Account2, (error) => {
            if (error) {
                agent.close();
                return done(error);
            }
            return agent
                .post(`/api/team/`)
                .type("application/json")
                .send(util.team.newTeam1)
                .end(function (err, res) {
                    res.should.have.status(200);
                    res.should.be.json;
                    res.body.should.have.property("message");
                    res.body.message.should.equal(Constants.Success.TEAM_CREATE);
                    res.body.should.have.property("data");

                    // deleting _id because that was generated, and not part of original data
                    const team = (new Team(util.team.createdNewTeam1)).toJSON();
                    delete res.body.data.id;
                    delete team.id;
                    chai.assert.equal(JSON.stringify(res.body.data), JSON.stringify(team));
                    done();
                });
        });
    });
});

describe("PATCH change team", function () {
    it("should FAIL to join a hacker to a team due to lack of authentication", function (done) {
        chai.request(server.app)
            .patch(`/api/team/join/`)
            .type("application/json")
            .send({
                name: "BronzeTeam",
            })
            .end(function (err, res) {
                res.should.have.status(401);
                res.should.be.json;
                res.body.should.have.property("message");
                res.body.message.should.equal(Constants.Error.AUTH_401_MESSAGE);
                res.body.should.have.property("data");

                done();
            });
    });

    it("should FAIL to join a volunteer to a team.", function (done) {
        util.auth.login(agent, util.account.Account5, (error) => {
            if (error) {
                agent.close();
                return done(error);
            }
            return agent
                .patch(`/api/team/join/`)
                .type("application/json")
                .send({
                    name: "BronzeTeam",
                })
                .end(function (err, res) {
                    res.should.have.status(403);
                    res.should.be.json;
                    res.body.should.have.property("message");
                    res.body.message.should.equal(Constants.Error.AUTH_403_MESSAGE);
                    res.body.should.have.property("data");

                    done();
                });
        });
    });

    it("should FAIL to join a hacker to a team that doesn't exist.", function (done) {
        util.auth.login(agent, util.account.Account1, (error) => {
            if (error) {
                agent.close();
                return done(error);
            }
            return agent
                .patch(`/api/team/join/`)
                .type("application/json")
                .send({
                    name: "NonExistTeam",
                })
                .end(function (err, res) {
                    res.should.have.status(404);
                    res.should.be.json;
                    res.body.should.have.property("message");
                    res.body.message.should.equal(Constants.Error.TEAM_404_MESSAGE);
                    res.body.should.have.property("data");

                    done();
                });
        });
    });

    it("should FAIL to join a hacker to a team that is full.", function (done) {
        util.auth.login(agent, util.account.Account1, (error) => {
            if (error) {
                agent.close();
                return done(error);
            }
            return agent
                .patch(`/api/team/join/`)
                .type("application/json")
                .send({
                    name: "FullTeam",
                })
                .end(function (err, res) {
                    res.should.have.status(409);
                    res.should.be.json;
                    res.body.should.have.property("message");
                    res.body.message.should.equal(Constants.Error.TEAM_SIZE_409_MESSAGE);
                    res.body.should.have.property("data");

                    done();
                });
        });
    });

    it("should SUCCEED and join a hacker without a team to a team.", function (done) {
        util.auth.login(agent, util.account.Account2, (error) => {
            if (error) {
                agent.close();
                return done(error);
            }
            return agent
                .patch(`/api/team/join/`)
                .type("application/json")
                .send({
                    name: "BronzeTeam",
                })
                .end(function (err, res) {
                    res.should.have.status(200);
                    res.should.be.json;
                    res.body.should.have.property("message");
                    res.body.message.should.equal(Constants.Success.TEAM_JOIN);
                    res.body.should.have.property("data");

                    done();
                });
        });
    });

    it("should SUCCEED and join a hacker on a team to aother team.", function (done) {
        util.auth.login(agent, util.account.Account1, (error) => {
            if (error) {
                agent.close();
                return done(error);
            }
            return agent
                .patch(`/api/team/join/`)
                .type("application/json")
                .send({
                    name: "SilverTeam",
                })
                .end(function (err, res) {
                    res.should.have.status(200);
                    res.should.be.json;
                    res.body.should.have.property("message");
                    res.body.message.should.equal(Constants.Success.TEAM_JOIN);
                    res.body.should.have.property("data");

                    done();
                });
        });
    });
});