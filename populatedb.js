"use strict";
console.log("Populates some test values into mongoDB");

const Account = require("./models/account.model");
const Bus = require("./models/bus.model");
const DefaultPermission = require("./models/defaultPermission.model");
const Hacker = require("./models/hacker.model");
const Permission = require("./models/permission.model");
const Skill = require("./models/skill.model");
const Sponsor = require("./models/sponsor.model");
const Staff = require("./models/staff.model");
const Team = require("./models/team.model");
const Volunteer = require("./models/volunteer.model");
const path = require("path");
const db = require("./services/database.service");
const mongoose = require("mongoose");
const result = require("dotenv").config({
    path: path.join(__dirname, "./.env")
});

if (result.error) {
    console.error(result);
}
db.connect();

const permissions = [
    {"_id": mongoose.Types.ObjectId(), "name": "Permission1"},
    {"_id": mongoose.Types.ObjectId(), "name": "Permission2"},
    {"_id": mongoose.Types.ObjectId(), "name": "Permission3"},
    {"_id": mongoose.Types.ObjectId(), "name": "Permission4"},
    {"_id": mongoose.Types.ObjectId(), "name": "Permission5"},
    {"_id": mongoose.Types.ObjectId(), "name": "Permission6"},
    {"_id": mongoose.Types.ObjectId(), "name": "Permission7"},
    {"_id": mongoose.Types.ObjectId(), "name": "Permission8"},
    {"_id": mongoose.Types.ObjectId(), "name": "Permission9"},
    {"_id": mongoose.Types.ObjectId(), "name": "Permission10"}
];
const accounts = [
    {
        "_id": mongoose.Types.ObjectId(),
        "firstName": "ABC",
        "lastName": "DEF",
        "email": "abc.def1@blahblah.com",
        "password": "probsShouldBeHashed1",
        "permissions": [permissions[1]._id, permissions[6]._id],
        "dietaryRestrictions": [],
        "shirtSize": "S"
    },
    {
        "_id": mongoose.Types.ObjectId(),
        "firstName": "abc",
        "lastName": "def",
        "email": "abc.def2@blahblah.com",
        "password": "probsShouldBeHashed2",
        "permissions": [permissions[2]._id, permissions[7]._id],
        "dietaryRestrictions": ["vegetarian"],
        "shirtSize": "M"
    },
    {
        "_id": mongoose.Types.ObjectId(),
        "firstName": "XYZ",
        "lastName": "UST",
        "email": "abc.def3@blahblah.com",
        "password": "probsShouldBeHashed3",
        "permissions": [permissions[3]._id, permissions[8]._id],
        "dietaryRestrictions": ["vegan"],
        "shirtSize": "L"
    },
    {
        "_id": mongoose.Types.ObjectId(),
        "firstName": "xyz",
        "lastName": "ust",
        "email": "abc.def4@blahblah.com",
        "password": "probsShouldBeHashed4",
        "permissions": [permissions[4]._id, permissions[9]._id],
        "dietaryRestrictions": ["vegetarian", "lactose intolerant"],
        "shirtSize": "XL"
    },
    {
        "_id": mongoose.Types.ObjectId(),
        "firstName": "LMAO",
        "lastName": "ROFL",
        "email": "abc.def5@blahblah.com",
        "password": "probsShouldBeHashed5",
        "permissions": [permissions[5]._id, permissions[0]._id],
        "dietaryRestrictions": ["something1", "something2"],
        "shirtSize": "XXL"
    }
];
const hackers = [
    {
        "accountId": accounts[0]._id,
        "status": "Applied",
        "school": "University of Blah",
        "gender": "Male",
        "needsBus": true,
        // lol there"s so much to put in
        "application": {

        }
    },
    {
        "accountId": accounts[4]._id,
        "status": "Accepted",
        "school": "University of Blah1",
        "gender": "Female",
        "needsBus": true,
        // lol there"s so much to put in
        "application": {

        }
    }
];
const busses = [
    {
        "origin": {
            "country": "Country1",
            "provinceOrState": "Province2",
            "zip": "123456",
            "city": "City1",
            "addr1": "addr1-1",
            "addr2": "addr2-1"
        },
        "capacity": 10,
        "hackers": [hackers[0]._id]
    }
];
const defaultPermissions = [
    //        enum: ["Hacker", "Volunteer", "Staff", "GodStaff", "Sponsor"],
    {"userType": "Hacker", "permissions": [permissions[0]._id, permissions[1]._id]},
    {"userType": "Volunteer", "permissions": [permissions[2]._id, permissions[1]._id]},
    {"userType": "Staff", "permissions": [permissions[4]._id, permissions[5]._id]},
    {"userType": "GodStaff", "permissions": [permissions[6]._id, permissions[7]._id]},
    {"userType": "Sponsor", "permissions": [permissions[8]._id, permissions[9]._id]}
];
const skills = [
    {"name": "Tech1", "category": "category1"},
    {"name": "Tech2", "category": "category2"},
    {"name": "Tech3", "category": "category3"},
    {"name": "Tech4", "category": "category1"},
    {"name": "Tech5", "category": "category2"},
    {"name": "Tech6", "category": "category3"},
    {"name": "Tech7", "category": "category1"},
    {"name": "Tech8", "category": "category2"}
];
const sponsors = [
    {
        "accountId": accounts[1]._id,
        "tier": 3,
        "company": "Best company NA",
        "contractURL": "https://linkto.contract",
        "nominees": hackers[0]._id
    }
];
const staffs = [
    {
        "accountId": accounts[2]._id,
        "godMode": true
    }
];
const teams = [
    {
        "name": "BronzeTeam",
        "members": {
            "type": [hackers[1]._id]
        },
        "hackSubmitted": false,
        "devpostURL": "justanother.post",
        "projectName": "YetAnotherProject"
    }
];
const volunteers = [
    {"accountId": accounts[3]._id}
];

