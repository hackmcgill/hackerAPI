"use strict";
const mongoose = require("mongoose");

function parsePatch(req, res, next, model) {
  let modelDetails = {};
  for (const val in req.body) {
    if (model.schema.paths.hasOwnProperty(val)) {
      modelDetails[val] = req.body[val];
      delete req.body[val];
    }
  }
  req.body.modelDetails = modelDetails;
  return next();
}

module.exports = {
  parsePatch: parsePatch
};
