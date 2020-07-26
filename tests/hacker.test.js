"use strict";
const chai = require("chai");
const chaiHttp = require("chai-http");
chai.use(chaiHttp);
const server = require("../app");
const agent = chai.request.agent(server.app);
chai.should();
const Hacker = require("../models/hacker.model");
const fs = require("fs");
const path = require("path");
const Constants = {
    Success: require("../constants/success.constant"),
    General: require("../constants/general.constant"),
    Error: require("../constants/error.constant")
};

const util = {
    auth: require("./util/auth.test.util"),
    hacker: require("./util/hacker.test.util"),
    account: require("./util/account.test.util"),
    accountConfirmation: require("./util/accountConfirmation.test.util")
};
const StorageService = require("../services/storage.service");

const Admin0 = util.account.staffAccounts.stored[0];

const volunteerAccount0 = util.account.volunteerAccounts.stored[0];

const newHackerAccount0 = util.account.hackerAccounts.new[0];
const newHacker0 = util.hacker.newHacker0;
const invalidHackerAccount0 = util.account.hackerAccounts.invalid;
const invalidHacker0 = util.hacker.invalidHacker0;
const invalidHacker2 = util.hacker.invalidHacker2;
const newHacker1 = util.hacker.newHacker1;

const noTeamHackerAccount0 = util.account.hackerAccounts.stored.noTeam[0];
const noTeamHacker0 = util.hacker.NoTeamHacker0;

const teamHackerAccount0 = util.account.hackerAccounts.stored.team[0];
const teamHackerAccount1 = util.account.hackerAccounts.stored.team[1];
const TeamHacker0 = util.hacker.TeamHacker0;
const TeamHacker1 = util.hacker.TeamHacker1;
const duplicateAccountLinkHacker0 = util.hacker.duplicateAccountLinkHacker0;

const unconfirmedHackerAccount1 =
    util.account.hackerAccounts.stored.unconfirmed[0];
const unconfirmedHackerAccount0 = util.hacker.unconfirmedAccountHacker0;

const unconfirmedHacker1 = util.hacker.unconfirmedAccountHacker1;

const invalidHacker1 = util.hacker.invalidHacker1;

const BatchAcceptHackerArrayValid = [
    util.hacker.TeamHacker0._id,
    util.hacker.TeamHacker1._id,
    util.hacker.NoTeamHacker0._id
];

const BatchAcceptHackerArrayInvalid = [
    invalidHacker1._id,
    unconfirmedHacker1._id
];

