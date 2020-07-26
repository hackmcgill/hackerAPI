"use strict";
const Constants = {
    General: require("./general.constant"),
    Routes: require("./routes.constant")
};
const mongoose = require("mongoose");

const accountRole = {
    _id: mongoose.Types.ObjectId("00000000e285ec4f6ec7e5c2"),
    name: "account",
    routes: [
        Constants.Routes.authRoutes.login,
        Constants.Routes.authRoutes.logout,
        Constants.Routes.authRoutes.changePassword,
        Constants.Routes.authRoutes.getSelfRoleBindindings,
        Constants.Routes.accountRoutes.getSelf,
        Constants.Routes.accountRoutes.getSelfById,
        Constants.Routes.accountRoutes.patchSelfById,
        Constants.Routes.settingsRoutes.getSettings
    ]
};

const adminRole = {
    _id: mongoose.Types.ObjectId.createFromTime(1),
    name: Constants.General.STAFF,
    routes: Constants.Routes.listAllRoutes()
};

const hackerRole = {
    _id: mongoose.Types.ObjectId.createFromTime(2),
    name: Constants.General.HACKER,
    routes: [
        Constants.Routes.hackerRoutes.post,
        Constants.Routes.hackerRoutes.getSelfById,
        Constants.Routes.hackerRoutes.getSelfByEmail,
        Constants.Routes.hackerRoutes.getSelfResumeById,
        Constants.Routes.hackerRoutes.patchSelfById,
        Constants.Routes.hackerRoutes.patchSelfConfirmationById,
        Constants.Routes.hackerRoutes.getSelf,

        Constants.Routes.travelRoutes.getSelf,
        Constants.Routes.travelRoutes.getSelfById,
        Constants.Routes.travelRoutes.getSelfByEmail,

        Constants.Routes.teamRoutes.join,
        Constants.Routes.teamRoutes.patchSelfById,
        Constants.Routes.teamRoutes.post,
        Constants.Routes.teamRoutes.get,
        Constants.Routes.teamRoutes.leave
    ]
};

const volunteerRole = {
    _id: mongoose.Types.ObjectId.createFromTime(3),
    name: Constants.General.VOLUNTEER,
    routes: [
        Constants.Routes.volunteerRoutes.getSelfById,
        Constants.Routes.volunteerRoutes.post,

        Constants.Routes.hackerRoutes.patchAnyCheckInById,
        Constants.Routes.hackerRoutes.patchSelfCheckInById,

        Constants.Routes.teamRoutes.get
    ]
};

const sponsorT1Role = {
    _id: mongoose.Types.ObjectId.createFromTime(4),
    name: Constants.General.SPONSOR_T1,
    routes: [
        Constants.Routes.sponsorRoutes.post,
        Constants.Routes.sponsorRoutes.getSelfById,
        Constants.Routes.sponsorRoutes.getSelf,
        Constants.Routes.sponsorRoutes.patchSelfById,

        Constants.Routes.searchRoutes.get,
        Constants.Routes.accountRoutes.getAnyById,
        Constants.Routes.hackerRoutes.getAnyById
    ]
};

const sponsorT2Role = {
    _id: mongoose.Types.ObjectId.createFromTime(5),
    name: Constants.General.SPONSOR_T2,
    routes: [
        Constants.Routes.sponsorRoutes.post,
        Constants.Routes.sponsorRoutes.getSelfById,
        Constants.Routes.sponsorRoutes.getSelf,
        Constants.Routes.sponsorRoutes.patchSelfById,

        Constants.Routes.searchRoutes.get,
        Constants.Routes.accountRoutes.getAnyById,
        Constants.Routes.hackerRoutes.getAnyById
    ]
};

const sponsorT3Role = {
    _id: mongoose.Types.ObjectId.createFromTime(6),
    name: Constants.General.SPONSOR_T3,
    routes: [
        Constants.Routes.sponsorRoutes.post,
        Constants.Routes.sponsorRoutes.getSelfById,
        Constants.Routes.sponsorRoutes.getSelf,
        Constants.Routes.sponsorRoutes.patchSelfById,

        Constants.Routes.searchRoutes.get,
        Constants.Routes.accountRoutes.getAnyById,
        Constants.Routes.hackerRoutes.getAnyById
    ]
};

const sponsorT4Role = {
    _id: mongoose.Types.ObjectId.createFromTime(7),
    name: Constants.General.SPONSOR_T4,
    routes: [
        Constants.Routes.sponsorRoutes.post,
        Constants.Routes.sponsorRoutes.getSelfById,
        Constants.Routes.sponsorRoutes.getSelf,
        Constants.Routes.sponsorRoutes.patchSelfById,

        Constants.Routes.searchRoutes.get,
        Constants.Routes.accountRoutes.getAnyById,
        Constants.Routes.hackerRoutes.getAnyById
    ]
};

const sponsorT5Role = {
    _id: mongoose.Types.ObjectId.createFromTime(8),
    name: Constants.General.SPONSOR_T5,
    routes: [
        Constants.Routes.sponsorRoutes.post,
        Constants.Routes.sponsorRoutes.getSelfById,
        Constants.Routes.sponsorRoutes.getSelf,
        Constants.Routes.sponsorRoutes.patchSelfById,

        Constants.Routes.searchRoutes.get,
        Constants.Routes.accountRoutes.getAnyById,
        Constants.Routes.hackerRoutes.getAnyById
    ]
};

const singularRoles = createAllSingularRoles();
const allRolesObject = createAllRoles();
const allRolesArray = Object.values(allRolesObject);

/**
 * Creates all the roles that are of a specific uri and request type
 * @return {Role[]}
 */
function createAllSingularRoles() {
    const allRoutes = Constants.Routes.allRoutes;
    let roles = [];

    for (let routeGroupKey in allRoutes) {
        if (!Object.prototype.hasOwnProperty.call(allRoutes, routeGroupKey)) {
            continue;
        }

        const routeGroup = allRoutes[routeGroupKey];
        for (let routeKey in routeGroup) {
            // Iterating through the attributes in the routeGroup object
            if (!Object.prototype.hasOwnProperty.call(routeGroup, routeKey)) {
                // Avoid all prototype attributes
                continue;
            }

            let role = {
                _id: routeGroup[routeKey]._id,
                name: routeKey + routeGroupKey,
                routes: routeGroup[routeKey]
            };
            let roleName = role.name;
            roles[roleName] = role;
        }
    }

    return roles;
}

/**
 * creates object with all the roles, both singular and of a type (ex hacker)
 * @return {*}
 */
function createAllRoles() {
    let allRolesObject = {
        accountRole: accountRole,
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
        if (!Object.prototype.hasOwnProperty.call(singularRoles, role)) {
            continue;
        }
        allRolesObject[role] = singularRoles[role];
    }

    return allRolesObject;
}

module.exports = {
    accountRole: accountRole,
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
    createAllRoles: createAllRoles
};
