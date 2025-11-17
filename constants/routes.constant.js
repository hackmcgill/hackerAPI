"use strict";

/**
 * ===***===***===***===***===***===***===***===***===
 * ===***===   PLEASE READ BEFORE EDITING    ===***===
 * ===***===***===***===***===***===***===***===***===
 *
 * If you are adding a route to this list, update this number
 * next avaiable createFromTime value: 180
 *
 * If you are deleting a route from this list, please add the ID to the list of 'reserved' IDs,
 * so that we don't accidentally assign someone to a given ID.
 * reserved createFromTime values:
 */

const Constants = require("./general.constant");
const mongoose = require("mongoose");

const authRoutes = {
    login: {
        requestType: Constants.REQUEST_TYPES.POST,
        uri: "/api/auth/login",
        _id: mongoose.Types.ObjectId.createFromTime(100),
    },
    logout: {
        requestType: Constants.REQUEST_TYPES.POST,
        uri: "/api/auth/logout",
        _id: mongoose.Types.ObjectId.createFromTime(101),
    },
    getSelfRoleBindindings: {
        requestType: Constants.REQUEST_TYPES.GET,
        uri: "/api/auth/rolebindings/" + Constants.ROLE_CATEGORIES.SELF,
        _id: mongoose.Types.ObjectId.createFromTime(102),
    },
    getAnyRoleBindings: {
        requestType: Constants.REQUEST_TYPES.GET,
        uri: "/api/auth/rolebindings/" + Constants.ROLE_CATEGORIES.ALL,
        _id: mongoose.Types.ObjectId.createFromTime(103),
    },
    changePassword: {
        requestType: Constants.REQUEST_TYPES.PATCH,
        uri: "/api/auth/password/change",
        _id: mongoose.Types.ObjectId.createFromTime(104),
    },
};

const accountRoutes = {
    getSelf: {
        requestType: Constants.REQUEST_TYPES.GET,
        uri: "/api/account/self",
        _id: mongoose.Types.ObjectId.createFromTime(105),
    },
    getSelfById: {
        requestType: Constants.REQUEST_TYPES.GET,
        uri: "/api/account/" + Constants.ROLE_CATEGORIES.SELF,
        _id: mongoose.Types.ObjectId.createFromTime(106),
    },
    getAnyById: {
        requestType: Constants.REQUEST_TYPES.GET,
        uri: "/api/account/" + Constants.ROLE_CATEGORIES.ALL,
        _id: mongoose.Types.ObjectId.createFromTime(107),
    },
    post: {
        requestType: Constants.REQUEST_TYPES.POST,
        uri: "/api/account/",
        _id: mongoose.Types.ObjectId.createFromTime(108),
    },
    patchSelfById: {
        requestType: Constants.REQUEST_TYPES.PATCH,
        uri: "/api/account/" + Constants.ROLE_CATEGORIES.SELF,
        _id: mongoose.Types.ObjectId.createFromTime(109),
    },
    patchAnyById: {
        requestType: Constants.REQUEST_TYPES.PATCH,
        uri: "/api/account/" + Constants.ROLE_CATEGORIES.ALL,
        _id: mongoose.Types.ObjectId.createFromTime(110),
    },
    inviteAccount: {
        requestType: Constants.REQUEST_TYPES.POST,
        uri: "/api/account/invite",
        _id: mongoose.Types.ObjectId.createFromTime(111),
    },
};

