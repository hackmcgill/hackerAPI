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

passwordResetSchema.methods.toJSON = function () {
    const resetObj = this.toObject();
    delete resetObj.__v;
    resetObj.id = resetObj._id;
    delete resetObj._id;
    return resetObj;
};

module.exports = mongoose.model("PasswordResetToken", passwordResetSchema);