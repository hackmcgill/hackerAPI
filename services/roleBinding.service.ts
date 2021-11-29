import RoleBinding from "../models/roleBinding.model";
import { getById as getRoleById, getRole } from "./role.service";
import { findById as findAccountById } from "./account.service";
import { UpdateResult } from "typeorm";
import Role from "../models/role.model";
const logger = require("./logger.service");

/**
 * Creates a rolebinding between an account and a role. Appends to an existing rolebinding if one already exists
 * @param {number} accountId the id of the account that you want to add a rolebinding to
 * @param {number} roleId the id of the role that you want to add
 */
async function createRoleBinding(accountId: number, roleId?: any) {
    const TAG = "[RoleBinding Service # createRoleBinding]:";
    const query = {
        accountId: accountId
    };
    const roleBindingModel = await getRoleBindingForAcct(accountId);
    if (!roleBindingModel) {
        const roleArray = roleId ? [roleId] : [];
        const newRb = RoleBinding.create({
            account: await findAccountById(accountId),
            roles: roleArray
        });
        return newRb.save();
    } else {
        // This code is terrible.
        if (roleId == undefined) return undefined;
        const role = await getRoleById(roleId);
        if (role == undefined) return undefined;
        roleBindingModel.roles.push();
        return RoleBinding.update(
            roleBindingModel.identifier,
            roleBindingModel
        ).then((value: UpdateResult) => {
            logger.queryCallbackFactory(TAG, "roleBinding", query);
            return value;
        });
    }
}

/**
 * Attempts to find a rolebinding given the role name and adds it to the account
 * @param {ObjectId} accountId the id of the account that you want to add a rolebinding to
 * @param {String} roleName the name of the role that you want to add
 */
async function createRoleBindingByRoleName(
    accountId: number,
    roleName: string
) {
    const role = await getRole(roleName);
    if (role === undefined) return undefined;
    await createRoleBinding(accountId, role.identifier);
}

/**
 * Removes a role from a rolebinding for a given account.
 * @param {ObjectId} accountId the id of the account that you want to remove a rolebinding from
 * @param {ObjectId} roleId the id of the role that you want to remove
 */
async function removeRoleBinding(accountId: number, roleId: number) {
    const TAG = "[RoleBinding Service # removeRoleBinding]:";
    const roleBindingModel = await getRoleBindingForAcct(accountId);
    const role = await getRoleById(roleId);
    if (
        roleBindingModel === undefined ||
        role === undefined ||
        roleId == undefined
    )
        return undefined;
    delete roleBindingModel.roles[roleBindingModel.roles.indexOf(role)];
    return RoleBinding.update(
        roleBindingModel.identifier,
        roleBindingModel
    ).then((value: UpdateResult) => {
        logger.queryCallbackFactory(
            TAG,
            "roleBinding",
            roleBindingModel.identifier
        );
        return value;
    });
}

/**
 * @async
 * @function getRoleBindingForAcct
 * @param {string} accountId The id of the account that you want the role bindings for.
 * @returns {Promise<RoleBinding>}
 * @description
 * Gets the roleBinding for a given account. Populates the role array as well with the Roles.
 */
async function getRoleBindingForAcct(accountId: number) {
    const TAG = "[RoleBinding Service # getRoleBindings]:";
    const query = {};
    //get the roleBinding for account
    //Populate roles for roleBinding

    return RoleBinding.findOne({
        where: { account: await findAccountById(accountId) }
    }).then((roleBinding) => {
        logger.queryCallbackFactory(TAG, "roleBinding", "accountId");
        return roleBinding;
    });
}

/**
 * @async
 * @function getById
 * @param {ObjectId} id The rolebinding id
 * @description
 * Returns the roleBinding specified by the id.
 */
async function getById(identifier: number) {
    const TAG = "[RoleBinding Service # getById]:";
    //get the roleBinding for account
    //Populate roles for roleBinding
    return await RoleBinding.findOne(identifier).then((roleBinding) => {
        logger.queryCallbackFactory(TAG, "roleBinding", identifier);
        return roleBinding;
    });
}

module.exports = {
    getRoleBindingForAcct: getRoleBindingForAcct,
    getById: getById,
    createRoleBinding: createRoleBinding,
    createRoleBindingByRoleName: createRoleBindingByRoleName,
    removeRoleBinding: removeRoleBinding
};
