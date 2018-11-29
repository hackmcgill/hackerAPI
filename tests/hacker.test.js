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
    Error: require("../constants/error.constant"),
};

const util = {
    auth: require("./util/auth.test.util"),
    hacker: require("./util/hacker.test.util"),
    account: require("./util/account.test.util"),
    auth: require("./util/auth.test.util"),
    accountConfirmation: require("./util/accountConfirmation.test.util")
};
const StorageService = require("../services/storage.service");

const Admin1 = util.account.Admin1;

// storedAccount1 and storedHacker1 are linked together, and have hacker priviledges
// newHackerDuplicateAccountLink1 is also linked with Account1
const storedAccount1 = util.account.Account1;
const storedHacker1 = util.hacker.HackerA;
const newHackerDuplicateAccountLink1 = util.hacker.duplicateAccountLinkHacker1;

// storedAccount2 and storedHacker2 are linked together, and have hacker priviledges
const storedAccount2 = util.account.Account2;
const storedHacker2 = util.hacker.HackerB;

const newHacker1 = util.hacker.newHacker1;
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
                    res.body.message.should.equal("Successfully retrieved hacker information");
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
                    res.body.message.should.equal("Successfully retrieved hacker information");
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
                    res.body.message.should.equal("Hacker creation successful");
                    res.body.should.have.property("data");

                    // delete _id and status because those fields were generated
                    delete res.body.data.id;
                    delete res.body.data.status;
                    chai.assert.equal(JSON.stringify(res.body.data), JSON.stringify(newHacker1));
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
                    res.body.message.should.equal("Hacker creation successful");
                    res.body.should.have.property("data");

                    // delete _id and status because those fields were generated
                    delete res.body.data.id;
                    delete res.body.data.status;
                    chai.assert.equal(JSON.stringify(res.body.data), JSON.stringify(newHacker1));
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
                    res.body.message.should.equal("Changed hacker information");
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
                    res.body.message.should.equal("Changed hacker information");
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
                    res.body.message.should.equal("Changed hacker information");
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
                    res.body.message.should.equal("Uploaded resume");
                    res.body.should.have.property("data");
                    res.body.data.should.have.property("filename");
                    StorageService.download(res.body.data.filename).then((value) => {
                        const actualFile = fs.readFileSync(path.join(__dirname, "testResume.pdf"))
                        chai.assert.equal(value[0].length, actualFile.length);
                        StorageService.delete(res.body.data.filename).then(() => {
                            done();
                        }).catch(done);
                    });
                });
        });
    });
});