"use strict";
const chai = require("chai");
const chaiHttp = require("chai-http");
chai.use(chaiHttp);
const server = require("../app");
const Team = require("../models/team.model");

const util = {
    team: require("./util/team.test.util"),
};

describe("GET team", function () {
    it("should SUCCEED and list a team's information from /api/team/:id GET", function(done) {
        chai.request(server.app)
        .get(`/api/team/` + util.team.Team1._id)
        .end(function (err, res) {
            res.should.have.status(200);
            res.should.be.json;
            res.body.should.have.property("message");
            res.body.message.should.equal("Successfully retrieved team information");
            res.body.should.have.property("data");

            let team = new Team(util.team.Team1);
            
            chai.expect(JSON.stringify(res.body.data)).to.deep.equal(JSON.stringify(team.toJSON()));
            chai.expect(res.body.data).to.deep.equal(team.toJSON());
        });
    });
});

describe("POST create team", function () {
    it("should SUCCEED and create a new team", function(done) {
        chai.request(server.app)
        .post(`/api/team/`)
        .type("application/json")
        .send(util.team.newTeam1)
        .end(function (err, res) {
            res.should.have.status(200);
            res.should.be.json;
            res.body.should.have.property("message");
            res.body.message.should.equal("Team creation successful");
            res.body.should.have.property("data");

            // deleting _id because that was generated, and not part of original data
            delete res.body.data._id;
            chai.assert.equal(JSON.stringify(res.body.data), JSON.stringify(util.team.newTeam1));
            done();
        });
    });
});