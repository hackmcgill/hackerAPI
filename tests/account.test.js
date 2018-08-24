"use strict";
const chai = require("chai");
const chaiHttp = require("chai-http");
chai.use(chaiHttp);
const server = require("../app");
const agent = chai.request.agent(server.app);
const should = chai.should();
const logger = require("../services/logger.service");

const util = {
    account: require("./util/account.test.util"),
};

const storedAccount1 = util.account.Account1;
const newAccount1 = util.account.newAccount1;

describe("GET user account", function () {
    it("should list the user's account on /api/account/self GET", function (done) {
        chai.request(server.app)
            .get("/api/account/self")
            // does not have password because of to stripped json
            .end(function (err, res) {
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
                res.body.data.should.have.property("permissions");
                res.body.data.should.have.property("dietaryRestrictions");
                res.body.data.should.have.property("shirtSize");
                done();
            });
    });

    // would this ever do anything?
    it("should fail to list the user's account on /api/account/self GET", function (done) {
        chai.request(server.app)
            .get("/api/account/self")
            .end(function (err, res) {
                res.should.have.status(400);
                res.should.be.json;
                res.body.should.have.property("message");
                res.body.message.should.equal("User email not found");
                done();
            });
    });
});

describe("POST create account", function () {
    it("should SUCCEED and create a new user", function(done) {
        chai.request(server.app)
        .post(`/api/account/create`)
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
});

describe("POST update account", function () {
    it("should SUCCEED and update an account", function(done) {
        chai.request(server.app)
        .post(`/api/account/updateOneUser`)
        .type("application/json")
        .send(storedAccount1)
        .end(function (err, res) {
            // auth?
            res.should.have.status(200);
            res.should.be.json;
            res.body.should.have.property("message");
            res.body.message.should.equal("Changed account");
            res.body.should.have.property("data");
            // Is this correct matching of data?
            res.body.data.should.equal("Changed information to: " + storedAccount1);
            done();
        });
    });
});