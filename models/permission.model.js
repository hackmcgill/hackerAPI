"use strict";
const mongoose = require('mongoose');
//describes the data type
const PermissionSchema = new mongoose.Schema({
    name: {
        type: String,
        unique: true,
        required: true
    }
});

PermissionSchema.methods.toJSON = function() {
    const ps = this.toObject();
    delete ps.__v;
    ps.id = ps._id;
    delete ps._id;
    return ps;
}
//export the model
module.exports = mongoose.model('Permission',PermissionSchema);
