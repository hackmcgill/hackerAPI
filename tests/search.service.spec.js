"use strict";

const chai = require("chai");
const chaiHttp = require("chai-http");
chai.use(chaiHttp);
const server = require("../app");

const agent = chai.request.agent(server.app);
const assert = require("chai").assert;
const should = chai.should();
const logger = require("../services/logger.service");
const SearchService = require("../services/search.service");

const util = {
    hacker: require("./util/hacker.test.util"),
    account: require("./util/account.test.util")
};

const queryToExecute = [
    {
        param: "gender",
        operation: "equals",
        value: "Female"
    }
]

const badQuery =[
    {
        param: "password",
        operation: "equals",
        value: "passowrd"
    }
]

describe("Searching for hackers", function() {
    it("Should return all female hackers", function(done) {
        chai.request(server.app)
            .get("/api/search/")
            .query({q: JSON.stringify(queryToExecute), model: "hacker"})
            .end(function (err, res) {
                res.should.have.status(200);
                res.body.should.have.property('data');
                done();
            });
    })
    it("Should return an error as hackers don't have password stored", function(done) {
        chai.request(server.app)
            .get("/api/search/")
            .query({q: JSON.stringify(badQuery), model: "hacker"})
            .end(function (err, res) {
                res.should.have.status(422);
                done();
            });
    })
    it("Should return an error as staff aren't searchable", function(done) {
        chai.request(server.app)
            .get("/api/search/")
            .query({q: JSON.stringify(badQuery), model: "staff"})
            .end(function (err, res) {
                res.should.have.status(422);
                done();
            });
    })
})