function dropAll() {
    Account.collection.drop().then(
        (value) => {
            logger.info(`${TAG} dropped table Account`)
        },
        (err) => {
            logger.error(`${TAG} could not drop Account. Error: ${JSON.stringify(err)}`)
        }
    );
    Bus.collection.drop().then(
        (value) => {
            logger.info(`${TAG} dropped table Account`)
        },
        (err) => {
            logger.error(`${TAG} could not drop Account. Error: ${JSON.stringify(err)}`)
        }
    );

// const DefaultPermission = require("./models/defaultPermission.model");
// const Hacker = require("./models/hacker.model");
// const Permission = require("./models/permission.model");
// const Skill = require("./models/skill.model");
// const Sponsor = require("./models/sponsor.model");
// const Staff = require("./models/staff.model");
// const Team = require("./models/team.model");
// const Volunteer = require("./models/volunteer.model");

}


function accountCreate(firstName, lastName, email, password, permissions, dietaryRestrictions, shirtSize, _id = mongoose.Types.ObjectId()) {
    const accountDetail = {
        _id: _id,
        firstName: firstName,
        lastName: lastName,
        email: email,
        password: password,
        permissions: permissions,
        dietaryRestrictions: dietaryRestrictions,
        shirtSize: shirtSize
    };

    // any validations here???

    const account = new Account(accountDetail);

    account.save(function (err) {
        if (err) {
            return err;
        }

        console.log("New account: " + account);
        accounts.push(account);
        return;
    });
}

function busCreate(origin, capacity, hackers, _id = mongoose.Types.ObjectId()) {
    const busDetail = {
        _id: _id,
        origin: origin,
        capacity: capacity,
        hackers: hackers
    };

    const bus = new Bus(busDetail);

    bus.save(function (err) {
        if (err) {
            return err;
        }

        console.log("New bus: " + bus);
        return;
    });
}

function defaultPermissionCreate(userType, permissions, _id = mongoose.Types.ObjectId()) {
    const defaultPermissionDetail = {_id: _id, userType: userType, permissions: permissions};

    const defaultPermission = new DefaultPermission(defaultPermissionDetail);

    defaultPermission.save(function (err) {
        if (err) {
            return err;
        }

        console.log("New defaultPermission: " + defaultPermission);
        return;
    });
}

