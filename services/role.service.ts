import { BaseEntity } from "typeorm";
import Role from "../models/role.model";
import * as logger from "./logger.service";

/**
 * @function createRole
 * @param {{_id: ObjectId, name: String, routes: route[]}} roleDetails
 * @return {Promise<Role>} The promise will resolve to a role object if save was successful.
 * @description Adds a new role to database.
 */
async function createRole(roleDetails: Object): Promise<Role> {
    const role = Role.create(roleDetails);

    return await role.save();
}

/**
 * @function getRole
 * @param {string} roleName The name of the role that you're looking for.
 * @description
 * Returns the role defined by the role name
 */
async function getRole(roleName: string): Promise<Role | undefined> {
    const TAG = "[Role Service # getRole]:";

    const query = { name: roleName };

    //get the roleBinding for account
    //Populate roles for roleBinding
    return await Role.findOne({ where: query }).then((role: Role) => {
        logger.queryCallbackFactory(TAG, "role", query);
        return role;
    });
}

/**
 * @function getById
 * @param {number} identifier The role id
 * @description
 * Returns the role specified by the id.
 */
async function getById(identifier: number): Promise<Role | undefined> {
    const TAG = "[Role Service # getById]:";

    //get the roleBinding for account
    //Populate roles for roleBinding
    return await Role.findOne(identifier).then((role: Role) => {
        logger.queryCallbackFactory(TAG, "role", identifier);
        return role;
    });
}

/**
 * @function getAll
 * @description
 * Returns all the roles in the database
 */
async function getAll(): Promise<Role[]> {
    const TAG = "[Role Service # getAll]:";
    return Role.find().then((roles) => {
        logger.queryCallbackFactory(TAG, "role", {});
        return roles;
    });
}

export { createRole, getRole, getById, getAll };
