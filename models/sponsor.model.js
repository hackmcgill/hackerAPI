"use strict";
const mongoose = require("mongoose");
//describes the data type
const SponsorSchema = new mongoose.Schema({
    accountId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Account",
        required: true
    },
    //What tier of sponsor are they?
    tier: {
        type: Number,
        min: 0,
        default: 0
    },
    company: {
        type: String,
        required: true
    },
    //URL to the contract between hackathon and sponsor
    contractURL: {
        type: String,
        required: true
    },
    //which hackers did the sponsor flag to see again?
    nominees: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Hacker"
        }
    ]
});

SponsorSchema.methods.toJSON = function() {
    const ss = this.toObject();
    delete ss.__v;
    ss.id = ss._id;
    delete ss._id;
    return ss;
};
//export the model
module.exports = mongoose.model("Sponsor", SponsorSchema);
