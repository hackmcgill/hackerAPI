"use strict";
const dotenv = require("dotenv");
const path = require("path");
dotenv.config({
    path: path.join(__dirname, "../.env")
});
const EmailService = require("../services/email.service");
const assert = require("chai").assert;

describe("Email Service", function() {
    it("It should send an email", (done) => {
        EmailService.send({
            to: process.env.NO_REPLY_EMAIL,
            from: process.env.NO_REPLY_EMAIL,
            subject: "Hey man",
            text: "Hi!",
            mailSettings: {
                sandboxMode: {
                    enable: true
                }
            }
        }).then((response) => {
            assert.equal(response[0].statusCode, 200, "response should be accepted");
            done();
        }).catch(done);
    });
    it("It should send multiple emails", (done) => {
        EmailService.sendMultiple({
            to: [process.env.NO_REPLY_EMAIL, process.env.NO_REPLY_EMAIL],
            from: process.env.NO_REPLY_EMAIL,
            subject: "Hey man",
            text: "Hi!",
            mailSettings: {
                sandboxMode: {
                    enable: true
                }
            }
        }).then((responses) => {
            responses.forEach((resp) => {
                if(resp) {
                    assert.equal(resp.statusCode, 200, "response should be accepted");
                }
            });
            done();
        }).catch(done);
    })
});