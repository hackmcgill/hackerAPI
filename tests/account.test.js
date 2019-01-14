"use strict";
const chai = require("chai");
const chaiHttp = require("chai-http");
chai.use(chaiHttp);
const server = require("../app");
const logger = require("../services/logger.service");
const Account = require("../models/account.model");
const should = chai.should();
const Constants = {
    Error: require("../constants/error.constant"),
    General: require("../constants/general.constant"),
    Success: require("../constants/success.constant"),
};


const util = {
    account: require("./util/account.test.util"),
    auth: require("./util/auth.test.util"),
    accountConfirmation: require("./util/accountConfirmation.test.util"),
    reset: require("./util/resetPassword.test.util")
};
const agent = chai.request.agent(server.app);
// tokens
const confirmationToken = util.accountConfirmation.ConfirmationToken;
const fakeToken = util.accountConfirmation.FakeToken;
const resetToken = util.reset.ResetToken;
// accounts
const Admin0 = util.account.staffAccounts[0];
const teamHackerAccount0 = util.account.hackerAccounts.stored.team[0];




//This account has a confirmation token in the db
const storedAccount2 = util.account.NonConfirmedAccount1;
//This account does not have a confirmation token in the DB
const storedAccount3 = util.account.NonConfirmedAccount2;
// admin role binding

const newAccount0 = util.account.unlinkedAccounts.new[0];


