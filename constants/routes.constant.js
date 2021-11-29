"use strict";

/**
 * ===***===***===***===***===***===***===***===***===
 * ===***===   PLEASE READ BEFORE EDITING    ===***===
 * ===***===***===***===***===***===***===***===***===
 *
 * If you are adding a route to this list, update this number
 * next avaiable createFromTime value: 166
 *
 * If you are deleting a route from this list, please add the ID to the list of 'reserved' IDs,
 * so that we don't accidentally assign someone to a given ID.
 * reserved createFromTime values:
 */

const Constants = require("./general.constant");

const authRoutes = {
    login: {
        requestType: Constants.REQUEST_TYPES.POST,
        uri: "/api/auth/login",
        _id: 100
    },
    logout: {
        requestType: Constants.REQUEST_TYPES.POST,
        uri: "/api/auth/logout",
        _id: 101
    },
    getSelfRoleBindindings: {
        requestType: Constants.REQUEST_TYPES.GET,
        uri: "/api/auth/rolebindings/" + Constants.ROLE_CATEGORIES.SELF,
        _id: 102
    },
    getAnyRoleBindings: {
        requestType: Constants.REQUEST_TYPES.GET,
        uri: "/api/auth/rolebindings/" + Constants.ROLE_CATEGORIES.ALL,
        _id: 103
    },
    changePassword: {
        requestType: Constants.REQUEST_TYPES.PATCH,
        uri: "/api/auth/password/change",
        _id: 104
    }
};

const accountRoutes = {
    getSelf: {
        requestType: Constants.REQUEST_TYPES.GET,
        uri: "/api/account/self",
        _id: 105
    },
    getSelfById: {
        requestType: Constants.REQUEST_TYPES.GET,
        uri: "/api/account/" + Constants.ROLE_CATEGORIES.SELF,
        _id: 106
    },
    getAnyById: {
        requestType: Constants.REQUEST_TYPES.GET,
        uri: "/api/account/" + Constants.ROLE_CATEGORIES.ALL,
        _id: 107
    },
    post: {
        requestType: Constants.REQUEST_TYPES.POST,
        uri: "/api/account/",
        _id: 108
    },
    patchSelfById: {
        requestType: Constants.REQUEST_TYPES.PATCH,
        uri: "/api/account/" + Constants.ROLE_CATEGORIES.SELF,
        _id: 109
    },
    patchAnyById: {
        requestType: Constants.REQUEST_TYPES.PATCH,
        uri: "/api/account/" + Constants.ROLE_CATEGORIES.ALL,
        _id: 110
    },
    inviteAccount: {
        requestType: Constants.REQUEST_TYPES.POST,
        uri: "/api/account/invite",
        _id: 111
    }
};

