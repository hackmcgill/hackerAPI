'use strict';
const mongoose = require('mongoose');
//describes the data type
const roleBinding = new mongoose.Schema({
  accountId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Account',
    required: true,
    unique: true,
  },
  roles: {
    type: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Role',
        required: true,
      },
    ],
  },
});

roleBinding.methods.toJSON = function() {
  const ps = this.toObject();
  delete ps.__v;
  ps.id = ps._id;
  delete ps._id;
  return ps;
};
//export the model
module.exports = mongoose.model('RoleBinding', roleBinding);
