"use strict";
const mongoose = require("mongoose");
//describes the data type
const VolunteerSchema = new mongoose.Schema({
    accountId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Account",
        required: true
    }
});

VolunteerSchema.methods.toJSON = function() {
    const vs = this.toObject();
    delete vs.__v;
    vs.id = vs._id;
    delete vs._id;
    return vs;
};
//export the model
module.exports = mongoose.model("Volunteer", VolunteerSchema);
