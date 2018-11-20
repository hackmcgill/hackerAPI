"use strict";
const RoleBinding = require("../../models/roleBinding.model");
const Util = {
    Account: require("./account.test.util"),
};
const Constants = {
    Role: require("../../constants/role.constant")
};
const TAG = "[ ROLEBINDING.TEST.UTIL.JS ]";
const logger = require("../../services/logger.service");

const RoleBinding1 = {
    accountId: Util.Account.allAccounts[6]._id,
    roles: [Constants.Role.adminRole._id],
};
const RoleBinding2 = {
    accountId: Util.Account.allAccounts[7]._id,
    roles: [Constants.Role.hackerRole._id],
};
const RoleBinding3 = {
    accountId: Util.Account.allAccounts[8]._id,
    roles: [Constants.Role.volunteerRole._id],
};
const RoleBinding4 = {
    accountId: Util.Account.allAccounts[9]._id,
    roles: [Constants.Role.sponsorT1Role._id],
};
const RoleBinding5 = {
    accountId: Util.Account.allAccounts[10]._id,
    roles: [Constants.Role.sponsorT2Role._id],
};
const RoleBinding6 = {
    accountId: Util.Account.allAccounts[11]._id,
    roles: [Constants.Role.allRolesObject.getSelfAccount._id],
};

const RoleBinding7 = {
    accountId: Util.Account.allAccounts[12]._id,
    roles: [Constants.Role.allRolesObject.getAnyByIdHacker._id, Constants.Role.allRolesObject.patchSelfByIdHacker._id],
};

const RoleBindingHacker1 = {
    accountId: Util.Account.Account1._id,
    roles: [Constants.Role.hackerRole._id],
};
const RoleBindingHacker2 = {
    accountId: Util.Account.Account2._id,
    roles: [Constants.Role.hackerRole._id],
};
const RoleBindingNewHacker1 = {
    accountId: Util.Account.allAccounts[13]._id,
    roles: [Constants.Role.hackerRole._id],
};

const RoleBindingSponsor1 = {
    accountId: Util.Account.Account3._id,
    roles: [Constants.Role.sponsorT1Role._id],
};

const RoleBindingSponsor2 = {
    accountId: Util.Account.Account5._id,
    roles: [Constants.Role.sponsorT1Role._id],
};

const RoleBindingVolunteer1 = {
    accountId: Util.Account.Account4._id,
    roles: [Constants.Role.volunteerRole._id],
};

const RoleBindingNewVolunteer1 = {
    accountId: Util.Account.generatedAccounts[15]._id,
    roles: [Constants.Role.volunteerRole._id],
};

const RoleBindingAdmin1 = {
    accountId: Util.Account.Admin1._id,
    roles: [Constants.Role.adminRole._id],
};

const RoleBindings = [
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
    RoleBindingAdmin1,
];


function storeAll(attributes, callback) {
    const roleBindingDocs = [];
    const roleBindingNames = [];
    attributes.forEach((attribute) => {
        roleBindingDocs.push(new RoleBinding(attribute));
        roleBindingNames.push(attribute.name);
    });

    RoleBinding.collection.insertMany(roleBindingDocs).then(
        () => {
            logger.info(`${TAG} saved RoleBindings: ${roleBindingNames.join(",")}`);
            callback();
        },
        (reason) => {
            logger.error(`${TAG} could not store RoleBindings ${roleBindingNames.join(",")}. Error: ${JSON.stringify(reason)}`);
            callback(reason);
        }
    );
}

function dropAll(callback) {
    RoleBinding.collection.drop().then(
        () => {
            logger.info(`Dropped table RoleBinding`);
            callback();
        },
        (err) => {
            logger.error(`Could not drop RoleBinding. Error: ${JSON.stringify(err)}`);
            callback(err);
        }
    ).catch((error) => {
        logger.error(error);
        callback();
    });
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
    storeAll: storeAll,
    dropAll: dropAll,
};