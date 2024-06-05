"use strict";
const mongoose = require("mongoose");
//describes the data type
const StaffSchema = new mongoose.Schema({
    accountId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Account",
        required: true
    }
});

StaffSchema.methods.toJSON = function(options) {
    const ss = this.toObject(options);
    delete ss.__v;
    ss.id = ss._id;
    delete ss._id;
    return ss;
};
//export the model
module.exports = mongoose.model("Staff", StaffSchema);