const hackerRoutes = {
    getSelf: {
        requestType: Constants.REQUEST_TYPES.GET,
        uri: "/api/hacker/self/",
        _id: mongoose.Types.ObjectId.createFromTime(112),
    },
    getSelfById: {
        requestType: Constants.REQUEST_TYPES.GET,
        uri: "/api/hacker/" + Constants.ROLE_CATEGORIES.SELF,
        _id: mongoose.Types.ObjectId.createFromTime(113),
    },
    getAnyById: {
        requestType: Constants.REQUEST_TYPES.GET,
        uri: "/api/hacker/" + Constants.ROLE_CATEGORIES.ALL,
        _id: mongoose.Types.ObjectId.createFromTime(114),
    },
    getSelfByEmail: {
        requestType: Constants.REQUEST_TYPES.GET,
        uri: "/api/hacker/email/" + Constants.ROLE_CATEGORIES.SELF,
        _id: mongoose.Types.ObjectId.createFromTime(115),
    },
    getAnyByEmail: {
        requestType: Constants.REQUEST_TYPES.GET,
        uri: "/api/hacker/email/" + Constants.ROLE_CATEGORIES.ALL,
        _id: mongoose.Types.ObjectId.createFromTime(116),
    },
    getSelfResumeById: {
        requestType: Constants.REQUEST_TYPES.GET,
        uri: "/api/hacker/resume/" + Constants.ROLE_CATEGORIES.SELF,
        _id: mongoose.Types.ObjectId.createFromTime(117),
    },
    getAnyResumeById: {
        requestType: Constants.REQUEST_TYPES.GET,
        uri: "/api/hacker/resume/" + Constants.ROLE_CATEGORIES.ALL,
        _id: mongoose.Types.ObjectId.createFromTime(118),
    },
    post: {
        requestType: Constants.REQUEST_TYPES.POST,
        uri: "/api/hacker/",
        _id: mongoose.Types.ObjectId.createFromTime(119),
    },
    postSelfResumeById: {
        requestType: Constants.REQUEST_TYPES.POST,
        uri: "/api/hacker/resume/" + Constants.ROLE_CATEGORIES.SELF,
        _id: mongoose.Types.ObjectId.createFromTime(120),
    },
    postAnyResumeById: {
        requestType: Constants.REQUEST_TYPES.POST,
        uri: "/api/hacker/resume/" + Constants.ROLE_CATEGORIES.ALL,
        _id: mongoose.Types.ObjectId.createFromTime(121),
    },
    patchSelfById: {
        requestType: Constants.REQUEST_TYPES.PATCH,
        uri: "/api/hacker/" + Constants.ROLE_CATEGORIES.SELF,
        _id: mongoose.Types.ObjectId.createFromTime(122),
    },
    patchAnyById: {
        requestType: Constants.REQUEST_TYPES.PATCH,
        uri: "/api/hacker/" + Constants.ROLE_CATEGORIES.ALL,
        _id: mongoose.Types.ObjectId.createFromTime(123),
    },
    patchAnyStatusById: {
        requestType: Constants.REQUEST_TYPES.PATCH,
        uri: "/api/hacker/status/" + Constants.ROLE_CATEGORIES.ALL,
        _id: mongoose.Types.ObjectId.createFromTime(124),
    },
    patchSelfStatusById: {
        requestType: Constants.REQUEST_TYPES.PATCH,
        uri: "/api/hacker/status/" + Constants.ROLE_CATEGORIES.SELF,
        _id: mongoose.Types.ObjectId.createFromTime(125),
    },
    patchAnyReviewerStatusById: {
        requestType: Constants.REQUEST_TYPES.PATCH,
        uri: "/api/hacker/reviewerStatus/" + Constants.ROLE_CATEGORIES.ALL,
        _id: mongoose.Types.ObjectId.createFromTime(168)
    },
    patchSelfReviewerStatusById: {
        requestType: Constants.REQUEST_TYPES.PATCH,
        uri: "/api/hacker/reviewerStatus/" + Constants.ROLE_CATEGORIES.SELF,
        _id: mongoose.Types.ObjectId.createFromTime(169)
    },
    patchAnyReviewerStatus2ById: {
        requestType: Constants.REQUEST_TYPES.PATCH,
        uri: "/api/hacker/reviewerStatus2/" + Constants.ROLE_CATEGORIES.ALL,
        _id: mongoose.Types.ObjectId.createFromTime(170)
    },
    patchSelfReviewerStatus2ById: {
        requestType: Constants.REQUEST_TYPES.PATCH,
        uri: "/api/hacker/reviewerStatus2/" + Constants.ROLE_CATEGORIES.SELF,
        _id: mongoose.Types.ObjectId.createFromTime(171)
    },
    patchAnyReviewerNameById: {
        requestType: Constants.REQUEST_TYPES.PATCH,
        uri: "/api/hacker/reviewerName/" + Constants.ROLE_CATEGORIES.ALL,
        _id: mongoose.Types.ObjectId.createFromTime(172)
    },
    patchSelfReviewerNameById: {
        requestType: Constants.REQUEST_TYPES.PATCH,
        uri: "/api/hacker/reviewerName/" + Constants.ROLE_CATEGORIES.SELF,
        _id: mongoose.Types.ObjectId.createFromTime(173)
    },
    patchAnyReviewerName2ById: {
        requestType: Constants.REQUEST_TYPES.PATCH,
        uri: "/api/hacker/reviewerName2/" + Constants.ROLE_CATEGORIES.ALL,
        _id: mongoose.Types.ObjectId.createFromTime(174)
    },
    patchSelfReviewerName2ById: {
        requestType: Constants.REQUEST_TYPES.PATCH,
        uri: "/api/hacker/reviewerName2/" + Constants.ROLE_CATEGORIES.SELF,
        _id: mongoose.Types.ObjectId.createFromTime(175)
    },
    patchAnyReviewerCommentsById: {
        requestType: Constants.REQUEST_TYPES.PATCH,
        uri: "/api/hacker/reviewerComments/" + Constants.ROLE_CATEGORIES.ALL,
        _id: mongoose.Types.ObjectId.createFromTime(176)
    },
    patchSelfReviewerCommentsById: {
        requestType: Constants.REQUEST_TYPES.PATCH,
        uri: "/api/hacker/reviewerComments/" + Constants.ROLE_CATEGORIES.SELF,
        _id: mongoose.Types.ObjectId.createFromTime(177)
    },
    patchAnyReviewerComments2ById: {
        requestType: Constants.REQUEST_TYPES.PATCH,
        uri: "/api/hacker/reviewerComments2/" + Constants.ROLE_CATEGORIES.ALL,
        _id: mongoose.Types.ObjectId.createFromTime(178)
    },
    patchSelfReviewerComments2ById: {
        requestType: Constants.REQUEST_TYPES.PATCH,
        uri: "/api/hacker/reviewerComments2/" + Constants.ROLE_CATEGORIES.SELF,
        _id: mongoose.Types.ObjectId.createFromTime(179)
    },
    patchSelfCheckInById: {
        requestType: Constants.REQUEST_TYPES.PATCH,
        uri: "/api/hacker/checkin/" + Constants.ROLE_CATEGORIES.SELF,
        _id: mongoose.Types.ObjectId.createFromTime(126),
    },
    patchAnyCheckInById: {
        requestType: Constants.REQUEST_TYPES.PATCH,
        uri: "/api/hacker/checkin/" + Constants.ROLE_CATEGORIES.ALL,
        _id: mongoose.Types.ObjectId.createFromTime(127),
    },
    patchSelfConfirmationById: {
        requestType: Constants.REQUEST_TYPES.PATCH,
        uri: "/api/hacker/confirmation/" + Constants.ROLE_CATEGORIES.SELF,
        _id: mongoose.Types.ObjectId.createFromTime(128),
    },
    patchAcceptHackerById: {
        requestType: Constants.REQUEST_TYPES.PATCH,
        uri: "/api/hacker/accept/" + Constants.ROLE_CATEGORIES.ALL,
        _id: mongoose.Types.ObjectId.createFromTime(129),
    },
    patchAcceptHackerByEmail: {
        requestType: Constants.REQUEST_TYPES.PATCH,
        uri: "/api/hacker/acceptEmail/" + Constants.ROLE_CATEGORIES.ALL,
        _id: mongoose.Types.ObjectId.createFromTime(130),
    },
    patchAcceptHackerByArrayOfIds: {
        requestType: Constants.REQUEST_TYPES.PATCH,
        uri: "/api/hacker/batchAccept",
        _id: mongoose.Types.ObjectId.createFromTime(165),
    },
    postAnySendWeekOfEmail: {
        requestType: Constants.REQUEST_TYPES.POST,
        uri: "/api/hacker/email/weekOf/" + Constants.ROLE_CATEGORIES.ALL,
        _id: mongoose.Types.ObjectId.createFromTime(131),
    },
    postSelfSendWeekOfEmail: {
        requestType: Constants.REQUEST_TYPES.POST,
        uri: "/api/hacker/email/weekOf/" + Constants.ROLE_CATEGORIES.SELF,
        _id: mongoose.Types.ObjectId.createFromTime(132),
    },
    postAnySendDayOfEmail: {
        requestType: Constants.REQUEST_TYPES.POST,
        uri: "/api/hacker/email/dayOf/" + Constants.ROLE_CATEGORIES.ALL,
        _id: mongoose.Types.ObjectId.createFromTime(133),
    },
    postSelfSendDayOfEmail: {
        requestType: Constants.REQUEST_TYPES.POST,
        uri: "/api/hacker/email/dayOf/" + Constants.ROLE_CATEGORIES.SELF,
        _id: mongoose.Types.ObjectId.createFromTime(134),
    },
    // },
    // postDiscord: {
    //     requestType: Constants.REQUEST_TYPES.POST,
    //     uri: "/api/hacker/discord",
    //     _id: mongoose.Types.ObjectId.createFromTime(167)
    // }
};

