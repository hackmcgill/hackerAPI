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

EmailTemplateSchema.methods.toJSON = function (options) {
    const ets = this.toObject(options);
    delete ets.__v;
    ets.id = ets._id;
    delete ets._id;
    return ets;
};

// export the model
module.exports = mongoose.model(
    "EmailTemplate",
    EmailTemplateSchema
);
