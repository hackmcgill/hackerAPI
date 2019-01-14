"use strict";
const chai = require("chai");
const chaiHttp = require("chai-http");
chai.use(chaiHttp);
const server = require("../app");
const agent = chai.request.agent(server.app);
const should = chai.should();
const Hacker = require("../models/hacker.model");
const fs = require("fs");
const path = require("path");
const Constants = {
    Success: require("../constants/success.constant"),
    General: require("../constants/general.constant"),
    Error: require("../constants/error.constant"),
};

const util = {
    auth: require("./util/auth.test.util"),
    hacker: require("./util/hacker.test.util"),
    account: require("./util/account.test.util"),
    accountConfirmation: require("./util/accountConfirmation.test.util")
};
const StorageService = require("../services/storage.service");

const Admin1 = util.account.Admin1;
const Volunteer1 = util.account.Account4;

// storedAccount1 and storedHacker1 are linked together, and have hacker priviledges
// newHackerDuplicateAccountLink1 is also linked with Account1
// storedHacker1 has status confirmed
const storedAccount1 = util.account.Account1;
const storedHacker1 = util.hacker.HackerA;
const newHackerDuplicateAccountLink1 = util.hacker.duplicateAccountLinkHacker1;

// storedAccount2 and storedHacker2 are linked together, and have hacker priviledges
const storedAccount2 = util.account.Account2;
const storedHacker2 = util.hacker.HackerB;

const newHacker1 = util.hacker.newHacker1;
// badConductHacker1 is the same as newHacker1, even linking to the same account
// the difference is that badConductHacker1 does not accept the code of conducts
const badConductHacker1 = util.hacker.badCodeOfConductHacker1;
const newHackerAccount1 = util.account.allAccounts[13];

const newHacker2 = util.hacker.newHacker2;
const invalidHacker1 = util.hacker.invalidHacker1;

