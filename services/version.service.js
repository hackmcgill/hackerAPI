"use strict";
const fs = require("fs");
const path = require("path");

const get = function() {
	const version = fs.readFileSync(path.join(__dirname, "../VERSION"), "utf8");
	return version.toString();
};

module.exports = {
	get: get
};