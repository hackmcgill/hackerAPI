"use strict";

const TAG = `[ HACKER.MIDDLEWARE.js ]`;
const mongoose = require("mongoose");
const Services = {
    Hacker: require("../services/hacker.service"),
    Storage: require("../services/storage.service"),
    Email: require("../services/email.service"),
    Account: require("../services/account.service"),
    Travel: require("../services/travel.service"),
    Env: require("../services/env.service")
};
const Middleware = {
    Util: require("./util.middleware")
};
const Constants = {
    General: require("../constants/general.constant"),
    Error: require("../constants/error.constant")
};

/**
 * @function parsePatch
 * @param {body: {id: ObjectId}} req
 * @param {*} res
 * @param {(err?) => void} next
 * @return {void}
 * @description Delete the req.body.id that was added by the validation of route parameter.
 */
function parsePatch(req, res, next) {
    delete req.body.id;
    return next();
}

/**
 * @function parseHacker
 * @param {{body: {accountId: ObjectId, application: Object, authorization: string}}} req
 * @param {*} res
 * @param {(err?)=>void} next
 * @return {void}
 * @description
 * Moves accountId, application from req.body to req.body.hackerDetails.
 * Adds _id to hackerDetails.
 */
function parseHacker(req, res, next) {
    const hackerDetails = {
        _id: mongoose.Types.ObjectId(),
        accountId: req.body.accountId,
        application: req.body.application,
        teamId: req.body.teamId
    };
    req.body.token = req.body.authorization;

    delete req.body.accountId;
    delete req.body.application;
    delete req.body.teamId;

    req.body.hackerDetails = hackerDetails;

    return next();
}

/**
 * @function parseCheckin
 * @param {{body: {*}}} req
 * @param {*} res
 * @param {(err?)=>void} next
 * @return {void}
 * @description
 * Adds the checked-in status to req.body
 */
function parseCheckIn(req, res, next) {
    req.body.status = Constants.General.HACKER_STATUS_CHECKED_IN;

    return next();
}

/**
 * @function parseCheckin
 * @param {{body: {confirm: boolean}}} req
 * @param {*} res
 * @param {(err?)=>void} next
 * @return {void}
 * @description
 * Changes req.body.status to confirmed or withdrawn depending on whether req.body.confirm is true or false respectively.
 * Deletes req.body.confirm afterwards
 */
function parseConfirmation(req, res, next) {
    const confirm = req.body.confirm;

    if (confirm) {
        req.body.status = Constants.General.HACKER_STATUS_CONFIRMED;
    } else {
        req.body.status = Constants.General.HACKER_STATUS_WITHDRAWN;
    }

    delete req.body.confirm;
    return next();
}

/**
 * @function addDefaultStatus
 * @param {{body: {hackerDetails: {status: String}}}} req
 * @param {JSON} res
 * @param {(err?)=>void} next
 * @return {void}
 * @description Adds status to hackerDetails.
 */
function addDefaultStatus(req, res, next) {
    req.body.hackerDetails.status = "Applied";
    return next();
}

/**
 * Helper function that validates if account is confirmed and is of proper type
 * @param account account object containing the information for an account
 * @param {(err?) => void} next
 */
async function validateConfirmedStatus(account, next) {
    if (!account) {
        return next({
            status: 404,
            message: Constants.Error.ACCOUNT_404_MESSAGE,
            error: {}
        });
    } else if (!account.confirmed) {
        return next({
            status: 403,
            message: Constants.Error.ACCOUNT_403_MESSAGE,
            error: {}
        });
    } else if (account.accountType !== Constants.General.HACKER) {
        return next({
            status: 409,
            message: Constants.Error.ACCOUNT_TYPE_409_MESSAGE
        });
    } else {
        return next();
    }
}

/**
 * Verifies that account is confirmed and of proper type from the account ID passed in req.body.accountId
 * @param {{body: {accountId: ObjectId}}} req
 * @param {*} res
 * @param {(err?) => void} next
 */
async function validateConfirmedStatusFromAccountId(req, res, next) {
    const account = await Services.Account.findById(req.body.accountId);
    return validateConfirmedStatus(account, next);
}

/**
 * Verifies that account is confirmed and of proper type from the hacker ID passed in req.params.id
 * @param {{params: {id: ObjectId}}} req
 * @param {*} res
 * @param {(err?) => void} next
 */
