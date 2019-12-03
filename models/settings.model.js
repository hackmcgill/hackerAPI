'use strict';
const mongoose = require('mongoose');
//describes the data type
const settings = new mongoose.Schema({
  openTime: {
    type: Date,
    default: 0,
  },
  closeTime: {
    type: Date,
    default: Date.now() + 31104000000, // Add a year from now.
  },
  confirmTime: {
    type: Date,
    default: Date.now() + 31104000000 + 2628000000, // 1 year and 1 month from now.
  },
});

settings.methods.toJSON = function() {
  const ss = this.toObject();
  delete ss.__v;
  ss.id = ss._id;
  delete ss._id;
  return ss;
};
//export the model
module.exports = mongoose.model('Settings', settings);
