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
            jobInterest: "Full Time",
            URL: {
                //gcloud bucket link
                resume: "www.gcloud.com/myResume100",
                github: "www.github.com/Person1",
                dribbble: null,
                personal: "www.person1.com",
                linkedIn: "www.linkedin.com/in/Person1",
                other: null
            }
        },
        shortAnswer: {
            skills: ["CSS", "HTML", "JS"],
            question1: "a",
            question2: "a",
            previousHackathons: 1
        },
        other: {
            ethnicity: ["Native American"],
            codeOfConduct: true,
            privacyPolicy: true
        },
        accommodation: {
            dietaryRestrictions: ["Gluten-Free"],
            shirtSize: "L",
            travel: 0,
            attendancePreference: "Remote"
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
                dribbble: null,
                personal: null,
                linkedIn: null,
                other: null
            }
        },
        shortAnswer: {
            skills: ["CSS", "HTML", "JS"],
            question1: "a",
            question2: "a",
            previousHackathons: 2
        },
        other: {
            ethnicity: ["European"],
            codeOfConduct: true,
            privacyPolicy: true
        },
        accommodation: {
            dietaryRestrictions: ["Gluten-Free"],
            shirtSize: "L",
            travel: 0,
            attendancePreference: "Remote"
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
                dribbble: null,
                personal: null,
                linkedIn: null,
                other: null
            }
        },
        shortAnswer: {
            skills: ["CSS", "HTML", "JS"],
            question1: "a",
            question2: "a",
            previousHackathons: 3
        },
        other: {
            ethnicity: ["European"],
            codeOfConduct: true,
            privacyPolicy: true
        },
        accommodation: {
            dietaryRestrictions: ["Gluten-Free"],
            shirtSize: "L",
            travel: 0,
            attendancePreference: "Remote"
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
                dribbble: null,
                personal: null,
                linkedIn: null,
                other: null
            }
        },
        shortAnswer: {
            skills: ["CSS", "HTML", "JS"],
            question1: "a",
            question2: "a",
            previousHackathons: 4
        },
        other: {
            ethnicity: ["European"],
            codeOfConduct: true,
            privacyPolicy: true
        },
        accommodation: {
            dietaryRestrictions: ["Gluten-Free"],
            shirtSize: "L",
            travel: 0,
            attendancePreference: "In Person"
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
                dribbble: null,
                personal: null,
                linkedIn: null,
                other: null
            }
        },
        shortAnswer: {
            skills: ["CSS", "HTML", "JS"],
            question1: "a",
            question2: "a",
            previousHackathons: 5
        },
        other: {
            ethnicity: ["European"],
            codeOfConduct: true,
            privacyPolicy: true
        },
        accommodation: {
            dietaryRestrictions: ["Gluten-Free"],
            shirtSize: "L",
            travel: 0,
            attendancePreference: "In Person"
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
                dribbble: null,
                personal: null,
                linkedIn: null,
                other: null
            }
        },
        shortAnswer: {
            skills: ["CSS", "HTML", "JS"],
            question1: "a",
            question2: "a",
            previousHackathons: 1
        },
        other: {
            ethnicity: ["European"],
            codeOfConduct: true,
            privacyPolicy: true
        },
        accommodation: {
            dietaryRestrictions: ["Gluten-Free"],
            shirtSize: "L",
            travel: 0,
            attendancePreference: "Remote"
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
            jobInterest: "Full Time",
            URL: {
                //gcloud bucket link
                resume: "www.gcloud.com/myResume100",
                github: "www.github.com/Person1",
                dribbble: null,
                personal: "www.person1.com",
                linkedIn: "www.linkedin.com/in/Person1",
                other: null
            }
        },
        shortAnswer: {
            skills: ["CSS", "HTML", "JS"],
            question1: "a",
            question2: "a",
            previousHackathons: 2
        },
        other: {
            ethnicity: ["Caucasian"],
            codeOfConduct: true,
            privacyPolicy: true
        },
        accommodation: {
            dietaryRestrictions: ["Gluten-Free"],
            shirtSize: "L",
            travel: 0,
            attendancePreference: "Remote"
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
            jobInterest: "Full Time",
            URL: {
                //gcloud bucket link
                resume: "www.gcloud.com/myResume100",
                github: "www.github.com/Person1",
                dribbble: null,
                personal: "www.person1.com",
                linkedIn: "www.linkedin.com/in/Person1",
                other: null
            }
        },
        shortAnswer: {
            skills: ["CSS", "HTML", "JS"],
            question1: "a",
            question2: "a",
            previousHackathons: 3
        },
        other: {
            ethnicity: ["African American"],
            codeOfConduct: true,
            privacyPolicy: true
        },
        accommodation: {
            dietaryRestrictions: ["Gluten-Free"],
            shirtSize: "L",
            travel: 0,
            attendancePreference: "Remote"
        }
    }
};

