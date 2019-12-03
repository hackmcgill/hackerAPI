'use strict';
const VALIDATOR = require('./validator.helper');

module.exports = {
  newVolunteerValidator: [
    VALIDATOR.mongoIdValidator('body', 'accountId', false),
  ],
};
