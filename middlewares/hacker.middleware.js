"use strict";

const TAG = `[ HACKER.MIDDLEWARE.js ]`;
const mongoose = require("mongoose");
const Services = {
    Hacker: require("../services/hacker.service"),
    Storage: require("../services/storage.service"),
    Email: require("../services/email.service"),
    Account: require("../services/account.service")
};
const Middleware = {
    Util: require("./util.middleware")
};
const Constants = require("../constants");
const fs = require("fs");
const path = require("path");

/**
 * @async
 * @function parseHacker
 * @param {{body:{accountId:string, school:string, gender:string, needsBus: string, application:Object}}} req
 * @param {JSON} res
 * @param {(err?)=>void} next
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
 * @param {{body:{hackerDetails:{status:String}}}} req
 * @param {JSON} res
 * @param {(err?)=>void} next
 * @return {void}
 * @description Adds status to hackerDetails.
 */
function addDefaultStatus(req, res, next) {
    req.body.hackerDetails.status = "Applied";
    next();
}

/**
 * Verifies that the current signed in user is linked to the hacker passed in via req.body.id
 * @param {{body:{id:String}}} req 
 * @param {*} res 
 * @param {(err?)=>void} next
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
 * @param {{body:{id:String}, file:[Buffer]}} req 
 * @param {*} res 
 * @param {(err?)=>void} next
 */
async function uploadResume(req, res, next) {
    const gcfilename = `resumes/${Date.now()}-${req.body.id}`;
    await Services.Storage.upload(req.file, gcfilename);
    req.body.gcfilename = gcfilename;
    await Services.Hacker.updateOne(req.body.id, { $set: {"application.portfolioURL.resume": gcfilename}});
    next();
}

/**
 * Attaches the resume of a hacker to req.body.resume. Assumes req.body.id exists.
 * @param {{body:{id:String}}} req 
 * @param {*} res 
 * @param {(err?)=>void} next
 */
async function downloadResume(req, res, next) {
    const hacker = await Services.Hacker.findById(req.body.id);
    if(hacker && hacker.application && hacker.application.portfolioURL && hacker.application.portfolioURL.resume) {
        res.body.resume = await Services.Storage.download(hacker.application.portfolioURL.resume);
    } else {
        return next({
            status: 404,
            message: "Resume does not exist",
            error:{}
        });
    }
    next();
}
/**
 * Sends a preset email to a user if a status change occured.
 * @param {{body: {status?: string}, email: string}} req 
 * @param {*} res 
 * @param {(err?:*)=>void} next 
 */
function sendStatusUpdateEmail(req, res, next) {
    let mailData;
    //skip if the status doesn't exist
    if(!req.body.status) {
        return next();
    }
    switch (req.body.status) {
        case Constants.HACKER_STATUS_NONE:
            //do nothing
            break;
        case Constants.HACKER_STATUS_ACCEPTED:
            //send acceptance email
            mailData = {
                to: req.email,
                from: process.env.NO_REPLY_EMAIL,
                subject: `Great update from ${process.env.HACKATHON}`,
                html: fs.readFileSync(path.join(__dirname, "../assets/email/accepted.html")).toString()
            };
            break;
        case Constants.HACKER_STATUS_APPLIED:
            //send applied email
            mailData = {
                to: req.email,
                from: process.env.NO_REPLY_EMAIL,
                subject: `Thanks for Applying to ${process.env.HACKATHON}`,
                html: fs.readFileSync(path.join(__dirname, "../assets/email/applied.html")).toString()
            };
            break;

        case Constants.HACKER_STATUS_CANCELLED:
            //send cancelled email
            mailData = {
                to: req.email,
                from: process.env.NO_REPLY_EMAIL,
                subject: "Sorry to see you go.",
                html: fs.readFileSync(path.join(__dirname, "../assets/email/cancelled.html")).toString()
            };
            break;

        case Constants.HACKER_STATUS_CHECKED_IN:
            //send checked in email
            mailData = {
                to: req.email,
                from: process.env.NO_REPLY_EMAIL,
                subject: `Welcome to ${process.env.HACKATHON}!`,
                html: fs.readFileSync(path.join(__dirname, "../assets/email/checkedIn.html")).toString()
            };
            break;

        case Constants.HACKER_STATUS_CONFIRMED:
            //send confirmed email
            mailData = {
                to: req.email,
                from: process.env.NO_REPLY_EMAIL,
                subject: "Thanks for applying!",
                html: fs.readFileSync(path.join(__dirname, "../assets/email/confirmed.html")).toString()
            };
            break;

        case Constants.HACKER_STATUS_WAITLISTED:
            mailData = {
                to: req.email,
                from: process.env.NO_REPLY_EMAIL,
                subject: "Update from McHacks",
                html: fs.readFileSync(path.join(__dirname, "../assets/email/waitlisted.html")).toString()
            };
            break;
        default:
            Services.Logger.error(`Invalid status change: ${req.body.status}`);
    }
    if(mailData) {
        Services.Email.send(mailData).then(
            (response) => {
                if(response[0].statusCode !== 202) {
                    next(response[0]);
                } else {
                    next();
                }
            }, next);
    } else {
        next({
            status: 422,
            message: "Invalid status change",
            data: {
                status: req.body.status
            }
        });
    }
}

/**
 * Updates a hacker that is specified by req.params.id, and then sets req.email 
 * to the email of the hacker, found in Account.
 * @param {{params:{id: string}, body: *}} req 
 * @param {*} res 
 * @param {*} next 
 */
async function updateHacker(req, res, next) {
    const hacker = await Services.Hacker.updateOne(req.params.id, req.body);
    if(hacker) {
        const acct = await Services.Account.findById(hacker.accountId);
        if(!acct) {
            return next({
                status: 500,
                message: "Error while searching for account by id when updating hacker",
                data: {
                    hackerId: hacker.id,
                    accountId: hacker.accountId
                }
            });
        }
        req.email = acct.email;
        next();
    } else {
        next({
            status: 404,
            message: "Hacker not found",
            data: {
                id: req.params.id
            }
        });
    }
}

module.exports = {
    parseHacker: parseHacker,
    addDefaultStatus: addDefaultStatus,
    ensureAccountLinkedToHacker: ensureAccountLinkedToHacker,
    uploadResume: Middleware.Util.asyncMiddleware(uploadResume),
    downloadResume: Middleware.Util.asyncMiddleware(downloadResume),
    sendStatusUpdateEmail: sendStatusUpdateEmail,
    updateHacker: Middleware.Util.asyncMiddleware(updateHacker),
};