"use strict";
const mongoose = require('mongoose');
//describes the data type
const SkillSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        unique: true
    },
    category: {
        type: String,
        required: true
    }
});

SkillSchema.methods.toJSON = function () {
    const ss = this.toObject();
    delete ss.__v;
    ss.id = ss._id;
    delete ss._id;
    return ss;
}
//export the model
module.exports = mongoose.model('Skill', SkillSchema);