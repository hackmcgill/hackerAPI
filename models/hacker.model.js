"use strict";

const Constants = require("../constants");
const mongoose = require("mongoose");
//describes the data type
const HackerSchema = new mongoose.Schema({
    //account id
    accountId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Account",
        required: true
    },
    status: {
        type: String,
        enum: Constants.HACKER_STATUSES,
        required: true,
        default: "None"
    },
    school: {
        type: String,
        required: true
    },
    //no enum for this
    gender: {
        type: String
    },
    needsBus: Boolean,
    application: {
        portfolioURL: {
            //gcloud bucket link
            resume: {
                type: String,
                required: true
            },
            github: {
                type: String
            },
            dropler: {
                type: String
            },
            personal: {
                type: String
            },
            linkedIn: {
                type: String
            },
            other: {
                type: String
            }
        },
        jobInterest: {
            type: String,
            enum: Constants.JOB_INTERESTS,
            required: true,
            default: "None"
        },
        skills: [{
            type: mongoose.Schema.Types.ObjectId,
            ref: "Skill"
        }],
        //any miscelaneous comments that the user has
        comments: {
            type: String,
            default: ""
        },
        //"Why do you want to come to our hackathon?"
        essay: {
            type: String,
            default: ""
        },
        team: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Team"
        }
    },
    ethnicity: {
        type: String,
        required: true
    },
    major: {
        type: String,
        required: true
    },
    graduationYear: {
        type: Number,
        required: true
    },
    codeOfConduct: {
        type: Boolean,
        required: true
    }
});

HackerSchema.methods.toJSON = function () {
    const hs = this.toObject();
    delete hs.__v;
    hs.id = hs._id;
    delete hs._id;
    return hs;
};

/**
 * @param field the field which should be queried
 * @returns {String} type of the field being queried
 * @description return the type of the field(if it exists and is allowed to be searched on)
 */
HackerSchema.statics.searchableField = function (field) {
    return HackerSchema.path(field).instance;
};

//export the model
module.exports = mongoose.model("Hacker", HackerSchema);