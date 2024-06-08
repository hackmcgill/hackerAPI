"use strict";
const mongoose = require("mongoose");
const passwordResetSchema = new mongoose.Schema({
    accountId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: "Account"
    },
    created: {
        type: Date,
        required: true
    }
});

passwordResetSchema.methods.toJSON = function(options) {
    const prs = this.toObject(options);
    delete prs.__v;
    prs.id = prs._id;
    delete prs._id;
    return prs;
};

module.exports = mongoose.model("PasswordResetToken", passwordResetSchema);