function hackerCreate(accountId, status, school, gender, needsBus, application, _id = mongoose.Types.ObjectId()) {
    const hackerDetail = {
        _id: _id,
        accountId: accountId,
        status: status,
        school: school,
        gender: gender,
        needsBus: needsBus,
        application: application
    };

    const hacker = new Hacker(hackerDetail);

    hacker.save(function (err) {
        if (err) {
            return err;
        }

        console.log("New hacker: " + hacker);
        return;
    });
}

function permissionCreate(name, _id = mongoose.Types.ObjectId()) {
    const permissionDetail = {
        _id: _id,
        name: name
    };

    const permission = new Permission(permissionDetail);

    permission.save(function (err) {
        if (err) {
            return err;
        }

        console.log("New permission: " + permission);
        return;
    });
}

function skillCreate(name, category, _id = mongoose.Types.ObjectId()) {
    const skillDetail = {
        _id: _id,
        name: name,
        category: category
    };

    const skill = new Skill(skillDetail);

    skill.save(function (err) {
        if (err) {
            return err;
        }

        console.log("New skill: " + skill);
        return;
    });
}

function sponsorCreate(accountId, tier, company, contractURL, nominees, _id = mongoose.Types.ObjectId()) {
    const sponsorDetail = {
        _id: _id,
        accountId: accountId,
        tier: tier,
        company: company,
        contractURL: contractURL,
        nominees: nominees
    };

    const sponsor = new Sponsor(sponsorDetail);

    sponsor.save(function (err) {
        if (err) {
            return err;
        }

        console.log("New sponsor: " + sponsor);
        return;
    });
}

function staffCreate(accountId, godMode, _id = mongoose.Types.ObjectId()) {
    const staffDetail = {
        _id: _id,
        accountId: accountId,
        godMode: godMode
    };

    const staff = new Staff(staffDetail);

    staff.save(function (err) {
        if (err) {
            return err;
        }

        console.log("New staff: " + staff);
        return;
    });
}

function teamCreate(name, members, hackSubmitted, devpostURL, projectName, _id = mongoose.Types.ObjectId()) {
    const teamDetail = {
        _id: _id,
        name: name,
        members: members,
        hackSubmitted: hackSubmitted,
        devpostURL: devpostURL,
        projectName: projectName
    };

    const team = new Team(teamDetail);

    team.save(function (err) {
        if (err) {
            return err;
        }

        console.log("New team: " + team);
        return;
    });
}

function volunteerCreate(accountId, _id = mongoose.Types.ObjectId()) {
    const volunteerDetail = {
        _id: _id,
        accountId: accountId
    };

    const volunteer = new Volunteer(volunteerDetail);

    volunteer.save(function (err) {
        if (err) {
            return err;
        }

        console.log("New voluneer: " + volunteer);
        return;
    });
}


permissions.forEach(function (permission) {
    permissionCreate(permission.name, permission._id);
});
accounts.forEach(function (account) {
    accountCreate(account.firstName, account.lastName, account.email, account.password, account.permissions, account.dietaryRestrictions, account.shirtSize, account._id);
});
hackers.forEach(function (hacker) {
    hackerCreate(hacker.accountID, hacker.status, hacker.school, hacker.gender, hacker.needsBus, hacker.application, hacker._id);
});
busses.forEach(function (bus) {
    busCreate(bus.origin, bus.capacity, bus.hackers, bus._id);
});
defaultPermissions.forEach(function (defaultPermission) {
    defaultPermissionCreate(defaultPermission.userType, defaultPermission.permissions, defaultPermission._id);
});
skills.forEach(function (skill) {
    skillCreate(skill.name, skill.category, skill._id);
});
sponsors.forEach(function (sponsor) {
    sponsorCreate(sponsor.accountId, sponsor.tier, sponsor.company, sponsor.contractURL, sponsor.nominees, sponsor._id);
});
staffs.forEach(function (staff) {
    staffCreate(staff.accountId, staff.godMode, staff._id);
});
teams.forEach(function (team) {
    teamCreate(team.name, team.members, team.hackSubmitted, team.devpostURL, team.projectName, team._id);
});
volunteers.forEach(function (volunteer) {
    volunteerCreate(volunteer.accountId, volunteer._id);
});