async function validateConfirmedStatusFromHackerId(req, res, next) {
    const hacker = await Services.Hacker.findById(req.params.id);
    if (hacker == null) {
        return next({
            status: 404,
            message: Constants.Error.HACKER_404_MESSAGE,
            data: req.body.hackerId
        });
    }
    const account = await Services.Account.findById(hacker.accountId);
    return validateConfirmedStatus(account, next);
}

/**
 * Verifies that account is confirmed and of proper type from the account object passed in req.body.account
 * @param {{body: {account: Object}}} req
 * @param {*} res
 * @param {(err?) => void} next
 */
async function validateConfirmedStatusFromObject(req, res, next) {
    return validateConfirmedStatus(req.body.account, next);
}

/**
 * @async
 * @function findById
 * @param {{body: {id: ObjectId}}} req
 * @param {*} res
 * @description Retrieves a hacker's information via req.body.id, moving result to req.body.hacker if succesful.
 */
async function findById(req, res, next) {
    const hacker = await Services.Hacker.findById(req.body.id);

    if (!hacker) {
        return next({
            status: 404,
            message: Constants.Error.HACKER_404_MESSAGE
        });
    }

    req.body.hacker = hacker;
    next();
}

async function findByEmail(req, res, next) {
    const account = await Services.Account.findByEmail(req.body.email);
    if (!account) {
        return next({
            status: 404,
            message: Constants.Error.ACCOUNT_404_MESSAGE,
            error: {}
        });
    }
    const hacker = await Services.Hacker.findByAccountId(account._id);
    if (!hacker) {
        return next({
            status: 404,
            message: Constants.Error.HACKER_404_MESSAGE,
            error: {}
        });
    }

    req.body.hacker = hacker;
    next();
}

/**
 * Verifies that the current signed in user is linked to the hacker passed in via req.body.id
 * @param {{body: {id: ObjectId}}} req
 * @param {*} res
 * @param {(err?)=>void} next
 */
// must check that the account id is in the hacker schema.
function ensureAccountLinkedToHacker(req, res, next) {
    Services.Hacker.findById(req.body.id)
        .then((hacker) => {
            req.hacker = hacker;
            if (
                hacker &&
                req.user &&
                String.toString(hacker.accountId) ===
                String.toString(req.user.id)
            ) {
                return next();
            } else {
                return next({
                    status: 403,
                    message: Constants.Error.AUTH_403_MESSAGE,
                    error: {}
                });
            }
        })
        .catch(next);
}

/**
 * Uploads resume via the storage service. Assumes there is a resume in req, and a hacker id in req.body.
 * @param {{body: {id: ObjectId}, resume: [Buffer]}} req
 * @param {*} res
 * @param {(err?)=>void} next
 */
async function uploadResume(req, res, next) {
    const gcfilename = `resumes/${Date.now()}-${req.hacker.id}`;
    await Services.Storage.upload(req.file, gcfilename);
    req.body.gcfilename = gcfilename;
    await Services.Hacker.updateOne(req.hacker.id, {
        $set: {
            "application.general.URL.resume": gcfilename
        }
    });
    return next();
}

/**
 * Attaches the resume of a hacker to req.body.resume. Assumes req.body.id exists.
 * @param {{body: {id: ObjectId}}} req
 * @param {*} res
 * @param {(err?)=>void} next
 */
async function downloadResume(req, res, next) {
    const hacker = await Services.Hacker.findById(req.body.id);
    if (
        hacker &&
        hacker.application &&
        hacker.application.general &&
        hacker.application.general.URL &&
        hacker.application.general.URL.resume
    ) {
        req.body.resume = await Services.Storage.download(
            hacker.application.general.URL.resume
        );
    } else {
        return next({
            status: 404,
            message: Constants.Error.RESUME_404_MESSAGE,
            error: {}
        });
    }
    return next();
}
/**
 * Sends a preset email to a user if a status change occured.
 * @param {{body: {status?: string}, params: {id: string}}} req
 * @param {*} res
 * @param {(err?:*)=>void} next
 */
async function sendStatusUpdateEmail(req, res, next) {
    //skip if the status doesn't exist
    if (!req.body.status) {
        return next();
    } else {
        // send it to the hacker that is being updated.
        const hacker = await Services.Hacker.findById(req.params.id);
        const account = await Services.Account.findById(hacker.accountId);
        if (!hacker) {
            return next({
                status: 404,
                message: Constants.Error.HACKER_404_MESSAGE
            });
        } else if (!account) {
            return next({
                status: 500,
                message: Constants.Error.GENERIC_500_MESSAGE
            });
        }
        Services.Email.sendStatusUpdate(
            account.firstName,
            account.email,
            req.body.status,
            next
        );
    }
}

