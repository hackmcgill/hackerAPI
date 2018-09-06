// must check that the account id is in the hacker schema.
"use strict";
const Services = {
    Hacker: require("../services/hacker.service"),
    Storage: require("../services/storage.service")
};
const Middleware = {
    Util: require("./util.middleware")
}

module.exports = {
    ensureAccountLinkedToHacker: ensureAccountLinkedToHacker,
    uploadResume: Middleware.Util.asyncMiddleware(uploadResume),
    downloadResume: Middleware.Util.asyncMiddleware(downloadResume)
};

/**
 * Verifies that the current signed in user is linked to the hacker passed in via req.body.id
 * @param {*} req 
 * @param {*} res 
 * @param {*} next 
 */
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
    await Services.Hacker.update(req.body.id, { $set: {"application.portfolioURL.resume": gcfilename}});
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