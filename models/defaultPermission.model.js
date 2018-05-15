"use strict";
const mongoose = require('mongoose');
//describes the data type
const defPermission = new mongoose.Schema({
    userType: {
        type: String,
        enum: ['Hacker', 'Volunteer', 'Staff', 'GodStaff', 'Sponsor'],
        required: true
    },
    permissions: {
        type: [{
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Permission'
        }]
    }
});

defPermission.methods.toJSON = function () {
    const ps = this.toObject();
    delete ps.__v;
    ps.id = ps._id;
    delete ps._id;
    return ps;
}
//export the model
module.exports = mongoose.model('DefsPermission', defPermission);