// duplicate of newHack0, but with false for code of conduct
const invalidHacker0 = {
    accountId: Util.Account.hackerAccounts.new[0]._id,
    application: {
        general: {
            school: "University of ASDF",
            degree: "Masters",
            fieldOfStudy: ["EE"],
            graduationYear: 2019,
            jobInterest: "Full Time",
            URL: {
                //gcloud bucket link
                resume: "www.gcloud.com/myResume100",
                github: "www.github.com/Person1",
                dribbble: null,
                personal: "www.person1.com",
                linkedIn: "www.linkedin.com/in/Person1",
                other: null
            }
        },
        shortAnswer: {
            skills: ["CSS", "HTML", "JS"],
            question1: "a",
            question2: "a",
            previousHackathons: 4
        },
        other: {
            ethnicity: ["Caucasian"],
            // must accept code of conduct to be valid
            codeOfConduct: false,
            privacyPolicy: false
        },
        accommodation: {
            dietaryRestrictions: ["Gluten-Free"],
            shirtSize: "L",
            travel: 0,
            attendancePreference: "Remote"
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
            degree: "Undergraduate",
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
            question2: "a",
            previousHackathons: 5
        },
        other: {
            ethnicity: ["Caucasian"],
            codeOfConduct: true,
            privacyPolicy: true
        },
        accommodation: {
            dietaryRestrictions: ["Gluten-Free"],
            shirtSize: "L",
            travel: "sfg",
            attendancePreference: "Remot"
        }
    }
};

// duplicate of newHack0, but with 101 for travel
const invalidHacker2 = {
    accountId: Util.Account.hackerAccounts.new[0]._id,
    application: {
        general: {
            school: "University of ASDF",
            degree: "Masters",
            fieldOfStudy: ["EE"],
            graduationYear: 2019,
            jobInterest: "Full Time",
            URL: {
                //gcloud bucket link
                resume: "www.gcloud.com/myResume100",
                github: "www.github.com/Person1",
                dribbble: null,
                personal: "www.person1.com",
                linkedIn: "www.linkedin.com/in/Person1",
                other: null
            }
        },
        shortAnswer: {
            skills: ["CSS", "HTML", "JS"],
            question1: "a",
            question2: "a",
            previousHackathons: 1
        },
        other: {
            ethnicity: ["Caucasian"],
            codeOfConduct: true,
            privacyPolicy: true
        },
        accommodation: {
            dietaryRestrictions: ["Gluten-Free"],
            shirtSize: "L",
            // must be between [0,100] to be valid
            travel: 101,
            attendancePreference: "Remote"
        }
    }
};

// duplicate of newHack0, but with invalid attendance preference.
const invalidHacker3 = {
    accountId: Util.Account.hackerAccounts.new[0]._id,
    application: {
        general: {
            school: "University of ASDF",
            degree: "Masters",
            fieldOfStudy: ["EE"],
            graduationYear: 2019,
            jobInterest: "Full Time",
            URL: {
                //gcloud bucket link
                resume: "www.gcloud.com/myResume100",
                github: "www.github.com/Person1",
                dribbble: null,
                personal: "www.person1.com",
                linkedIn: "www.linkedin.com/in/Person1",
                other: null
            }
        },
        shortAnswer: {
            skills: ["CSS", "HTML", "JS"],
            question1: "a",
            question2: "a",
            previousHackathons: 4
        },
        other: {
            ethnicity: ["Caucasian"],
            codeOfConduct: true,
            privacyPolicy: true
        },
        accommodation: {
            dietaryRestrictions: ["Gluten-Free"],
            shirtSize: "L",
            travel: 0,
            // Attendence Preference Must Be Remote or In Person
            attendancePreference: "asdf"
        }
    }
};

