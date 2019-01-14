"use strict";
const RoleBinding = require("../../models/roleBinding.model");
const Util = {
    Account: require("./account.test.util"),
};
const Constants = {
    Role: require("../../constants/role.constant")
};
const logger = require("../../services/logger.service");

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