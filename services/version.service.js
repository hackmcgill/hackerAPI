"use strict";
const { version } = require("../package.json");

const get = function() {
    return version;
};

module.exports = {
    get: get
};
