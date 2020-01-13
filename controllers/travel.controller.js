"use strict";
const Constants = {
    Success: require("../constants/success.constant"),
    Error: require("../constants/error.constant")
};

function okay(req, res) {
    return res.status(200).json({
        message: "good"
    });
}

/**
 * @function showTravel
 * @param {{body: {travel: Object}}} req
 * @param {*} res
 * @return {JSON} Success status and travel object
 * @description Returns the JSON of travel object located in req.body.travel
 */
function showTravel(req, res) {
    return res.status(200).json({
        message: Constants.Success.TRAVEL_READ,
        data: req.body.travel.toJSON()
    });
}

/**
 * @function createTravel
 * @param {{body: {travel: {_id: ObjectId, accountId: ObjectId, hackerId: objectId, status: string, request: number, offer: number}}}} req
 * @param {*} res
 * @return {JSON} Success status
 * @description
 *      Create a travel's record based off information stored in req.body.travel
 *      Returns a 200 status for the created travel.
 */
function createdTravel(req, res) {
    return res.status(200).json({
        message: Constants.Success.TRAVEL_CREATE,
        data: req.body.travel.toJSON()
    });
}

/**
 * @function updatedTravel
 * @param {{params: {id: ObjectId}, body: {Object}}} req
 * @param {*} res
 * @return {JSON} Success or error status
 * @description
 *      Change a travel's information based on the trave;'s mongoID specified in req.params.id.
 *      The id is moved to req.body.id from req.params.id by validation.
 *      Returns a 200 status for an updated travel.
 *      The new information is located in req.body.
 */
function updatedTravel(req, res) {
    return res.status(200).json({
        message: Constants.Success.TRAVEL_UPDATE,
        data: req.body
    });
}

module.exports = {
    okay: okay,
    showTravel: showTravel,
    updatedTravel: updatedTravel,
    createdTravel: createdTravel
};
