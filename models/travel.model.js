"use strict";
const Constants = require("../constants/general.constant");
const mongoose = require("mongoose");
//describes the data type
const TravelSchema = new mongoose.Schema({
    accountId: {
        // The account this travel data is associated with
        type: mongoose.Schema.Types.ObjectId,
        ref: "Account",
        required: true
    },
    hackerId: {
        // The hacker this travel data is associated with
        type: mongoose.Schema.Types.ObjectId,
        ref: "Hacker",
        required: true
    },
    status: {
        // Has this hacker been approved for funds, etc.
        type: String,
        enum: Constants.TRAVEL_STATUSES,
        required: true,
        default: "None"
    },
    request: {
        // Amount of money hacker has requested for travel
        amount: {
            type: Number,
            required: true
        },
        reason: {
            type: String,
            required: true,
            default: ""
        }
    },
    offer: {
        // Amount of money we have offered hacker for travel
        type: Number,
        default: 0
    }
});

TravelSchema.methods.toJSON = function(options) {
    const ts = this.toObject(options);
    delete ts.__v;
    ts.id = ts._id;
    delete ts._id;
    return ts;
};

//export the model
module.exports = mongoose.model("Travel", TravelSchema);