const hackerRoutes = {
    getSelf: {
        requestType: Constants.REQUEST_TYPES.GET,
        uri: "/api/hacker/self/",
        _id: 112
    },
    getSelfById: {
        requestType: Constants.REQUEST_TYPES.GET,
        uri: "/api/hacker/" + Constants.ROLE_CATEGORIES.SELF,
        _id: 113
    },
    getAnyById: {
        requestType: Constants.REQUEST_TYPES.GET,
        uri: "/api/hacker/" + Constants.ROLE_CATEGORIES.ALL,
        _id: 114
    },
    getSelfByEmail: {
        requestType: Constants.REQUEST_TYPES.GET,
        uri: "/api/hacker/email/" + Constants.ROLE_CATEGORIES.SELF,
        _id: 115
    },
    getAnyByEmail: {
        requestType: Constants.REQUEST_TYPES.GET,
        uri: "/api/hacker/email/" + Constants.ROLE_CATEGORIES.ALL,
        _id: 116
    },
    getSelfResumeById: {
        requestType: Constants.REQUEST_TYPES.GET,
        uri: "/api/hacker/resume/" + Constants.ROLE_CATEGORIES.SELF,
        _id: 117
    },
    getAnyResumeById: {
        requestType: Constants.REQUEST_TYPES.GET,
        uri: "/api/hacker/resume/" + Constants.ROLE_CATEGORIES.ALL,
        _id: 118
    },
    post: {
        requestType: Constants.REQUEST_TYPES.POST,
        uri: "/api/hacker/",
        _id: 119
    },
    postSelfResumeById: {
        requestType: Constants.REQUEST_TYPES.POST,
        uri: "/api/hacker/resume/" + Constants.ROLE_CATEGORIES.SELF,
        _id: 120
    },
    postAnyResumeById: {
        requestType: Constants.REQUEST_TYPES.POST,
        uri: "/api/hacker/resume/" + Constants.ROLE_CATEGORIES.ALL,
        _id: 121
    },
    patchSelfById: {
        requestType: Constants.REQUEST_TYPES.PATCH,
        uri: "/api/hacker/" + Constants.ROLE_CATEGORIES.SELF,
        _id: 122
    },
    patchAnyById: {
        requestType: Constants.REQUEST_TYPES.PATCH,
        uri: "/api/hacker/" + Constants.ROLE_CATEGORIES.ALL,
        _id: 123
    },
    patchAnyStatusById: {
        requestType: Constants.REQUEST_TYPES.PATCH,
        uri: "/api/hacker/status/" + Constants.ROLE_CATEGORIES.ALL,
        _id: 124
    },
    patchSelfStatusById: {
        requestType: Constants.REQUEST_TYPES.PATCH,
        uri: "/api/hacker/status/" + Constants.ROLE_CATEGORIES.SELF,
        _id: 125
    },
    patchSelfCheckInById: {
        requestType: Constants.REQUEST_TYPES.PATCH,
        uri: "/api/hacker/checkin/" + Constants.ROLE_CATEGORIES.SELF,
        _id: 126
    },
    patchAnyCheckInById: {
        requestType: Constants.REQUEST_TYPES.PATCH,
        uri: "/api/hacker/checkin/" + Constants.ROLE_CATEGORIES.ALL,
        _id: 127
    },
    patchSelfConfirmationById: {
        requestType: Constants.REQUEST_TYPES.PATCH,
        uri: "/api/hacker/confirmation/" + Constants.ROLE_CATEGORIES.SELF,
        _id: 128
    },
    patchAcceptHackerById: {
        requestType: Constants.REQUEST_TYPES.PATCH,
        uri: "/api/hacker/accept/" + Constants.ROLE_CATEGORIES.ALL,
        _id: 129
    },
    patchAcceptHackerByEmail: {
        requestType: Constants.REQUEST_TYPES.PATCH,
        uri: "/api/hacker/acceptEmail/" + Constants.ROLE_CATEGORIES.ALL,
        _id: 130
    },
    patchAcceptHackerByArrayOfIds: {
        requestType: Constants.REQUEST_TYPES.PATCH,
        uri: "/api/hacker/batchAccept",
        _id: 165
    },
    postAnySendWeekOfEmail: {
        requestType: Constants.REQUEST_TYPES.POST,
        uri: "/api/hacker/email/weekOf/" + Constants.ROLE_CATEGORIES.ALL,
        _id: 131
    },
    postSelfSendWeekOfEmail: {
        requestType: Constants.REQUEST_TYPES.POST,
        uri: "/api/hacker/email/weekOf/" + Constants.ROLE_CATEGORIES.SELF,
        _id: 132
    },
    postAnySendDayOfEmail: {
        requestType: Constants.REQUEST_TYPES.POST,
        uri: "/api/hacker/email/dayOf/" + Constants.ROLE_CATEGORIES.ALL,
        _id: 133
    },
    postSelfSendDayOfEmail: {
        requestType: Constants.REQUEST_TYPES.POST,
        uri: "/api/hacker/email/dayOf/" + Constants.ROLE_CATEGORIES.SELF,
        _id: 134
    }
};

const travelRoutes = {
    getSelf: {
        requestType: Constants.REQUEST_TYPES.GET,
        uri: "/api/travel/self/",
        _id: 135
    },
    getSelfById: {
        requestType: Constants.REQUEST_TYPES.GET,
        uri: "/api/travel/" + Constants.ROLE_CATEGORIES.SELF,
        _id: 136
    },
    getAnyById: {
        requestType: Constants.REQUEST_TYPES.GET,
        uri: "/api/travel/" + Constants.ROLE_CATEGORIES.ALL,
        _id: 137
    },
    getSelfByEmail: {
        requestType: Constants.REQUEST_TYPES.GET,
        uri: "/api/travel/email/" + Constants.ROLE_CATEGORIES.SELF,
        _id: 138
    },
    getAnyByEmail: {
        requestType: Constants.REQUEST_TYPES.GET,
        uri: "/api/travel/email/" + Constants.ROLE_CATEGORIES.ALL,
        _id: 139
    },
    post: {
        requestType: Constants.REQUEST_TYPES.POST,
        uri: "/api/travel/",
        _id: 140
    },
    patchAnyStatusById: {
        requestType: Constants.REQUEST_TYPES.PATCH,
        uri: "/api/travel/status/" + Constants.ROLE_CATEGORIES.ALL,
        _id: 141
    },
    patchAnyOfferById: {
        requestType: Constants.REQUEST_TYPES.PATCH,
        uri: "/api/travel/offer/" + Constants.ROLE_CATEGORIES.ALL,
        _id: 142
    }
};

