"use strict";
const {
    body,
    query,
    header,
    param
} = require("express-validator/check");
const logger = require("../../services/logger.service");
const Skill = require("../../services/skill.service");
const TAG = `[ VALIDATOR.HELPER.js ]`;
const jwt = require("jsonwebtoken");

// untested
/**
 * Validates that field must be boolean.
 * @param {"query" | "body" | "header" | "param"} fieldLocation the location where the field should be found 
 * @param {string} fieldname name of the field that needs to be validated.
 * @param {boolean} optional whether the field is optional or not.
 */
function booleanValidator (fieldLocation, fieldname, optional = true) {
    const booleanField = setProperValidationChainBuilder(fieldLocation, fieldname, "invalid boolean");

    if (optional) {
        return booleanField.optional({ checkFalsy: true }).isBoolean().withMessage("must be boolean");
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
function nameValidator  (fieldLocation, fieldname, optional = true) {
    const name = setProperValidationChainBuilder(fieldLocation, fieldname, "invalid name");
    if (optional) {
        return name.optional({ checkFalsy: true }).isAscii().withMessage("must contain only ascii characters");
    } else {
        return name.exists().withMessage("name must exist").isAscii().withMessage("must contain only ascii characters");
    }
}

// untested
/**
 * Validates that field must be email.
 * @param {"query" | "body" | "header" | "param"} fieldLocation the location where the field should be found 
 * @param {string} fieldname name of the field that needs to be validated.
 * @param {boolean} optional whether the field is optional or not.
 */
function emailValidator(fieldLocation, fieldname, optional = true) {
    const email = setProperValidationChainBuilder(fieldLocation, fieldname, "invalid email");

    if (optional) {
        return email.optional({ checkFalsy: true }).matches(/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/).withMessage("must be valid email");
    } else {
        return email.exists().withMessage("email must exist").matches(/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/).withMessage("must be valid email");
    }
}

// untested
/**
 * Validates that field must be alphabetical.
 * @param {"query" | "body" | "header" | "param"} fieldLocation the location where the field should be found 
 * @param {string} fieldname name of the field that needs to be validated.
 * @param {boolean} optional whether the field is optional or not.
 */
function alphaValidator (fieldLocation, fieldname, optional = true) {
    const diet = setProperValidationChainBuilder(fieldLocation, fieldname, "invalid diet");

    if (optional) {
        return diet.optional({ checkFalsy: true}).isAlpha().withMessage("must contain alphabet characters");
    } else {
        return diet.exists().withMessage("must exist").isAlpha().withMessage("must contain alphabet characters");
    }
}

// untested
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

// untested
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

// untested
/**
 * Validates that field must be one of the status enums.
 * @param {"query" | "body" | "header" | "param"} fieldLocation the location where the field should be found 
 * @param {string} fieldname name of the field that needs to be validated.
 * @param {boolean} optional whether the field is optional or not.
 */
function hackerStatusValidator (fieldLocation, fieldname, optional = true) {
    const status = setProperValidationChainBuilder(fieldLocation, fieldname, "invalid status");

    const statuses = ["None", "Applied", "Accepted", "Waitlisted", "Confirmed", "Cancelled", "Checked-in"];

    if (optional) {
        return status.optional({ checkFalsy: true}).isIn(statuses).withMessage(`must be one of valid statuses: ${statuses.join(",")}`);
    } else {
        return status.exists().withMessage(`must be one of valid statuses: ${statuses.join(",")}`);
    }
}

// untested
/**
 * Validates that field must be a valid application.
 * @param {"query" | "body" | "header" | "param"} fieldLocation the location where the field should be found 
 * @param {string} fieldname name of the field that needs to be validated.
 * @param {boolean} optional whether the field is optional or not.
 */
function applicationValidator (fieldLocation, fieldname, optional = true) {
    const application = setProperValidationChainBuilder(fieldLocation, fieldname, "invalid application");

    const jobInterests = ["Internship", "Full-time", "None"];

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
        return application.custom(app => {
            hasValid.resume = (!app.portfolioURL.resume || typeof(app.portfolioURL.resume) === "string");
            hasValid.github = (!app.portfolioURL.github || typeof(app.portfolioURL.github) === "string");
            hasValid.dropler = (!app.portfolioURL.dropler || typeof(app.portfolioURL.dropler) === "string");
            hasValid.personal = (!app.portfolioURL.personal || typeof(app.portfolioURL.personal) === "string");
            hasValid.linkedIn = (!app.portfolioURL.linkedIn || typeof(app.portfolioURL.linkedIn) === "string");
            hasValid.other = (!app.portfolioURL.other || typeof(app.portfolioURL.other) === "string");
            hasValid.jobInterest = (!app.jobInterest || jobInterests.includes(app.jobInterests));
            hasValid.skills = (!app.skills || skillsArrayValidator(app.skills));
            hasValid.comments = (!app.comments || typeof(app.comments) === "string");
            hasValid.essay = (!app.essay || typeof(app.essay) === "string");
            hasValid.team = (!app.team || typeof(app.team) === "string");
            return  hasValid.comments && hasValid.github && hasValid.dropler && hasValid.personal && 
                    hasValid.linkedIn && hasValid.other && hasValid.jobInterest && hasValid.skills && hasValid.team;
        }).withMessage({message: "Not all items of the application are valid", isValid: hasValid});
    } else {
        return application.custom(app => {
            hasValid.resume = (typeof(app.portfolioURL.resume) === "string");
            hasValid.github = (typeof(app.portfolioURL.github) === "string");
            hasValid.dropler = (typeof(app.portfolioURL.dropler) === "string");
            hasValid.personal = (typeof(app.portfolioURL.personal) === "string");
            hasValid.linkedIn = (typeof(app.portfolioURL.linkedIn) === "string");
            hasValid.other = (typeof(app.portfolioURL.other) === "string");
            hasValid.jobInterest = (jobInterests.includes(app.jobInterests));
            hasValid.skills = (skillsArrayValidator(app.skills));
            hasValid.comments = (typeof(app.comments) === "string");
            hasValid.essay = (typeof(app.essay) === "string");
            hasValid.team = (typeof(app.team) === "string");
            return  hasValid.comments && hasValid.github && hasValid.dropler && hasValid.personal && 
                    hasValid.linkedIn && hasValid.other && hasValid.jobInterest && hasValid.skills && hasValid.team;
        }).withMessage({message: "Not all items of the application are valid", isValid: hasValid});
    }
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

function skillsArrayValidator (skills) {
    let valid = true;
    skills.forEach(skill => {
        //ERROR: THIS IS DOING LOGIC ON A PROMISE @RICHARD
        if (!Skill.isSkillIdValid(skill)) {
            valid = false;
        }
    });
    return valid;
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
            console.error("Invalid location: " + location);
    }


}

function mongoIdValidator (location, fieldname, optional = true) {
    const mongoId = setProperValidationChainBuilder(location, fieldname, "invalid mongoID");
    if (optional) {
        return mongoId.optional({ checkFalsy: true }).isMongoId().withMessage("must be a valid mongoID");
    } else {
        return mongoId.exists().isMongoId().withMessage("must be a valid mongoID");
    }
}


module.exports = {
    mongoIdValidator: mongoIdValidator,
    nameValidator: nameValidator,
    emailValidator: emailValidator,
    alphaValidator: alphaValidator,
    shirtSizeValidator: shirtSizeValidator,
    passwordValidator: passwordValidator,
    hackerStatusValidator: hackerStatusValidator,
    booleanValidator: booleanValidator,
    applicationValidator: applicationValidator,
    jwtValidator: jwtValidator
};