const travelRoutes = {
    getSelf: {
        requestType: Constants.REQUEST_TYPES.GET,
        uri: "/api/travel/self/",
        _id: mongoose.Types.ObjectId.createFromTime(135),
    },
    getSelfById: {
        requestType: Constants.REQUEST_TYPES.GET,
        uri: "/api/travel/" + Constants.ROLE_CATEGORIES.SELF,
        _id: mongoose.Types.ObjectId.createFromTime(136),
    },
    getAnyById: {
        requestType: Constants.REQUEST_TYPES.GET,
        uri: "/api/travel/" + Constants.ROLE_CATEGORIES.ALL,
        _id: mongoose.Types.ObjectId.createFromTime(137),
    },
    getSelfByEmail: {
        requestType: Constants.REQUEST_TYPES.GET,
        uri: "/api/travel/email/" + Constants.ROLE_CATEGORIES.SELF,
        _id: mongoose.Types.ObjectId.createFromTime(138),
    },
    getAnyByEmail: {
        requestType: Constants.REQUEST_TYPES.GET,
        uri: "/api/travel/email/" + Constants.ROLE_CATEGORIES.ALL,
        _id: mongoose.Types.ObjectId.createFromTime(139),
    },
    post: {
        requestType: Constants.REQUEST_TYPES.POST,
        uri: "/api/travel/",
        _id: mongoose.Types.ObjectId.createFromTime(140),
    },
    patchAnyStatusById: {
        requestType: Constants.REQUEST_TYPES.PATCH,
        uri: "/api/travel/status/" + Constants.ROLE_CATEGORIES.ALL,
        _id: mongoose.Types.ObjectId.createFromTime(141),
    },
    patchAnyOfferById: {
        requestType: Constants.REQUEST_TYPES.PATCH,
        uri: "/api/travel/offer/" + Constants.ROLE_CATEGORIES.ALL,
        _id: mongoose.Types.ObjectId.createFromTime(142),
    },
};

