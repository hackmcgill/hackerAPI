"use strict";
const mongoose = require("mongoose");
//describes the data type
const BusSchema = new mongoose.Schema({
    origin: {
        country: {
            type: String,
            required: true
        },
        provinceOrState: {
            type: String,
            required: true
        },
        zip: {
            type: String,
            required: true
        },
        city: {
            type: String,
            required: true
        },
        addr1: {
            type: String,
            required: true
        },
        addr2: String,
    },
    capacity: {
        type: Number,
        required: true,
        min: 0
    },
    hackers: {
        type: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: "Hacker"
            }
        ]
        // TODO: find way to validate that this array size is smaller than the max capacity
    }
});

BusSchema.methods.toJSON = function() {
    const bs = this.toObject();
    delete bs.__v;
    bs.id = bs._id;
    delete bs._id;
    return bs;
}
//export the model
module.exports = mongoose.model("Bus",BusSchema);
