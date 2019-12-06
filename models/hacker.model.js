"use strict";
const Constants = require("../constants/general.constant");
const mongoose = require("mongoose");
//describes the data type
const HackerSchema = new mongoose.Schema({
  //account id
  accountId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Account",
    required: true
  },
  status: {
    type: String,
    enum: Constants.HACKER_STATUSES,
    required: true,
    default: "None"
  },
  application: {
    general: {
      school: {
        type: String,
        required: true
      },
      degree: {
        type: String,
        required: true
      },
      fieldOfStudy: [
        {
          type: String,
          required: true
        }
      ],
      graduationYear: {
        type: Number,
        required: true
      },
      jobInterest: {
        type: String,
        enum: Constants.JOB_INTERESTS,
        required: true,
        default: "None"
      },
      URL: {
        //gcloud bucket link
        resume: {
          type: String,
          default: ""
        },
        github: {
          type: String
        },
        dribbble: {
          type: String
        },
        personal: {
          type: String
        },
        linkedIn: {
          type: String
        },
        other: {
          type: String
        }
      }
    },
    shortAnswer: {
      skills: [
        {
          type: String
        }
      ],
      //any miscelaneous comments that the user has
      comments: {
        type: String,
        default: ""
      },
      //"Why do you want to come to our hackathon?"
      question1: {
        type: String,
        default: "",
        required: true
      },
      // "Some Q"
      question2: {
        type: String,
        default: "",
        required: true
      }
    },
    other: {
      ethnicity: {
        type: [
          {
            type: String,
            required: true
          }
        ],
        required: true
      },
      gender: {
        type: String,
        required: true
      },
      codeOfConduct_MLH: {
        type: Boolean,
        required: true
      },
      codeOfConduct_MCHACKS: {
        type: Boolean,
        required: true
      }
    },
    accomodation: {
      needsBus: Boolean,
      default: false
    },
    team: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Team"
    }
  },
  teamId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Team"
  }
});

HackerSchema.methods.toJSON = function() {
  const hs = this.toObject();
  delete hs.__v;
  hs.id = hs._id;
  delete hs._id;
  return hs;
};
HackerSchema.methods.isApplicationComplete = function() {
  const hs = this.toObject();
  console.log(hs);
  const portfolioDone = !!hs.application.general.URL.resume;
  const jobInterestDone = !!hs.application.general.jobInterest;
  const question1Done = !!hs.application.shortAnswer.question1;
  const question2Done = !!hs.application.shortAnswer.question2;
  return portfolioDone && jobInterestDone && question1Done && question2Done;
};

/**
 * @param field the field which should be queried
 * @returns {String} type of the field being queried
 * @description return the type of the field(if it exists and is allowed to be searched on)
 */
HackerSchema.statics.searchableField = function(field) {
  const schemaField = HackerSchema.path(field);
  if (schemaField != undefined) {
    return schemaField.instance;
  } else {
    return null;
  }
};

//export the model
module.exports = mongoose.model("Hacker", HackerSchema);
