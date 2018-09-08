"use strict";
const {
    body,
    query,
    header,
    param
} = require("express-validator/check");
const logger = require("../../services/logger.service");
const mongoose = require("mongoose");
const TAG = `[ VALIDATOR.HELPER.js ]`;
const jwt = require("jsonwebtoken");
const Constants = require("../../constants");

/**
 * Validates that field is a valid devpost URL
 * @param {"query" | "body" | "header" | "param"} fieldLocation the location where the field should be found 
 * @param {string} fieldname Name of the field that needs to be validated.
 * @param {boolean} optional Whether the field is optional or not.
 */
function devpostValidator (fieldLocation, fieldname, optional = true) {
    const devpostUrl = setProperValidationChainBuilder(fieldLocation, fieldname, "invalid web address");
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
 * @param {"query" | "body" | "header" | "param"} fieldLocation the location where the field should be found 
 * @param {string} fieldname Name of the field that needs to be validated.
 * @param {boolean} optional Whether the field is optional or not.
 * @param {number} lowerBound Lower bound for a valid integer.
 * @param {number} upperBound Lpper bound for a valid integer.
 */
function integerValidator (fieldLocation, fieldname, optional = true, lowerBound = -Infinity, upperBound = Infinity) {
    const value = setProperValidationChainBuilder(fieldLocation, fieldname, "invalid integer");

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
 * @param {"query" | "body" | "header" | "param"} fieldLocation the location where the field should be found 
 * @param {string} fieldname Name of the field that needs to be validated.
 * @param {boolean} optional Whether the field is optional or not.
 */
function mongoIdValidator (fieldLocation, fieldname, optional = true) {
    const mongoId = setProperValidationChainBuilder(fieldLocation, fieldname, "invalid mongoID array");

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
function mongoIdArrayValidator (fieldLocation, fieldname, optional = true) {
    const arr = setProperValidationChainBuilder(fieldLocation, fieldname, "invalid mongoID array");

    if (optional) {
        return arr.optional({ checkFalsy: true })
            .custom(isMongoIdArray).withMessage("Value must be an array of mongoIDs");
    } else {
        return arr.exists()
            .custom(isMongoIdArray).withMessage("Value must be an array of mongoIDs");
    }
}

/**
 * Validates that field must be boolean.
 * @param {"query" | "body" | "header" | "param"} fieldLocation the location where the field should be found 
 * @param {string} fieldname name of the field that needs to be validated.
 * @param {boolean} optional whether the field is optional or not.
 */
function booleanValidator (fieldLocation, fieldname, optional = true) {
    const booleanField = setProperValidationChainBuilder(fieldLocation, fieldname, "invalid boolean");

    if (optional) {
        // do not use check falsy option as a 'false' boolean will be skipped
        return booleanField.optional().isBoolean().withMessage("must be boolean");
    } else {
        return booleanField.exists().isBoolean().withMessage("must be boolean");
    }
}

// untested
/**
 * Validates that field name is ascii only.
 * @param {"query" | "body" | "header" | "param"} fieldLocation the location where the field should be found 
 * @param {string} fieldname name of the field that needs to be validated.
 * @param {boolean} optional whether the field is optional or not.
 */
function nameValidator (fieldLocation, fieldname, optional = true) {
    const name = setProperValidationChainBuilder(fieldLocation, fieldname, "invalid name");
    if (optional) {
        return name.optional({ checkFalsy: true }).isAscii().withMessage("must contain only ascii characters");
    } else {
        return name.exists().withMessage("name must exist").isAscii().withMessage("must contain only ascii characters");
    }
}

/**
 * Validates that field is a valid URL
 * @param {"query" | "body" | "header" | "param"} fieldLocation the location where the field should be found 
 * @param {string} fieldname Name of the field that needs to be validated.
 * @param {boolean} optional Whether the field is optional or not.
 * @description 
 * Matches against a regex that looks for optional http://, https://, http:, https:, and optional www.
 * Regex then looks for the domain, and then optional route, path, query parameters
 */
function urlValidator (fieldLocation, fieldname, optional = true) {
    const url = setProperValidationChainBuilder(fieldLocation, fieldname, "invalid name");

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
 * Validates that field must be email.
 * @param {"query" | "body" | "header" | "param"} fieldLocation the location where the field should be found 
 * @param {string} fieldname name of the field that needs to be validated.
 * @param {boolean} optional whether the field is optional or not.
 */
function emailValidator(fieldLocation, fieldname, optional = true) {
    const email = setProperValidationChainBuilder(fieldLocation, fieldname, "invalid email");
    if (optional) {
        return email.optional({ checkFalsy: true }).matches(Constants.EMAIL_REGEX).withMessage("must be valid email");
    } else {
        return email.exists().withMessage("email must exist").matches(Constants.EMAIL_REGEX).withMessage("must be valid email");
    }
}

/**
 * Validates that field must be alphabetical.
 * @param {"query" | "body" | "header" | "param"} fieldLocation the location where the field should be found 
 * @param {string} fieldname name of the field that needs to be validated.
 * @param {boolean} optional whether the field is optional or not.
 */
function alphaValidator (fieldLocation, fieldname, optional = true) {
    const name = setProperValidationChainBuilder(fieldLocation, fieldname, "invalid alpha string");
    if (optional) {
        return name.optional({ checkFalsy: true}).isAlpha().withMessage("must contain alphabet characters");
    } else {
        return name.exists().withMessage("must exist").isAlpha().withMessage("must contain alphabet characters");
    }
}

/**
 * Validates that field must be one of the shirt size enums.
 * @param {"query" | "body" | "header" | "param"} fieldLocation the location where the field should be found 
 * @param {string} fieldname name of the field that needs to be validated.
 * @param {boolean} optional whether the field is optional or not.
 */
function shirtSizeValidator (fieldLocation, fieldname, optional = true) {
    const size = setProperValidationChainBuilder(fieldLocation, fieldname, "invalid shirt size");
    const shirtSizes = ["XS", "S", "M", "L", "XL", "XXL"];

    if (optional) {
        return size.optional({ checkFalsy: true}).isIn(shirtSizes).withMessage(`Must be one of ${shirtSizes.join(",")}`);
    } else {
        return size.exists().withMessage("shirt size must exist").isIn(shirtSizes).withMessage(`must be one of ${shirtSizes.join(",")}`);
    }
}

/**
 * Validates that field must be at least 6 characters long. 
 * TODO: impose better restrictions.
 * @param {"query" | "body" | "header" | "param"} fieldLocation the location where the field should be found 
 * @param {string} fieldname name of the field that needs to be validated.
 * @param {boolean} optional whether the field is optional or not.
 */
function passwordValidator (fieldLocation, fieldname, optional = true) {
    const password = setProperValidationChainBuilder(fieldLocation, fieldname, "invalid password");
    if (optional) {
        return password.optional({ checkFalsy: true}).isLength({ min: 6 }).withMessage("must be longer than 6 characters");
    } else {
        return password.exists().withMessage("password must exist").isLength({ min: 6 }).withMessage("must be longer than 6 characters");
    }
}

/**
 * Validates that field must be one of the status enums.
 * @param {"query" | "body" | "header" | "param"} fieldLocation the location where the field should be found 
 * @param {string} fieldname name of the field that needs to be validated.
 * @param {boolean} optional whether the field is optional or not.
 */
function hackerStatusValidator (fieldLocation, fieldname, optional = true) {
    const status = setProperValidationChainBuilder(fieldLocation, fieldname, "invalid status");

    if (optional) {
        return status.optional({ checkFalsy: true}).isIn(Constants.HACKER_STATUSES).withMessage(`Status must be in ${Constants.HACKER_STATUSES}`);
    } else {
        return status.exists().withMessage(`Status must be in ${Constants.HACKER_STATUSES}`);
    }
}

/**
 * Validates that field must be a valid application.
 * @param {"query" | "body" | "header" | "param"} fieldLocation the location where the field should be found 
 * @param {string} fieldname name of the field that needs to be validated.
 * @param {boolean} optional whether the field is optional or not.
 */
function applicationValidator (fieldLocation, fieldname, optional = true) {
    const application = setProperValidationChainBuilder(fieldLocation, fieldname, "invalid application");

    //helper object to iterate through the items in the application and track which items are not valid.
    const hasValid = {
        resume: false,
        github: false,
        dropler: false,
        personal: false,
        linkedIn: false,
        other: false,
        jobInterest: false,
        skills: false,
        comments: false,
        essay: false,
        team: false
    };
    if (optional) {
        return application.optional({ checkFalsy: true}).custom(app => {
            const jobInterests = Constants.JOB_INTERESTS;
            hasValid.resume = (!app.portfolioURL.resume || typeof(app.portfolioURL.resume) === "string");
            hasValid.github = (!app.portfolioURL.github || typeof(app.portfolioURL.github) === "string");
            hasValid.dropler = (!app.portfolioURL.dropler || typeof(app.portfolioURL.dropler) === "string");
            hasValid.personal = (!app.portfolioURL.personal || typeof(app.portfolioURL.personal) === "string");
            hasValid.linkedIn = (!app.portfolioURL.linkedIn || typeof(app.portfolioURL.linkedIn) === "string");
            hasValid.other = (!app.portfolioURL.other || typeof(app.portfolioURL.other) === "string");
            hasValid.jobInterest = (!app.jobInterest || jobInterests.includes(app.jobInterest));
            hasValid.skills = (!app.skills || isMongoIdArray(app.skills));
            hasValid.comments = (!app.comments || typeof(app.comments) === "string");
            hasValid.essay = (!app.essay || typeof(app.essay) === "string");
            hasValid.team = (!app.team || mongoose.Types.ObjectId.isValid(app.team));
            return  hasValid.comments && hasValid.github && hasValid.dropler && hasValid.personal && 
                    hasValid.linkedIn && hasValid.other && hasValid.jobInterest && hasValid.skills && hasValid.team;
        }).withMessage({message: "Not all items of the application are valid", isValid: hasValid});
    } else {
        return application.custom(app => {
            const jobInterests = Constants.JOB_INTERESTS;
            hasValid.resume = (typeof(app.portfolioURL.resume) === "string");
            hasValid.github = (!app.portfolioURL.github || typeof(app.portfolioURL.github) === "string");
            hasValid.dropler = (!app.portfolioURL.dropler || typeof(app.portfolioURL.dropler) === "string");
            hasValid.personal = (!app.portfolioURL.personal || typeof(app.portfolioURL.personal) === "string");
            hasValid.linkedIn = (!app.portfolioURL.linkedIn || typeof(app.portfolioURL.linkedIn) === "string");
            hasValid.other = (!app.portfolioURL.other || typeof(app.portfolioURL.other) === "string");
            hasValid.jobInterest = (jobInterests.includes(app.jobInterest));
            hasValid.skills = (!app.skills || isMongoIdArray(app.skills));
            hasValid.comments = (!app.comments || typeof(app.comments) === "string");
            hasValid.essay = (!app.essay || typeof(app.essay) === "string");
            hasValid.team = (!app.team || mongoose.Types.ObjectId.isValid(app.team));
            return  hasValid.comments && hasValid.github && hasValid.dropler && hasValid.personal && 
                    hasValid.linkedIn && hasValid.other && hasValid.jobInterest && hasValid.skills && hasValid.team;
        }).withMessage({message: "Not all items of the application are valid", isValid: hasValid});
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

    for (var ele of arr) {
        if (!mongoose.Types.ObjectId.isValid(ele)) {
            return false;
        }
    }

    return true;
}

function jwtValidator (fieldLocation, fieldname, jwtSecret, optional = true) {
    const jwtValidationChain = setProperValidationChainBuilder(fieldLocation, fieldname, "Must be vali jwt");
    if(optional) {
        return jwtValidationChain.optional({ checkFalsy: true})
        .custom(value => {
            const token = jwt.verify(value, jwtSecret);
            if(typeof token !== "undefined"){
                return true;
            }
            return false;
        }).withMessage(`must be valid jwt`);
    } else {
        return jwtValidationChain.exists().withMessage("Token must be provided")
        .custom(value => {
            const token = jwt.verify(value, jwtSecret);
            if(typeof token !== "undefined"){
                return true;
            }
            return false;
        }).withMessage(`must be valid jwt`);
    }
}

function setProperValidationChainBuilder(location, fieldName, errorString) {
/**
 * export const check: ValidationChainBuilder;
export const body: ValidationChainBuilder;
export const cookie: ValidationChainBuilder;
export const header: ValidationChainBuilder;
export const param: ValidationChainBuilder;
export const query: ValidationChainBuilder;
 */
    switch (location) {
        case "query":
            return query(fieldName, errorString);
        case "body":
            return body(fieldName, errorString);
        case "header":
            return header(fieldName, errorString);
        case "param":
            return param(fieldName, errorString);
        default:
            logger.error(`${TAG} Invalid field location: ${location}`);
    }
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
    jwtValidator: jwtValidator,
    urlValidator: urlValidator
};