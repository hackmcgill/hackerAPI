"use strict";
const Constants = {
    Success: require("../constants/success.constant"),
    Error: require("../constants/error.constant")
};

/**
 * @function showHacker
 * @param {{body: {hacker: Object}}} req
 * @param {*} res
 * @return {JSON} Success status and hacker object
 * @description Returns the JSON of hacker object located in req.body.hacker
 */
function showHacker(req, res) {
    return res.status(200).json({
        message: Constants.Success.HACKER_READ,
        data: req.body.hacker.toJSON()
    });
}

/**
 * @function createdHacker
 * @param {{body: {hacker: {_id: ObjectId, accountId: ObjectId, status: string, application: {Object}}}}} req
 * @param {*} res
 * @return {JSON} Success status
 * @description returns success message
 */
function createdHacker(req, res) {
    return res.status(200).json({
        message: Constants.Success.HACKER_CREATE,
        data: req.body.hacker.toJSON()
    });
}

/**
 * @function updateHacker
 * @param {{params: {id: ObjectId}, body: {Object}}} req
 * @param {*} res
 * @return {JSON} Success or error status
 * @description
 *      Change a hacker's information based on the hacker's mongoID specified in req.params.id.
 *      The id is moved to req.body.id from req.params.id by validation.
 *      Returns a 200 status for an updated hacker.
 *      The new information is located in req.body.
 */
function updatedHacker(req, res) {
    return res.status(200).json({
        message: Constants.Success.HACKER_UPDATE,
        data: req.body
    });
}

function uploadedResume(req, res) {
    return res.status(200).json({
        message: Constants.Success.RESUME_UPLOAD,
        data: {
            filename: req.body.gcfilename
        }
    });
}

function downloadedResume(req, res) {
    return res.status(200).json({
        message: Constants.Success.RESUME_DOWNLOAD,
        data: {
            id: req.body.id,
            resume: req.body.resume
        }
    });
}

function gotStats(req, res) {
    return res.status(200).json({
        message: "Retrieved stats",
        data: {
            stats: req.body.stats
        }
    });
}

function sentWeekOfEmail(req, res) {
    return res.status(200).json({
        message: Constants.Success.HACKER_SENT_WEEK_OF,
        data: {}
    });
}

function sentDayOfEmail(req, res) {
    return res.status(200).json({
        message: Constants.Success.HACKER_SENT_DAY_OF,
        data: {}
    });
}

function updatedHackerBatch(req, res) {
    return res.status(200).json({
        message: Constants.Success.HACKER_UPDATE_BATCH,
        data: {
            success_ids: req.body.ids,
            errors: req.errors || []
        }
    });
}

/**
 * @function assignReviewers
 * @param {*} req
 * @param {*} res
 * @return {JSON} Success or error status
 * @description
 *      Assign reviewers to hackers who've not yet been assigned reviewers and submitted applications before the deadline.
 *      Returns a 200 status after bulk assignment reviewers.
 *      The assignments are located in req.body.
 */
function assignedReviewers(req, res) {
    return res.status(200).json({
        message: 'Successfully assigned reviewers to hackers',
        data: req.body
    });
}

module.exports = {
    updatedHacker: updatedHacker,
    updatedHackerBatch: updatedHackerBatch,
    assignedReviewers: assignedReviewers,
    createdHacker: createdHacker,
    uploadedResume: uploadedResume,
    downloadedResume: downloadedResume,
    showHacker: showHacker,
    gotStats: gotStats,
    sentWeekOfEmail: sentWeekOfEmail,
    sentDayOfEmail: sentDayOfEmail
};
