"use strict";
const {
    body,
    query,
    param
} = require("express-validator/check");
const logger = require("../../services/logger.service");
const Skill = require("../../services/skill.service");
const Team = require("../../services/team.service");
const mongoose = require("mongoose");
const TAG = `[ VALIDATOR.HELPER.js ]`;
const Constants = require("../../constants");

/**
 * Validates that field is a valid devpost URL
 * @param {"get" | "post"} getOrPost Whether the query is sent as a get or post request
 * @param {string} fieldname Name of the field that needs to be validated.
 * @param {boolean} optional Whether the field is optional or not.
 */
function devpostValidator (getOrPost, fieldname, optional = true) {
    var devpostUrl;

    if (getOrPost === "get") {
        devpostUrl = query(fieldname, "invalid integer");
    } else {
        devpostUrl = body(fieldname, "invalid integer");
    }

    // match optional https://, http://, www., then optional pre-devpost part, then devpost.com with different routes and params
    if (optional) {
        return devpostUrl.optional({ checkFalsy: true })
            .matches(Constants.DEVPOST_REGEX)
            .withMessage("must be valid devpost url");
    } else {
        return devpostUrl.exists().withMessage("devpost url must exist")
            .matches(Constants.DEVPOST_REGEX)
            .withMessage("must be valid devpost url");
    }
}

/**
 * Validates that field is a valid integer
 * @param {"get" | "post"} getOrPost Whether the query is sent as a get or post request
 * @param {string} fieldname Name of the field that needs to be validated.
 * @param {boolean} optional Whether the field is optional or not.
 * @param {number} lowerBound Lower bound for a valid integer.
 * @param {number} upperBound Lpper bound for a valid integer.
 */
function integerValidator (getOrPost, fieldname, optional = true, lowerBound = -Infinity, upperBound = Infinity) {
    var value;

    if (getOrPost === "get") {
        value = query(fieldname, "invalid integer");
    } else {
        value = body(fieldname, "invalid integer");
    }

    if (optional) {
        return value.optional({ checkFalsy: true })
            .isInt().withMessage("tier must be an integer.")
            .custom((value) => {
                return value >= lowerBound && value <= upperBound;
            }).withMessage("tier must be between 0 and 5");
    } else {
        return value.exists().withMessage("tier must exist")
            .isInt().withMessage("tier must be an integer.")
            .custom((value) => {
                return value >= lowerBound && value <= upperBound;
            }).withMessage("tier must be between 0 and 5");
    }
}

/**
 * Validates that field is a valid mongoID
 * @param {"get" | "post"} getOrPost Whether the query is sent as a get or post request
 * @param {string} fieldname Name of the field that needs to be validated.
 * @param {boolean} optional Whether the field is optional or not.
 */
function mongoIdValidator (getOrPostOrParam, fieldname, optional = true) {
    var mongoId;

    if (getOrPostOrParam === "get") {
        mongoId = query(fieldname, "invalid mongoID");
    } else if(getOrPostOrParam === "post") {
        mongoId = body(fieldname, "invalid mongoID");
    } else {
        mongoId = param(fieldname, "invalid mongoID");
    }

    if (optional) {
        return mongoId.optional({ checkFalsy: true }).isMongoId().withMessage("must be a valid mongoID");
    } else {
        return mongoId.exists().isMongoId().withMessage("must be a valid mongoID");
    }
}

/**
 * Validates that field is a valid mongoID array
 * @param {"get" | "post"} getOrPost Whether the query is sent as a get or post request
 * @param {string} fieldname Name of the field that needs to be validated.
 * @param {boolean} optional Whether the field is optional or not.
 */
function mongoIdArrayValidator (getOrPost, fieldname, optional = true) {
    var arr;

    if (getOrPost === "get") {
        arr = query(fieldname, "invalid mongoID array");
    } else {
        arr = body(fieldname, "invalid mongoID array");
    }

    if (optional) {
        return arr.optional({ checkFalsy: true })
            .custom((value) => {
                return isMongoIdArray(value);
            }).withMessage("Value must be an array of mongoIDs");
    } else {
            return arr.exists()
            .custom((value) => {
                return isMongoIdArray(value);
            }).withMessage("Value must be an array of mongoIDs");
    }
}

/**
 * Validates that field is a valid boolean
 * @param {"get" | "post"} getOrPost Whether the query is sent as a get or post request
 * @param {string} fieldname Name of the field that needs to be validated.
 * @param {boolean} optional Whether the field is optional or not.
 */
function booleanValidator (getOrPost, fieldname, optional = true) {
    var booleanField;

    if (getOrPost === "get") {
        booleanField = query(fieldname, "invalid boolean");
    } else {
        booleanField = body(fieldname, "invalid boolean");
    }

    if (optional) {
        // do not use check falsy option as a 'false' boolean will be skipped
        return booleanField.optional().isBoolean().withMessage("must be boolean");
    } else {
        return booleanField.exists().isBoolean().withMessage("must be boolean");
    }
}

