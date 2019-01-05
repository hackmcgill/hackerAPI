"use strict";
const mongoose = require("mongoose");
const Constants = require("../constants/general.constant");

//describes the data type
const TeamSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    members: {
        type: [{
            type: mongoose.Schema.Types.ObjectId,
            ref: "Hacker"
        }],
        validate: [validateTeamSize, "{PATH} exceeds the limit"]
    },
    devpostURL: {
        type: String,
        default: undefined,
    },
    projectName: String
});

TeamSchema.index({
    name: 1
});

function validateTeamSize(membersArr) {
    return membersArr.length <= Constants.MAX_TEAM_SIZE;
}

TeamSchema.methods.toJSON = function () {
    const ts = this.toObject();
    delete ts.__v;
    ts.id = ts._id;
    delete ts._id;
    return ts;
};
//export the model
module.exports = mongoose.model("Team", TeamSchema);