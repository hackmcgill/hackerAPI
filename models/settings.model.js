"use strict";
const mongoose = require("mongoose");
//describes the data type
const settings = new mongoose.Schema({
    openTime: {
        type: Date,
        default: Date.now() + 2628000000 // One month from now.
    },
    closeTime: {
        type: Date,
        default: Date.now() + 31540000000 + 2628000000 // One year and 1 month from now.
    },
    confirmTime: {
        type: Date,
        default: Date.now() + 31540000000 + 2628000000 + 2628000000 // 1 year and 2 months from now.
    },
    isRemote: {
        type: Boolean,
        default: false
    }
});

settings.methods.toJSON = function() {
    const ss = this.toObject();
    delete ss.__v;
    ss.id = ss._id;
    delete ss._id;
    return ss;
};
//export the model
module.exports = mongoose.model("Settings", settings);