/**
 * Validates that field is a valid name with only ascii characters
 * @param {"get" | "post"} getOrPost Whether the query is sent as a get or post request
 * @param {string} fieldname Name of the field that needs to be validated.
 * @param {boolean} optional Whether the field is optional or not.
 */
function nameValidator (getOrPost, fieldname, optional = true) {
    var name;
    if (getOrPost === "get") {
        name = query(fieldname, "invalid name");
    } else {
        name = body(fieldname, "invalid name");
    }

    if (optional) {
        return name.optional({ checkFalsy: true }).isAscii().withMessage("must contain only ascii characters");
    } else {
        return name.exists().withMessage("name must exist").isAscii().withMessage("must contain only ascii characters");
    }
}

/**
 * Validates that field is a valid URL
 * @param {"get" | "post"} getOrPost Whether the query is sent as a get or post request
 * @param {string} fieldname Name of the field that needs to be validated.
 * @param {boolean} optional Whether the field is optional or not.
 * @description 
 * Matches against a regex that looks for optional http://, https://, http:, https:, and optional www.
 * Regex then looks for the domain, and then optional route, path, query parameters
 */
function urlValidator (getOrPost, fieldname, optional = true) {
    var url;
    if (getOrPost === "get") {
        url = query(fieldname, "invalid url");
    } else {
        url = body(fieldname, "invalid url");
    }

    if (optional) {
        return url.optional({ checkFalsy: true })
            .matches(Constants.URL_REGEX)
            .withMessage("must be valid url");
    } else {
        return url.exists().withMessage("url must exist")
            .matches(Constants.URL_REGEX)
            .withMessage("must be valid url");
    }
}

/**
 * Validates that field is a valid email
 * @param {"get" | "post"} getOrPost Whether the query is sent as a get or post request
 * @param {string} fieldname Name of the field that needs to be validated.
 * @param {boolean} optional Whether the field is optional or not.
 */
function emailValidator (getOrPost, fieldname, optional = true) {
    var email;
    if (getOrPost === "get") {
        email = query(fieldname, "invalid email");
    } else {
        email = body(fieldname, "invalid email");
    }

    if (optional) {
        return email.optional({ checkFalsy: true }).matches(Constants.EMAIL_REGEX).withMessage("must be valid email");
    } else {
        return email.exists().withMessage("email must exist").matches(Constants.EMAIL_REGEX).withMessage("must be valid email");
    }
}

/**
 * Validates that field only contains alphabetical characters
 * @param {"get" | "post"} getOrPost Whether the query is sent as a get or post request
 * @param {string} fieldname Name of the field that needs to be validated.
 * @param {boolean} optional Whether the field is optional or not.
 */
function alphaValidator (getOrPost, fieldname, optional = true) {
    var name;

    if (getOrPost === "get") {
        name = query(fieldname, "invalid dietary restriction");
    } else {
        name = body(fieldname, "invalid dietary restriction");
    }

    if (optional) {
        return name.optional({ checkFalsy: true}).isAlpha().withMessage("must contain alphabet characters");
    } else {
        return name.exists().withMessage("must exist").isAlpha().withMessage("must contain alphabet characters");
    }
}

/**
 * Validates that field contains valid shirt sizes
 * @param {"get" | "post"} getOrPost Whether the query is sent as a get or post request
 * @param {string} fieldname Name of the field that needs to be validated.
 * @param {boolean} optional Whether the field is optional or not.
 */
function shirtSizeValidator (getOrPost, fieldname, optional = true) {
    var size;

    if (getOrPost === "get") {
        size = query(fieldname, "invalid size");
    } else {
        size = body(fieldname, "invalid size");
    }

    if (optional) {
        return size.optional({ checkFalsy: true}).isIn(Constants.SHIRT_SIZES).withMessage(`Size must be in ${Constants.SHIRT_SIZES}`);
    } else {
        return size.exists().withMessage("shirt size must exist").isIn(Constants.SHIRT_SIZES).withMessage(`Size must be in ${Constants.SHIRT_SIZES}`);
    }
}

/**
 * Validates that field is a valid password. Checks that the length is >= 6.
 * @param {"get" | "post"} getOrPost Whether the query is sent as a get or post request
 * @param {string} fieldname Name of the field that needs to be validated.
 * @param {boolean} optional Whether the field is optional or not.
 */
function passwordValidator (getOrPost, fieldname, optional = true) {
    var password;

    if (getOrPost === "get") {
        password = query(fieldname, "invalid password");
    } else {
        password = body(fieldname, "invalid password");
    }

    if (optional) {
        return password.optional({ checkFalsy: true}).isLength({ min: 6 }).withMessage("must be longer than 6 characters");
    } else {
        return password.exists().withMessage("password must exist").isLength({ min: 6 }).withMessage("must be longer than 6 characters");
    }
}

