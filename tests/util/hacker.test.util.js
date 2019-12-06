"use strict";
const Util = {
  Account: require("./account.test.util")
};
const Constants = {
  MongoId: require("../../constants/testMongoId.constant")
};

const mongoose = require("mongoose");
const Hacker = require("../../models/hacker.model");
const logger = require("../../services/logger.service");

const TeamHacker0 = {
  _id: Constants.MongoId.hackerAId,
  accountId: Util.Account.hackerAccounts.stored.team[0]._id,
  status: "Confirmed",
  application: {
    general: {
      school: "University of Blah",
      degree: "Masters",
      fieldOfStudy: ["EE"],
      graduationYear: 2019,
      jobInterest: "Full-time",
      URL: {
        //gcloud bucket link
        resume: "www.gcloud.com/myResume100",
        github: "www.github.com/Person1",
        dribbble: undefined,
        personal: "www.person1.com",
        linkedIn: "www.linkedin.com/in/Person1",
        other: undefined
      }
    },
    shortAnswer: {
      skills: ["CSS", "HTML", "JS"],
      question1: "a",
      question2: "a"
    },
    other: {
      gender: "Male",
      ethnicity: ["Native American"],
      codeOfConduct_MCHACKS: true,
      codeOfConduct_MLH: true
    },
    accomodation: {
      needsBus: true
    }
  },
  teamId: Constants.MongoId.team1Id
};

const TeamHacker1 = {
  _id: Constants.MongoId.hackerDId,
  accountId: Util.Account.hackerAccounts.stored.team[1]._id,
  status: "Checked-in",
  application: {
    general: {
      school: "University of Blah",
      degree: "Masters",
      fieldOfStudy: ["EE"],
      graduationYear: 2019,
      jobInterest: "Internship",
      URL: {
        //gcloud bucket link
        resume: "www.gcloud.com/myResume2",
        github: "www.github.com/Personasdf",
        dribbble: undefined,
        personal: undefined,
        linkedIn: undefined,
        other: undefined
      }
    },
    shortAnswer: {
      skills: ["CSS", "HTML", "JS"],
      question1: "a",
      question2: "a"
    },
    other: {
      gender: "Female",
      ethnicity: ["European"],
      codeOfConduct_MCHACKS: true,
      codeOfConduct_MLH: true
    },
    accomodation: {
      needsBus: false
    }
  },
  teamId: Constants.MongoId.team3Id
};

const TeamHacker2 = {
  _id: Constants.MongoId.hackerEId,
  accountId: Util.Account.hackerAccounts.stored.team[2]._id,
  status: "Waitlisted",
  application: {
    general: {
      school: "University of Blah",
      degree: "Masters",
      fieldOfStudy: ["EE"],
      graduationYear: 2019,
      jobInterest: "Internship",
      URL: {
        //gcloud bucket link
        resume: "www.gcloud.com/myResume2",
        github: "www.github.com/Personasdf",
        dribbble: undefined,
        personal: undefined,
        linkedIn: undefined,
        other: undefined
      }
    },
    shortAnswer: {
      skills: ["CSS", "HTML", "JS"],
      question1: "a",
      question2: "a"
    },
    other: {
      gender: "Female",
      ethnicity: ["European"],
      codeOfConduct_MCHACKS: true,
      codeOfConduct_MLH: true
    },
    accomodation: {
      needsBus: false
    }
  },
  teamId: Constants.MongoId.team3Id
};

const TeamHacker3 = {
  _id: Constants.MongoId.hackerFId,
  accountId: Util.Account.hackerAccounts.stored.team[3]._id,
  status: "Waitlisted",
  application: {
    general: {
      school: "University of Blah",
      degree: "Masters",
      fieldOfStudy: ["EE"],
      graduationYear: 2019,
      jobInterest: "Internship",
      URL: {
        //gcloud bucket link
        resume: "www.gcloud.com/myResume2",
        github: "www.github.com/Personasdf",
        dribbble: undefined,
        personal: undefined,
        linkedIn: undefined,
        other: undefined
      }
    },
    shortAnswer: {
      skills: ["CSS", "HTML", "JS"],
      question1: "a",
      question2: "a"
    },
    other: {
      gender: "Female",
      ethnicity: ["European"],
      codeOfConduct_MCHACKS: true,
      codeOfConduct_MLH: true
    },
    accomodation: {
      needsBus: false
    }
  },
  teamId: Constants.MongoId.team3Id
};

