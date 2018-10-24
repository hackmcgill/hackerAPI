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
        uri: "/api/hacker/" + Constants.ROLE_CATEGORIES.all,
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
        uri: "/api/sponsor/" + Constants.ROLE_CATEGORIES.all,
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
        uri: "/api/team/" + Constants.ROLE_CATEGORIES.all,
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

const allRoutes = [["Account", accountRoutes], ["Hacker", hackerRoutes], ["Sponsor", sponsorRoutes], ["Team", teamRoutes], ["Volunteer", volunteerRoutes]];

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

const singularRoles = createAllSingularRoles();

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
    let roles = {};
    for (let typeRoute of allRoutes) {
        let routes = typeRoute[1];
        let routeName = typeRoute[0];
        for (let route of Object.entries(routes)) {
            let role = {
                _id: mongoose.Types.ObjectId(),
                name: route[0] + routeName,
                routes: [route[1]],
            };
            let roleName = route[0] + routeName;
            roles[roleName] = role;
        }
    }

    return roles;
}

function storeAll(attributes, callback) {
    const roleDocs = [];
    const roleNames = [];
    attributes.forEach((attribute) => {
        roleDocs.push(new Role(attribute));
        roleNames.push(attribute.name);
    });

    Role.collection.insertMany(roleDocs).then(
        () => {
            logger.info(`${TAG} saved Roles: ${roleNames.join(",")}`);
            callback();
        },
        (reason) => {
            logger.error(`${TAG} could not store Roles ${roleNames.join(",")}. Error: ${JSON.stringify(reason)}`);
            callback(reason);
        }
    );
}

function dropAll(callback) {
    Role.collection.drop().then(
        () => {
            logger.info(`Dropped table Role`);
            callback();
        },
        (err) => {
            logger.error(`Could not drop Role. Error: ${JSON.stringify(err)}`);
            callback(err);
        }
    ).catch((error) => {
        logger.error(error);
        callback();
    });
}

module.exports = {
    adminRole: adminRole,
    hackerRole: hackerRole,
    volunteerRole: volunteerRole,
    sponsorT1Role: sponsorT1Role,
    sponsorT2Role: sponsorT2Role,
    sponsorT3Role: sponsorT3Role,
    sponsorT4Role: sponsorT4Role,
    sponsorT5Role: sponsorT5Role,
    singularRoles: singularRoles,

    createAllSingularRoles: createAllSingularRoles,
    storeAll: storeAll,
    dropAll: dropAll,
};