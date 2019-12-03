'use strict';
const VALIDATOR = require('./validator.helper');

module.exports = {
  createSettingsValidator: [
    VALIDATOR.dateValidator('body', 'openTime', true),
    VALIDATOR.dateValidator('body', 'closeTime', true),
    VALIDATOR.dateValidator('body', 'confirmTime', true),
  ],
};