const TeamHacker4 = {
  _id: Constants.MongoId.hackerGId,
  accountId: Util.Account.hackerAccounts.stored.team[4]._id,
  status: "Waitlisted",
  application: {
    general: {
      school: "University of Blah",
      degree: "Masters",
      fieldOfStudy: ["EE"],
      graduationYear: 2019,
      jobInterest: "Internship",
      URL: {
        //gcloud bucket link
        resume: "www.gcloud.com/myResume2",
        github: "www.github.com/Personasdf",
        dribbble: undefined,
        personal: undefined,
        linkedIn: undefined,
        other: undefined
      }
    },
    shortAnswer: {
      skills: ["CSS", "HTML", "JS"],
      question1: "a",
      question2: "a"
    },
    other: {
      gender: "Female",
      ethnicity: ["European"],
      codeOfConduct_MCHACKS: true,
      codeOfConduct_MLH: true
    },
    accomodation: {
      needsBus: false
    }
  },
  teamId: Constants.MongoId.team3Id
};

const NoTeamHacker0 = {
  _id: Constants.MongoId.hackerBId,
  accountId: Util.Account.hackerAccounts.stored.noTeam[0]._id,
  status: "Accepted",
  application: {
    general: {
      school: "University of Blah",
      degree: "Masters",
      fieldOfStudy: ["EE"],
      graduationYear: 2019,
      jobInterest: "Internship",
      URL: {
        //gcloud bucket link
        resume: "www.gcloud.com/myResume1",
        github: "www.github.com/Person4",
        dribbble: undefined,
        personal: undefined,
        linkedIn: undefined,
        other: undefined
      }
    },
    shortAnswer: {
      skills: ["CSS", "HTML", "JS"],
      question1: "a",
      question2: "a"
    },
    other: {
      gender: "Female",
      ethnicity: ["European"],
      codeOfConduct_MCHACKS: true,
      codeOfConduct_MLH: true
    },
    accomodation: {
      needsBus: false
    }
  }
};

const newHacker0 = {
  accountId: Util.Account.hackerAccounts.new[0]._id,
  application: {
    general: {
      school: "University of ASDF",
      degree: "Masters",
      fieldOfStudy: ["EE"],
      graduationYear: 2019,
      jobInterest: "Full-time",
      URL: {
        //gcloud bucket link
        resume: "www.gcloud.com/myResume100",
        github: "www.github.com/Person1",
        dribbble: undefined,
        personal: "www.person1.com",
        linkedIn: "www.linkedin.com/in/Person1",
        other: undefined
      }
    },
    shortAnswer: {
      skills: ["CSS", "HTML", "JS"],
      question1: "a",
      question2: "a"
    },
    other: {
      gender: "Female",
      ethnicity: ["Caucasian"],
      codeOfConduct_MCHACKS: true,
      codeOfConduct_MLH: true
    },
    accomodation: {
      needsBus: false
    }
  }
};

const newHacker1 = {
  accountId: Util.Account.hackerAccounts.new[1]._id,
  application: {
    general: {
      school: "University of YIKES",
      degree: "PhD",
      fieldOfStudy: ["EE"],
      graduationYear: 2019,
      jobInterest: "Full-time",
      URL: {
        //gcloud bucket link
        resume: "www.gcloud.com/myResume100",
        github: "www.github.com/Person1",
        dribbble: undefined,
        personal: "www.person1.com",
        linkedIn: "www.linkedin.com/in/Person1",
        other: undefined
      }
    },
    shortAnswer: {
      skills: ["CSS", "HTML", "JS"],
      question1: "a",
      question2: "a"
    },
    other: {
      gender: "Female",
      ethnicity: ["African American"],
      codeOfConduct_MCHACKS: true,
      codeOfConduct_MLH: true
    },
    accomodation: {
      needsBus: true
    }
  }
};