const sponsorRoutes = {
    getSelf: {
        requestType: Constants.REQUEST_TYPES.GET,
        uri: "/api/sponsor/self/",
        _id: mongoose.Types.ObjectId.createFromTime(143),
    },
    getSelfById: {
        requestType: Constants.REQUEST_TYPES.GET,
        uri: "/api/sponsor/" + Constants.ROLE_CATEGORIES.SELF,
        _id: mongoose.Types.ObjectId.createFromTime(144),
    },
    getAnyById: {
        requestType: Constants.REQUEST_TYPES.GET,
        uri: "/api/sponsor/" + Constants.ROLE_CATEGORIES.ALL,
        _id: mongoose.Types.ObjectId.createFromTime(145),
    },
    post: {
        requestType: Constants.REQUEST_TYPES.POST,
        uri: "/api/sponsor/",
        _id: mongoose.Types.ObjectId.createFromTime(146),
    },
    patchSelfById: {
        requestType: Constants.REQUEST_TYPES.PATCH,
        uri: "/api/sponsor/" + Constants.ROLE_CATEGORIES.SELF,
        _id: mongoose.Types.ObjectId.createFromTime(147),
    },
    patchAnyById: {
        requestType: Constants.REQUEST_TYPES.PATCH,
        uri: "/api/sponsor/" + Constants.ROLE_CATEGORIES.ALL,
        _id: mongoose.Types.ObjectId.createFromTime(148),
    },
};

const teamRoutes = {
    get: {
        requestType: Constants.REQUEST_TYPES.GET,
        uri: "/api/team/" + Constants.ROLE_CATEGORIES.ALL,
        _id: mongoose.Types.ObjectId.createFromTime(149),
    },
    post: {
        requestType: Constants.REQUEST_TYPES.POST,
        uri: "/api/team/",
        _id: mongoose.Types.ObjectId.createFromTime(150),
    },
    join: {
        requestType: Constants.REQUEST_TYPES.PATCH,
        uri: "/api/team/join/",
        _id: mongoose.Types.ObjectId.createFromTime(151),
    },
    patchSelfById: {
        requestType: Constants.REQUEST_TYPES.PATCH,
        uri: "/api/team/" + Constants.ROLE_CATEGORIES.SELF,
        _id: mongoose.Types.ObjectId.createFromTime(152),
    },
    patchAnyById: {
        requestType: Constants.REQUEST_TYPES.PATCH,
        uri: "/api/team/" + Constants.ROLE_CATEGORIES.ALL,
        _id: mongoose.Types.ObjectId.createFromTime(153),
    },
    leave: {
        requestType: Constants.REQUEST_TYPES.PATCH,
        uri: "/api/team/leave/",
        _id: mongoose.Types.ObjectId.createFromTime(154),
    },
};

