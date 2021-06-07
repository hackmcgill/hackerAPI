"use strict";
const mongoose = require("mongoose");

// describes the data type
const EmailTemplateSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    content: {
        type: String,
        required: true
    }
});

EmailTemplateSchema.methods.toJSON = function () {
    const emailTemplateObj = this.toObject();
    delete emailTemplateObj.__v;
    emailTemplateObj.id = emailTemplateObj._id;
    delete emailTemplateObj._id;
    return emailTemplateObj;
};

// export the model
module.exports = mongoose.model(
    "EmailTemplate",
    EmailTemplateSchema
);