describe("GET hacker", function() {
    // fail on authentication
    it("should FAIL to list a hacker's information on /api/hacker/:id GET due to authentication", function(done) {
        chai.request(server.app)
            .get(`/api/hacker/` + TeamHacker0._id)
            .end(function(err, res) {
                res.should.have.status(401);
                res.should.be.json;
                res.body.should.have.property("message");
                res.body.message.should.equal(Constants.Error.AUTH_401_MESSAGE);
                done();
            });
    });

    // success case
    it("should list the user's hacker info on /api/hacker/self GET", function(done) {
        util.auth.login(agent, teamHackerAccount0, (error) => {
            if (error) {
                agent.close();
                return done(error);
            }
            return agent.get("/api/hacker/self").end(function(err, res) {
                if (err) {
                    return done(err);
                }
                res.should.have.status(200);
                res.should.be.json;
                res.body.should.have.property("message");
                res.body.message.should.equal(Constants.Success.HACKER_READ);
                res.body.should.have.property("data");

                let hacker = new Hacker(TeamHacker0);
                chai.assert.equal(
                    JSON.stringify(res.body.data),
                    JSON.stringify(hacker.toJSON())
                );
                done();
            });
        });
    });

    // fail case due to wrong account type
    it("should FAIL to list the hacker info of an admin due to wrong account type /api/account/self GET", function(done) {
        util.auth.login(agent, Admin0, (error) => {
            if (error) {
                agent.close();
                return done(error);
            }
            return agent.get("/api/hacker/self").end(function(err, res) {
                res.should.have.status(409);
                res.should.be.json;
                res.body.should.have.property("message");
                res.body.message.should.equal(
                    Constants.Error.ACCOUNT_TYPE_409_MESSAGE
                );
                done();
            });
        });
    });

    // fail case due to unconfirmed email address of already defined hacker
    it("should FAIL to list the user's hacker info due to unconfirmed email on /api/hacker/self GET", function(done) {
        util.auth.login(agent, unconfirmedHackerAccount1, (error) => {
            if (error) {
                agent.close();
                return done(error);
            }
            return agent.get("/api/hacker/self").end(function(err, res) {
                res.should.have.status(409);
                res.should.be.json;
                res.body.should.have.property("message");
                res.body.message.should.equal(
                    Constants.Error.ACCOUNT_TYPE_409_MESSAGE
                );
                done();
            });
        });
    });

    // succeed on admin case
    it("should list a hacker's information using admin power on /api/hacker/:id GET", function(done) {
        util.auth.login(agent, Admin0, (error) => {
            if (error) {
                agent.close();
                return done(error);
            }
            return (
                agent
                    .get(`/api/hacker/${TeamHacker0._id}`)
                    // does not have password because of to stripped json
                    .end(function(err, res) {
                        if (err) {
                            return done(err);
                        }
                        res.should.have.status(200);
                        res.should.be.json;
                        res.body.should.have.property("message");
                        res.body.message.should.equal(
                            Constants.Success.HACKER_READ
                        );
                        res.body.should.have.property("data");

                        let hacker = new Hacker(TeamHacker0);
                        chai.assert.equal(
                            JSON.stringify(res.body.data),
                            JSON.stringify(hacker.toJSON())
                        );

                        done();
                    })
            );
        });
    });

    // succeed on :self case
    it("should list the user's hacker information on /api/hacker/:id GET", function(done) {
        util.auth.login(agent, teamHackerAccount0, (error) => {
            if (error) {
                agent.close();
                return done(error);
            }
            return (
                agent
                    .get(`/api/hacker/${TeamHacker0._id}`)
                    // does not have password because of to stripped json
                    .end(function(err, res) {
                        if (err) {
                            return done(err);
                        }
                        res.should.have.status(200);
                        res.should.be.json;
                        res.body.should.have.property("message");
                        res.body.message.should.equal(
                            Constants.Success.HACKER_READ
                        );
                        res.body.should.have.property("data");

                        let hacker = new Hacker(TeamHacker0);

                        chai.assert.equal(
                            JSON.stringify(res.body.data),
                            JSON.stringify(hacker.toJSON())
                        );

                        done();
                    })
            );
        });
    });

    // fail due to lack of authorization
    it("should FAIL to list a hacker information due to lack of authorization on /api/hacker/:id GET", function(done) {
        util.auth.login(agent, noTeamHackerAccount0, (error) => {
            if (error) {
                agent.close();
                return done(error);
            }
            return (
                agent
                    .get(`/api/hacker/${TeamHacker0._id}`)
                    // does not have password because of to stripped json
                    .end(function(err, res) {
                        if (err) {
                            return done(err);
                        }
                        res.should.have.status(403);
                        res.should.be.json;
                        res.body.should.have.property("message");
                        res.body.message.should.equal(
                            Constants.Error.AUTH_403_MESSAGE
                        );
                        res.body.should.have.property("data");

                        done();
                    })
            );
        });
    });

    // fail due to lack of hacker
    it("should FAIL to list an invalid hacker /api/hacker/:id GET", function(done) {
        util.auth.login(agent, Admin0, (error) => {
            if (error) {
                agent.close();
                return done(error);
            }
            return agent
                .get(`/api/hacker/${invalidHacker1._id}`)
                .end(function(err, res) {
                    if (err) {
                        return done(err);
                    }
                    res.should.have.status(404);
                    res.should.be.json;
                    res.body.should.have.property("message");
                    res.body.message.should.equal(
                        Constants.Error.HACKER_404_MESSAGE
                    );
                    res.body.should.have.property("data");

                    done();
                });
        });
    });

    // succeed on admin case
    it("should list a hacker's information using admin power on /api/hacker/email/:email GET", function(done) {
        util.auth.login(agent, Admin0, (error) => {
            if (error) {
                agent.close();
                return done(error);
            }
            return (
                agent
                    .get(`/api/hacker/email/${teamHackerAccount0.email}`)
                    // does not have password because of to stripped json
                    .end(function(err, res) {
                        if (err) {
                            return done(err);
                        }
                        res.should.have.status(200);
                        res.should.be.json;
                        res.body.should.have.property("message");
                        res.body.message.should.equal(
                            Constants.Success.HACKER_READ
                        );
                        res.body.should.have.property("data");

                        let hacker = new Hacker(TeamHacker0);
                        chai.assert.equal(
                            JSON.stringify(res.body.data),
                            JSON.stringify(hacker.toJSON())
                        );

                        done();
                    })
            );
        });
    });

    // succeed on :self case
    it("should list the user's hacker information on /api/hacker/email/:email GET", function(done) {
        util.auth.login(agent, teamHackerAccount0, (error) => {
            if (error) {
                agent.close();
                return done(error);
            }
            return (
                agent
                    .get(`/api/hacker/email/${teamHackerAccount0.email}`)
                    // does not have password because of to stripped json
                    .end(function(err, res) {
                        if (err) {
                            return done(err);
                        }
                        res.should.have.status(200);
                        res.should.be.json;
                        res.body.should.have.property("message");
                        res.body.message.should.equal(
                            Constants.Success.HACKER_READ
                        );
                        res.body.should.have.property("data");

                        let hacker = new Hacker(TeamHacker0);

                        chai.assert.equal(
                            JSON.stringify(res.body.data),
                            JSON.stringify(hacker.toJSON())
                        );

                        done();
                    })
            );
        });
    });

    // fail due to lack of authorization
    it("should FAIL to list a hacker information due to lack of authorization on /api/hacker/email/:id GET", function(done) {
        util.auth.login(agent, noTeamHackerAccount0, (error) => {
            if (error) {
                agent.close();
                return done(error);
            }
            return (
                agent
                    .get(`/api/hacker/email/${teamHackerAccount0.email}`)
                    // does not have password because of to stripped json
                    .end(function(err, res) {
                        if (err) {
                            return done(err);
                        }
                        res.should.have.status(403);
                        res.should.be.json;
                        res.body.should.have.property("message");
                        res.body.message.should.equal(
                            Constants.Error.AUTH_403_MESSAGE
                        );
                        res.body.should.have.property("data");

                        done();
                    })
            );
        });
    });
});

