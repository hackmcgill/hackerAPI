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

const queryToExecute = [{
    param: "gender",
    operation: "equals",
    value: "Female"
}]

const query2 = [{
    param: "school",
    operation: "ne",
    value: "McGill"
}]

const badQuery = [{
    param: "password",
    operation: "equals",
    value: "passowrd"
}]

describe("Searching for hackers", function () {
    it("Should return all female hackers", function (done) {
        chai.request(server.app)
            .get("/api/search/hacker")
            .query({
                q: JSON.stringify(queryToExecute)
            })
            .end(function (err, res) {
                res.should.have.status(200);
                res.body.should.have.property('data');
                res.body.data.should.have.length(2);
                done();
            });
    })
    it("Should return an error as hackers don't have password stored", function (done) {
        chai.request(server.app)
            .get("/api/search/hacker")
            .query({
                q: JSON.stringify(badQuery)
            })
            .end(function (err, res) {
                res.should.have.status(422);
                done();
            });
    })
    it("Should return an error as staff aren't searchable", function (done) {
        chai.request(server.app)
            .get("/api/search/staff")
            .query({
                q: JSON.stringify(badQuery)
            })
            .end(function (err, res) {
                res.should.have.status(422);
                done();
            });
    })
    it("Should only return 1 hacker (page size)", function (done) {
        chai.request(server.app)
            .get("/api/search/hacker")
            .query({
                q: JSON.stringify(query2),
                limit: 1
            })
            .end(function (err, res) {
                res.should.have.status(200);
                res.body.data.should.have.length(1);
                done();
            })
    })
    it("Should only return 1 hacker (pagination)", function (done) {
        chai.request(server.app)
            .get("/api/search/hacker")
            //There are two test samples so by making limit 1, there will be something on the second page
            .query({
                q: JSON.stringify(query2),
                limit: 1,
                page: 1
            })
            .end(function (err, res) {
                res.should.have.status(200);
                res.body.data.should.have.length(1);
                done();
            })
    })
    it("Should throw an error because out of bounds (page size)", function (done) {
        chai.request(server.app)
            .get("/api/search/hacker")
            .query({
                q: JSON.stringify(query2),
                limit: 5000
            })
            .end(function (err, res) {
                res.should.have.status(422);
                done();
            })
    })
    it("Should throw an error because out of bounds (pagination)", function (done) {
        chai.request(server.app)
            .get("/api/search/hacker")
            .query({
                q: JSON.stringify(query2),
                limit: 1,
                page: -1
            })
            .end(function (err, res) {
                res.should.have.status(422);
                done();
            })
    })
})