const sponsorRoutes = {
    getSelf: {
        requestType: Constants.REQUEST_TYPES.GET,
        uri: "/api/sponsor/self/",
        _id: 143
    },
    getSelfById: {
        requestType: Constants.REQUEST_TYPES.GET,
        uri: "/api/sponsor/" + Constants.ROLE_CATEGORIES.SELF,
        _id: 144
    },
    getAnyById: {
        requestType: Constants.REQUEST_TYPES.GET,
        uri: "/api/sponsor/" + Constants.ROLE_CATEGORIES.ALL,
        _id: 145
    },
    post: {
        requestType: Constants.REQUEST_TYPES.POST,
        uri: "/api/sponsor/",
        _id: 146
    },
    patchSelfById: {
        requestType: Constants.REQUEST_TYPES.PATCH,
        uri: "/api/sponsor/" + Constants.ROLE_CATEGORIES.SELF,
        _id: 147
    },
    patchAnyById: {
        requestType: Constants.REQUEST_TYPES.PATCH,
        uri: "/api/sponsor/" + Constants.ROLE_CATEGORIES.ALL,
        _id: 148
    }
};

const teamRoutes = {
    get: {
        requestType: Constants.REQUEST_TYPES.GET,
        uri: "/api/team/" + Constants.ROLE_CATEGORIES.ALL,
        _id: 149
    },
    post: {
        requestType: Constants.REQUEST_TYPES.POST,
        uri: "/api/team/",
        _id: 150
    },
    join: {
        requestType: Constants.REQUEST_TYPES.PATCH,
        uri: "/api/team/join/",
        _id: 151
    },
    patchSelfById: {
        requestType: Constants.REQUEST_TYPES.PATCH,
        uri: "/api/team/" + Constants.ROLE_CATEGORIES.SELF,
        _id: 152
    },
    patchAnyById: {
        requestType: Constants.REQUEST_TYPES.PATCH,
        uri: "/api/team/" + Constants.ROLE_CATEGORIES.ALL,
        _id: 153
    },
    leave: {
        requestType: Constants.REQUEST_TYPES.PATCH,
        uri: "/api/team/leave/",
        _id: 154
    }
};

const volunteerRoutes = {
    getSelfById: {
        requestType: Constants.REQUEST_TYPES.GET,
        uri: "/api/volunteer/" + Constants.ROLE_CATEGORIES.SELF,
        _id: 155
    },
    getAnyById: {
        requestType: Constants.REQUEST_TYPES.GET,
        uri: "/api/volunteer/" + Constants.ROLE_CATEGORIES.ALL,
        _id: 156
    },
    post: {
        requestType: Constants.REQUEST_TYPES.POST,
        uri: "/api/volunteer/",
        _id: 157
    }
};

const roleRoutes = {
    post: {
        requestType: Constants.REQUEST_TYPES.POST,
        uri: "/api/role/",
        _id: 158
    }
};

const searchRoutes = {
    get: {
        requestType: Constants.REQUEST_TYPES.GET,
        uri: "/api/search/",
        _id: 159
    }
};

const staffRoutes = {
    hackerStats: {
        requestType: Constants.REQUEST_TYPES.GET,
        uri: "/api/hacker/stats",
        _id: 160
    },
    postInvite: {
        requestType: Constants.REQUEST_TYPES.POST,
        uri: "/api/account/invite",
        _id: 161
    },
    getInvite: {
        requestType: Constants.REQUEST_TYPES.GET,
        uri: "/api/account/invite",
        _id: 162
    }
};

const settingsRoutes = {
    getSettings: {
        requestType: Constants.REQUEST_TYPES.GET,
        uri: "/api/settings",
        _id: 163
    },
    patchSettings: {
        requestType: Constants.REQUEST_TYPES.PATCH,
        uri: "/api/settings",
        _id: 164
    }
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
    Staff: staffRoutes
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
    listAllRoutes: listAllRoutes
};
