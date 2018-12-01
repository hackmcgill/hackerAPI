"use strict";
const chai = require("chai");
const chaiHttp = require("chai-http");
chai.use(chaiHttp);
const server = require("../app");
const logger = require("../services/logger.service");
const Account = require("../models/account.model");
const should = chai.should();

const agent = chai.request.agent(server.app);

const util = {
    account: require("./util/account.test.util"),
    auth: require("./util/auth.test.util"),
    accountConfirmation: require("./util/accountConfirmation.test.util"),
    reset: require("./util/resetPassword.test.util"),
    role: require("./util/role.test.util")
};

const roles = require("../constants/role.constant");

// hacker role binding
const storedAccount1 = util.account.Account1;

describe("GET roles", function () {
    it("should list all roles GET", function (done) {
        util.auth.login(agent, storedAccount1, (error) => {
            if (error) {
                agent.close();
                return done(error);
            }
            return agent
                .get("/api/auth/roles")
                .end(function (err, res) {
                    if (err) {
                        return done(err);
                    }
                    res.should.have.status(200);
                    res.should.be.json;
                    res.body.should.have.property("message");
                    res.body.message.should.equal("Successfully retrieved all roles");
                    res.body.should.have.property("data");
                    res.body.data.should.be.a("Array");

                    let rolenames = []
                    roles.allRolesArray.forEach(element => {
                        rolenames.push(element.name)
                    });

                    let retrievedRoleNames = []
                    res.body.data.forEach(element => {
                        retrievedRoleNames.push(element.name)
                    });

                    rolenames.should.have.members(retrievedRoleNames)
                    done();
                });
        });
    })
});
