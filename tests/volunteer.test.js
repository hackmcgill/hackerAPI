'use strict';
const chai = require('chai');
const chaiHttp = require('chai-http');
chai.use(chaiHttp);
const server = require('../app');
const agent = chai.request.agent(server.app);
const should = chai.should();
const Volunteer = require('../models/volunteer.model');
const Constants = {
  Success: require('../constants/success.constant'),
  Error: require('../constants/error.constant'),
};

const util = {
  volunteer: require('./util/volunteer.test.util'),
  account: require('./util/account.test.util'),
  auth: require('./util/auth.test.util'),
};

const Admin0 = util.account.staffAccounts.stored[0];
const HackerAccount0 = util.account.hackerAccounts.stored.team[0];

const VolunteerAccount0 = util.account.volunteerAccounts.stored[0];
const Volunteer0 = util.volunteer.Volunteer0;

const newVolunteerAccount0 = util.account.volunteerAccounts.new[0];
const newVolunteer0 = util.volunteer.newVolunteer0;
const duplicateVolunteer = util.volunteer.duplicateVolunteer1;

const invalidVolunteer0 = util.volunteer.invalidVolunteer0;

describe('GET volunteer', function() {
  it('should FAIL to get volunteer due to lack of authentication', function(done) {
    chai
      .request(server.app)
      .get(`/api/volunteer/${Volunteer0._id}`)
      .end(function(err, res) {
        res.should.have.status(401);
        res.should.be.json;
        res.body.should.have.property('message');
        res.body.message.should.equal(Constants.Error.AUTH_401_MESSAGE);
        res.body.should.have.property('data');

        done();
      });
  });

  it('should Fail to GET volunteer due inappropriate authorization', function(done) {
    util.auth.login(agent, HackerAccount0, (error) => {
      if (error) {
        agent.close();
        return done(error);
      }
      return agent
        .get(`/api/volunteer/${util.volunteer.Volunteer0._id}`)
        .end(function(err, res) {
          res.should.have.status(403);
          res.should.be.json;
          res.body.should.have.property('message');
          res.body.message.should.equal(Constants.Error.AUTH_403_MESSAGE);
          res.body.should.have.property('data');

          done();
        });
    });
  });

  it('should Fail to GET volunteer due to non existant volunteer id', function(done) {
    util.auth.login(agent, Admin0, (error) => {
      if (error) {
        agent.close();
        return done(error);
      }
      return agent.get(`/api/volunteer/${Admin0._id}`).end(function(err, res) {
        res.should.have.status(404);
        res.should.be.json;
        res.body.should.have.property('message');
        res.body.message.should.equal(Constants.Error.VOLUNTEER_404_MESSAGE);
        res.body.should.have.property('data');

        done();
      });
    });
  });

  // success case
  it('should GET volunteer info by id with admin credentials', function(done) {
    util.auth.login(agent, Admin0, (error) => {
      if (error) {
        agent.close();
        return done(error);
      }
      return agent
        .get(`/api/volunteer/${Volunteer0._id}`)
        .end(function(err, res) {
          if (err) {
            return done(err);
          }
          res.should.have.status(200);
          res.should.be.json;
          res.body.should.have.property('message');
          res.body.message.should.equal(Constants.Success.VOLUNTEER_GET_BY_ID);
          res.body.should.have.property('data');

          let volunteer = new Volunteer(util.volunteer.Volunteer0);
          chai.assert.equal(
            JSON.stringify(res.body.data),
            JSON.stringify(volunteer.toJSON())
          );
          done();
        });
    });
  });

  // success case
  it("should GET the user's volunteer info by id", function(done) {
    util.auth.login(agent, VolunteerAccount0, (error) => {
      if (error) {
        agent.close();
        return done(error);
      }
      return agent
        .get(`/api/volunteer/${util.volunteer.Volunteer0._id}`)
        .end(function(err, res) {
          if (err) {
            return done(err);
          }
          res.should.have.status(200);
          res.should.be.json;
          res.body.should.have.property('message');
          res.body.message.should.equal(Constants.Success.VOLUNTEER_GET_BY_ID);
          res.body.should.have.property('data');

          let volunteer = new Volunteer(util.volunteer.Volunteer0);
          chai.assert.equal(
            JSON.stringify(res.body.data),
            JSON.stringify(volunteer.toJSON())
          );
          done();
        });
    });
  });
});

describe('POST create volunteer', function() {
  it('should FAIL to create a new volunteer due to lack of authentication', function(done) {
    chai
      .request(server.app)
      .post(`/api/volunteer`)
      .type('application/json')
      .send(util.volunteer.newVolunteer0)
      .end(function(err, res) {
        res.should.have.status(401);
        res.should.be.json;
        res.body.should.have.property('message');
        res.body.message.should.equal(Constants.Error.AUTH_401_MESSAGE);

        done();
      });
  });

  // fail on admin case
  it('fail to create a volunteer when the logged in account is not a volunteer /api/volunteer POST', function(done) {
    util.auth.login(agent, Admin0, (error) => {
      if (error) {
        agent.close();
        return done(error);
      }
      return agent
        .post(`/api/volunteer`)
        .type('application/json')
        .send(invalidVolunteer0)
        .end(function(err, res) {
          res.should.have.status(409);
          res.should.be.json;
          res.body.should.have.property('message');
          res.body.message.should.equal(
            Constants.Error.ACCOUNT_TYPE_409_MESSAGE
          );
          res.body.should.have.property('data');

          done();
        });
    });
  });

  // succeed on user case
  it('should create a volunteer for the user /api/volunteer POST', function(done) {
    util.auth.login(agent, newVolunteerAccount0, (error) => {
      if (error) {
        agent.close();
        return done(error);
      }
      return agent
        .post(`/api/volunteer`)
        .type('application/json')
        .send(newVolunteer0)
        .end(function(err, res) {
          res.should.have.status(200);
          res.should.be.json;
          res.body.should.have.property('message');
          res.body.message.should.equal(Constants.Success.VOLUNTEER_CREATE);
          res.body.should.have.property('data');

          // deleting id because that was generated, and not part of original data
          delete res.body.data.id;
          chai.assert.equal(
            JSON.stringify(res.body.data),
            JSON.stringify(newVolunteer0)
          );
          done();
        });
    });
  });

  // fail due to duplicate accountId
  it('should create a volunteer for the user /api/volunteer POST', function(done) {
    util.auth.login(agent, newVolunteerAccount0, (error) => {
      if (error) {
        agent.close();
        return done(error);
      }
      return agent
        .post(`/api/volunteer`)
        .type('application/json')
        .send(duplicateVolunteer)
        .end(function(err, res) {
          res.should.have.status(409);
          res.should.be.json;
          res.body.should.have.property('message');
          res.body.message.should.equal(
            Constants.Error.VOLUNTEER_ID_409_MESSAGE
          );
          res.body.should.have.property('data');

          done();
        });
    });
  });

  // fail on non-volunteer type account trying to create volunteer
  it('should FAIL to create a volunteer due to authorization /api/volunteer POST', function(done) {
    util.auth.login(agent, HackerAccount0, (error) => {
      if (error) {
        agent.close();
        return done(error);
      }
      return agent
        .post(`/api/volunteer`)
        .type('application/json')
        .send(util.volunteer.newVolunteer1)
        .end(function(err, res) {
          res.should.have.status(403);
          res.should.be.json;
          res.body.should.have.property('message');
          res.body.message.should.equal(Constants.Error.AUTH_403_MESSAGE);
          res.body.should.have.property('data');

          done();
        });
    });
  });
});