const volunteerRoutes = {
    getSelfById: {
        requestType: Constants.REQUEST_TYPES.GET,
        uri: "/api/volunteer/" + Constants.ROLE_CATEGORIES.SELF,
        _id: mongoose.Types.ObjectId.createFromTime(155),
    },
    getAnyById: {
        requestType: Constants.REQUEST_TYPES.GET,
        uri: "/api/volunteer/" + Constants.ROLE_CATEGORIES.ALL,
        _id: mongoose.Types.ObjectId.createFromTime(156),
    },
    post: {
        requestType: Constants.REQUEST_TYPES.POST,
        uri: "/api/volunteer/",
        _id: mongoose.Types.ObjectId.createFromTime(157),
    },
};

const roleRoutes = {
    post: {
        requestType: Constants.REQUEST_TYPES.POST,
        uri: "/api/role/",
        _id: mongoose.Types.ObjectId.createFromTime(158),
    },
};

const searchRoutes = {
    get: {
        requestType: Constants.REQUEST_TYPES.GET,
        uri: "/api/search/",
        _id: mongoose.Types.ObjectId.createFromTime(159),
    },
};

const staffRoutes = {
    hackerStats: {
        requestType: Constants.REQUEST_TYPES.GET,
        uri: "/api/hacker/stats",
        _id: mongoose.Types.ObjectId.createFromTime(160),
    },
    postInvite: {
        requestType: Constants.REQUEST_TYPES.POST,
        uri: "/api/account/invite",
        _id: mongoose.Types.ObjectId.createFromTime(161),
    },
    getInvite: {
        requestType: Constants.REQUEST_TYPES.GET,
        uri: "/api/account/invite",
        _id: mongoose.Types.ObjectId.createFromTime(162),
    },
    postDiscord: {
        requestType: Constants.REQUEST_TYPES.POST,
        uri: "/api/hacker/discord",
        _id: mongoose.Types.ObjectId.createFromTime(167),
    },
    postAutomatedStatusEmails: {
        requestType: Constants.REQUEST_TYPES.POST,
        uri: "/api/email/automated/status/:status",
        _id: mongoose.Types.ObjectId.createFromTime(168),
    },
    getAutomatedStatusEmailCount: {
        requestType: Constants.REQUEST_TYPES.GET,
        uri: "/api/email/automated/status/:status/count",
        _id: mongoose.Types.ObjectId.createFromTime(169),
    },
};

const settingsRoutes = {
    getSettings: {
        requestType: Constants.REQUEST_TYPES.GET,
        uri: "/api/settings",
        _id: mongoose.Types.ObjectId.createFromTime(163),
    },
    patchSettings: {
        requestType: Constants.REQUEST_TYPES.PATCH,
        uri: "/api/settings",
        _id: mongoose.Types.ObjectId.createFromTime(164),
    },
};

const allRoutes = {
    Auth: authRoutes,
    Account: accountRoutes,
    Hacker: hackerRoutes,
    Travel: travelRoutes,
    Sponsor: sponsorRoutes,
    Team: teamRoutes,
    Volunteer: volunteerRoutes,
    Role: roleRoutes,
    Search: searchRoutes,
    Settings: settingsRoutes,
    Staff: staffRoutes,
};

/**
 * returns all the routes as a list
 * @param {boolean} includeId whether to include _id in the returned route object.
 * @return {{requestType: string, uri: string, id?: ObjectId}[]}
 */
function listAllRoutes(includeId = true) {
    let routes = [];

    for (let routeGroupKey in allRoutes) {
        if (!Object.prototype.hasOwnProperty.call(allRoutes, routeGroupKey)) {
            continue;
        }

        const routeGroup = allRoutes[routeGroupKey];
        for (let routeKey in routeGroup) {
            if (!Object.prototype.hasOwnProperty.call(routeGroup, routeKey)) {
                continue;
            }

            const route = {};
            // copy only over the attributes that we care about
            route.requestType = routeGroup[routeKey].requestType;
            route.uri = routeGroup[routeKey].uri;
            if (includeId) route._id = routeGroup[routeKey]._id;

            routes.push(route);
        }
    }

    return routes;
}

module.exports = {
    authRoutes: authRoutes,
    accountRoutes: accountRoutes,
    hackerRoutes: hackerRoutes,
    travelRoutes: travelRoutes,
    sponsorRoutes: sponsorRoutes,
    teamRoutes: teamRoutes,
    volunteerRoutes: volunteerRoutes,
    roleRoutes: roleRoutes,
    searchRoutes: searchRoutes,
    settingsRoutes: settingsRoutes,
    staffRoutes: staffRoutes,
    allRoutes: allRoutes,
    listAllRoutes: listAllRoutes,
};
