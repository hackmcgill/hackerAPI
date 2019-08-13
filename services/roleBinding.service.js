"use strict";
const RoleBinding = require("../models/roleBinding.model");
const RoleService = require("./role.service");
const logger = require("./logger.service");

/**
 * Creates a rolebinding between an account and a role. Appends to an existing rolebinding if one already exists
 * @param {ObjectId} accountId the id of the account that you want to add a rolebinding to
 * @param {ObjectId} roleId the id of the role that you want to add
 */
async function createRoleBinding(accountId, roleId = undefined) {
    const TAG = "[RoleBinding Service # createRoleBinding]:";
    const query = {
        accountId: accountId
    };
    const roleBindingModel = await getRoleBindingForAcct(accountId);
    if (!roleBindingModel) {
        const roleArray = (!!roleId) ? [roleId] : [];
        const newRb = new RoleBinding({
            name: accountId + "_rolebinding",
            accountId: accountId,
            roles: roleArray
        });
        return newRb.save();
    } else {
        return RoleBinding.findByIdAndUpdate(roleBindingModel._id, {
            $addToSet: {
                roles: roleId
            }
        }, logger.queryCallbackFactory(TAG, "roleBinding", query));
    }
}

/**
 * Attempts to find a rolebinding given the role name and adds it to the account
 * @param {ObjectId} accountId the id of the account that you want to add a rolebinding to
 * @param {String} roleName the name of the role that you want to add
 */
async function createRoleBindingByRoleName(accountId, roleName){
    const role = await RoleService.getRole(roleName);
    if (!!role) {
        await createRoleBinding(accountId, role.id);
    }
}

/**
 * Removes a role from a rolebinding for a given account.
 * @param {ObjectId} accountId the id of the account that you want to remove a rolebinding from
 * @param {ObjectId} roleId the id of the role that you want to remove
 */
async function removeRoleBinding(accountId, roleId) {
    const TAG = "[RoleBinding Service # removeRoleBinding]:";
    const roleBindingModel = await getRoleBindingForAcct(accountId);
    return RoleBinding.findByIdAndUpdate(roleBindingModel._id, {
        $pop: {
            roles: roleId
        }
    }, logger.queryCallbackFactory(TAG, "roleBinding", roleBindingModel._id));
}

/**
 * @async
 * @function getRoleBindingForAcct
 * @param {string} accountId The id of the account that you want the role bindings for.
 * @returns {Promise<RoleBinding>}
 * @description
 * Gets the roleBinding for a given account. Populates the role array as well with the Roles.
 */
async function getRoleBindingForAcct(accountId) {
    const TAG = "[RoleBinding Service # getRoleBindings]:";
    const query = {
        accountId: accountId
    };
    //get the roleBinding for account
    //Populate roles for roleBinding

    return RoleBinding.findOne(query, logger.queryCallbackFactory(TAG, "roleBinding", query)).populate({
        path: "roles",
    });
}

/**
 * @async
 * @function getById
 * @param {ObjectId} id The rolebinding id
 * @description
 * Returns the roleBinding specified by the id.
 */
async function getById(id) {
    const TAG = "[RoleBinding Service # getById]:";
    const query = {
        _id: id
    };
    //get the roleBinding for account
    //Populate roles for roleBinding
    return await RoleBinding.findById(query, logger.queryCallbackFactory(TAG, "roleBinding", query));
}

module.exports = {
    getRoleBindingForAcct: getRoleBindingForAcct,
    getById: getById,
    createRoleBinding: createRoleBinding,
    createRoleBindingByRoleName: createRoleBindingByRoleName,
    removeRoleBinding: removeRoleBinding
};