/**
 * Sends a preset email to a user if a status change occured with email params.
 * @param {{body: {status?: string}, params: {email: string}}} req
 * @param {*} res
 * @param {(err?:*)=>void} next
 */
async function completeStatusUpdateEmail(req, res, next) {
    //skip if the status doesn't exist
    if (!req.body.hacker.status) {
        return next();
    } else {
        // send it to the hacker that is being updated.
        const hacker = await Services.Hacker.findById(req.body.hacker._id);
        const account = await Services.Account.findById(hacker.accountId);
        if (!hacker) {
            return next({
                status: 404,
                message: Constants.Error.HACKER_404_MESSAGE
            });
        } else if (!account) {
            return next({
                status: 500,
                message: Constants.Error.GENERIC_500_MESSAGE
            });
        }
        Services.Email.sendStatusUpdate(
            account.firstName,
            account.email,
            req.body.hacker.status,
            next
        );
    }
}

/**
 * Sends an email telling the user that they have applied. This is used exclusively when we POST a hacker.
 * @param {{body: {hacker: {accountId: string}}}} req
 * @param {*} res
 * @param {(err?:*)=>void} next
 */
async function sendAppliedStatusEmail(req, res, next) {
    const hacker = req.body.hacker;
    const account = await Services.Account.findById(hacker.accountId);
    if (!account) {
        return next({
            status: 500,
            message: Constants.Error.GENERIC_500_MESSAGE,
            error: {}
        });
    }
    Services.Email.sendStatusUpdate(
        account.firstName,
        account.email,
        Constants.General.HACKER_STATUS_APPLIED,
        next
    );
}

/**
 * Sends an email telling the user that they have applied. This is used exclusively when we POST a hacker.
 * @param {{body: {hacker: {accountId: string}}}} req
 * @param {*} res
 * @param {(err?:*)=>void} next
 */
async function sendWeekOfEmail(req, res, next) {
    const hacker = req.body.hacker;
    const address = Services.Env.isProduction()
        ? process.env.FRONTEND_ADDRESS_DEPLOY
        : process.env.FRONTEND_ADDRESS_DEV;
    const httpOrHttps = address.includes("localhost") ? "http" : "https";
    const singleHackerViewLink = Services.Hacker.generateHackerViewLink(
        httpOrHttps,
        address,
        hacker._id.toString()
    );
    const ticketSVG = await Services.Hacker.generateQRCode(
        singleHackerViewLink
    );
    const account = await Services.Account.findById(hacker.accountId);
    if (!account || !ticketSVG) {
        return next({
            status: 500,
            message: Constants.Error.GENERIC_500_MESSAGE,
            error: {}
        });
    }
    Services.Email.sendWeekOfEmail(
        account.firstName,
        account.email,
        ticketSVG,
        next
    );
}

/**
 * Sends an email telling the user that they have applied. This is used exclusively when we POST a hacker.
 * @param {{body: {hacker: {accountId: string}}}} req
 * @param {*} res
 * @param {(err?:*)=>void} next
 */
async function sendDayOfEmail(req, res, next) {
    const hacker = req.body.hacker;
    const account = await Services.Account.findById(hacker.accountId);
    if (!account) {
        return next({
            status: 500,
            message: Constants.Error.GENERIC_500_MESSAGE,
            error: {}
        });
    }
    Services.Email.sendDayOfEmail(account.firstName, account.email, next);
}

/**
 * If the current hacker's status is Constants.HACKER_STATUS_NONE, and the hacker's application is completed,
 * then it will change the status of the hacker to Constants.General.HACKER_STATUS_APPLIED, and then email the hacker to
 * confirm that they applied.
 * @param {{body: {status?: string}, params: {id: string}}} req
 * @param {*} res
 * @param {(err?:*)=>void} next
 */
