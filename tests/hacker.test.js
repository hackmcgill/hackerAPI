"use strict";
const chai = require("chai");
const chaiHttp = require("chai-http");
chai.use(chaiHttp);
const server = require("../app");
const agent = chai.request.agent(server.app);
const should = chai.should();
const logger = require("../services/logger.service");

const util = {
    hacker: require("./util/hacker.test.util"),
};

const storedHacker1 = util.hacker.HackerA;
const newHacker1 = util.hacker.newHacker1;

describe("POST create hacker", function () {
    it("should SUCCEED and create a new hacker", function(done) {
        chai.request(server.app)
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
            delete res.body.data._id;
            delete res.body.data.status;
            chai.assert.equal(JSON.stringify(res.body.data), JSON.stringify(newHacker1));
            done();
        });
    });
});

describe("POST update one hacker", function () {
    it("should SUCCEED and update a hacker", function(done) {
        chai.request(server.app)
        .post(`/api/hacker/adminChangeHacker/` + storedHacker1._id)
        .type("application/json")
        .send(storedHacker1)
        .end(function (err, res) {
            // auth?
            res.should.have.status(200);
            res.should.be.json;
            res.body.should.have.property("message");
            res.body.message.should.equal("Changed hacker information");
            res.body.should.have.property("data");
            // Is this correct matching of data?
            res.body.data.should.equal(storedHacker1);
            done();
        });
    });
});