// duplicate of newHack0, but with false for code of conduct
const invalidHacker0 = {
  accountId: Util.Account.hackerAccounts.invalid[0]._id,
  application: {
    general: {
      school: "University of ASDF",
      degree: "Masters",
      fieldOfStudy: ["EE"],
      graduationYear: 2019,
      jobInterest: "Full-time",
      URL: {
        //gcloud bucket link
        resume: "www.gcloud.com/myResume100",
        github: "www.github.com/Person1",
        dribbble: undefined,
        personal: "www.person1.com",
        linkedIn: "www.linkedin.com/in/Person1",
        other: undefined
      }
    },
    shortAnswer: {
      skills: ["CSS", "HTML", "JS"],
      question1: "a",
      question2: "a"
    },
    other: {
      gender: "Female",
      ethnicity: ["Caucasian"],
      // must accept code of conduct to be valid
      codeOfConduct_MCHACKS: false,
      codeOfConduct_MLH: false
    },
    accomodation: {
      needsBus: true
    }
  }
};

const invalidHacker1 = {
  _id: mongoose.Types.ObjectId(),
  // invalid mongoID
  accountId: Util.Account.hackerAccounts.invalid[1]._invalidId,
  application: {
    general: {
      // invalid missing school attribute
      degree: "Undersaduate",
      fieldOfStudy: ["EE"],
      graduationYear: 2020,
      // invalid job interest
      jobInterest: "ASDF",
      URL: {
        // invalid URL links with no resume
      }
    },
    shortAnswer: {
      skills: ["CSS", "HTML", "JS"],
      question1: "a",
      question2: "a"
    },
    other: {
      gender: "Female",
      ethnicity: ["Caucasian"],
      codeOfConduct_MCHACKS: true,
      codeOfConduct_MLH: true
    },
    accomodation: {
      needsBus: true
    }
  }
};

const duplicateAccountLinkHacker0 = {
  _id: mongoose.Types.ObjectId(),
  accountId: Util.Account.hackerAccounts.stored.team[0]._id,
  status: "Applied",
  application: {
    general: {
      school: "University of Blah",
      degree: "Undergraduate",
      fieldOfStudy: ["CS"],
      graduationYear: 2019,
      jobInterest: "Full-time",
      URL: {
        //gcloud bucket link
        resume: "www.gcloud.com/myResume100",
        github: "www.github.com/Person1",
        dribbble: undefined,
        personal: "www.person1.com",
        linkedIn: "www.linkedin.com/in/Person1",
        other: undefined
      }
    },
    shortAnswer: {
      skills: ["CSS", "HTML", "JS"],
      question1: "a",
      question2: "a"
    },
    other: {
      gender: "Male",
      ethnicity: ["Caucasian"],
      codeOfConduct_MCHACKS: true,
      codeOfConduct_MLH: true
    },
    accomodation: {
      needsBus: true
    }
  }
};

const waitlistedHacker0 = {
  _id: Constants.MongoId.hackerCId,
  accountId: Util.Account.waitlistedHacker0._id,
  status: "Waitlisted",
  application: {
    general: {
      school: "University of Blah",
      degree: "Masters",
      fieldOfStudy: ["EE"],
      graduationYear: 2019,
      jobInterest: "Intership",
      URL: {
        //gcloud bucket link
        resume: "www.gcloud.com/myResume2",
        github: "www.github.com/Personasdf",
        dribbble: undefined,
        personal: undefined,
        linkedIn: undefined,
        other: undefined
      }
    },
    shortAnswer: {
      skills: ["CSS", "HTML", "JS"],
      question1: "a",
      question2: "a"
    },
    other: {
      gender: "Female",
      ethnicity: ["European"],
      codeOfConduct_MCHACKS: true,
      codeOfConduct_MLH: true
    },
    accomodation: {
      needsBus: false
    }
  },
  teamId: Constants.MongoId.team2Id
};

