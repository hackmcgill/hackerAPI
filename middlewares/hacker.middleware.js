"use strict";

const TAG = `[ HACKER.MIDDLEWARE.js ]`;
const mongoose = require("mongoose");
const Services = {
    Hacker: require("../services/hacker.service"),
    Storage: require("../services/storage.service")
};
const Middleware = {
    Util: require("./util.middleware")
};

/**
 * @async
 * @function parseHacker
 * @param {JSON} req
 * @param {JSON} res
 * @param {JSON} next
 * @return {void}
 * @description 
 * Moves accountId, school, gender, needsBus, application from req.body to req.body.teamDetails. 
 * Adds _id to teamDetails.
 */
function parseHacker(req, res, next) {
    const hackerDetails = {
        _id: mongoose.Types.ObjectId(),
        accountId: req.body.accountId,
        school: req.body.school,
        gender: req.body.gender,
        needsBus: req.body.needsBus,
        application: req.body.application,
    };

    delete req.body.accountId;
    delete req.body.school;
    delete req.body.gender;
    delete req.body.needsBus;
    delete req.body.application;

    req.body.hackerDetails = hackerDetails;

    next();
}

/**
 * @async
 * @function addDefaultStatus
 * @param {JSON} req
 * @param {JSON} res
 * @param {JSON} next
 * @return {void}
 * @description Adds status to teamDetails.
 */
function addDefaultStatus(req, res, next) {
    req.body.hackerDetails.status = "Applied";
    next();
}

/**
 * Verifies that the current signed in user is linked to the hacker passed in via req.body.id
 * @param {*} req 
 * @param {*} res 
 * @param {*} next 
 */
// must check that the account id is in the hacker schema.
function ensureAccountLinkedToHacker(req, res, next) {
    Services.Hacker.findById(req.body.id).then(
        (hacker) => {
            if(hacker && hacker.accountId === req.user.id) {
                next();
            } else {
                next({
                    status: 401,
                    message: "Unauthorized",
                    error: {}
                });
            }
        }
    ).catch(next);
}

/**
 * Uploads resume via the storage service. Assumes there is a file in req, and a hacker id in req.body. 
 * @param {*} req 
 * @param {*} res 
 * @param {*} next 
 */
async function uploadResume(req, res, next) {
    const gcfilename = `resumes/${Date.now()}-${req.body.id}`;
    await Services.Storage.upload(req.file, gcfilename);
    req.body.gcfilename = gcfilename;
    await Services.Hacker.updateOne(req.body.id, { $set: {"application.portfolioURL.resume": gcfilename}});
    next();
}

/**
 * Returns the application of a given hacker. Assumes req.body.id exists.
 * @param {*} req 
 * @param {*} res 
 * @param {*} next 
 */
async function downloadResume(req, res, next) {
    const hacker = await Services.Hacker.findById(req.body.id);
    if(hacker && hacker.application && hacker.application.portfolioURL && hacker.application.portfolioURL.resume) {
        res.body.resume = await Services.Storage.download(hacker.application.portfolioURL.resume);
    } else {
        res.body.resume = null;
    }
    next();
}


module.exports = {
    parseHacker: parseHacker,
    addDefaultStatus: addDefaultStatus,
    ensureAccountLinkedToHacker: ensureAccountLinkedToHacker,
    uploadResume: Middleware.Util.asyncMiddleware(uploadResume),
    downloadResume: Middleware.Util.asyncMiddleware(downloadResume)
};