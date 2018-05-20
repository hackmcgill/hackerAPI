#! /usr/bin/env node

console.log('Populates some test values into mongoDB');

var Account = require('./models/account.model');
var Bus = require('./models/bus.model');
var DefaultPermission = require('./models/defaultPermission.model');
var Hacker = require('./models/hacker.model');
var Permission = require('./models/permission.model');
var Skill = require('./models/skill.model');
var Sponsor = require('./models/sponsor.model');
var Staff = require('./models/staff.model');
var Team = require('./models/team.model');
var Volunteer = require('./models/volunteer.model');

var mongoose = require('mongoose');
var mongoDB = '127.0.0.1:27017';
// copy pasted lmao ???
mongoose.connect(mongoDB);
mongoose.Promise = global.Promise;
var db = mongoose.connection;
mongoose.connection.on('error', console.error.bind(console, 'MongoDB connection error:'));

var accounts = [
    {
        "_id": new ObjectID(),
        "firstName": "ABC", "lastName": "DEF", "email": "abc.def1@blahblah.com",
        "password": "probsShouldBeHashed1", 
        "permissions": [permissions[1]._id, permissions[6]._id],
        "dietaryRestrictions": [],
        "shirtSize": "S"
    },
    {
        "_id": new ObjectID(),
        "firstName": "abc", "lastName": "def", "email": "abc.def2@blahblah.com",
        "password": "probsShouldBeHashed2", 
        "permissions": [permissions[2]._id, permissions[7]._id],
        "dietaryRestrictions": ["vegetarian"],
        "shirtSize": "M"
    },
    {
        "_id": new ObjectID(),
        "firstName": "XYZ", "lastName": "UST", "email": "abc.def3@blahblah.com",
        "password": "probsShouldBeHashed3", 
        "permissions": [permissions[3]._id, permissions[8]._id],
        "dietaryRestrictions": ["vegan"],
        "shirtSize": "L"
    },
    {
        "_id": new ObjectID(),
        "firstName": "xyz", "lastName": "ust", "email": "abc.def4@blahblah.com",
        "password": "probsShouldBeHashed4", 
        "permissions": [permissions[4]._id, permissions[9]._id],
        "dietaryRestrictions": ["vegetarian", "lactose intolerant"],
        "shirtSize": "XL"
    },
    {
        "_id": new ObjectID(),
        "firstName": "LMAO", "lastName": "ROFL", "email": "abc.def5@blahblah.com",
        "password": "probsShouldBeHashed5", 
        "permissions": [permissions[5]._id, permissions[10]._id],
        "dietaryRestrictions": ["something1", "something2"],
        "shirtSize": "XXL"
    },
];
var busses = [
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
var defaultPermissions = [
    //        enum: ['Hacker', 'Volunteer', 'Staff', 'GodStaff', 'Sponsor'],
    { "userType": "Hacker", "permissions": [permissions[0]._id, permissions[1]._id] },
    { "userType": "Volunteer", "permissions": [permissions[2]._id, permissions[1]._id] },
    { "userType": "Staff", "permissions": [permissions[4]._id, permissions[5]._id] },
    { "userType": "GodStaff", "permissions": [permissions[6]._id, permissions[7]._id] },
    { "userType": "Sponsor", "permissions": [permissions[8]._id, permissions[9]._id] },
];
var hackers = [
    {
        "accountId": accounts[0]._id,
        "status": "Applied",
        "school": "University of Blah",
        "gender": "Male",
        "needsBus": true,
        // lol there's so much to put in
        "application": {},
    },
    {
        "accountId": accounts[4]._id,
        "status": "Accepted",
        "school": "University of Blah1",
        "gender": "Female",
        "needsBus": true,
        // lol there's so much to put in
        "application": {},
    }
];
var permissions = [
    { "_id": new ObjectID(), "name": "Permission1" }, 
    { "_id": new ObjectID(), "name": "Permission2" }, 
    { "_id": new ObjectID(), "name": "Permission3" }, 
    { "_id": new ObjectID(), "name": "Permission4" }, 
    { "_id": new ObjectID(), "name": "Permission5" }, 
    { "_id": new ObjectID(), "name": "Permission6" }, 
    { "_id": new ObjectID(), "name": "Permission7" }, 
    { "_id": new ObjectID(), "name": "Permission8" }, 
    { "_id": new ObjectID(), "name": "Permission9" }, 
    { "_id": new ObjectID(), "name": "Permission10" }, 
];
var skills = [
    {"name": "Tech1", "category": "category1"},
    {"name": "Tech2", "category": "category2"},
    {"name": "Tech3", "category": "category3"},
    {"name": "Tech4", "category": "category1"},
    {"name": "Tech1", "category": "category2"},
    {"name": "Tech2", "category": "category3"},
    {"name": "Tech3", "category": "category1"},
    {"name": "Tech4", "category": "category2"},
];
var sponsors = [
    {
        "accountId": accounts[1]._id,
        "tier": 3,
        "company": "Best company NA",
        "contractURL": "https://linkto.contract",
        "nominees": hackers[0]._id
    }
];
var staffs = [
    {
        "accountId": accounts[2]._id,
        "godMode": true
    }
];
var teams = [
    {
        "name": "BronzeTeam",
        "members": {
            "type": [hackers[1]._id],
        },
        "hackSubmitted": false,
        "devpostURL": "justanother.post",
        "projectName": "YetAnotherProject"
    }
];
var volunteers = [
    { "accountId": accounts[3]._id }
];

function accountCreate(firstName, lastName, email, password, 
                    permissions, dietaryRestrictions, shirtSize, _id = new ObjectID()) {
    accountDetail = {
        _id: id,
        firstName: firstName,
        lastName: lastName, 
        email: email, 
        password: password, 
        permissions: permissions,
        dietaryRestrictions: dietaryRestrictions, 
        shirtSize: shirtSize
    };

    // any validations here???

    var account = new Account(accountDetail);
         
    account.save(function (err) {
        if (err) {
            return err;
        }

        console.log('New account: ' + account);
        accounts.push(account);
        return;
    });
}

function busCreate(origin, capacity, hackers, _id = new ObjectID()) {
    busDetail = {
        _id: _id,
        origin: origin,
        capacity: capacity,
        hackers: hackers
    };

    var bus = new Bus(busDetail);

    bus.save(function (err) {
        if (err) {
            return err;
        }

        console.log('New bus: ' + bus);
        return;
    });
}

function defaultPermissionCreate(userType, permissions, _id = new ObjectID()) {
    defaultPermissionDetail = { _id: id, userType:userType, permissions:permissions };

    var defaultPermission = new DefaultPermission(defaultPermissionDetail);

    defaultPermission.save(function (err) {
        if (err) {
            return err;
        }

        console.log('New defaultPermission: ' + defaultPermission);
        return;
    });
}

function hackerCreate(accountId, status, school, gender, needsBus, application, _id = new ObjectID()) {
    hackerDetail = {
        _id: _id,
        accountId: accountId,
        status: status,
        school: school,
        gender: gender,
        needsBus: needsBus,
        application: application
    };

    var hacker = new Hacker(hackerDetail);

    hacker.save(function (err) {
        if (err) {
            return err;
        }

        console.log('New hacker: ' + hacker);
        return;
    });
}

function permissionCreate(name, _id = new ObjectID()) {
    permissionDetail = {
        _id: _id,
        name: name
    };

    var permission = new Permission(permissionDetail);

    permission.save(function (err) {
        if (err) {
            return err;
        }

        console.log('New permission: ' + permission);
        return;
    });
}

function skillCreate(name, _id = new ObjectID()) {
    skillDetail = {
        _id: _id,
        name: name,
        category: category
    };

    var skill = new Skill(skillDetail);

    skill.save(function (err) {
        if (err) {
            return err;
        }

        console.log('New skill: ' + skill);
        return;
    });
}

function sponsorCreate(accountId, tier, company, contractURL, nominees, _id = new ObjectID()) {
    sponsorDetail = {
        _id: _id,
        accountId: accountId,
        tier: tier,
        company: company,
        contractURL: contractURL,
        nominees: nominees
    };

    var sponsor = new Sponsor(sponsorDetail);

    sponsor.save(function (err) {
        if (err) {
            return err;
        }

        console.log('New sponsor: ' + sponsor);
        return;
    });
}

function staffCreate(accountId, godMode, _id = new ObjectID()) {
    staffDetail = {
        _id: _id,
        accountId: accountId,
        godMode: godMode
    };

    var staff = new Staff(staffDetail);

    staff.save(function (err) {
        if (err) {
            return err;
        }

        console.log('New staff: ' + staff);
        return;
    });
}

function teamCreate(name, members, hackSubmitted, devpostURL, projectName, _id = new ObjectID()) {
    teamDetail = {
        _id: _id,
        name: name,
        member: member,
        hackSubmitted: hackSubmitted,
        devpostURL: devpostURL,
        projectName: projectName
    };

    var team = new Team(teamDetail);

    team.save(function (err) {
        if (err) {
            return err;
        }

        console.log('New team: ' + team);
        return;
    });
}

function volunteerCreate(accountId, _id = new ObjectID()) {
    volunteerDetail = {
        _id: _id,
        accountId: accountId
    };

    var volunteer = new Volunteer(volunteerDetail);

    volunteer.save(function (err) {
        if (err) {
            return err;
        }

        console.log('New voluneer: ' + volunteer);
        return;
    });
}