describe("GET hacker", function () {
    // fail on authentication
    it("should fail to list a hacker's information on /api/hacker/:id GET due to authentication", function (done) {
        chai.request(server.app)
            .get(`/api/hacker/` + storedHacker1._id)
            .end(function (err, res) {
                res.should.have.status(401);
                res.should.be.json;
                res.body.should.have.property("message");
                res.body.message.should.equal(Constants.Error.AUTH_401_MESSAGE);
                done();
            });
    });

    // success case
    it("should list the user's hacker info on /api/hacker/self GET", function (done) {
        util.auth.login(agent, storedAccount1, (error) => {
            if (error) {
                agent.close();
                return done(error);
            }
            return agent
                .get("/api/hacker/self")
                .end(function (err, res) {
                    if (err) {
                        return done(err);
                    }
                    res.should.have.status(200);
                    res.should.be.json;
                    res.body.should.have.property("message");
                    res.body.message.should.equal(Constants.Success.HACKER_READ);
                    res.body.should.have.property("data");

                    let hacker = new Hacker(storedHacker1);
                    chai.assert.equal(JSON.stringify(res.body.data), JSON.stringify(hacker.toJSON()));
                    done();
                });
        });
    });

    // fail case due to wrong account type
    it("should fail to list the hacker info of an admin due to wrong account type /api/account/self GET", function (done) {
        util.auth.login(agent, Admin1, (error) => {
            if (error) {
                agent.close();
                return done(error);
            }
            return agent
                .get("/api/hacker/self")
                .end(function (err, res) {
                    res.should.have.status(409);
                    res.should.be.json;
                    res.body.should.have.property("message");
                    res.body.message.should.equal(Constants.Error.ACCOUNT_TYPE_409_MESSAGE);
                    done();
                });
        });
    });

    // succeed on admin case
    it("should list a hacker's information using admin power on /api/hacker/:id GET", function (done) {
        util.auth.login(agent, Admin1, (error) => {
            if (error) {
                agent.close();
                return done(error);
            }
            return agent
                .get(`/api/hacker/${storedHacker1._id}`)
                // does not have password because of to stripped json
                .end(function (err, res) {
                    if (err) {
                        return done(err);
                    }
                    res.should.have.status(200);
                    res.should.be.json;
                    res.body.should.have.property("message");
                    res.body.message.should.equal(Constants.Success.HACKER_READ);
                    res.body.should.have.property("data");

                    let hacker = new Hacker(storedHacker1);
                    chai.assert.equal(JSON.stringify(res.body.data), JSON.stringify(hacker.toJSON()));

                    done();
                });
        });
    });

    // succeed on :self case
    it("should list the user's hacker information on /api/hacker/:id GET", function (done) {
        util.auth.login(agent, storedAccount1, (error) => {
            if (error) {
                agent.close();
                return done(error);
            }
            return agent
                .get(`/api/hacker/${storedHacker1._id}`)
                // does not have password because of to stripped json
                .end(function (err, res) {
                    if (err) {
                        return done(err);
                    }
                    res.should.have.status(200);
                    res.should.be.json;
                    res.body.should.have.property("message");
                    res.body.message.should.equal(Constants.Success.HACKER_READ);
                    res.body.should.have.property("data");

                    let hacker = new Hacker(storedHacker1);

                    chai.assert.equal(JSON.stringify(res.body.data), JSON.stringify(hacker.toJSON()));

                    done();
                });
        });
    });

    // fail due to lack of authorization
    it("should fail to list a hacker information due to lack of authorization on /api/hacker/:id GET", function (done) {
        util.auth.login(agent, storedAccount2, (error) => {
            if (error) {
                agent.close();
                return done(error);
            }
            return agent
                .get(`/api/hacker/${storedHacker1._id}`)
                // does not have password because of to stripped json
                .end(function (err, res) {
                    if (err) {
                        return done(err);
                    }
                    res.should.have.status(403);
                    res.should.be.json;
                    res.body.should.have.property("message");
                    res.body.message.should.equal(Constants.Error.AUTH_403_MESSAGE);
                    res.body.should.have.property("data");

                    done();
                });
        });
    });

    // fail due to lack of hacker
    it("should fail to list an invalid hacker /api/hacker/:id GET", function (done) {
        util.auth.login(agent, Admin1, (error) => {
            if (error) {
                agent.close();
                return done(error);
            }
            return agent
                .get(`/api/hacker/${invalidHacker1._id}`)
                .end(function (err, res) {
                    if (err) {
                        return done(err);
                    }
                    res.should.have.status(404);
                    res.should.be.json;
                    res.body.should.have.property("message");
                    res.body.message.should.equal(Constants.Error.HACKER_404_MESSAGE);
                    res.body.should.have.property("data");

                    done();
                });
        });
    });

    // succeed on admin case
    it("should list a hacker's information using admin power on /api/hacker/email/:email GET", function (done) {
        util.auth.login(agent, Admin1, (error) => {
            if (error) {
                agent.close();
                return done(error);
            }
            return agent
                .get(`/api/hacker/email/${storedAccount1.email}`)
                // does not have password because of to stripped json
                .end(function (err, res) {
                    if (err) {
                        return done(err);
                    }
                    res.should.have.status(200);
                    res.should.be.json;
                    res.body.should.have.property("message");
                    res.body.message.should.equal(Constants.Success.HACKER_READ);
                    res.body.should.have.property("data");

                    let hacker = new Hacker(storedHacker1);
                    chai.assert.equal(JSON.stringify(res.body.data), JSON.stringify(hacker.toJSON()));

                    done();
                });
        });
    });

    // succeed on :self case
    it("should list the user's hacker information on /api/hacker/email/:email GET", function (done) {
        util.auth.login(agent, storedAccount1, (error) => {
            if (error) {
                agent.close();
                return done(error);
            }
            return agent
                .get(`/api/hacker/email/${storedAccount1.email}`)
                // does not have password because of to stripped json
                .end(function (err, res) {
                    if (err) {
                        return done(err);
                    }
                    res.should.have.status(200);
                    res.should.be.json;
                    res.body.should.have.property("message");
                    res.body.message.should.equal(Constants.Success.HACKER_READ);
                    res.body.should.have.property("data");

                    let hacker = new Hacker(storedHacker1);

                    chai.assert.equal(JSON.stringify(res.body.data), JSON.stringify(hacker.toJSON()));

                    done();
                });
        });
    });

    // fail due to lack of authorization
    it("should fail to list a hacker information due to lack of authorization on /api/hacker/email/:id GET", function (done) {
        util.auth.login(agent, storedAccount2, (error) => {
            if (error) {
                agent.close();
                return done(error);
            }
            return agent
                .get(`/api/hacker/email/${storedAccount1.email}`)
                // does not have password because of to stripped json
                .end(function (err, res) {
                    if (err) {
                        return done(err);
                    }
                    res.should.have.status(403);
                    res.should.be.json;
                    res.body.should.have.property("message");
                    res.body.message.should.equal(Constants.Error.AUTH_403_MESSAGE);
                    res.body.should.have.property("data");

                    done();
                });
        });
    });
});

