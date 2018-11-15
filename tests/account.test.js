"use strict";
const chai = require("chai");
const chaiHttp = require("chai-http");
chai.use(chaiHttp);
const server = require("../app");
const logger = require("../services/logger.service");
const Account = require("../models/account.model");
const should = chai.should();


const util = {
    account: require("./util/account.test.util"),
    auth: require("./util/auth.test.util"),
    accountConfirmation: require("./util/accountConfirmation.test.util"),
    reset: require("./util/resetPassword.test.util")
};
// hacker role binding
const storedAccount1 = util.account.Account1;
// admin role binding
const Admin1 = util.account.Admin1;
const newAccount1 = util.account.newAccount1;
const agent = chai.request.agent(server.app);
const confirmationToken = util.accountConfirmation.ConfirmationToken;
const fakeToken = util.accountConfirmation.FakeToken;
const resetToken = util.reset.ResetToken;

describe("GET user account", function () {
    // fail on authentication
    it("should fail to list the user's account on /api/account/self GET due to authentication", function (done) {
        chai.request(server.app)
            .get("/api/account/self")
            .end(function (err, res) {
                res.should.have.status(401);
                res.should.be.json;
                res.body.should.have.property("message");
                res.body.message.should.equal("Not Authenticated");
                done();
            });
    });

    // success case
    it("should list the user's account on /api/account/self GET", function (done) {
        util.auth.login(agent, Admin1, (error) => {
            if (error) {
                agent.close();
                return done(error);
            }
            return agent
                .get("/api/account/self")
                // does not have password because of to stripped json
                .end(function (err, res) {
                    if (err) {
                        return done(err);
                    }
                    res.should.have.status(200);
                    res.should.be.json;
                    res.body.should.have.property("message");
                    res.body.message.should.equal("Account found by user email");
                    res.body.should.have.property("data");
                    res.body.data.should.be.a("object");
                    res.body.data.should.have.property("firstName");
                    res.body.data.should.have.property("lastName");
                    res.body.data.should.have.property("email");
                    // ???
                    // res.body.data.should.equal(req.user.email);
                    res.body.data.should.have.property("dietaryRestrictions");
                    res.body.data.should.have.property("shirtSize");
                    done();
                });
        });
    });

    // success case - admin case
    it("should list another account specified by id using admin priviledge on /api/account/:id/ GET", function (done) {
        util.auth.login(agent, Admin1, (error) => {
            if (error) {
                agent.close();
                return done(error);
            }
            return agent
                .get(`/api/account/` + storedAccount1._id)
                // does not have password because of to stripped json
                .end(function (err, res) {
                    if (err) {
                        return done(err);
                    }
                    res.should.have.status(200);
                    res.should.be.json;
                    res.body.should.have.property("message");
                    res.body.message.should.equal("Account found by user id");
                    res.body.should.have.property("data");

                    // use acc.toStrippedJSON to deal with hidden passwords and convert _id to id
                    const acc = new Account(storedAccount1);
                    chai.assert.equal(JSON.stringify(res.body.data), JSON.stringify(acc.toStrippedJSON()));
                    done();
                });
        });
    });
    // success case - user case
    it("should list an account specified by id on /api/account/:id/ GET", function (done) {
        util.auth.login(agent, storedAccount1, (error) => {
            if (error) {
                agent.close();
                return done(error);
            }
            return agent
                .get(`/api/account/` + storedAccount1._id)
                // does not have password because of to stripped json
                .end(function (err, res) {
                    if (err) {
                        return done(err);
                    }
                    res.should.have.status(200);
                    res.should.be.json;
                    res.body.should.have.property("message");
                    res.body.message.should.equal("Account found by user id");
                    res.body.should.have.property("data");

                    // use acc.toStrippedJSON to deal with hidden passwords and convert _id to id
                    const acc = new Account(storedAccount1);
                    chai.assert.equal(JSON.stringify(res.body.data), JSON.stringify(acc.toStrippedJSON()));
                    done();
                });
        });
    });

    // // fail case on authorization
    it("should fail to list an account specified by id on /api/account/:id/ GET due to lack of authorization", function (done) {
        util.auth.login(agent, storedAccount1, (error) => {
            if (error) {
                agent.close();
                return done(error);
            }
            return agent
                .get(`/api/account/` + Admin1._id)
                // does not have password because of to stripped json
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
});

describe("POST create account", function () {
    it("should SUCCEED and create a new account", function (done) {
        chai.request(server.app)
            .post(`/api/account/`)
            .type("application/json")
            .send(newAccount1)
            .end(function (err, res) {
                res.should.have.status(200);
                res.should.be.json;
                res.body.should.have.property("message");
                res.body.message.should.equal("Account creation successful");
                done();
            });
    });

    it("should FAIL to create an account because the email is already in use", function (done) {
        chai.request(server.app)
            .post(`/api/account/`)
            .type("application/json")
            .send(storedAccount1)
            .end(function (err, res) {
                res.should.have.status(409);
                done();
            });
    });
});

describe("POST confirm account", function () {
    it("should SUCCEED and confirm the account", function (done) {
        chai.request(server.app)
            .post('/api/auth/confirm/' + confirmationToken)
            .type("application/json")
            .end(function (err, res) {
                res.should.have.status(200);
                res.body.should.have.property("message");
                res.body.message.should.equal("Successfully confirmed account");
                done();
            })
    })
    it("should FAIL confirming the account", function (done) {
        chai.request(server.app)
            .post('/api/auth/confirm/' + fakeToken)
            .type("application/json")
            .end(function (err, res) {
                res.should.have.status(422);
                res.body.should.have.property("message");
                res.body.message.should.equal("Invalid token for confirming account");
                done();
            })
    })
})

describe("PATCH update account", function () {
    const updatedInfo = {
        "_id": storedAccount1._id,
        "firstName": "new",
        "lastName": "name"
    };
    const failUpdatedInfo = {
        "_id": Admin1._id,
        "firstName": "fail",
        "lastName": "fail"
    };

    // fail on authentication
    it("should fail to update an account due to authentication", function (done) {
        chai.request(server.app)
            .get(`/api/account/${updatedInfo._id}`)
            .end(function (err, res) {
                res.should.have.status(401);
                res.should.be.json;
                res.body.should.have.property("message");
                res.body.message.should.equal("Not Authenticated");
                done();
            });
    });

    // succeed on :all case
    it("should SUCCEED and use admin to update another account", function (done) {
        util.auth.login(agent, Admin1, (error) => {
            if (error) {
                agent.close();
                return done(error);
            }
            agent
                .patch(`/api/account/${updatedInfo._id}`)
                .type("application/json")
                .send(updatedInfo)
                .end(function (err, res) {
                    res.should.have.status(200);
                    res.should.be.json;
                    res.body.should.have.property("message");
                    res.body.message.should.equal("Changed account information");
                    res.body.should.have.property("data");
                    // Is this correct matching of data?
                    res.body.data.firstName.should.equal(updatedInfo.firstName);
                    res.body.data.lastName.should.equal(updatedInfo.lastName);
                    done();
                });
        });
    });

    // succeed on :self case
    it("should SUCCEED and update the user's own account", function (done) {
        util.auth.login(agent, storedAccount1, (error) => {
            if (error) {
                agent.close();
                return done(error);
            }
            agent
                .patch(`/api/account/${updatedInfo._id}`)
                .type("application/json")
                .send(updatedInfo)
                .end(function (err, res) {
                    res.should.have.status(200);
                    res.should.be.json;
                    res.body.should.have.property("message");
                    res.body.message.should.equal("Changed account information");
                    res.body.should.have.property("data");
                    // Is this correct matching of data?
                    res.body.data.firstName.should.equal(updatedInfo.firstName);
                    res.body.data.lastName.should.equal(updatedInfo.lastName);

                    done();
                });
        });
    });

    // fail due to lack of authorization
    it("should Fail to update an account due to lack of authorization", function (done) {
        util.auth.login(agent, storedAccount1, (error) => {
            if (error) {
                agent.close();
                return done(error);
            }
            agent
                .patch(`/api/account/${failUpdatedInfo._id}`)
                .type("application/json")
                .send(updatedInfo)
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

describe("POST reset password", function () {
    const password = {
        "password": "NewPassword"
    };
    it("should SUCCEED and change the password", function (done) {
        chai.request(server.app)
            .post('/api/auth/password/reset')
            .type("application/json")
            .set('X-Reset-Token', resetToken)
            .send(password)
            .end(function (err, res) {
                res.should.have.status(200);
                res.body.should.have.property("message");
                res.body.message.should.equal("Successfully reset password");
                done();
            })
    })
})

describe("GET retrieve permissions", function() {
    it("should SUCCEED and retrieve the rolebindings for the user", function (done) {
        util.auth.login(agent, storedAccount1, (error) => {
            if (error) {
                agent.close();
                return done(error);
            }
            agent
                .get("/api/auth/rolebindings/" + storedAccount1._id)
                .type("application/json")
                .end(function (err, res) {
                    res.should.have.status(200);
                    res.body.should.have.property("message");
                    res.body.message.should.equal("Successfully retrieved role bindings");
                    res.body.should.have.property("data")
                    res.body.data.should.be.a("object");
                    res.body.data.should.have.property("roles");
                    res.body.data.should.have.property("accountId");
                    res.body.data.accountId.should.equal(storedAccount1._id.toHexString());
                    done();
                });
        });
    });
    it("should FAIL to retrieve the rolebindings as the account is not authenticated", function(done) {
        chai.request(server.app)
            .get("/api/auth/rolebindings/" + storedAccount1._id)
            .type("application/json")
            .end(function (err, res) {
                res.should.have.status(401);
                res.body.should.have.property("message");
                res.body.message.should.equal("Not Authenticated");
                done();
            });
    });
});