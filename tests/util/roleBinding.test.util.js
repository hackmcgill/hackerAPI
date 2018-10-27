"use strict";
const RoleBinding = require("../../models/roleBinding.model");
const Util = {
    Account: require("./account.test.util"),
    Role: require("./role.test.util"),
};
const TAG = "[ ROLEBINDING.TEST.UTIL.JS ]";
const logger = require("../../services/logger.service");

const RoleBinding1 = {
    accountId: Util.Account.allAccounts[6]._id,
    roles: [Util.Role.adminRole],
};
const RoleBinding2 = {
    accountId: Util.Account.allAccounts[7]._id,
    roles: [Util.Role.hackerRole],
};
const RoleBinding3 = {
    accountId: Util.Account.allAccounts[8]._id,
    roles: [Util.Role.volunteerRole],
};
const RoleBinding4 = {
    accountId: Util.Account.allAccounts[9]._id,
    roles: [Util.Role.sponsorT1Role],
};
const RoleBinding5 = {
    accountId: Util.Account.allAccounts[10]._id,
    roles: [Util.Role.sponsorT2Role],
};
const RoleBinding6 = {
    accountId: Util.Account.allAccounts[11]._id,
    roles: [Util.Role.singularRoles.getSelfAccount],
};
const RoleBinding7 = {
    accountId: Util.Account.allAccounts[12]._id,
    roles: [Util.Role.getAnyByIdHacker, Util.Role.patchSelfByIdHacker],
};

const RoleBindingHacker1 = {
    accountId: Util.Account.Account1._id,
    roles: [Util.Role.hackerRole],
};
const RoleBindingHacker2 = {
    accountId: Util.Account.Account2._id,
    roles: [Util.Role.hackerRole],
}

const RoleBindingAdmin1 = {
    accountId: Util.Account.Admin1._id,
    roles: [Util.Role.adminRole],
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