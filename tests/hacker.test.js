"use strict";
const chai = require("chai");
const chaiHttp = require("chai-http");
chai.use(chaiHttp);
const server = require("../app");
const agent = chai.request.agent(server.app);
const should = chai.should();
const Hacker = require("../models/hacker.model");

const util = {
    hacker: require("./util/hacker.test.util"),
};

const storedHacker1 = util.hacker.HackerA;
const newHacker1 = util.hacker.newHacker1;
const invalidHacker1 = util.hacker.invalidHacker1;

describe("GET hacker", function () {
    it("should list a hacker's information from /api/hacker/:id GET", function(done) {
        chai.request(server.app)
        .get(`/api/hacker/` + storedHacker1._id)
        .end(function (err, res) {
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

    it("should FAIL to create new hacker due to invalid input", function(done) {
        chai.request(server.app)
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

describe("PATCH update one hacker", function () {
    it("should SUCCEED and update a hacker", function(done) {
        chai.request(server.app)
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
            chai.assert.equal(JSON.stringify(res.body.data), JSON.stringify({gender: "Other"}));
            done();
        });
    });
});

describe("PATCH update one hacker status", function () {
    it("should SUCCEED and update the hacker status", function(done) {
        //this takes a lot of time for some reason
        chai.request(server.app)
        .patch(`/api/hacker/${storedHacker1._id}`)
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

            delete res.body.data.id;
            chai.assert.equal(JSON.stringify(res.body.data), JSON.stringify({status: "Accepted"}));
            done();
        });
    });
});