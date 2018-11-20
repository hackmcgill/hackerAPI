"use strict";
const Constants = {
    General: require("./general.constant"),
    Routes: require("./routes.constant"),
};
const mongoose = require("mongoose");

const adminRole = {
    "_id": mongoose.Types.ObjectId(),
    "name": Constants.General.GODSTAFF,
    "routes": Constants.Routes.listAllRoutes(),
};

const hackerRole = {
    "_id": mongoose.Types.ObjectId(),
    "name": Constants.General.HACKER,
    "routes": [
        Constants.Routes.authRoutes.login,
        Constants.Routes.authRoutes.logout,
        Constants.Routes.authRoutes.getSelfRoleBindindings,

        Constants.Routes.accountRoutes.getSelf,
        Constants.Routes.accountRoutes.getSelfById,
        Constants.Routes.accountRoutes.patchSelfById,

        Constants.Routes.hackerRoutes.post,
        Constants.Routes.hackerRoutes.getSelfById,
        Constants.Routes.hackerRoutes.getSelfResumeById,
        Constants.Routes.hackerRoutes.patchSelfById,
    ]
};

const volunteerRole = {
    "_id": mongoose.Types.ObjectId(),
    "name": Constants.General.VOLUNTEER,
    "routes": [
        Constants.Routes.authRoutes.login,
        Constants.Routes.authRoutes.logout,
        Constants.Routes.authRoutes.getSelfRoleBindindings,

        Constants.Routes.volunteerRoutes.post,
    ]
};

const sponsorT1Role = {
    "_id": mongoose.Types.ObjectId(),
    "name": Constants.General.SPONSOR_T1,
    "routes": [
        Constants.Routes.authRoutes.login,
        Constants.Routes.authRoutes.logout,
        Constants.Routes.authRoutes.getSelfRoleBindindings,

        Constants.Routes.sponsorRoutes.post,
        Constants.Routes.sponsorRoutes.getSelfById,
    ]
};

const sponsorT2Role = {
    "_id": mongoose.Types.ObjectId(),
    "name": Constants.General.SPONSOR_T2,
    "routes": [
        Constants.Routes.authRoutes.login,
        Constants.Routes.authRoutes.logout,
        Constants.Routes.authRoutes.getSelfRoleBindindings,

        Constants.Routes.sponsorRoutes.post,
        Constants.Routes.sponsorRoutes.getSelfById,
    ]
};

const sponsorT3Role = {
    "_id": mongoose.Types.ObjectId(),
    "name": Constants.General.SPONSOR_T3,
    "routes": [
        Constants.Routes.authRoutes.login,
        Constants.Routes.authRoutes.logout,
        Constants.Routes.authRoutes.getSelfRoleBindindings,

        Constants.Routes.sponsorRoutes.post,
        Constants.Routes.sponsorRoutes.getSelfById,
    ]
};

const sponsorT4Role = {
    "_id": mongoose.Types.ObjectId(),
    "name": Constants.General.SPONSOR_T4,
    "routes": [
        Constants.Routes.authRoutes.login,
        Constants.Routes.authRoutes.logout,
        Constants.Routes.authRoutes.getSelfRoleBindindings,

        Constants.Routes.sponsorRoutes.post,
        Constants.Routes.sponsorRoutes.getSelfById,
    ]
};

const sponsorT5Role = {
    "_id": mongoose.Types.ObjectId(),
    "name": Constants.General.SPONSOR_T5,
    "routes": [
        Constants.Routes.authRoutes.login,
        Constants.Routes.authRoutes.logout,
        Constants.Routes.authRoutes.getSelfRoleBindindings,

        Constants.Routes.sponsorRoutes.post,
        Constants.Routes.sponsorRoutes.getSelfById,
    ]
};

const singularRoles = createAllSingularRoles();
const allRolesObject = createAllRoles();
const allRolesArray = Object.values(allRolesObject);

// creates the roles that are just one uri + request type
function createAllSingularRoles() {
    const allRoutes = Constants.Routes.allRoutes;
    let roles = [];

    for (let routeGroupKey in allRoutes) {

        if (!allRoutes.hasOwnProperty(routeGroupKey)) {
            continue;
        }

        const routeGroup = allRoutes[routeGroupKey];
        for (let routeKey in routeGroup) {
            if (!routeGroup.hasOwnProperty(routeKey)) {
                continue;
            }

            let role = {
                _id: mongoose.Types.ObjectId(),
                name: routeKey + routeGroupKey,
                routes: routeGroup[routeKey],
            };
            let roleName = role.name;
            roles[roleName] = role;
        }
    }

    return roles;
}

// creates object with all the roles, both singular and of a type (ex hacker)
function createAllRoles() {
    let allRolesObject = {
        adminRole: adminRole,
        hackerRole: hackerRole,
        volunteerRole: volunteerRole,
        sponsorT1Role: sponsorT1Role,
        sponsorT2Role: sponsorT2Role,
        sponsorT3Role: sponsorT3Role,
        sponsorT4Role: sponsorT4Role,
        sponsorT5Role: sponsorT5Role
    };

    const singularRoles = createAllSingularRoles();
    for (let role in singularRoles) {
        if (!singularRoles.hasOwnProperty(role)) {
            continue;
        }
        allRolesObject[role] = singularRoles[role];
    }

    return allRolesObject;
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
    allRolesObject: allRolesObject,
    allRolesArray: allRolesArray,
    createAllSingularRoles: createAllSingularRoles,
    createAllRoles: createAllRoles,
};