describe("POST create hacker", function () {
    // fail on authentication
    it("should fail to create a new hacker due to lack of authentication",
        function (done) {
            chai.request(server.app)
                .post(`/api/hacker/`)
                .type("application/json")
                .send(newHacker1)
                .end(function (err, res) {
                    res.should.have.status(401);
                    res.should.be.json;
                    res.body.should.have.property("message");
                    res.body.message.should.equal(Constants.Error.AUTH_401_MESSAGE);

                    done();
                });
        });

    // succeed on admin case
    it("should SUCCEED and create a new hacker (with an account that has been confirmed) using admin credentials", function (done) {
        util.auth.login(agent, Admin1, (error) => {
            if (error) {
                agent.close();
                return done(error);
            }
            return agent
                .post(`/api/hacker/`)
                .type("application/json")
                .send(newHacker1)
                .end(function (err, res) {
                    res.should.have.status(200);
                    res.should.be.json;
                    res.body.should.have.property("message");
                    res.body.message.should.equal(Constants.Success.HACKER_CREATE);
                    res.body.should.have.property("data");

                    // create JSON version of model
                    // delete id as they will be different between model objects
                    // update status to be applied on the comparator hacker object
                    const hacker = (new Hacker(newHacker1)).toJSON();
                    hacker.status = Constants.General.HACKER_STATUS_APPLIED;
                    delete res.body.data.id;
                    delete hacker.id;
                    chai.assert.equal(JSON.stringify(res.body.data), JSON.stringify(hacker));

                    done();
                });
        });
    });

    // succeed on user case
    it("should SUCCEED and create a new hacker for user (with an account that has been confirmed)", function (done) {
        util.auth.login(agent, newHackerAccount1, (error) => {
            if (error) {
                agent.close();
                return done(error);
            }
            return agent
                .post(`/api/hacker/`)
                .type("application/json")
                .send(newHacker1)
                .end(function (err, res) {
                    res.should.have.status(200);
                    res.should.be.json;
                    res.body.should.have.property("message");
                    res.body.message.should.equal(Constants.Success.HACKER_CREATE);
                    res.body.should.have.property("data");

                    // create JSON version of model
                    // delete id as they will be different between model objects
                    // update status to be applied on the comparator hacker object
                    const hacker = (new Hacker(newHacker1)).toJSON();
                    hacker.status = Constants.General.HACKER_STATUS_APPLIED;
                    delete res.body.data.id;
                    delete hacker.id;
                    chai.assert.equal(JSON.stringify(res.body.data), JSON.stringify(hacker));
                    done();
                });
        });
    });

    // should fail due to 'false' on code of conduct
    it("should FAIL if the new hacker does not accept code of conduct", function (done) {
        util.auth.login(agent, newHackerAccount1, (error) => {
            if (error) {
                agent.close();
                return done(error);
            }
            return agent
                .post(`/api/hacker/`)
                .type("application/json")
                .send(badConductHacker1)
                .end(function (err, res) {
                    res.should.have.status(422);
                    res.should.be.json;
                    res.body.should.have.property("message");
                    res.body.message.should.equal("Validation failed");
                    res.body.should.have.property("data");
                    res.body.data.should.have.property("codeOfConduct");
                    res.body.data.codeOfConduct.msg.should.equal("Must be equal to true");
                    done();
                });
        });
    });

    // fail on unconfirmed account, using admin
    it("should FAIL to create a new hacker if the account hasn't been confirmed", function (done) {
        util.auth.login(agent, Admin1, (error) => {
            if (error) {
                agent.close();
                return done(error);
            }
            return agent
                .post(`/api/hacker/`)
                .type("application/json")
                .send(newHacker2)
                .end(function (err, res) {
                    res.should.be.json;
                    res.body.should.have.property("message");
                    res.body.message.should.equal(Constants.Error.ACCOUNT_403_MESSAGE);
                    res.should.have.status(403);
                    done();
                });
        });
    });

    // fail due to duplicate accountId
    it("should FAIL to create new hacker due to duplicate account link", function (done) {
        util.auth.login(agent, Admin1, (error) => {
            if (error) {
                agent.close();
                return done(error);
            }
            return agent
                .post(`/api/hacker/`)
                .type("application/json")
                .send(newHackerDuplicateAccountLink1)
                .end(function (err, res) {
                    res.should.have.status(409);
                    res.body.should.have.property("message");
                    res.body.message.should.equal(Constants.Error.HACKER_ID_409_MESSAGE);
                    res.body.should.have.property("data");
                    done();
                });
        });
    });

    // fail on invalid input
    it("should FAIL to create new hacker due to invalid input", function (done) {
        util.auth.login(agent, Admin1, (error) => {
            if (error) {
                agent.close();
                return done(error);
            }
            return agent
                .post(`/api/hacker/`)
                .type("application/json")
                .send(invalidHacker1)
                .end(function (err, res) {
                    // replace with actual test comparisons after error handler is implemented
                    res.should.have.status(422);
                    done();
                });
        });
    });
});

