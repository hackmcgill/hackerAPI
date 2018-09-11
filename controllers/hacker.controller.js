"use strict";
const mongoose = require("mongoose");
const Constants = require("../constants");
const fs = require("fs");
const Services = {
    Hacker: require("../services/hacker.service"),
    Logger: require("../services/logger.service"),
    Email: require("../services/email.service")
};
const Util = require("../middlewares/util.middleware");

/**
 * @async
 * @function createHacker
 * @param {*} req
 * @param {*} res
 * @return {JSON} Success or error status
 * @description create a hacker from information in req.body.hackerDetails
 */
async function createHacker(req, res) {
    const hackerDetails = req.body.hackerDetails;
    
    const success = await Services.Hacker.createHacker(hackerDetails);

    if (success) {
        return res.status(200).json({
            message: "Hacker creation successful",
            data: hackerDetails
        });
    } else {
        return res.status(400).json({
            message: "Issue with hacker creation",
            data: {}
        });
    }
}

/**
 * @async
 * @function updatedHacker
 * @param {*} req
 * @param {*} res
 * @return {JSON} Success or error status
 * @description 
 *      Change a hacker's information based on the hacker's mongoID specified in req.params.id.
 *      The new information is located in req.body.
 */
async function updatedHacker(req, res) {
    return res.status(200).json({
        message: "Changed hacker information",
        data: req.body
    });
}

function uploadedResume (req, res) {
    return res.status(200).json({
        message: "Uploaded resume",
        data: {
            filename: req.body.gcfilename
        }
    });
}

function downloadedResume (req, res) {
    return res.status(200).json({
        message: "Downloaded resume",
        data: {
            id: req.body.id,
            resume: req.body.resume
        }
    });
}

module.exports = {
    updateHacker: updatedHacker,
    createHacker: Util.asyncMiddleware(createHacker),
    uploadedResume: uploadedResume,
    downloadedResume: downloadedResume
};