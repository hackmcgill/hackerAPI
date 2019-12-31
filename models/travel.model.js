"use strict";
const Constants = require("../constants/general.constant");
const mongoose = require("mongoose");
//describes the data type
const TravelSchema = new mongoose.Schema({
    hackerId: { // The hacker this travel data is associated with
        type: mongoose.Schema.Types.ObjectId,
        ref: "Hacker",
        required: true
    },
    status: { // Has this hacker been approved for funds, etc.
        type: String,
        enum: Constants.TRAVEL_STATUSES,
        required: true,
        default: "None"
    },
    request: { // Amount of money hacker has requested for travel
        type: Number,
        required: true
    },
    offer: { // Amount of money we have offered hacker for travel
        type: Number,
        default: 0
    }
});

TravelSchema.methods.toJSON = function () {
    const hs = this.toObject();
    delete hs.__v;
    hs.id = hs._id;
    delete hs._id;
    return hs;
};

//export the model
module.exports = mongoose.model("Travel", TravelSchema);