describe("POST create hacker", function() {
    // fail on authentication
    it("should FAIL to create a new hacker due to lack of authentication", function(done) {
        chai.request(server.app)
            .post(`/api/hacker/`)
            .type("application/json")
            .send(newHacker1)
            .end(function(err, res) {
                res.should.have.status(401);
                res.should.be.json;
                res.body.should.have.property("message");
                res.body.message.should.equal(Constants.Error.AUTH_401_MESSAGE);

                done();
            });
    });

    // succeed on admin case
    it("should SUCCEED and create a new hacker (with an account that has been confirmed) using admin credentials", function(done) {
        util.auth.login(agent, Admin0, (error) => {
            if (error) {
                agent.close();

                return done(error);
            }
            return agent
                .post(`/api/hacker/`)
                .type("application/json")
                .send(newHacker0)
                .end(function(err, res) {
                    res.should.have.status(200);
                    res.should.be.json;
                    res.body.should.have.property("message");
                    res.body.message.should.equal(
                        Constants.Success.HACKER_CREATE
                    );
                    res.body.should.have.property("data");

                    // create JSON version of model
                    // delete id as they will be different between model objects
                    // update status to be applied on the comparator hacker object
                    const hacker = new Hacker(newHacker0).toJSON();
                    hacker.status = Constants.General.HACKER_STATUS_APPLIED;
                    delete res.body.data.id;
                    delete hacker.id;
                    chai.assert.equal(
                        JSON.stringify(res.body.data),
                        JSON.stringify(hacker),
                        "objects do not match"
                    );

                    done();
                });
        });
    });

    // succeed on user case
    it("should SUCCEED and create a new hacker for user (with an account that has been confirmed)", function(done) {
        util.auth.login(agent, newHackerAccount0, (error) => {
            if (error) {
                agent.close();
                return done(error);
            }
            return agent
                .post(`/api/hacker/`)
                .type("application/json")
                .send(newHacker0)
                .end(function(err, res) {
                    res.should.have.status(200);
                    res.should.be.json;
                    res.body.should.have.property("message");
                    res.body.message.should.equal(
                        Constants.Success.HACKER_CREATE
                    );
                    res.body.should.have.property("data");

                    // create JSON version of model
                    // delete id as they will be different between model objects
                    // update status to be applied on the comparator hacker object
                    const hacker = new Hacker(newHacker0).toJSON();
                    hacker.status = Constants.General.HACKER_STATUS_APPLIED;
                    delete res.body.data.id;
                    delete hacker.id;
                    chai.assert.equal(
                        JSON.stringify(res.body.data),
                        JSON.stringify(hacker)
                    );
                    done();
                });
        });
    });

    // should fail due to travel request larger than 100
    it("should FAIL if the new hacker inputs a value larger than 100 for travel reimbursement", function(done) {
        util.auth.login(agent, newHackerAccount0, (error) => {
            if (error) {
                agent.close();
                return done(error);
            }
            return agent
                .post(`/api/hacker/`)
                .type("application/json")
                .send(invalidHacker2)
                .end(function(err, res) {
                    res.should.have.status(422);
                    res.should.be.json;
                    res.body.should.have.property("message");
                    res.body.message.should.equal("Validation failed");
                    res.body.should.have.property("data");
                    res.body.data.should.have.property(
                        "application.accommodation.travel"
                    );
                    res.body.data[
                        "application.accommodation.travel"
                    ].should.have.property("msg");
                    res.body.data[
                        "application.accommodation.travel"
                    ].msg.should.equal(
                        "application.accommodation.travel must be between 0 and 100"
                    );
                    done();
                });
        });
    });

    // should fail due to 'false' on code of conduct
    it("should FAIL if the new hacker does not accept code of conduct", function(done) {
        util.auth.login(agent, newHackerAccount0, (error) => {
            if (error) {
                agent.close();
                return done(error);
            }
            return agent
                .post(`/api/hacker/`)
                .type("application/json")
                .send(invalidHacker0)
                .end(function(err, res) {
                    res.should.have.status(422);
                    res.should.be.json;
                    res.body.should.have.property("message");
                    res.body.message.should.equal("Validation failed");
                    res.body.should.have.property("data");
                    res.body.data.should.have.property(
                        "application.other.privacyPolicy"
                    );
                    res.body.data[
                        "application.other.privacyPolicy"
                    ].msg.should.equal("Must be equal to true");
                    res.body.data.should.have.property(
                        "application.other.codeOfConduct"
                    );
                    res.body.data[
                        "application.other.codeOfConduct"
                    ].msg.should.equal("Must be equal to true");
                    done();
                });
        });
    });

    // fail on unconfirmed account, using admin
    it("should FAIL to create a new hacker if the account hasn't been confirmed", function(done) {
        util.auth.login(agent, Admin0, (error) => {
            if (error) {
                agent.close();
                return done(error);
            }
            return agent
                .post(`/api/hacker/`)
                .type("application/json")
                .send(unconfirmedHackerAccount0)
                .end(function(err, res) {
                    res.should.be.json;
                    res.body.should.have.property("message");
                    res.body.message.should.equal(
                        Constants.Error.ACCOUNT_403_MESSAGE
                    );
                    res.should.have.status(403);
                    done();
                });
        });
    });

    // fail due to duplicate accountId
    it("should FAIL to create new hacker due to duplicate account link", function(done) {
        util.auth.login(agent, Admin0, (error) => {
            if (error) {
                agent.close();
                return done(error);
            }
            return agent
                .post(`/api/hacker/`)
                .type("application/json")
                .send(duplicateAccountLinkHacker0)
                .end(function(err, res) {
                    res.should.have.status(409);
                    res.body.should.have.property("message");
                    res.body.message.should.equal(
                        Constants.Error.HACKER_ID_409_MESSAGE
                    );
                    res.body.should.have.property("data");
                    done();
                });
        });
    });

    // fail on invalid input
    it("should FAIL to create new hacker due to invalid input", function(done) {
        util.auth.login(agent, Admin0, (error) => {
            if (error) {
                agent.close();
                return done(error);
            }
            return agent
                .post(`/api/hacker/`)
                .type("application/json")
                .send(invalidHacker1)
                .end(function(err, res) {
                    res.should.have.status(422);
                    res.should.be.json;
                    res.body.should.have.property("message");
                    res.body.message.should.equal("Validation failed");
                    res.body.should.have.property("data");
                    res.body.data.should.have.property("accountId");
                    res.body.data.accountId.should.have.property("msg");
                    res.body.data.accountId.msg.should.equal("Invalid mongoID");
                    res.body.data.should.have.property(
                        "application.general.school"
                    );
                    res.body.data[
                        "application.general.school"
                    ].should.have.property("msg");
                    res.body.data[
                        "application.general.school"
                    ].msg.should.equal("name must exist");
                    res.body.data.should.have.property(
                        "application.general.jobInterest"
                    );
                    res.body.data[
                        "application.general.jobInterest"
                    ].should.have.property("msg");

                    res.body.data[
                        "application.general.jobInterest"
                    ].should.have.property("msg");
                    res.body.data[
                        "application.general.jobInterest"
                    ].msg.should.equal("The value must be part of the enum");
                    res.body.data.should.have.property(
                        "application.accommodation.travel"
                    );
                    res.body.data[
                        "application.accommodation.travel"
                    ].should.have.property("msg");
                    res.body.data[
                        "application.accommodation.travel"
                    ].msg.should.equal(
                        "application.accommodation.travel must be an integer."
                    );

                    done();
                });
        });
    });
});

