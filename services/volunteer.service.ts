import Volunteer from "../models/volunteer.model";
const logger = require("./logger.service");

/**
 * @function createVolunteer
 * @param {{_id: ObjectId, accountId: ObjectId}} volunteerDetails
 * @return {Promise<Volunteer>} The promise will resolve to a volunteer object if save was successful.
 * @description Adds a new volunteer to database.
 */
async function createVolunteer(volunteerDetails: Object): Promise<Volunteer> {
    const TAG = `[Volunteer Service # createTeam]:`;

    const volunteer = Volunteer.create(volunteerDetails);
    return await volunteer.save();
}

/**
 * @function findById
 * @param {number} identifier
 * @return {Promise<Volunteer | undefined>} The document query will resolve to volunteer or null.
 * @description Finds an volunteer by the id, which is the mongoId.
 */
async function findById(identifier: number): Promise<Volunteer | undefined> {
    const TAG = `[Volunteer Service # findById ]:`;

    return await Volunteer.findOne(identifier).then((volunteer) => {
        logger.queryCallbackFactory(TAG, "volunteer", identifier);
        return volunteer;
    });
}

// TODO: Deprecrate / remove this function.
/**
 * @function findByAccountId
 * @param {number} accountId
 * @return {Promise<Volunteer | undefined>} A volunteer document queried by accountId
 */
async function findByAccountId(
    accountId: number
): Promise<Volunteer | undefined> {
    const TAG = `[ Volunteer Service # findByAccountId ]:`;
    return this.findById(accountId);
}

export { createVolunteer, findById, findByAccountId };
