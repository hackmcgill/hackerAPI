"use strict";
import { Schema, model } from "mongoose";
//describes the data type
const VolunteerSchema = new Schema({
    accountId: {
        type: Schema.Types.ObjectId,
        ref: "Account",
        required: true
    }
});

VolunteerSchema.methods.toJSON = function () {
    const vs = this.toObject();
    delete vs.__v;
    vs.id = vs._id;
    delete vs._id;
    return vs;
};
//export the model
export default model("Volunteer", VolunteerSchema);