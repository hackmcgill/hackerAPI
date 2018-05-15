"use strict";
const mongoose = require('mongoose');
//describes the data type
const AccountSchema = new mongoose.Schema({
    firstName: {
        type: String,
        required: true,
    },
    lastName: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        trim: true,
        lowercase: true,
        unique: true,
        required: 'Email address is required',
        validate: [validateEmail, 'Please fill a valid email address'],
        match: [/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/, 'Please fill a valid email address']
    },
    password: {
        type: String,
        required: true
    },
    permissions: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Permission'
    }],
    dietaryRestrictions: [{
        type: String
    }],
    shirtSize: {
        type: String,
        enum: ['XS','S','M','L','XL','XXL'],
        required: true
    }
});

AccountSchema.methods.toJSON = function () {
    const as = this.toObject();
    delete as.__v;
    as.id = as._id;
    delete as._id;
    return as;
};
//deletes password
AccountSchema.methods.toStrippedJSON = function () {
    const as = this.toJSON();
    delete as.password;
    return as;
}
//export the model
module.exports = mongoose.model('Account', HackerSchema);