async function updateStatusIfApplicationCompleted(req, res, next) {
    const hacker = await Services.Hacker.findById(req.params.id);
    if (hacker) {
        if (
            hacker.status === Constants.General.HACKER_STATUS_NONE &&
            hacker.isApplicationComplete()
        ) {
            await Services.Hacker.updateOne(req.params.id, {
                status: Constants.General.HACKER_STATUS_APPLIED
            });
            const account = await Services.Account.findById(hacker.accountId);
            if (!account) {
                return next({
                    status: 500,
                    message: Constants.Error.GENERIC_500_MESSAGE,
                    error: {}
                });
            }
            Services.Email.sendStatusUpdate(
                account.firstName,
                account.email,
                Constants.General.HACKER_STATUS_APPLIED,
                next
            );
        } else {
            return next();
        }
    } else {
        return next({
            status: 404,
            message: Constants.Error.HACKER_404_MESSAGE,
            data: {
                id: req.params.id
            }
        });
    }
}

/**
 * Checks that the hacker's status matches one of the input statuses
 * @param {String[]} statuses
 * @returns {(req, res, next) => {}} the middleware that will check hacker's status
 */
function checkStatus(statuses) {
    return Middleware.Util.asyncMiddleware(async (req, res, next) => {
        let hacker = await Services.Hacker.findById(req.params.id);

        if (!!hacker) {
            const status = hacker.status;
            // makes sure the hacker's status is in the accepted statuses list
            if (statuses.indexOf(status) === -1) {
                return next({
                    status: 409,
                    message: Constants.Error.HACKER_STATUS_409_MESSAGE,
                    data: {
                        id: req.params.id,
                        validStatuses: statuses
                    }
                });
            }

            return next();
        } else {
            return next({
                status: 404,
                message: Constants.Error.HACKER_404_MESSAGE,
                data: {
                    id: req.params.id
                }
            });
        }
    });
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
    if (hacker) {
        const acct = await Services.Account.findById(hacker.accountId);
        if (!acct) {
            return next({
                status: 500,
                message: Constants.Error.HACKER_UPDATE_500_MESSAGE,
                data: {
                    hackerId: hacker.id,
                    accountId: hacker.accountId
                }
            });
        }
        req.email = acct.email;

        // If this hacker has a travel account associated with it, then update request to reflect amount wanted for travel
        const travel = await Services.Travel.findByHackerId(hacker.id);
        if (travel) {
            await Services.Travel.updateOne(travel.id, { "request": hacker.application.accommodation.travel });
        }
        return next();
    } else {
        return next({
            status: 404,
            message: Constants.Error.HACKER_404_MESSAGE,
            data: {
                id: req.params.id
            }
        });
    }
}

/**
 * Updates a hacker that is specified by req.body.hacker._id, and then sets req.email
 * to the email of the hacker, found in Account.
 * @param {{params:{_id: string}, body: *}} req
 * @param {*} res
 * @param {*} next
 */
async function obtainEmailByHackerId(req, res, next) {
    const hacker = await Services.Hacker.findById(req.body.hacker._id);
    if (hacker) {
        const acct = await Services.Account.findById(hacker.accountId);
        if (!acct) {
            return next({
                status: 500,
                message: Constants.Error.HACKER_UPDATE_500_MESSAGE,
                data: {
                    hackerId: hacker.id,
                    accountId: hacker.accountId
                }
            });
        }
        req.email = acct.email;
        return next();
    } else {
        return next({
            status: 404,
            message: Constants.Error.HACKER_404_MESSAGE,
            data: {
                id: req.params.id
            }
        });
    }
}

/**
 * Sets req.body.status to Accepted for next middleware.
 * @param {{params:{id: string}, body: *}} req 
 * @param {*} res 
 * @param {*} next 
 */
function parseAccept(req, res, next) {
    req.body.status = Constants.General.HACKER_STATUS_ACCEPTED;
    req.hackerId = req.params.id;
    next();
}

/**
 * Sets req.body.hacker.status to Accepted for next middleware.
 * @param {{params:{email: string}, body: *}} req 
 * @param {*} res 
 * @param {*} next 
 */
function parseAcceptEmail(req, res, next) {
    req.body.hacker.status = Constants.General.HACKER_STATUS_ACCEPTED;
    req.hackerId = req.body.hacker._id;
    next();
}


/**
 * @function createHacker
 * @param {{body: {hackerDetails: object}}} req
 * @param {*} res
 * @param {(err?)=>void} next
 * @return {void}
 * @description
 * Creates hacker document after making sure there is no other hacker with the same linked accountId
 */