describe("GET user account", function () {
    // fail on authentication
    it("should fail to list the user's account on /api/account/self GET due to authentication", function (done) {
        chai.request(server.app)
            .get("/api/account/self")
            .end(function (err, res) {
                res.should.have.status(401);
                res.should.be.json;
                res.body.should.have.property("message");
                res.body.message.should.equal(Constants.Error.AUTH_401_MESSAGE);
                done();
            });
    });

    // fail due to invalid login
    it("should fail due to invalid password", function (done) {
        agent.post("/api/auth/login").type("application/json").send({
            email: Admin0.email,
            password: "FakePassword"
        }).end((err, res) => {
            res.should.have.status(401);
            res.body.should.have.property("message");
            res.body.message.should.equal(Constants.Error.AUTH_401_MESSAGE);
            done();
        });
    });

    // success case
    it("should list the user's account on /api/account/self GET", function (done) {
        util.auth.login(agent, Admin0, (error) => {
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
                    res.body.message.should.equal(Constants.Success.ACCOUNT_READ);
                    res.body.should.have.property("data");
                    res.body.data.should.be.a("object");
                    res.body.data.should.have.property("firstName");
                    res.body.data.should.have.property("lastName");
                    res.body.data.should.have.property("email");
                    res.body.data.should.have.property("dietaryRestrictions");
                    res.body.data.should.have.property("shirtSize");
                    done();
                });
        });
    });

    // success case - admin case
    it("should list another account specified by id using admin priviledge on /api/account/:id/ GET", function (done) {
        util.auth.login(agent, Admin0, (error) => {
            if (error) {
                agent.close();
                return done(error);
            }
            return agent
                .get(`/api/account/${teamHackerAccount0._id}`)
                // does not have password because of to stripped json
                .end(function (err, res) {
                    if (err) {
                        return done(err);
                    }
                    res.should.have.status(200);
                    res.should.be.json;
                    res.body.should.have.property("message");
                    res.body.message.should.equal(Constants.Success.ACCOUNT_READ);
                    res.body.should.have.property("data");

                    // use acc.toStrippedJSON to deal with hidden passwords and convert _id to id
                    const acc = new Account(teamHackerAccount0);
                    chai.assert.equal(JSON.stringify(res.body.data), JSON.stringify(acc.toStrippedJSON()));
                    done();
                });
        });
    });
    // success case - user case
    it("should list an account specified by id on /api/account/:id/ GET", function (done) {
        util.auth.login(agent, teamHackerAccount0, (error) => {
            if (error) {
                agent.close();
                return done(error);
            }
            return agent
                .get(`/api/account/${teamHackerAccount0._id}`)
                // does not have password because of to stripped json
                .end(function (err, res) {
                    if (err) {
                        return done(err);
                    }
                    res.should.have.status(200);
                    res.should.be.json;
                    res.body.should.have.property("message");
                    res.body.message.should.equal(Constants.Success.ACCOUNT_READ);
                    res.body.should.have.property("data");

                    // use acc.toStrippedJSON to deal with hidden passwords and convert _id to id
                    const acc = new Account(teamHackerAccount0);
                    chai.assert.equal(JSON.stringify(res.body.data), JSON.stringify(acc.toStrippedJSON()));
                    done();
                });
        });
    });

    // // fail case on authorization
    it("should fail to list an account specified by id on /api/account/:id/ GET due to lack of authorization", function (done) {
        util.auth.login(agent, teamHackerAccount0, (error) => {
            if (error) {
                agent.close();
                return done(error);
            }
            return agent
                .get(`/api/account/${Admin0._id}`)
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

describe("POST create account", function () {
    it("should SUCCEED and create a new account", function (done) {
        chai.request(server.app)
            .post(`/api/account/`)
            .type("application/json")
            .send(teamHackerAccount0)
            .end(function (err, res) {
                res.should.have.status(200);
                res.should.be.json;
                res.body.should.have.property("message");
                res.body.message.should.equal(Constants.Success.ACCOUNT_CREATE);

                // use acc.toStrippedJSON to deal with hidden passwords and convert _id to id
                const acc = (new Account(teamHackerAccount0)).toStrippedJSON();
                // delete id as those are generated
                delete acc.id;
                delete res.body.data.id;
                chai.assert.equal(JSON.stringify(res.body.data), JSON.stringify(acc));
                done();
            });
    });

    it("should FAIL to create an account because the email is already in use", function (done) {
        chai.request(server.app)
            .post(`/api/account/`)
            .type("application/json")
            .send(teamHackerAccount0)
            .end(function (err, res) {
                res.should.have.status(422);
                done();
            });
    });
});

describe("POST confirm account", function () {
    it("should SUCCEED and confirm the account", function (done) {
        chai.request(server.app)
            .post(`/api/auth/confirm/${confirmationToken}`)
            .type("application/json")
            .end(function (err, res) {
                res.should.have.status(200);
                res.body.should.have.property("message");
                res.body.message.should.equal(Constants.Success.AUTH_CONFIRM_ACCOUNT);
                done();
            });
    });
    it("should FAIL confirming the account", function (done) {
        chai.request(server.app)
            .post(`/api/auth/confirm/${fakeToken}`)
            .type("application/json")
            .end(function (err, res) {
                res.should.have.status(401);
                res.body.should.have.property("message");
                res.body.message.should.equal(Constants.Error.ACCOUNT_TOKEN_401_MESSAGE);
                done();
            });
    });
    it("should FAIL to confirm account that has token with email but no account", function (done) {
        chai.request(server.app)
            .post(`/api/auth/confirm/${fakeToken}`)
            .type("application/json")
            .end(function (err, res) {
                res.should.have.status(401);
                res.body.should.have.property("message");
                res.body.message.should.equal(Constants.Error.ACCOUNT_TOKEN_401_MESSAGE);
                done();
            });
    });
});

describe("PATCH update account", function () {
    const updatedInfo = {
        "_id": teamHackerAccount0._id,
        "firstName": "new",
        "lastName": "name"
    };

    const failUpdatedInfo = {
        "_id": Admin0._id,
        "firstName": "fail",
        "lastName": "fail"
    };

    // fail on authentication
    it("should fail to update an account due to authentication", function (done) {
        chai.request(server.app)
            .patch(`/api/account/${updatedInfo._id}`)
            .end(function (err, res) {
                res.should.have.status(401);
                res.should.be.json;
                res.body.should.have.property("message");
                res.body.message.should.equal(Constants.Error.AUTH_401_MESSAGE);
                done();
            });
    });

    // succeed on :all case
    it("should SUCCEED and use admin to update another account", function (done) {
        util.auth.login(agent, Admin0, (error) => {
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
                    res.body.message.should.equal(Constants.Success.ACCOUNT_UPDATE);
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
        util.auth.login(agent, teamHackerAccount0, (error) => {
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
                    res.body.message.should.equal(Constants.Success.ACCOUNT_UPDATE);
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
        util.auth.login(agent, teamHackerAccount0, (error) => {
            if (error) {
                agent.close();
                return done(error);
            }
            agent
                .patch(`/api/account/${failUpdatedInfo._id}`)
                .type("application/json")
                .send(updatedInfo)
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
});

describe("POST reset password", function () {
    const password = {
        "password": "NewPassword"
    };
    it("should SUCCEED and change the password", function (done) {
        chai.request(server.app)
            .post("/api/auth/password/reset")
            .type("application/json")
            .set("X-Reset-Token", resetToken)
            .send(password)
            .end(function (err, res) {
                res.should.have.status(200);
                res.body.should.have.property("message");
                res.body.message.should.equal(Constants.Success.AUTH_RESET_PASSWORD);
                done();
            });
    });
});

describe("PATCH change password for logged in user", function () {
    const successChangePassword = {
        "oldPassword": Admin0.password,
        "newPassword": "password12345"
    };
    const failChangePassword = {
        "oldPassword": "WrongPassword",
        "newPassword": "password12345"
    };
    // fail on authentication
    it("should fail to change the user's password because they are not logged in", function (done) {
        chai.request(server.app)
            .patch("/api/auth/password/change")
            .type("application/json")
            .send(failChangePassword)
            .end(function (err, res) {
                res.should.have.status(401);
                res.should.be.json;
                res.body.should.have.property("message");
                res.body.message.should.equal(Constants.Error.AUTH_401_MESSAGE);
                done();
            });
    });
    // success case
    it("should change the logged in user's password to a new password", function (done) {
        util.auth.login(agent, Admin0, (error) => {
            if (error) {
                agent.close();
                return done(error);
            }
            agent
                .patch("/api/auth/password/change")
                .type("application/json")
                .send(successChangePassword)
                .end(function (err, res) {
                    res.should.have.status(200);
                    res.should.be.json;
                    res.body.should.have.property("message");
                    res.body.message.should.equal(Constants.Success.AUTH_RESET_PASSWORD);
                    done();
                });
        });
    });
    // fail case because old password in incorrect
    it("should fail to change the logged in user's password to a new password because old password is incorrect", function (done) {
        util.auth.login(agent, Admin0, (error) => {
            if (error) {
                agent.close();
                return done(error);
            }
            agent
                .patch("/api/auth/password/change")
                .type("application/json")
                .send(failChangePassword)
                .end(function (err, res) {
                    res.should.have.status(401);
                    res.should.be.json;
                    res.body.should.have.property("message");
                    res.body.message.should.equal(Constants.Error.AUTH_401_MESSAGE);
                    done();
                });
        });
    });
});

describe("GET retrieve permissions", function () {
    it("should SUCCEED and retrieve the rolebindings for the user", function (done) {
        util.auth.login(agent, teamHackerAccount0, (error) => {
            if (error) {
                agent.close();
                return done(error);
            }
            agent
                .get("/api/auth/rolebindings/" + teamHackerAccount0._id)
                .type("application/json")
                .end(function (err, res) {
                    res.should.have.status(200);
                    res.body.should.have.property("message");
                    res.body.message.should.equal(Constants.Success.AUTH_GET_ROLE_BINDINGS);
                    res.body.should.have.property("data");
                    res.body.data.should.be.a("object");
                    res.body.data.should.have.property("roles");
                    res.body.data.should.have.property("accountId");
                    res.body.data.accountId.should.equal(teamHackerAccount0._id.toHexString());
                    done();
                });
        });
    });
    it("should FAIL to retrieve the rolebindings as the account is not authenticated", function (done) {
        chai.request(server.app)
            .get("/api/auth/rolebindings/" + teamHackerAccount0._id)
            .type("application/json")
            .end(function (err, res) {
                res.should.have.status(401);
                res.body.should.have.property("message");
                res.body.message.should.equal(Constants.Error.AUTH_401_MESSAGE);
                done();
            });
    });
});

describe("GET resend confirmation email", function () {
    it("should SUCCEED and resend the confirmation email", function (done) {
        util.auth.login(agent, storedAccount3, (error) => {
            if (error) {
                agent.close();
                return done(error);
            }
            agent
                .get("/api/auth/confirm/resend")
                .type("application/json")
                .end(function (err, res) {
                    res.should.have.status(200);
                    res.should.be.json;
                    res.body.should.have.property("message");
                    res.body.message.should.equal(Constants.Success.AUTH_SEND_CONFIRMATION_EMAIL);
                    done();
                });
        });
    });
    it("should FAIL as the account is already confirmed", function (done) {
        util.auth.login(agent, teamHackerAccount0, (error) => {
            if (error) {
                agent.close();
                return done(error);
            }
            agent
                .get("/api/auth/confirm/resend")
                .type("application/json")
                .end(function (err, res) {
                    res.should.have.status(422);
                    res.should.be.json;
                    res.body.should.have.property("message");
                    res.body.message.should.equal("Account already confirmed");
                    done();
                });
        });
    });
    it("should FAIL as account confirmation token does not exist", function (done) {
        util.auth.login(agent, storedAccount2, (error) => {
            if (error) {
                agent.close();
                return done(error);
            }
            agent
                .get("/api/auth/confirm/resend")
                .type("application/json")
                .end(function (err, res) {
                    res.should.have.status(428);
                    res.should.be.json;
                    res.body.should.have.property("message");
                    res.body.message.should.equal("Account confirmation token does not exist");
                    done();
                });
        });
    });
});

describe("POST invite account", function () {
    it("Should succeed to invite a user to create an account", function (done) {
        util.auth.login(agent, Admin0, (error) => {
            if (error) {
                agent.close();
                return done(error);
            }
            return agent
                .post("/api/account/invite")
                .type("application/json")
                .send({
                    email: newAccount0.email,
                    accountType: Constants.General.VOLUNTEER
                })
                // does not have password because of to stripped json
                .end(function (err, res) {
                    if (err) {
                        return done(err);
                    }
                    res.should.have.status(200);
                    res.body.should.have.property("message");
                    res.body.message.should.equal(Constants.Success.ACCOUNT_INVITE);
                    done();
                });
        });
    });
});

describe("GET invites", function () {
    it("Should FAIL to get all invites due to Authentication", function (done) {
        chai.request(server.app)
            .get("/api/account/invite")
            .end(function (err, res) {
                res.should.have.status(401);
                res.body.should.have.property("message");
                res.body.message.should.equal(Constants.Error.AUTH_401_MESSAGE);
                done();
            });
    });
    it("Should FAIL to get all invites due to Authorization", function (done) {
        util.auth.login(agent, teamHackerAccount0, (error) => {
            if (error) {
                agent.close();
                return done(error);
            }
            return agent
                .get("/api/account/invite")
                .end(function (err, res) {
                    res.should.have.status(403);
                    res.body.should.have.property("message");
                    res.body.message.should.equal(Constants.Error.AUTH_403_MESSAGE);
                    done();
                });
        });
    });
    it("Should SUCCEED to get all invites", function (done) {
        util.auth.login(agent, Admin0, (error) => {
            if (error) {
                agent.close();
                return done(error);
            }
            return agent
                .get("/api/account/invite")
                .end(function (err, res) {
                    if (err) {
                        return done(err);
                    }
                    res.should.have.status(200);
                    res.body.should.have.property("message");
                    res.body.message.should.equal(Constants.Success.ACCOUNT_GET_INVITES);
                    res.body.should.have.property("data");
                    res.body.data.should.have.property("invites");
                    res.body.data.invites.length.should.equal(util.accountConfirmation.AccountConfirmationTokens.length);
                    done();
                });
        });
    });
});