const unconfirmedAccountHacker0 = {
  _id: Constants.MongoId.hackerCId,
  accountId: Util.Account.NonConfirmedAccount2._id,
  status: "Waitlisted",
  application: {
    general: {
      school: "University of Blah1",
      degree: "Masters",
      fieldOfStudy: ["EE"],
      graduationYear: 2019,
      jobInterest: "Internship",
      URL: {
        //gcloud bucket link
        resume: "www.gcloud.com/myResume123",
        github: "www.github.com/Personasdf",
        dribbble: undefined,
        personal: undefined,
        linkedIn: undefined,
        other: undefined
      }
    },
    shortAnswer: {
      skills: ["CSS", "HTML", "JS"],
      question1: "a",
      question2: "a"
    },
    other: {
      gender: "Female",
      ethnicity: ["European"],
      codeOfConduct_MCHACKS: true,
      codeOfConduct_MLH: true
    },
    accomodation: {
      needsBus: false
    }
  }
};

const unconfirmedAccountHacker1 = {
  _id: Constants.MongoId.hackerHId,
  accountId: Util.Account.hackerAccounts.stored.unconfirmed[0]._id,
  status: "Accepted",
  application: {
    general: {
      school: "University of Blah2",
      degree: "Underggraduate",
      fieldOfStudy: ["EE"],
      graduationYear: 2019,
      jobInterest: "Internship",
      URL: {
        //gcloud bucket link
        resume: "www.gcloud.com/myResume123",
        github: "www.github.com/Personasdf",
        dropler: undefined,
        personal: undefined,
        linkedIn: undefined,
        other: undefined
      }
    },
    shortAnswer: {
      skills: ["CSS", "HTML", "JS"],
      question1: "a",
      question2: "a"
    },
    other: {
      gender: "Female",
      ethnicity: ["European"],
      codeOfConduct_MCHACKS: true,
      codeOfConduct_MLH: true
    },
    accomodation: {
      needsBus: false
    }
  }
};

const Hackers = [
  TeamHacker0,
  TeamHacker1,
  TeamHacker2,
  TeamHacker3,
  TeamHacker4,

  NoTeamHacker0,

  invalidHacker0,
  unconfirmedAccountHacker1,

  duplicateAccountLinkHacker0,
  waitlistedHacker0
];

module.exports = {
  TeamHacker0: TeamHacker0,
  TeamHacker1: TeamHacker1,
  TeamHacker2: TeamHacker2,
  TeamHacker3: TeamHacker3,
  TeamHacker4: TeamHacker4,

  NoTeamHacker0: NoTeamHacker0,

  newHacker0: newHacker0,
  newHacker1: newHacker1,

  invalidHacker0: invalidHacker0,
  invalidHacker1: invalidHacker1,

  duplicateAccountLinkHacker0: duplicateAccountLinkHacker0,
  waitlistedHacker0: waitlistedHacker0,
  unconfirmedAccountHacker0: unconfirmedAccountHacker0,
  unconfirmedAccountHacker1: unconfirmedAccountHacker1,

  Hackers: Hackers,
  storeAll: storeAll,
  dropAll: dropAll
};

function store(attributes) {
  const hackerDocs = [];
  const hackerIds = [];
  for (var i = 0; i < attributes.length; i++) {
    hackerDocs.push(new Hacker(attributes[i]));
    hackerIds.push(attributes[i]._id);
  }

  return Hacker.collection.insertMany(hackerDocs);
}

async function storeAll() {
  await store(Hackers);
}

async function dropAll() {
  try {
    await Hacker.collection.drop();
  } catch (e) {
    if (e.code === 26) {
      logger.info("namespace %s not found", Hacker.collection.name);
    } else {
      throw e;
    }
  }
}
