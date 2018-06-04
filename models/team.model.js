"use strict";
import { Schema, model } from "mongoose";
const MAX_TEAM_SIZE = 4;
//describes the data type
const TeamSchema = new Schema({
    name: {
        type: String,
        unique: true,
        required: true
    },
    members: {
        type: [{
            type: Schema.Types.ObjectId,
            ref: "Hacker"
        }],
        validate: [validateTeamSize, "{PATH} exceeds the limit"]
    },
    hackSubmitted: {
        type: Boolean,
        default: false
    },
    devpostURL: String,
    projectName: String
});

function validateTeamSize(membersArr) {
    return membersArr.size <= MAX_TEAM_SIZE;
}

TeamSchema.methods.toJSON = function () {
    const ts = this.toObject();
    delete ts.__v;
    ts.id = ts._id;
    delete ts._id;
    return ts;
};
//export the model
export default model("Team", TeamSchema);