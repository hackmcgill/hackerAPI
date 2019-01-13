"use strict";
const RoleBinding = require("../../models/roleBinding.model");
const Util = {
    Account: require("./account.test.util"),
};
const Constants = {
    Role: require("../../constants/role.constant")
};
const logger = require("../../services/logger.service");

const RoleBinding1 = {
    accountId: Util.Account.allAccounts[6]._id,
    roles: [Constants.Role.accountRole._id, Constants.Role.adminRole._id],
};
const RoleBinding2 = {
    accountId: Util.Account.allAccounts[7]._id,
    roles: [Constants.Role.accountRole._id, Constants.Role.hackerRole._id],
};
const RoleBinding3 = {
    accountId: Util.Account.allAccounts[8]._id,
    roles: [Constants.Role.accountRole._id, Constants.Role.volunteerRole._id],
};
const RoleBinding4 = {
    accountId: Util.Account.allAccounts[9]._id,
    roles: [Constants.Role.accountRole._id, Constants.Role.sponsorT1Role._id],
};
const RoleBinding5 = {
    accountId: Util.Account.allAccounts[10]._id,
    roles: [Constants.Role.accountRole._id, Constants.Role.sponsorT2Role._id],
};
const RoleBinding6 = {
    accountId: Util.Account.allAccounts[11]._id,
    roles: [Constants.Role.accountRole._id, Constants.Role.allRolesObject.getSelfAccount._id],
};

const RoleBinding7 = {
    accountId: Util.Account.allAccounts[12]._id,
    roles: [Constants.Role.accountRole._id, Constants.Role.allRolesObject.getAnyByIdHacker._id, Constants.Role.allRolesObject.patchSelfByIdHacker._id],
};

const RoleBindingHacker1 = {
    accountId: Util.Account.Account1._id,
    roles: [Constants.Role.accountRole._id, Constants.Role.hackerRole._id],
};
const RoleBindingHacker2 = {
    accountId: Util.Account.Account2._id,
    roles: [Constants.Role.accountRole._id, Constants.Role.hackerRole._id],
};
const RoleBindingHacker3 = {
    accountId: Util.Account.Hacker3._id,
    roles: [Constants.Role.hackerRole._id],
};

const RoleBindingNewHacker1 = {
    accountId: Util.Account.allAccounts[13]._id,
    roles: [Constants.Role.accountRole._id, Constants.Role.allRolesObject["postHacker"]],
};

const RoleBindingSponsor1 = {
    accountId: Util.Account.Account3._id,
    roles: [Constants.Role.accountRole._id, Constants.Role.sponsorT1Role._id],
};

const RoleBindingSponsor2 = {
    accountId: Util.Account.Account5._id,
    roles: [Constants.Role.accountRole._id, Constants.Role.sponsorT1Role._id],
};

const RoleBindingVolunteer1 = {
    accountId: Util.Account.Account4._id,
    roles: [Constants.Role.accountRole._id, Constants.Role.volunteerRole._id],
};

const RoleBindingNewVolunteer1 = {
    accountId: Util.Account.generatedAccounts[15]._id,
    roles: [Constants.Role.accountRole._id, Constants.Role.allRolesObject["postVolunteer"]],
};

const RoleBindingAdmin0 = {
    accountId: Util.Account.staffAccounts[0],
    roles: [Constants.Role.adminRole._id],
};

// function setUpAccountRoleBinding???(???) {
//     /* 
//     TODO
//     */
// }


const RoleBindings = [
    RoleBindingAdmin0,


    RoleBinding1,
    RoleBinding2,
    RoleBinding3,
    RoleBinding4,
    RoleBinding5,
    RoleBinding6,
    RoleBinding7,
    RoleBindingHacker1,
    RoleBindingHacker2,
    RoleBindingNewHacker1,
    RoleBindingSponsor1,
    RoleBindingSponsor2,
    RoleBindingVolunteer1,
    RoleBindingNewVolunteer1,

    RoleBindingHacker3,
];


function storeAll(attributes) {
    const roleBindingDocs = [];
    const roleBindingNames = [];
    attributes.forEach((attribute) => {
        roleBindingDocs.push(new RoleBinding(attribute));
        roleBindingNames.push(attribute.name);
    });

    return RoleBinding.collection.insertMany(roleBindingDocs);
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
    RoleBinding1: RoleBinding1,
    RoleBinding2: RoleBinding2,
    RoleBinding3: RoleBinding3,
    RoleBinding4: RoleBinding4,
    RoleBinding5: RoleBinding5,
    RoleBinding6: RoleBinding6,
    RoleBinding7: RoleBinding7,
    RoleBindings: RoleBindings,
    RoleBindingHacker3: RoleBindingHacker3,
    storeAll: storeAll,
    dropAll: dropAll,
};