// duplicate of newHack0, but with missing attendance preference.
const invalidHacker4 = {
    accountId: Util.Account.hackerAccounts.new[0]._id,
    application: {
        general: {
            school: "University of ASDF",
            degree: "Masters",
            fieldOfStudy: ["EE"],
            graduationYear: 2019,
            jobInterest: "Full Time",
            URL: {
                //gcloud bucket link
                resume: "www.gcloud.com/myResume100",
                github: "www.github.com/Person1",
                dribbble: null,
                personal: "www.person1.com",
                linkedIn: "www.linkedin.com/in/Person1",
                other: null
            }
        },
        shortAnswer: {
            skills: ["CSS", "HTML", "JS"],
            question1: "a",
            question2: "a",
            previousHackathons: 4
        },
        other: {
            ethnicity: ["Caucasian"],
            codeOfConduct: true,
            privacyPolicy: true
        },
        accommodation: {
            dietaryRestrictions: ["Gluten-Free"],
            shirtSize: "L",
            travel: 0,
            // Attendence Preference Must Be Remote or In Person
            // attendancePreference: "asdf"
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
            jobInterest: "Full Time",
            URL: {
                //gcloud bucket link
                resume: "www.gcloud.com/myResume100",
                github: "www.github.com/Person1",
                dribbble: null,
                personal: "www.person1.com",
                linkedIn: "www.linkedin.com/in/Person1",
                other: null
            }
        },
        shortAnswer: {
            skills: ["CSS", "HTML", "JS"],
            question1: "a",
            question2: "a",
            previousHackathons: 2
        },
        other: {
            ethnicity: ["Caucasian"],
            codeOfConduct: true,
            privacyPolicy: true
        },
        accommodation: {
            dietaryRestrictions: ["Gluten-Free"],
            shirtSize: "L",
            travel: 0,
            attendancePreference: "Remote"
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
                dribbble: null,
                personal: null,
                linkedIn: null,
                other: null
            }
        },
        shortAnswer: {
            skills: ["CSS", "HTML", "JS"],
            question1: "a",
            question2: "a",
            previousHackathons: 3
        },
        other: {
            ethnicity: ["European"],
            codeOfConduct: true,
            privacyPolicy: true
        },
        accommodation: {
            dietaryRestrictions: ["Gluten-Free"],
            shirtSize: "L",
            travel: 0,
            attendancePreference: "Remote"
        }
    },
    teamId: Constants.MongoId.team2Id
};

const unconfirmedAccountHacker0 = {
    _id: Constants.MongoId.hackerCId,
    accountId: Util.Account.NonConfirmedAccount3._id,
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
                dribbble: null,
                personal: null,
                linkedIn: null,
                other: null
            }
        },
        shortAnswer: {
            skills: ["CSS", "HTML", "JS"],
            question1: "a",
            question2: "a",
            previousHackathons: 4
        },
        other: {
            ethnicity: ["European"],
            codeOfConduct: true,
            privacyPolicy: true
        },
        accommodation: {
            dietaryRestrictions: ["Gluten-Free"],
            shirtSize: "L",
            travel: 0,
            attendancePreference: "Remote"
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
            degree: "Undergraduate",
            fieldOfStudy: ["EE"],
            graduationYear: 2019,
            jobInterest: "Internship",
            URL: {
                //gcloud bucket link
                resume: "www.gcloud.com/myResume123",
                github: "www.github.com/Personasdf",
                dropler: null,
                personal: null,
                linkedIn: null,
                other: null
            }
        },
        shortAnswer: {
            skills: ["CSS", "HTML", "JS"],
            question1: "a",
            question2: "a",
            previousHackathons: 5
        },
        other: {
            ethnicity: ["European"],
            codeOfConduct: true,
            privacyPolicy: true
        },
        accommodation: {
            dietaryRestrictions: ["Gluten-Free"],
            shirtSize: "L",
            travel: 0,
            attendancePreference: "Remote"
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
    invalidHacker2: invalidHacker2,
    invalidHacker3: invalidHacker3,
    invalidHacker4: invalidHacker4,

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
