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

describe("PATCH update one hacker", function () {
    it("should SUCCEED and update a hacker", function(done) {
        chai.request(server.app)
        .patch(`/api/hacker/${storedHacker1._id}`)
        .type("application/json")
        .send({
            status: "Accepted"
        })
        .end(function (err, res) {
            // auth?
            res.should.have.status(200);
            res.should.be.json;
            res.body.should.have.property("message");
            res.body.message.should.equal("Changed hacker information");
            res.body.should.have.property("data");
            chai.assert.equal(JSON.stringify(res.body.data), JSON.stringify({status: "Accepted"}));
            done();
        });
    });
});