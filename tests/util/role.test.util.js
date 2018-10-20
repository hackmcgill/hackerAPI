"use strict";
const Role = require("../../models/role.model");
const Constants = require("../../constants");
const mongoose = require("mongoose");
const TAG = "[ ROLE.TEST.UTIL.JS ]";
const logger = require("../../services/logger.service");

const accountRoutes = {
    "getSelf": {
        requestTypes: Constants.REQUEST_TYPES.GET, 
        uri: "/api/account/self"
    },
    "getSelfById": {
        requestTypes: Constants.REQUEST_TYPES.GET,
        uri: "/api/account/" + Constants.ROLE_CATEGORIES.self,
    },
    "getAnyById": {
        requestTypes: Constants.REQUEST_TYPES.GET,
        uri: "/api/account/" + Constants.ROLE_CATEGORIES.all,
    },
    "post": {
        requestTypes: Constants.REQUEST_TYPES.POST,
        uri: "/api/account/"
    },
    "patchSelfById": {
        requestTypes: Constants.REQUEST_TYPES.PATCH,
        uri: "/api/account/" + Constants.ROLE_CATEGORIES.self,
    },
    "patchAnyById": {
        requestTypes: Constants.REQUEST_TYPES.PATCH,
        uri: "/api/account/" + Constants.ROLE_CATEGORIES.all,
    }
};

const hackerRoutes = {
    "getSelfById": {
        requestTypes: Constants.REQUEST_TYPES.GET,
        uri: "/api/hacker/" + Constants.ROLE_CATEGORIES.self,
    },
    "getAnyById": {
        requestTypes: Constants.REQUEST_TYPES.GET,
        uri: "/api/hacker/" + Constants.ROLE_CATEGORIES.any,
    },
    "getSelfResumeById": {
        requestTypes: Constants.REQUEST_TYPES.GET,
        uri: "/api/hacker/" + Constants.ROLE_CATEGORIES.self + "/resume",
    },
    "getAnyResumeById": {
        requestTypes: Constants.REQUEST_TYPES.GET,
        uri: "/api/hacker/" + Constants.ROLE_CATEGORIES.all + "/resume",
    },
    "post": {
        requestTypes: Constants.REQUEST_TYPES.POST,
        uri: "/api/hacker/",
    },
    "postSelfResumeById": {
        requestTypes: Constants.REQUEST_TYPES.POST,
        uri: "/api/hacker/" + Constants.ROLE_CATEGORIES.self + "/resume",
    },
    "postAnyResumeById": {
        requestTypes: Constants.REQUEST_TYPES.POST,
        uri: "/api/hacker/" + Constants.ROLE_CATEGORIES.all + "/resume",
    },
    "patchSelfById": {
        requestTypes: Constants.REQUEST_TYPES.PATCH,
        uri: "/api/hacker/" + Constants.ROLE_CATEGORIES.self,
    },
    "patchAnyById": {
        requestTypes: Constants.REQUEST_TYPES.PATCH,
        uri: "/api/hacker/" + Constants.ROLE_CATEGORIES.all,
    },
};

const sponsorRoutes = {
    "getSelfById": {
        requestTypes: Constants.REQUEST_TYPES.GET,
        uri: "/api/sponsor/" + Constants.ROLE_CATEGORIES.self,
    },
    "getAnyById": {
        requestTypes: Constants.REQUEST_TYPES.GET,
        uri: "/api/sponsor/" + Constants.ROLE_CATEGORIES.any,
    },
    "post": {
        requestTypes: Constants.REQUEST_TYPES.POST,
        uri: "/api/sponsor/",
    },
};

const teamRoutes = {
    "getSelfById": {
        requestTypes: Constants.REQUEST_TYPES.GET,
        uri: "/api/team/" + Constants.ROLE_CATEGORIES.self,
    },
    "getAnyById": {
        requestTypes: Constants.REQUEST_TYPES.GET,
        uri: "/api/team/" + Constants.ROLE_CATEGORIES.any,
    },
    "post": {
        requestTypes: Constants.REQUEST_TYPES.POST,
        uri: "/api/team/",
    },
};

const volunteerRoutes = {
    "post": {
        requestTypes: Constants.REQUEST_TYPES.POST,
        uri: "/api/volunteer/",
    },
};

const allRoutes = [accountRoutes, hackerRoutes, sponsorRoutes, teamRoutes, volunteerRoutes];

const adminRole = {
    "_id": mongoose.Types.ObjectId(),
    "name": "admin",
    "routes": getAllRoutes(),
};

const hackerRole = {
    "_id": mongoose.Types.ObjectId(),
    "name": "hacker",
    "routes": [
        accountRoutes.getSelf,
        accountRoutes.getSelfById,
        accountRoutes.patchSelfById,

        hackerRoutes.getSelfById,
        hackerRoutes.getSelfResumeById,
        hackerRoutes.patchSelfById,
    ]
};

const volunteerRole = {
    "_id": mongoose.Types.ObjectId(),
    "name": "volunteer",
    "routes": [
        volunteerRoutes.post,
    ]
};

const sponsorT1Role = {
    "_id": mongoose.Types.ObjectId(),
    "name": "sponsorT1",
    "routes": [
        sponsorRoutes.post,
        sponsorRoutes.getSelfById,
    ]
};

const sponsorT2Role = {
    "_id": mongoose.Types.ObjectId(),
    "name": "sponsorT2",
    "routes": [
        sponsorRoutes.post,
        sponsorRoutes.getSelfById,
    ]
};

const sponsorT3Role = {
    "_id": mongoose.Types.ObjectId(),
    "name": "sponsorT3",
    "routes": [
        sponsorRoutes.post,
        sponsorRoutes.getSelfById,
    ]
};

const sponsorT4Role = {
    "_id": mongoose.Types.ObjectId(),
    "name": "sponsorT4",
    "routes": [
        sponsorRoutes.post,
        sponsorRoutes.getSelfById,
    ]
};

const sponsorT5Role = {
    "_id": mongoose.Types.ObjectId(),
    "name": "sponsorT5",
    "routes": [
        sponsorRoutes.post,
        sponsorRoutes.getSelfById,
    ]
};


function getAllRoutes() {
    let routes = [];
    for (let typeRoute of allRoutes) {
        for (let route of Object.entries(typeRoute)) {
            routes.push(route);
        }
    }

    return routes;
}

// creates the roles that are just one uri + request type
function createAllSingularRoles() {
    console.log("HIHI");
    let roles = [];
    // for (let typeRoute of allRoutes) {
    //     for (let route of Object.entries(typeRoute)) {
    //         console.log(route);
    //     }
    // }
}

module.exports = {
    createAllSingularRoles: createAllSingularRoles,
};