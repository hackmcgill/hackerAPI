"use strict";
const chai = require("chai");
const chaiHttp = require("chai-http");
chai.use(chaiHttp);
const server = require("../app");
const agent = chai.request.agent(server.app);
const Constants = {
    Success: require("../constants/success.constant"),
    Error: require("../constants/error.constant"),
};

describe("GET settings", function () {
    it("should get the current settings", function (done) {
        chai.request(server.app)
            .get(`/api/settings/`)
            // does not have password because of to stripped json
            .end(function (err, res) {
                res.should.have.status(200);
                res.should.be.json;
                res.body.should.have.property("message");
                res.body.message.should.equal(Constants.Success.SETTINGS_GET);
                done();
            });
    });
    it("should update the settings", function (done) {
        chai.request(server.app)
            .patch(`/api/settings/`)
            .type("application/json")
            .send({
                openTime: new Date().toString(),
                closeTime: new Date().toString(),
                confirmTime: new Date().toString(),
            })
            // does not have password because of to stripped json
            .end(function (err, res) {
                res.should.have.status(200);
                res.should.be.json;
                res.body.should.have.property("message");
                res.body.message.should.equal(Constants.Success.SETTINGS_PATCH);
                done();
            });
    });

});