async function createHacker(req, res, next) {
    const hackerDetails = req.body.hackerDetails;

    const exists = await Services.Hacker.findByAccountId(
        hackerDetails.accountId
    );

    if (exists) {
        return next({
            status: 422,
            message: Constants.Error.ACCOUNT_DUPLICATE_422_MESSAGE,
            data: {
                id: hackerDetails.accountId
            }
        });
    }
    const hacker = await Services.Hacker.createHacker(hackerDetails);
    if (!!hacker) {
        req.body.hacker = hacker;
        return next();
    } else {
        return next({
            status: 500,
            message: Constants.Error.HACKER_CREATE_500_MESSAGE,
            data: {}
        });
    }
}

/**
 * Checks that there are no other hackers with the same account id as the one passed into req.body.accountId
 * @param {{body:{accountId: ObjectId}}} req
 * @param {*} res
 * @param {*} next
 */
async function checkDuplicateAccountLinks(req, res, next) {
    const hacker = await Services.Hacker.findByAccountId(req.body.accountId);
    if (!hacker) {
        return next();
    } else {
        return next({
            status: 409,
            message: Constants.Error.HACKER_ID_409_MESSAGE,
            data: {
                id: req.body.accountId
            }
        });
    }
}

/**
 * Finds the hacker information of the logged in user
 * @param {{user: {id: string}}} req
 * @param {*} res
 * @param {(err?)=>void} next
 */
async function findSelf(req, res, next) {
    if (
        req.user.accountType != Constants.General.HACKER ||
        !req.user.confirmed
    ) {
        return next({
            status: 409,
            message: Constants.Error.ACCOUNT_TYPE_409_MESSAGE,
            error: {
                id: req.user.id
            }
        });
    }

    const hacker = await Services.Hacker.findByAccountId(req.user.id);

    if (!!hacker) {
        req.body.hacker = hacker;
        return next();
    } else {
        return next({
            status: 409,
            message: Constants.Error.HACKER_404_MESSAGE,
            error: {
                id: req.user.id
            }
        });
    }
}

async function getStats(req, res, next) {
    const stats = await Services.Hacker.getStats(req.body.results);
    req.body.stats = stats;
    next();
}

module.exports = {
    parsePatch: parsePatch,
    parseHacker: parseHacker,
    addDefaultStatus: addDefaultStatus,
    ensureAccountLinkedToHacker: ensureAccountLinkedToHacker,
    uploadResume: Middleware.Util.asyncMiddleware(uploadResume),
    downloadResume: Middleware.Util.asyncMiddleware(downloadResume),
    sendWeekOfEmail: Middleware.Util.asyncMiddleware(sendWeekOfEmail),
    sendDayOfEmail: Middleware.Util.asyncMiddleware(sendDayOfEmail),
    sendStatusUpdateEmail: Middleware.Util.asyncMiddleware(
        sendStatusUpdateEmail
    ),
    sendAppliedStatusEmail: Middleware.Util.asyncMiddleware(
        sendAppliedStatusEmail
    ),
    updateHacker: Middleware.Util.asyncMiddleware(updateHacker),
    obtainEmailByHackerId: Middleware.Util.asyncMiddleware(obtainEmailByHackerId),
    parseAccept: parseAccept,
    parseAcceptEmail: parseAcceptEmail,
    validateConfirmedStatusFromAccountId: Middleware.Util.asyncMiddleware(
        validateConfirmedStatusFromAccountId
    ),
    validateConfirmedStatusFromHackerId: Middleware.Util.asyncMiddleware(
        validateConfirmedStatusFromHackerId
    ),
    validateConfirmedStatusFromObject: Middleware.Util.asyncMiddleware(
        validateConfirmedStatusFromObject
    ),
    completeStatusUpdateEmail: Middleware.Util.asyncMiddleware(
        completeStatusUpdateEmail
    ),
    checkDuplicateAccountLinks: Middleware.Util.asyncMiddleware(
        checkDuplicateAccountLinks
    ),
    updateStatusIfApplicationCompleted: Middleware.Util.asyncMiddleware(
        updateStatusIfApplicationCompleted
    ),
    checkStatus: checkStatus,
    parseCheckIn: parseCheckIn,
    parseConfirmation: parseConfirmation,
    createHacker: Middleware.Util.asyncMiddleware(createHacker),
    findSelf: Middleware.Util.asyncMiddleware(findSelf),
    getStats: Middleware.Util.asyncMiddleware(getStats),
    findById: Middleware.Util.asyncMiddleware(findById),
    findByEmail: Middleware.Util.asyncMiddleware(findByEmail)
};
