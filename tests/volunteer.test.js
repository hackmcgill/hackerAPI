"use strict";
const chai = require("chai");
const chaiHttp = require("chai-http");
chai.use(chaiHttp);
const server = require("../app");
const Volunteer = require("../models/volunteer.model");

const util = {
    volunteer: require("./util/volunteer.test.util"),
};

describe("POST create volunteer", function () {
    it("should SUCCEED and create a new volunteer", function(done) {
        chai.request(server.app)
        .post(`/api/volunteer/`)
        .type("application/json")
        .send(util.volunteer.newVolunteer1)
        .end(function (err, res) {
            res.should.have.status(200);
            res.should.be.json;
            res.body.should.have.property("message");
            res.body.message.should.equal("Volunteer creation successful");
            res.body.should.have.property("data");

            // deleting _id because that was generated, and not part of original data
            delete res.body.data._id;
            chai.assert.equal(JSON.stringify(res.body.data), JSON.stringify(util.volunteer.newVolunteer1));
            done();
        });
    });
});