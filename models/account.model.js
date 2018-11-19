"use strict";
const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const Constants = require("../constants/general.constant");
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
        required: "Email address is required",
        match: [Constants.EMAIL_REGEX, "Please fill a valid email address"]
    },
    password: {
        type: String,
        required: true
    },
    dietaryRestrictions: [{
        type: String
    }],
    shirtSize: {
        type: String,
        enum: Constants.SHIRT_SIZES,
        required: true
    },
    confirmed: {
        type: Boolean,
        default: false
    },
    accountType: {
        type: String,
        enum: Constants.USER_TYPES,
        default: Constants.HACKER
    },
    birthDate: {
        type: Date,
        required: true
    },
    phoneNumber: {
        type: Number,
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
};
/**
 * Pass in an un-encrypted password and see whether it matches the 
 * encrypted password
 * @param {String} password 
 */
AccountSchema.methods.comparePassword = function (password) {
    return bcrypt.compareSync(password, this.password);
};
/**
 * Returns if the accountType corresponds to a sponsor 
 */
AccountSchema.methods.isSponsor = function(){
    return Constants.SPONSOR_TIERS.includes(this.accountType) || this.accountType == Constants.SPONSOR;
}
//export the model
module.exports = mongoose.model("Account", AccountSchema);