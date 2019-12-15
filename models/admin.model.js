"use strict";
const mongoose = require("mongoose");
//describes the data type
const AdminSchema = new mongoose.Schema({
    accountId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Account",
        required: true
    }
});

AdminSchema.methods.toJSON = function() {
    const ss = this.toObject();
    delete ss.__v;
    ss.id = ss._id;
    delete ss._id;
    return ss;
};
//export the model
module.exports = mongoose.model("Admin", AdminSchema);