/**
 * Validates that field is a valid status for a hacker.
 * @param {"get" | "post"} getOrPost Whether the query is sent as a get or post request
 * @param {string} fieldname Name of the field that needs to be validated.
 * @param {boolean} optional Whether the field is optional or not.
 */
function hackerStatusValidator (getOrPost, fieldname, optional = true) {
    var status;

    if (getOrPost === "get") {
        status = query(fieldname, "invalid status");
    } else {
        status = body(fieldname, "invalid status");
    }

    if (optional) {
        return status.optional({ checkFalsy: true}).isIn(Constants.HACKER_STATUSES).withMessage(`Status must be in ${Constants.HACKER_STATUSES}`);
    } else {
        return status.exists().withMessage(`Status must be in ${Constants.HACKER_STATUSES}`);
    }
}

/**
 * Validates that field is a valid application.
 * @param {"get" | "post"} getOrPost Whether the query is sent as a get or post request
 * @param {string} fieldname Name of the field that needs to be validated.
 * @param {boolean} optional Whether the field is optional or not.
 */
function applicationValidator (getOrPost, fieldname, optional = true) {
    var application;

    if (getOrPost === "get") {
        application = query(fieldname, "invalid application");
    } else {
        application = body(fieldname, "invalid application");
    }

    if (optional) {
        return application.optional({ checkFalsy: true })
            .custom(app => {
                let jobInterests = Constants.JOB_INTERESTS;
                return (
                    (!app.portfolioURL.resume || typeof(app.portfolioURL.resume) === "string") &&
                    (!app.portfolioURL.github || typeof(app.portfolioURL.github) === "string") &&
                    (!app.portfolioURL.dropler || typeof(app.portfolioURL.dropler) === "string") &&
                    (!app.portfolioURL.personal || typeof(app.portfolioURL.personal) === "string") &&
                    (!app.portfolioURL.linkedIn || typeof(app.portfolioURL.linkedIn) === "string") &&
                    (!app.portfolioURL.other || typeof(app.portfolioURL.other) === "string") &&
                    (!app.jobInterest || jobInterests.includes(app.jobInterest)) &&
                    (!app.skills || isMongoIdArray(app.skills)) &&
                    (!app.comments || typeof(app.comments) === "string") &&
                    (!app.essay || typeof(app.essay) === "string") &&
                    (!app.team || Team.isTeamIdValid(app.team))
                );
            });
    } else {
        return application.exists().withMessage("application must exist")
            .custom(app => {
                let jobInterests = Constants.JOB_INTERESTS;
                return (
                    // resume must be entered when first creating hacker
                    typeof(app.portfolioURL.resume === "string") &&
                    (!app.portfolioURL.github || typeof(app.portfolioURL.github) === "string") &&
                    (!app.portfolioURL.dropler || typeof(app.portfolioURL.dropler) === "string") &&
                    (!app.portfolioURL.personal || typeof(app.portfolioURL.personal) === "string") &&
                    (!app.portfolioURL.linkedIn || typeof(app.portfolioURL.linkedIn) === "string") &&
                    (!app.portfolioURL.other || typeof(app.portfolioURL.other) === "string") &&
                    // job interest must be entered when first creating hacker
                    jobInterests.includes(app.jobInterest) &&
                    (!app.skills || isMongoIdArray(app.skills)) &&
                    (!app.comments || typeof(app.comments) === "string") &&
                    (!app.essay || typeof(app.essay) === "string") &&
                    (!app.team || Team.isTeamIdValid(app.team))
                );
            });
    }
}

/**
 * Validates that field is a valid skill.
 * @param {"get" | "post"} getOrPost Whether the query is sent as a get or post request
 * @param {string} fieldname Name of the field that needs to be validated.
 * @param {boolean} optional Whether the field is optional or not.
 */
function isMongoIdArray (arr) {
    if (!Array.isArray(arr)) {
        return false;
    }

    arr.forEach(ele => {
        if (!mongoose.Types.ObjectId.isValid(ele)) {
            return false;
        }
    });

    return true;
}

module.exports = {
    devpostValidator: devpostValidator,
    integerValidator: integerValidator,
    mongoIdValidator: mongoIdValidator,
    mongoIdArrayValidator: mongoIdArrayValidator,
    nameValidator: nameValidator,
    emailValidator: emailValidator,
    alphaValidator: alphaValidator,
    shirtSizeValidator: shirtSizeValidator,
    passwordValidator: passwordValidator,
    hackerStatusValidator: hackerStatusValidator,
    booleanValidator: booleanValidator,
    applicationValidator: applicationValidator,
    urlValidator: urlValidator,
};