describe("PATCH update multiple hackers", function() {
    it("should FAIL input validation on /api/hacker/batchAccept as an Admin", function(done) {
        util.auth.login(agent, Admin0, (error) => {
            if (error) {
                agent.close();
                return done(error);
            }
            return agent
                .patch(`/api/hacker/batchAccept/`)
                .type("application/json")
                .send()
                .end(function(err, res) {
                    res.should.have.status(422);
                    res.should.be.json;
                    res.body.should.have.property("message");
                    res.body.message.should.equal(
                        Constants.Error.VALIDATION_422_MESSAGE
                    );
                    done();
                });
        });
    });
    it("should FAIL authorization on /api/hacker/batchAccept as a non-Admin", function(done) {
        util.auth.login(agent, noTeamHackerAccount0, (error) => {
            if (error) {
                agent.close();
                return done(error);
            }
            return agent
                .patch(`/api/hacker/batchAccept/`)
                .type("application/json")
                .send()
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
    it("should SUCCEED and accept 2 hackers on /api/hacker/batchAccept as an Admin", function(done) {
        util.auth.login(agent, Admin0, (error) => {
            if (error) {
                agent.close();
                return done(error);
            }
            return agent
                .patch(`/api/hacker/batchAccept/`)
                .type("application/json")
                .send({ ids: BatchAcceptHackerArrayValid })
                .end(function(err, res) {
                    res.should.have.status(200);
                    res.should.be.json;
                    res.body.should.have.property("message");
                    res.body.message.should.equal(
                        Constants.Success.HACKER_UPDATE_BATCH
                    );
                    res.body.should.have.property("data");
                    chai.assert.equal(
                        JSON.stringify(res.body.data),
                        JSON.stringify({
                            success_ids: BatchAcceptHackerArrayValid,
                            errors: []
                        })
                    );
                    done();
                });
        });
    });
    it("should SUCCEED and accept 0 out of 2 hackers on /api/hacker/batchAccept as an Admin", function(done) {
        util.auth.login(agent, Admin0, (error) => {
            if (error) {
                agent.close();
                return done(error);
            }
            return agent
                .patch(`/api/hacker/batchAccept/`)
                .type("application/json")
                .send({ ids: BatchAcceptHackerArrayInvalid })
                .end(function(err, res) {
                    res.should.have.status(200);
                    res.should.be.json;
                    res.body.should.have.property("message");
                    res.body.message.should.equal(
                        Constants.Success.HACKER_UPDATE_BATCH
                    );
                    res.body.should.have.property("data");
                    res.body.data.should.have.property("success_ids");
                    chai.assert.equal(res.body.data.success_ids.length, 0);
                    res.body.data.should.have.property("errors");
                    chai.assert.equal(res.body.data.errors.length, 2);
                    done();
                });
        });
    });
});

describe("PATCH update one hacker", function() {
    // fail on authentication
    it("should FAIL to update a hacker on /api/hacker/:id GET due to authentication", function(done) {
        chai.request(server.app)
            .patch(`/api/hacker/${TeamHacker0._id}`)
            .type("application/json")
            .send({
                application: TeamHacker0.application
            })
            .end(function(err, res) {
                res.should.have.status(401);
                res.should.be.json;
                res.body.should.have.property("message");
                res.body.message.should.equal(Constants.Error.AUTH_401_MESSAGE);
                done();
            });
    });

    //should FAIL on authentication
    it("should FAIL to accept a hacker on /api/hacker/accept/:id due to authentication", function(done) {
        chai.request(server.app)
            .patch(`/api/hacker/accept/${TeamHacker0._id}`)
            .type("application/json")
            .send()
            .end(function(err, res) {
                res.should.have.status(401);
                res.should.be.json;
                res.body.should.have.property("message");
                res.body.message.should.equal(Constants.Error.AUTH_401_MESSAGE);
                done();
            });
    });

    // should FAIL due to authorization
    it("should FAIL to accept hacker info due to lack of authorization on /api/hacker/accept/:id", function(done) {
        util.auth.login(agent, noTeamHackerAccount0, (error) => {
            if (error) {
                agent.close();
                return done(error);
            }
            return agent
                .patch(`/api/hacker/accept/${TeamHacker0._id}`)
                .type("application/json")
                .send()
                .end(function(err, res) {
                    res.should.have.status(403);
                    res.should.be.json;
                    res.body.should.have.property("message");
                    res.body.message.should.equal(
                        Constants.Error.AUTH_403_MESSAGE
                    );
                    res.body.should.have.property("data");

                    done();
                });
        });
    });

    it("should FAIL to accept an invalid hacker's info on /api/hacker/accept/:id", function(done) {
        util.auth.login(agent, Admin0, (error) => {
            if (error) {
                agent.close();
                return done(error);
            }
            return agent
                .patch(`/api/hacker/accept/${invalidHacker1._id}`)
                .type("application/json")
                .send()
                .end(function(err, res) {
                    res.should.have.status(404);
                    res.should.be.json;
                    res.body.should.have.property("message");
                    res.body.message.should.equal(
                        Constants.Error.ACCOUNT_404_MESSAGE
                    );
                    res.body.should.have.property("data");

                    done();
                });
        });
    });

    it("should SUCCEED and accept a hacker on /api/hacker/accept/:id as an Admin", function(done) {
        util.auth.login(agent, Admin0, (error) => {
            if (error) {
                agent.close();
                return done(error);
            }
            return agent
                .patch(`/api/hacker/accept/${TeamHacker0._id}`)
                .type("application/json")
                .send()
                .end(function(err, res) {
                    res.should.have.status(200);
                    res.should.be.json;
                    res.body.should.have.property("message");
                    res.body.message.should.equal(
                        Constants.Success.HACKER_UPDATE
                    );
                    res.body.should.have.property("data");
                    chai.assert.equal(
                        JSON.stringify(res.body.data),
                        JSON.stringify({
                            status: "Accepted"
                        })
                    );
                    done();
                });
        });
    });

    it("should FAIL to accept a hacker on /api/hacker/acceptEmail/:email due to authentication", function(done) {
        chai.request(server.app)
            .patch(`/api/hacker/acceptEmail/${teamHackerAccount0.email}`)
            .type("application/json")
            .send()
            .end(function(err, res) {
                res.should.have.status(401);
                res.should.be.json;
                res.body.should.have.property("message");
                res.body.message.should.equal(Constants.Error.AUTH_401_MESSAGE);
                done();
            });
    });

    // should FAIL due to authorization
    it("should FAIL to accept hacker info due to lack of authorization on /api/hacker/acceptEmail/:email", function(done) {
        util.auth.login(agent, noTeamHackerAccount0, (error) => {
            if (error) {
                agent.close();
                return done(error);
            }
            return agent
                .patch(`/api/hacker/acceptEmail/${teamHackerAccount0.email}`)
                .type("application/json")
                .send()
                .end(function(err, res) {
                    res.should.have.status(403);
                    res.should.be.json;
                    res.body.should.have.property("message");
                    res.body.message.should.equal(
                        Constants.Error.AUTH_403_MESSAGE
                    );
                    res.body.should.have.property("data");

                    done();
                });
        });
    });

    it("should FAIL to accept an invalid hacker's info on /api/hacker/acceptEmail/:email", function(done) {
        util.auth.login(agent, Admin0, (error) => {
            if (error) {
                agent.close();
                return done(error);
            }
            return agent
                .patch(
                    `/api/hacker/acceptEmail/${invalidHackerAccount0[0].email}`
                )
                .type("application/json")
                .send()
                .end(function(err, res) {
                    res.should.have.status(404);
                    res.should.be.json;
                    res.body.should.have.property("message");
                    res.body.message.should.equal(
                        Constants.Error.ACCOUNT_404_MESSAGE
                    );
                    res.body.should.have.property("data");

                    done();
                });
        });
    });

    it("should SUCCEED and accept a hacker on /api/hacker/acceptEmail/:email as an Admin", function(done) {
        util.auth.login(agent, Admin0, (error) => {
            if (error) {
                agent.close();
                return done(error);
            }
            return agent
                .patch(`/api/hacker/acceptEmail/${teamHackerAccount0.email}`)
                .type("application/json")
                .send()
                .end(function(err, res) {
                    res.should.have.status(200);
                    res.should.be.json;
                    res.body.should.have.property("message");
                    res.body.message.should.equal(
                        Constants.Success.HACKER_UPDATE
                    );
                    res.body.should.have.property("data");
                    chai.assert.equal(res.body.data.hacker.status, "Accepted");
                    done();
                });
        });
    });

    // should succeed on admin case
    it("should SUCCEED and update a hacker using admin power", function(done) {
        util.auth.login(agent, Admin0, (error) => {
            if (error) {
                agent.close();
                return done(error);
            }
            let app = TeamHacker0.application;
            app.accommodation.shirtSize = "M";
            return agent
                .patch(`/api/hacker/${TeamHacker0._id}`)
                .type("application/json")
                .send({
                    application: {
                        general: app.general,
                        shortAnswer: app.shortAnswer,
                        other: app.other,
                        accommodation: {
                            barriers: app.accommodation.barriers,
                            impairments: app.accommodation.impairments,
                            travel: app.accommodation.travel,
                            shirtSize: "M"
                        }
                    }
                })
                .end(function(err, res) {
                    res.should.have.status(200);
                    res.should.be.json;
                    res.body.should.have.property("message");
                    res.body.message.should.equal(
                        Constants.Success.HACKER_UPDATE
                    );
                    res.body.should.have.property("data");
                    res.body.data.should.have.property("application");
                    res.body.data.application.should.have.property(
                        "accommodation"
                    );
                    res.body.data.application.accommodation.should.have.property(
                        "shirtSize"
                    );
                    chai.assert.equal(
                        JSON.stringify(
                            res.body.data.application.accommodation.shirtSize
                        ),
                        '"M"'
                    );
                    done();
                });
        });
    });

    it("should SUCCEED and update a hacker STATUS as an Admin", function(done) {
        util.auth.login(agent, Admin0, (error) => {
            if (error) {
                agent.close();
                return done(error);
            }
            return agent
                .patch(`/api/hacker/status/${TeamHacker0._id}`)
                .type("application/json")
                .send({
                    status: "Accepted"
                })
                .end(function(err, res) {
                    res.should.have.status(200);
                    res.should.be.json;
                    res.body.should.have.property("message");
                    res.body.message.should.equal(
                        Constants.Success.HACKER_UPDATE
                    );
                    res.body.should.have.property("data");
                    chai.assert.equal(
                        JSON.stringify(res.body.data),
                        JSON.stringify({
                            status: "Accepted"
                        })
                    );
                    done();
                });
        });
    });

    it("should FAIL and NOT update a hacker STATUS as a Hacker", function(done) {
        util.auth.login(agent, teamHackerAccount0, (error) => {
            if (error) {
                agent.close();
                return done(error);
            }
            return agent
                .patch(`/api/hacker/status/${TeamHacker0._id}`)
                .type("application/json")
                .send({
                    status: "Accepted"
                })
                .end(function(err, res) {
                    res.should.have.status(403);
                    res.should.be.json;
                    res.body.should.have.property("message");
                    res.body.message.should.equal(
                        Constants.Error.AUTH_403_MESSAGE
                    );
                    res.body.should.have.property("data");
                    done();
                });
        });
    });

    // hacker changed email, thus cannot change their status until they confirm email
    it("should FAIL and NOT update a hacker STATUS as a Hacker due to unconfirmed email", function(done) {
        util.auth.login(agent, Admin0, (error) => {
            if (error) {
                agent.close();
                return done(error);
            }
            return agent
                .patch(`/api/hacker/status/${unconfirmedHacker1._id}`)
                .type("application/json")
                .send({
                    status: "Waitlisted"
                })
                .end(function(err, res) {
                    res.should.have.status(403);
                    res.should.be.json;
                    res.body.should.have.property("message");
                    res.body.message.should.equal(
                        Constants.Error.ACCOUNT_403_MESSAGE
                    );
                    res.body.should.have.property("data");
                    done();
                });
        });
    });

    // volunteer should successfully checkin hacker
    it("should SUCCEED and check in hacker as a volunteer", function(done) {
        util.auth.login(agent, volunteerAccount0, (error) => {
            if (error) {
                agent.close();
                return done(error);
            }
            return agent
                .patch(`/api/hacker/checkin/${TeamHacker0._id}`)
                .type("application/json")
                .send({
                    status: "Checked-in"
                })
                .end(function(err, res) {
                    res.should.have.status(200);
                    res.should.be.json;
                    res.body.should.have.property("message");
                    res.body.message.should.equal(
                        Constants.Success.HACKER_UPDATE
                    );
                    res.body.should.have.property("data");
                    chai.assert.equal(
                        JSON.stringify(res.body.data),
                        JSON.stringify({
                            status: "Checked-in"
                        })
                    );
                    done();
                });
        });
    });

    // hacker should fail to checkin hacker
    it("should FAIL to check in hacker as a hacker", function(done) {
        util.auth.login(agent, teamHackerAccount0, (error) => {
            if (error) {
                agent.close();
                return done(error);
            }
            return agent
                .patch(`/api/hacker/checkin/${TeamHacker0._id}`)
                .type("application/json")
                .send({
                    status: "Checked-in"
                })
                .end(function(err, res) {
                    res.should.have.status(403);
                    res.should.be.json;
                    res.body.should.have.property("message");
                    res.body.message.should.equal(
                        Constants.Error.AUTH_403_MESSAGE
                    );
                    res.body.should.have.property("data");
                    done();
                });
        });
    });

    // hacker should FAIL to checkin hacker due to unconfirmed email
    it("should FAIL to check in hacker as a volunteer due to unconfirmed email", function(done) {
        util.auth.login(agent, volunteerAccount0, (error) => {
            if (error) {
                agent.close();
                return done(error);
            }
            return agent
                .patch(`/api/hacker/checkin/${unconfirmedHacker1._id}`)
                .type("application/json")
                .send({
                    status: "Checked-in"
                })
                .end(function(err, res) {
                    res.should.have.status(403);
                    res.should.be.json;
                    res.body.should.have.property("message");
                    res.body.message.should.equal(
                        Constants.Error.ACCOUNT_403_MESSAGE
                    );
                    res.body.should.have.property("data");
                    done();
                });
        });
    });

    // should succeed on hacker case
    it("should SUCCEED and update the user's hacker info", function(done) {
        util.auth.login(agent, noTeamHackerAccount0, (error) => {
            if (error) {
                agent.close();
                return done(error);
            }
            let app = noTeamHacker0.application;
            return agent
                .patch(`/api/hacker/${noTeamHacker0._id}`)
                .type("application/json")
                .send({
                    application: {
                        general: app.general,
                        shortAnswer: app.shortAnswer,
                        other: app.other,
                        accommodation: {
                            barriers: app.accommodation.barriers,
                            impairments: app.accommodation.impairments,
                            travel: app.accommodation.travel,
                            shirtSize: "M"
                        }
                    }
                })
                .end(function(err, res) {
                    res.should.have.status(200);
                    res.should.be.json;
                    res.body.should.have.property("message");
                    res.body.message.should.equal(
                        Constants.Success.HACKER_UPDATE
                    );
                    res.body.should.have.property("data");
                    res.body.data.should.have.property("application");
                    res.body.data.application.should.have.property(
                        "accommodation"
                    );
                    res.body.data.application.accommodation.should.have.property(
                        "shirtSize"
                    );
                    chai.assert.equal(
                        JSON.stringify(
                            res.body.data.application.accommodation.shirtSize
                        ),
                        '"M"'
                    );
                    done();
                });
        });
    });

    // should FAIL to change hacker data with an unconfirmed email
    it("should FAIL and not update the user's hacker info due to unconfirmed email", function(done) {
        util.auth.login(agent, unconfirmedHackerAccount1, (error) => {
            if (error) {
                agent.close();
                return done(error);
            }
            let app = unconfirmedHacker1.application;
            return agent
                .patch(`/api/hacker/${unconfirmedHacker1._id}`)
                .type("application/json")
                .send({
                    application: {
                        general: app.general,
                        shortAnswer: app.shortAnswer,
                        other: app.other,
                        accommodation: {
                            barriers: app.accommodation.barriers,
                            impairments: app.accommodation.impairments,
                            travel: app.accommodation.travel,
                            shirtSize: "M"
                        }
                    }
                })
                .end(function(err, res) {
                    res.should.have.status(403);
                    res.should.be.json;
                    res.body.should.have.property("message");
                    res.body.message.should.equal(
                        Constants.Error.ACCOUNT_403_MESSAGE
                    );
                    res.body.should.have.property("data");
                    done();
                });
        });
    });

    // should fail due to authorization
    it("should Fail to update hacker info due to lack of authorization", function(done) {
        util.auth.login(agent, noTeamHackerAccount0, (error) => {
            if (error) {
                agent.close();
                return done(error);
            }
            let app = TeamHacker0.application;
            return agent
                .patch(`/api/hacker/${TeamHacker0._id}`)
                .type("application/json")
                .send({
                    application: {
                        general: app.general,
                        shortAnswer: app.shortAnswer,
                        other: app.other,
                        accommodation: {
                            barriers: app.accommodation.barriers,
                            impairments: app.accommodation.impairments,
                            travel: app.accommodation.travel,
                            shirtSize: "M"
                        }
                    }
                })
                .end(function(err, res) {
                    res.should.have.status(403);
                    res.should.be.json;
                    res.body.should.have.property("message");
                    res.body.message.should.equal(
                        Constants.Error.AUTH_403_MESSAGE
                    );
                    res.body.should.have.property("data");

                    done();
                });
        });
    });

    // fail due to lack of hacker
    it("should fail to change an invalid hacker's info", function(done) {
        util.auth.login(agent, Admin0, (error) => {
            if (error) {
                agent.close();
                return done(error);
            }
            return agent
                .get(`/api/hacker/${invalidHacker1._id}`)
                .end(function(err, res) {
                    if (err) {
                        return done(err);
                    }
                    res.should.have.status(404);
                    res.should.be.json;
                    res.body.should.have.property("message");
                    res.body.message.should.equal(
                        Constants.Error.HACKER_404_MESSAGE
                    );
                    res.body.should.have.property("data");

                    done();
                });
        });
    });

    // Succeed and change accepted to confirm
    it("should succeed for hacker to update their own status from accepted to confirmed", function(done) {
        util.auth.login(agent, noTeamHackerAccount0, (error) => {
            if (error) {
                agent.close();
                return done(error);
            }
            return agent
                .patch(`/api/hacker/confirmation/${noTeamHacker0._id}`)
                .type("application/json")
                .send({
                    confirm: true
                })
                .end(function(err, res) {
                    if (err) {
                        return done(err);
                    }
                    res.should.have.status(200);
                    res.should.be.json;
                    res.body.should.have.property("message");
                    res.body.message.should.equal(
                        Constants.Success.HACKER_UPDATE
                    );
                    res.body.should.have.property("data");
                    chai.assert.equal(
                        JSON.stringify(res.body.data),
                        JSON.stringify({
                            status: Constants.General.HACKER_STATUS_CONFIRMED
                        })
                    );

                    done();
                });
        });
    });

    // Fail and don't change to accepted
    it("should FAIL for hacker to update their own status from accepted to confirmed due to unconfirmed email", function(done) {
        util.auth.login(agent, unconfirmedHackerAccount1, (error) => {
            if (error) {
                agent.close();
                return done(error);
            }
            return agent
                .patch(`/api/hacker/confirmation/${unconfirmedHacker1._id}`)
                .type("application/json")
                .send({
                    confirm: true
                })
                .end(function(err, res) {
                    if (err) {
                        return done(err);
                    }
                    res.should.have.status(403);
                    res.should.be.json;
                    res.body.should.have.property("message");
                    res.body.message.should.equal(
                        Constants.Error.ACCOUNT_403_MESSAGE
                    );
                    res.body.should.have.property("data");
                    done();
                });
        });
    });

    // Succeed and change confirmed to accepted
    it("should succeed for hacker to update their own status from confirmed to accepted", function(done) {
        util.auth.login(agent, teamHackerAccount0, (error) => {
            if (error) {
                agent.close();
                return done(error);
            }
            return agent
                .patch(`/api/hacker/confirmation/${TeamHacker0._id}`)
                .type("application/json")
                .send({
                    confirm: false
                })
                .end(function(err, res) {
                    if (err) {
                        return done(err);
                    }
                    res.should.have.status(200);
                    res.should.be.json;
                    res.body.should.have.property("message");
                    res.body.message.should.equal(
                        Constants.Success.HACKER_UPDATE
                    );
                    res.body.should.have.property("data");
                    chai.assert.equal(
                        JSON.stringify(res.body.data),
                        JSON.stringify({
                            status: Constants.General.HACKER_STATUS_WITHDRAWN
                        })
                    );

                    done();
                });
        });
    });

    // fail for a hacker that's not accepted
    it("should FAIL to update hacker status when hacker status is not accepted or confirmed", function(done) {
        util.auth.login(agent, util.account.waitlistedHacker0, (error) => {
            if (error) {
                agent.close();
                return done(error);
            }
            return agent
                .patch(
                    `/api/hacker/confirmation/${util.hacker.waitlistedHacker0._id}`
                )
                .type("application/json")
                .send({
                    confirm: true
                })
                .end(function(err, res) {
                    if (err) {
                        return done(err);
                    }
                    res.should.have.status(409);
                    res.should.be.json;
                    res.body.should.have.property("message");
                    res.body.message.should.equal(
                        Constants.Error.HACKER_STATUS_409_MESSAGE
                    );
                    res.body.should.have.property("data");

                    done();
                });
        });
    });

    // fail for a hacker that's not accepted
    it("should fail for hacker trying to confirm someone else", function(done) {
        util.auth.login(agent, util.account.waitlistedHacker0, (error) => {
            if (error) {
                agent.close();
                return done(error);
            }
            return agent
                .patch(`/api/hacker/confirmation/${noTeamHacker0._id}`)
                .type("application/json")
                .send({
                    confirm: true
                })
                .end(function(err, res) {
                    if (err) {
                        return done(err);
                    }
                    res.should.have.status(403);
                    res.should.be.json;
                    res.body.should.have.property("message");
                    res.body.message.should.equal(
                        Constants.Error.AUTH_403_MESSAGE
                    );
                    res.body.should.have.property("data");

                    done();
                });
        });
    });
});

describe("POST add a hacker resume", function() {
    it("It should SUCCEED and upload a resume for a hacker", function(done) {
        //this takes a lot of time for some reason
        util.auth.login(agent, noTeamHacker0, (error) => {
            if (error) {
                return done(error);
            }
            return agent
                .post(`/api/hacker/resume/${noTeamHacker0._id}`)
                .type("multipart/form-data")
                .attach(
                    "resume",
                    fs.createReadStream(path.join(__dirname, "testResume.pdf")),
                    {
                        contentType: "application/pdf"
                    }
                )
                .end(function(err, res) {
                    res.should.have.status(200);
                    res.should.have.property("body");
                    res.body.should.have.property("message");
                    res.body.message.should.equal(
                        Constants.Success.RESUME_UPLOAD
                    );
                    res.body.should.have.property("data");
                    res.body.data.should.have.property("filename");
                    StorageService.download(res.body.data.filename).then(
                        (value) => {
                            const actualFile = fs.readFileSync(
                                path.join(__dirname, "testResume.pdf")
                            );
                            chai.assert.equal(
                                value[0].length,
                                actualFile.length
                            );
                            StorageService.delete(res.body.data.filename)
                                .then(() => {
                                    done();
                                })
                                .catch(done);
                        }
                    );
                });
        });
    });
});

describe("GET Hacker stats", function() {
    it("It should FAIL and get hacker stats (invalid validation)", function(done) {
        //this takes a lot of time for some reason
        util.auth.login(agent, Admin0, (error) => {
            if (error) {
                return done(error);
            }
            return agent.get(`/api/hacker/stats`).end(function(err, res) {
                res.should.have.status(422);
                res.should.have.property("body");
                res.body.should.have.property("message");
                done();
            });
        });
    });
    it("It should SUCCEED and get hacker stats", function(done) {
        //this takes a lot of time for some reason
        util.auth.login(agent, Admin0, (error) => {
            if (error) {
                return done(error);
            }
            return agent
                .get(`/api/hacker/stats`)
                .query({
                    model: "hacker",
                    q: JSON.stringify([])
                })
                .end(function(err, res) {
                    res.should.have.status(200);
                    res.should.have.property("body");
                    res.body.should.have.property("message");
                    res.body.message.should.equal("Retrieved stats");
                    res.body.should.have.property("data");
                    res.body.data.should.have.property("stats");
                    res.body.data.stats.should.have.property("total");
                    res.body.data.stats.should.have.property("status");
                    res.body.data.stats.should.have.property("school");
                    res.body.data.stats.should.have.property("degree");
                    res.body.data.stats.should.have.property("gender");
                    res.body.data.stats.should.have.property("travel");
                    res.body.data.stats.should.have.property("ethnicity");
                    res.body.data.stats.should.have.property("jobInterest");
                    res.body.data.stats.should.have.property("fieldOfStudy");
                    res.body.data.stats.should.have.property("graduationYear");
                    res.body.data.stats.should.have.property(
                        "dietaryRestrictions"
                    );
                    res.body.data.stats.should.have.property("shirtSize");
                    res.body.data.stats.should.have.property("age");
                    done();
                });
        });
    });
    it("It should FAIL and get hacker stats due to invalid Authorization", function(done) {
        //this takes a lot of time for some reason
        util.auth.login(agent, teamHackerAccount0, (error) => {
            if (error) {
                return done(error);
            }
            return agent.get(`/api/hacker/stats`).end(function(err, res) {
                res.should.have.status(403);
                res.should.be.json;
                res.body.should.have.property("message");
                res.body.message.should.equal(Constants.Error.AUTH_403_MESSAGE);
                res.body.should.have.property("data");
                done();
            });
        });
    });
    it("It should FAIL and get hacker stats due to invalid Authentication", function(done) {
        //this takes a lot of time for some reason
        chai.request(server.app)
            .get(`/api/hacker/stats`)
            .end(function(err, res) {
                res.should.have.status(401);
                res.should.be.json;
                res.body.should.have.property("message");
                res.body.message.should.equal(Constants.Error.AUTH_401_MESSAGE);
                done();
            });
    });
});

describe("POST send week-of email", function() {
    it("It should FAIL to send the week-of email due to invalid Authentication", function(done) {
        //this takes a lot of time for some reason
        chai.request(server.app)
            .post(`/api/hacker/email/weekOf/${noTeamHacker0._id}`)
            .end(function(err, res) {
                res.should.have.status(401);
                res.should.be.json;
                res.body.should.have.property("message");
                res.body.message.should.equal(Constants.Error.AUTH_401_MESSAGE);
                res.body.should.have.property("data");
                done();
            });
    });
    it("It should FAIL to send the week-of email due to invalid Authorization", function(done) {
        //this takes a lot of time for some reason
        util.auth.login(agent, noTeamHacker0, (error) => {
            if (error) {
                return done(error);
            }
            return agent
                .post(`/api/hacker/email/weekOf/${noTeamHacker0._id}`)
                .end(function(err, res) {
                    res.should.have.status(403);
                    res.should.be.json;
                    res.body.should.have.property("message");
                    res.body.message.should.equal(
                        Constants.Error.AUTH_403_MESSAGE
                    );
                    res.body.should.have.property("data");
                    done();
                });
        });
    });
    it("It should SUCCEED to send the week-of email", function(done) {
        //this takes a lot of time for some reason
        util.auth.login(agent, Admin0, (error) => {
            if (error) {
                return done(error);
            }
            return agent
                .post(`/api/hacker/email/weekOf/${TeamHacker0._id}`)
                .end(function(err, res) {
                    res.should.have.status(200);
                    res.should.be.json;
                    res.body.should.have.property("message");
                    res.body.message.should.equal(
                        Constants.Success.HACKER_SENT_WEEK_OF
                    );
                    res.body.should.have.property("data");
                    done();
                });
        });
    });

    it("It should FAIL to send the week-of email due to unconfirmed email of hacker", function(done) {
        //this takes a lot of time for some reason
        util.auth.login(agent, Admin0, (error) => {
            if (error) {
                return done(error);
            }
            return agent
                .post(`/api/hacker/email/weekOf/${unconfirmedHacker1._id}`)
                .end(function(err, res) {
                    res.should.have.status(403);
                    res.should.be.json;
                    res.body.should.have.property("message");
                    res.body.message.should.equal(
                        Constants.Error.ACCOUNT_403_MESSAGE
                    );
                    res.body.should.have.property("data");
                    done();
                });
        });
    });
});

describe("POST send day-of email", function() {
    it("It should FAIL to send the day-of email due to invalid Authentication", function(done) {
        //this takes a lot of time for some reason
        chai.request(server.app)
            .post(`/api/hacker/email/dayOf/${TeamHacker1._id}`)
            .end(function(err, res) {
                res.should.have.status(401);
                res.should.be.json;
                res.body.should.have.property("message");
                res.body.message.should.equal(Constants.Error.AUTH_401_MESSAGE);
                res.body.should.have.property("data");
                done();
            });
    });
    it("It should FAIL to send the day-of email due to invalid Authorization", function(done) {
        //this takes a lot of time for some reason
        util.auth.login(agent, teamHackerAccount1, (error) => {
            if (error) {
                return done(error);
            }
            return agent
                .post(`/api/hacker/email/dayOf/${TeamHacker1._id}`)
                .end(function(err, res) {
                    res.should.have.status(403);
                    res.should.be.json;
                    res.body.should.have.property("message");
                    res.body.message.should.equal(
                        Constants.Error.AUTH_403_MESSAGE
                    );
                    res.body.should.have.property("data");
                    done();
                });
        });
    });
    it("It should SUCCEED to send the day-of email", function(done) {
        //this takes a lot of time for some reason
        util.auth.login(agent, Admin0, (error) => {
            if (error) {
                return done(error);
            }
            return agent
                .post(`/api/hacker/email/dayOf/${TeamHacker1._id}`)
                .end(function(err, res) {
                    res.should.have.status(200);
                    res.should.be.json;
                    res.body.should.have.property("message");
                    res.body.message.should.equal(
                        Constants.Success.HACKER_SENT_DAY_OF
                    );
                    res.body.should.have.property("data");
                    done();
                });
        });
    });

    it("It should FAIL to send the day-of email due to unconfirmed email of hacker", function(done) {
        //this takes a lot of time for some reason
        util.auth.login(agent, Admin0, (error) => {
            if (error) {
                return done(error);
            }
            return agent
                .post(`/api/hacker/email/dayOf/${unconfirmedHacker1._id}`)
                .end(function(err, res) {
                    res.should.have.status(403);
                    res.should.be.json;
                    res.body.should.have.property("message");
                    res.body.message.should.equal(
                        Constants.Error.ACCOUNT_403_MESSAGE
                    );
                    res.body.should.have.property("data");
                    done();
                });
        });
    });
});
