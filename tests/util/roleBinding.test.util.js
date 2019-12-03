"use strict";
const RoleBinding = require("../../models/roleBinding.model");
const Util = {
    Account: require("./account.test.util"),
};
const Constants = {
    Role: require("../../constants/role.constant"),
    General: require("../../constants/general.constant")
};
const logger = require("../../services/logger.service");

function createRoleBinding(accountId, accountType = null, specificRoles = []) {
    let roleBinding = {
        accountId: accountId,
        roles: [Constants.Role.accountRole]
    };

    switch (accountType) {
        case Constants.General.HACKER:
            roleBinding.roles.push(Constants.Role.hackerRole);
            break;
        case Constants.General.VOLUNTEER:
            roleBinding.roles.push(Constants.Role.volunteerRole);
            break;
        case Constants.General.STAFF:
            roleBinding.roles.push(Constants.Role.adminRole);
            break;
        case Constants.General.SPONSOR_T1:
            roleBinding.roles.push(Constants.Role.sponsorT1Role);
            break;
        case Constants.General.SPONSOR_T2:
            roleBinding.roles.push(Constants.Role.sponsorT2Role);
            break;
        case Constants.General.SPONSOR_T3:
            roleBinding.roles.push(Constants.Role.sponsorT3Role);
            break;
        case Constants.General.SPONSOR_T4:
            roleBinding.roles.push(Constants.Role.sponsorT4Role);
            break;
        case Constants.General.SPONSOR_T5:
            roleBinding.roles.push(Constants.Role.sponsorT5Role);
            break;
    }

    for (const role of specificRoles) {
        roleBinding.roles.push(role);
    }

    return roleBinding;
}

function createRoleBindings(accounts) {
    let roleBindings = [];

    for (const account of accounts) {
        roleBindings.push(createRoleBinding(account._id, account.accountType));
    }

    return roleBindings;
}

const TeamHackerRB = createRoleBindings(Util.Account.hackerAccounts.stored.team);
const NoTeamHackerRB = createRoleBindings(Util.Account.hackerAccounts.stored.noTeam);
const UnconfirmedHackerRB = createRoleBindings(Util.Account.hackerAccounts.stored.unconfirmed);
const VolunteerRB = createRoleBindings(Util.Account.volunteerAccounts.stored);
const StaffRB = createRoleBindings(Util.Account.staffAccounts.stored);
const SponsorT1RB = createRoleBindings(Util.Account.sponsorT1Accounts.stored);
const SponsorT2RB = createRoleBindings(Util.Account.sponsorT2Accounts.stored);
const SponsorT3RB = createRoleBindings(Util.Account.sponsorT3Accounts.stored);
const SponsorT4RB = createRoleBindings(Util.Account.sponsorT4Accounts.stored);
const SponsorT5RB = createRoleBindings(Util.Account.sponsorT5Accounts.stored);

const newHackerRB = createRoleBindings(Util.Account.hackerAccounts.new);
const newVolunteerRB = createRoleBindings(Util.Account.volunteerAccounts.new);
const newSponsorT1RB = createRoleBindings(Util.Account.sponsorT1Accounts.new);
const newSponsorT2RB = createRoleBindings(Util.Account.sponsorT2Accounts.new);
const newSponsorT3RB = createRoleBindings(Util.Account.sponsorT3Accounts.new);
const newSponsorT4RB = createRoleBindings(Util.Account.sponsorT4Accounts.new);
const newSponsorT5RB = createRoleBindings(Util.Account.sponsorT5Accounts.new);

const extraAccounts = [
    createRoleBinding(Util.Account.NonConfirmedAccount1._id),
    createRoleBinding(Util.Account.NonConfirmedAccount2._id),
    createRoleBinding(Util.Account.NonConfirmedAccount3._id),
    createRoleBinding(Util.Account.waitlistedHacker0._id, Constants.General.HACKER),
];

function store(attributes) {
    const roleBindingDocs = [];
    const roleBindingNames = [];
    attributes.forEach((attribute) => {
        roleBindingDocs.push(new RoleBinding(attribute));
        roleBindingNames.push(attribute.name);
    });

    return RoleBinding.collection.insertMany(roleBindingDocs);
}

async function storeAll() {
    await store(TeamHackerRB);
    await store(NoTeamHackerRB);
    await store(UnconfirmedHackerRB);
    await store(VolunteerRB);
    await store(StaffRB);
    await store(SponsorT1RB);
    await store(SponsorT2RB);
    await store(SponsorT3RB);
    await store(SponsorT4RB);
    await store(SponsorT5RB);

    await store(newHackerRB);
    await store(newVolunteerRB);
    await store(newSponsorT1RB);
    await store(newSponsorT2RB);
    await store(newSponsorT3RB);
    await store(newSponsorT4RB);
    await store(newSponsorT5RB);

    await store(extraAccounts);
}

async function dropAll() {
    try {
        await RoleBinding.collection.drop();
    } catch (e) {
        if (e.code === 26) {
            logger.info("namespace %s not found", RoleBinding.collection.name);
        } else {
            throw e;
        }
    }
}

module.exports = {
    TeamHackerRB: TeamHackerRB,
    NoTeamHackerRB: NoTeamHackerRB,
    UnconfirmedHackerRB: UnconfirmedHackerRB,
    VolunteerRB: VolunteerRB,
    StaffRB: StaffRB,
    SponsorT1RB: SponsorT1RB,
    SponsorT2RB: SponsorT2RB,
    SponsorT3RB: SponsorT3RB,
    SponsorT4RB: SponsorT4RB,
    SponsorT5RB: SponsorT5RB,

    newHackerRB: newHackerRB,
    newVolunteerRB: newVolunteerRB,
    newSponsorT1RB: newSponsorT1RB,
    newSponsorT2RB: newSponsorT2RB,
    newSponsorT3RB: newSponsorT3RB,
    newSponsorT4RB: newSponsorT4RB,
    newSponsorT5RB: newSponsorT5RB,

    extraAccounts: extraAccounts,

    storeAll: storeAll,
    dropAll: dropAll,
};