'use strict';
const mongoose = require('mongoose');

module.exports = {
  parsePatch: function(req, model, done) {
    setMatchingAttributes(model).then(() => {
      done();
    });
  },
};

async function setMatchingAttributes(model) {
  let modelDetails = {};
  for (const val in req.body) {
    if (model.schema.paths.hasOwnProperty(val)) {
      modelDetails[val] = req.body[val];
      delete req.body[val];
    }
  }
  req.body.modelDetails = modelDetails;
}