describe("PATCH update one hacker", function () {
    // fail on authentication
    it("should fail to update a hacker on /api/hacker/:id GET due to authentication", function (done) {
        chai.request(server.app)
            .patch(`/api/hacker/${storedHacker1._id}`)
            .type("application/json")
            .send({
                gender: "Other"
            })
            .end(function (err, res) {
                res.should.have.status(401);
                res.should.be.json;
                res.body.should.have.property("message");
                res.body.message.should.equal(Constants.Error.AUTH_401_MESSAGE);
                done();
            });
    });

    // should succeed on admin case
    it("should SUCCEED and update a hacker using admin power", function (done) {
        util.auth.login(agent, Admin1, (error) => {
            if (error) {
                agent.close();
                return done(error);
            }
            return agent
                .patch(`/api/hacker/${storedHacker1._id}`)
                .type("application/json")
                .send({
                    gender: "Other"
                })
                .end(function (err, res) {
                    res.should.have.status(200);
                    res.should.be.json;
                    res.body.should.have.property("message");
                    res.body.message.should.equal(Constants.Success.HACKER_UPDATE);
                    res.body.should.have.property("data");
                    chai.assert.equal(JSON.stringify(res.body.data), JSON.stringify({
                        gender: "Other"
                    }));
                    done();
                });
        });
    });

    it("should SUCCEED and update a hacker STATUS as an Admin", function (done) {
        util.auth.login(agent, Admin1, (error) => {
            if (error) {
                agent.close();
                return done(error);
            }
            return agent
                .patch(`/api/hacker/status/${storedHacker1._id}`)
                .type("application/json")
                .send({
                    status: "Accepted"
                })
                .end(function (err, res) {
                    res.should.have.status(200);
                    res.should.be.json;
                    res.body.should.have.property("message");
                    res.body.message.should.equal(Constants.Success.HACKER_UPDATE);
                    res.body.should.have.property("data");
                    chai.assert.equal(JSON.stringify(res.body.data), JSON.stringify({
                        status: "Accepted"
                    }));
                    done();
                });
        });
    });

    it("should FAIL and NOT update a hacker STATUS as a Hacker", function (done) {
        util.auth.login(agent, storedAccount1, (error) => {
            if (error) {
                agent.close();
                return done(error);
            }
            return agent
                .patch(`/api/hacker/status/${storedHacker1._id}`)
                .type("application/json")
                .send({
                    status: "Accepted"
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

    // volunteer should successfully checkin hacker
    it("should SUCCEED and check in hacker as a volunteer", function (done) {
        util.auth.login(agent, Volunteer1, (error) => {
            if (error) {
                agent.close();
                return done(error);
            }
            return agent
                .patch(`/api/hacker/checkin/${storedHacker1._id}`)
                .type("application/json")
                .send({
                    status: "Checked-in"
                })
                .end(function (err, res) {
                    res.should.have.status(200);
                    res.should.be.json;
                    res.body.should.have.property("message");
                    res.body.message.should.equal(Constants.Success.HACKER_UPDATE);
                    res.body.should.have.property("data");
                    chai.assert.equal(JSON.stringify(res.body.data), JSON.stringify({
                        status: "Checked-in"
                    }));
                    done();
                });
        });
    });

    // hacker should fail to checkin hacker
    it("should FAIL to check in hacker as a hacker", function (done) {
        util.auth.login(agent, storedAccount1, (error) => {
            if (error) {
                agent.close();
                return done(error);
            }
            return agent
                .patch(`/api/hacker/checkin/${storedHacker1._id}`)
                .type("application/json")
                .send({
                    status: "Checked-in"
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

    // should succeed on hacker case
    it("should SUCCEED and update the user's hacker info", function (done) {
        util.auth.login(agent, storedAccount2, (error) => {
            if (error) {
                agent.close();
                return done(error);
            }
            return agent
                .patch(`/api/hacker/${storedHacker2._id}`)
                .type("application/json")
                .send({
                    gender: "Other"
                })
                .end(function (err, res) {
                    res.should.have.status(200);
                    res.should.be.json;
                    res.body.should.have.property("message");
                    res.body.message.should.equal(Constants.Success.HACKER_UPDATE);
                    res.body.should.have.property("data");
                    chai.assert.equal(JSON.stringify(res.body.data), JSON.stringify({
                        gender: "Other"
                    }));
                    done();
                });
        });
    });

    // should fail due to authorization
    it("should Fail to update hacker info due to lack of authorization", function (done) {
        util.auth.login(agent, storedAccount2, (error) => {
            if (error) {
                agent.close();
                return done(error);
            }
            return agent
                .patch(`/api/hacker/${storedHacker1._id}`)
                .type("application/json")
                .send({
                    gender: "Other"
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

    // fail due to lack of hacker
    it("should fail to change an invalid hacker's info", function (done) {
        util.auth.login(agent, Admin1, (error) => {
            if (error) {
                agent.close();
                return done(error);
            }
            return agent
                .get(`/api/hacker/${invalidHacker1._id}`)
                .end(function (err, res) {
                    if (err) {
                        return done(err);
                    }
                    res.should.have.status(404);
                    res.should.be.json;
                    res.body.should.have.property("message");
                    res.body.message.should.equal(Constants.Error.HACKER_404_MESSAGE);
                    res.body.should.have.property("data");

                    done();
                });
        });
    });

    // Succeed and change accepted to confirm
    it("should succeed for hacker to update their own status from accepted to confirmed", function (done) {
        util.auth.login(agent, storedAccount2, (error) => {
            if (error) {
                agent.close();
                return done(error);
            }
            return agent
                .patch(`/api/hacker/confirmation/${storedHacker2._id}`)
                .type("application/json")
                .send({
                    confirm: true
                })
                .end(function (err, res) {
                    if (err) {
                        return done(err);
                    }
                    res.should.have.status(200);
                    res.should.be.json;
                    res.body.should.have.property("message");
                    res.body.message.should.equal(Constants.Success.HACKER_UPDATE);
                    res.body.should.have.property("data");
                    chai.assert.equal(JSON.stringify(res.body.data), JSON.stringify({
                        status: Constants.General.HACKER_STATUS_CONFIRMED
                    }));

                    done();
                });
        });
    });

    // Succeed and change confirmed to accepted
    it("should succeed for hacker to update their own status from confirmed to accepted", function (done) {
        util.auth.login(agent, storedAccount1, (error) => {
            if (error) {
                agent.close();
                return done(error);
            }
            return agent
                .patch(`/api/hacker/confirmation/${storedHacker1._id}`)
                .type("application/json")
                .send({
                    confirm: false
                })
                .end(function (err, res) {
                    if (err) {
                        return done(err);
                    }
                    res.should.have.status(200);
                    res.should.be.json;
                    res.body.should.have.property("message");
                    res.body.message.should.equal(Constants.Success.HACKER_UPDATE);
                    res.body.should.have.property("data");
                    chai.assert.equal(JSON.stringify(res.body.data), JSON.stringify({
                        status: Constants.General.HACKER_STATUS_CANCELLED
                    }));

                    done();
                });
        });
    });

    // fail for a hacker that's not accepted
    it("should fail to update hacker status when hacker status is not accepted or confirmed", function (done) {
        util.auth.login(agent, util.account.Hacker3, (error) => {
            if (error) {
                agent.close();
                return done(error);
            }
            return agent
                .patch(`/api/hacker/confirmation/${util.hacker.HackerC._id}`)
                .type("application/json")
                .send({
                    confirm: true
                })
                .end(function (err, res) {
                    if (err) {
                        return done(err);
                    }
                    res.should.have.status(409);
                    res.should.be.json;
                    res.body.should.have.property("message");
                    res.body.message.should.equal(Constants.Error.HACKER_STATUS_409_MESSAGE);
                    res.body.should.have.property("data");

                    done();
                });
        });
    });

    // fail for a hacker that's not accepted
    it("should fail for hacker trying to confirm someone else", function (done) {
        util.auth.login(agent, util.account.Hacker3, (error) => {
            if (error) {
                agent.close();
                return done(error);
            }
            return agent
                .patch(`/api/hacker/confirmation/${storedHacker1._id}`)
                .type("application/json")
                .send({
                    confirm: true
                })
                .end(function (err, res) {
                    if (err) {
                        return done(err);
                    }
                    res.should.have.status(403);
                    res.should.be.json;
                    res.body.should.have.property("message");
                    res.body.message.should.equal(Constants.Error.AUTH_403_MESSAGE);
                    res.body.should.have.property("data");

                    done();
                });
        });
    });
});
describe("POST add a hacker resume", function () {
    it("It should SUCCEED and upload a resume for a hacker", function (done) {
        //this takes a lot of time for some reason
        util.auth.login(agent, storedHacker1, (error) => {
            if (error) {
                return done(error);
            }
            return agent
                .post(`/api/hacker/resume/${storedHacker1._id}`)
                .type("multipart/form-data")
                .attach("resume", fs.createReadStream(path.join(__dirname, "testResume.pdf")), {
                    contentType: "application/pdf"
                })
                .end(function (err, res) {
                    res.should.have.status(200);
                    res.should.have.property("body");
                    res.body.should.have.property("message");
                    res.body.message.should.equal(Constants.Success.RESUME_UPLOAD);
                    res.body.should.have.property("data");
                    res.body.data.should.have.property("filename");
                    StorageService.download(res.body.data.filename).then((value) => {
                        const actualFile = fs.readFileSync(path.join(__dirname, "testResume.pdf"));
                        chai.assert.equal(value[0].length, actualFile.length);
                        StorageService.delete(res.body.data.filename).then(() => {
                            done();
                        }).catch(done);
                    });
                });
        });
    });
});

describe("GET Hacker stats", function () {
    it("It should FAIL and get hacker stats (invalid validation)", function (done) {
        //this takes a lot of time for some reason
        util.auth.login(agent, Admin1, (error) => {
            if (error) {
                return done(error);
            }
            return agent
                .get(`/api/hacker/stats`)
                .end(function (err, res) {
                    res.should.have.status(422);
                    res.should.have.property("body");
                    res.body.should.have.property("message");
                    done();
                });
        });
    });
    it("It should SUCCEED and get hacker stats", function (done) {
        //this takes a lot of time for some reason
        util.auth.login(agent, Admin1, (error) => {
            if (error) {
                return done(error);
            }
            return agent
                .get(`/api/hacker/stats`)
                .query({
                    model: "hacker",
                    q: JSON.stringify([])
                })
                .end(function (err, res) {
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
                    res.body.data.stats.should.have.property("needsBus");
                    res.body.data.stats.should.have.property("ethnicity");
                    res.body.data.stats.should.have.property("jobInterest");
                    res.body.data.stats.should.have.property("major");
                    res.body.data.stats.should.have.property("graduationYear");
                    res.body.data.stats.should.have.property("dietaryRestrictions");
                    res.body.data.stats.should.have.property("shirtSize");
                    res.body.data.stats.should.have.property("age");
                    done();
                });
        });
    });
    it("It should FAIL and get hacker stats due to invalid Authorization", function (done) {
        //this takes a lot of time for some reason
        util.auth.login(agent, storedAccount1, (error) => {
            if (error) {
                return done(error);
            }
            return agent
                .get(`/api/hacker/stats`)
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
    it("It should FAIL and get hacker stats due to invalid Authentication", function (done) {
        //this takes a lot of time for some reason
        chai.request(server.app)
            .get(`/api/hacker/stats`)
            .end(function (err, res) {
                res.should.have.status(401);
                res.should.be.json;
                res.body.should.have.property("message");
                res.body.message.should.equal(Constants.Error.AUTH_401_MESSAGE);
                done();
            });
    });
});