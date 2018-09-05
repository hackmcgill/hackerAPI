"use strict";
const chai = require("chai");
const chaiHttp = require("chai-http");
chai.use(chaiHttp);
const server = require("../app");

const util = {
    sponsor: require("./util/sponsor.test.util"),
};

// configure sponsor data to be the same as output from query
// stringify and parse for deep copy
let storedSponsor = JSON.parse(JSON.stringify(util.sponsor.Sponsor1));
storedSponsor.id = storedSponsor._id;
delete storedSponsor._id;

const newSponsor = util.sponsor.newSponsor1;

describe("GET user sponsor", function () {
    it("should list a sponsor's information from /api/sponsor/:id GET", function (done) {
        chai.request(server.app)
            .get(`/api/sponsor/` + util.sponsor.Sponsor1._id)
            // does not have password because of to stripped json
            .end(function (err, res) {
                res.should.have.status(200);
                res.should.be.json;
                res.body.should.have.property("message");
                res.body.message.should.equal("Successfully retrieved sponsor information");
                res.body.should.have.property("data");                
                res.body.data.should.be.a("object");

                chai.expect(res.body.data).to.deep.equal(storedSponsor);
                done();
            });
    });
});

describe("POST create sponsor", function () {
    it("should SUCCEED and create a new user", function(done) {
        chai.request(server.app)
        .post(`/api/sponsor/`)
        .type("application/json")
        .send(newSponsor)
        .end(function (err, res) {
            res.should.have.status(200);
            res.should.be.json;
            res.body.should.have.property("message");
            res.body.message.should.equal("Sponsor creation successful");
            res.body.should.have.property("data");

            // deleting _id because that was generated, and not part of original data
            delete res.body.data._id;
            chai.assert.equal(JSON.stringify(res.body.data), JSON.stringify(newSponsor));
            done();
        });
    });
});