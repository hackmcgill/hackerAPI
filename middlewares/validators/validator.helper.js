"use strict";
const { body, query, header, param } = require("express-validator/check");
const logger = require("../../services/logger.service");
const mongoose = require("mongoose");
const TAG = `[ VALIDATOR.HELPER.js ]`;
const jwt = require("jsonwebtoken");
const Constants = require("../../constants/general.constant");
const Models = {
    Hacker: require("../../models/hacker.model")
};

/**
 * Validates that field is a valid integer
 * @param {"query" | "body" | "header" | "param"} fieldLocation the location where the field should be found
 * @param {string} fieldname Name of the field that needs to be validated.
 * @param {boolean} optional Whether the field is optional or not.
 * @param {number} lowerBound Lower bound for a valid integer.
 * @param {number} upperBound Lpper bound for a valid integer.
 */
function integerValidator(
    fieldLocation,
    fieldname,
    optional = true,
    lowerBound = -Infinity,
    upperBound = Infinity
) {
    const value = setProperValidationChainBuilder(
        fieldLocation,
        fieldname,
        "invalid integer"
    );

    if (optional) {
        return value
            .optional({
                checkFalsy: true
            })
            .isInt()
            .withMessage(`${fieldname} must be an integer.`)
            .custom((value) => {
                return value >= lowerBound && value <= upperBound;
            })
            .withMessage(
                `${fieldname} must be between ${lowerBound} and  ${upperBound}`
            );
    } else {
        return value
            .exists()
            .withMessage("tier must exist")
            .isInt()
            .withMessage(`${fieldname} must be an integer.`)
            .custom((value) => {
                return value >= lowerBound && value <= upperBound;
            })
            .withMessage(
                `${fieldname} must be between ${lowerBound} and  ${upperBound}`
            );
    }
}

/**
 * Validates that field is a valid mongoID
 * @param {"query" | "body" | "header" | "param"} fieldLocation the location where the field should be found
 * @param {string} fieldname Name of the field that needs to be validated.
 * @param {boolean} optional Whether the field is optional or not.
 */
function mongoIdValidator(fieldLocation, fieldname, optional = true) {
    const mongoId = setProperValidationChainBuilder(
        fieldLocation,
        fieldname,
        "invalid mongoID"
    );

    if (optional) {
        return mongoId
            .optional({
                checkFalsy: true
            })
            .isMongoId()
            .withMessage("must be a valid mongoID");
    } else {
        return mongoId
            .exists()
            .isMongoId()
            .withMessage("must be a valid mongoID");
    }
}

/**
 * Validates that field is a valid mongoID array
 * @param {"get" | "post"} getOrPost Whether the query is sent as a get or post request
 * @param {string} fieldname Name of the field that needs to be validated.
 * @param {boolean} optional Whether the field is optional or not.
 */
function mongoIdArrayValidator(fieldLocation, fieldname, optional = true) {
    const arr = setProperValidationChainBuilder(
        fieldLocation,
        fieldname,
        "invalid mongoID array"
    );

    if (optional) {
        return arr
            .optional({
                checkFalsy: true
            })
            .custom(isMongoIdArray)
            .withMessage("Value must be an array of mongoIDs");
    } else {
        return arr
            .exists()
            .custom(isMongoIdArray)
            .withMessage("Value must be an array of mongoIDs");
    }
}

/**
 * Validates that field must be boolean. Optionally checks for desired boolean
 * @param {"query" | "body" | "header" | "param"} fieldLocation the location where the field should be found
 * @param {string} fieldname name of the field that needs to be validated.
 * @param {boolean} optional whether the field is optional or not.
 */
function booleanValidator(
    fieldLocation,
    fieldname,
    optional = true,
    desire = null
) {
    const booleanField = setProperValidationChainBuilder(
        fieldLocation,
        fieldname,
        "invalid boolean"
    );

    if (optional) {
        // do not use check falsy option as a 'false' boolean will be skipped
        return booleanField
            .optional()
            .isBoolean()
            .withMessage("must be boolean")
            .custom((val) => {
                if (desire !== null) {
                    return desire === val;
                }
                return true;
            })
            .withMessage(`Must be equal to ${desire}`);
    } else {
        return booleanField
            .exists()
            .isBoolean()
            .withMessage("must be boolean")
            .custom((val) => {
                if (desire !== null) {
                    return desire === val;
                }
                return true;
            })
            .withMessage(`Must be equal to ${desire}`);
    }
}

/**
 * Validates that field name is ascii only.
 * @param {"query" | "body" | "header" | "param"} fieldLocation the location where the field should be found
 * @param {string} fieldname name of the field that needs to be validated.
 * @param {boolean} optional whether the field is optional or not.
 */
function asciiValidator(fieldLocation, fieldname, optional = true) {
    const name = setProperValidationChainBuilder(
        fieldLocation,
        fieldname,
        "invalid name"
    );
    if (optional) {
        return name
            .optional({
                checkFalsy: true
            })
            .isAscii()
            .withMessage("must contain only ascii characters");
    } else {
        return name
            .exists()
            .withMessage("name must exist")
            .isAscii()
            .withMessage("must contain only ascii characters");
    }
}

/**
 * Validates that field name is string only.
 * @param {"query" | "body" | "header" | "param"} fieldLocation the location where the field should be found
 * @param {string} fieldname name of the field that needs to be validated.
 * @param {boolean} optional whether the field is optional or not.
 */
function stringValidator(fieldLocation, fieldname, optional = true) {
    const name = setProperValidationChainBuilder(
        fieldLocation,
        fieldname,
        "invalid string"
    );
    if (optional) {
        return name
            .optional({
                checkFalsy: true
            })
            .isString()
            .withMessage("must be a string");
    } else {
        return name
            .exists()
            .withMessage("name must exist")
            .isString()
            .withMessage("must be a string");
    }
}

/**
 * Validates the field against a regex
 * @param {"query" | "body" | "header" | "param"} fieldLocation the location where the field should be found
 * @param {string} fieldname Name of the field that needs to be validated.
 * @param {boolean} optional Whether the field is optional or not.
 * @param {regex} desire The regex to match against
 * @description The default regex to match against accepts anything
 */
function regexValidator(
    fieldLocation,
    fieldname,
    optional = true,
    desire = Constants.ANY_REGEX
) {
    const match = setProperValidationChainBuilder(
        fieldLocation,
        fieldname,
        "invalid name"
    );

    if (optional) {
        return match
            .optional({
                checkFalsy: true
            })
            .matches(desire)
            .withMessage("must be valid url");
    } else {
        return match
            .exists()
            .withMessage("url must exist")
            .matches(desire)
            .withMessage("must be valid url");
    }
}

/**
 * Validates that field must be alphabetical.
 * @param {"query" | "body" | "header" | "param"} fieldLocation the location where the field should be found
 * @param {string} fieldname name of the field that needs to be validated.
 * @param {boolean} optional whether the field is optional or not.
 */
function alphaValidator(fieldLocation, fieldname, optional = true) {
    const name = setProperValidationChainBuilder(
        fieldLocation,
        fieldname,
        "invalid alpha string"
    );
    if (optional) {
        return name
            .optional({
                checkFalsy: true
            })
            .isAlpha()
            .withMessage("must contain alphabet characters");
    } else {
        return name
            .exists()
            .withMessage("must exist")
            .isAlpha()
            .withMessage("must contain alphabet characters");
    }
}
/**
 * Validates that field must be an array with alphabetical characters.
 * @param {"query" | "body" | "header" | "param"} fieldLocation the location where the field should be found
 * @param {string} fieldname name of the field that needs to be validated.
 * @param {boolean} optional whether the field is optional or not.
 */
function alphaArrayValidator(fieldLocation, fieldname, optional = true) {
    const name = setProperValidationChainBuilder(
        fieldLocation,
        fieldname,
        "invalid alpha array"
    );
    if (optional) {
        return name
            .optional({
                checkFalsy: true
            })
            .custom(alphaArrayValidationHelper)
            .withMessage(
                "must contain alphabet characters in each element of the array"
            );
    } else {
        return name
            .exists()
            .withMessage("must exist")
            .custom(alphaArrayValidationHelper)
            .withMessage(
                "must contain alphabet characters in each element of the array"
            );
    }
}

/**
 * Returns true if value is an alpha array, else false
 * @param {*} value value to check against
 */
function alphaArrayValidationHelper(value) {
    if (!Array.isArray(value)) {
        return false;
    }
    for (const el of value) {
        if (typeof el !== "string") {
            return false;
        }
    }
    return true;
}

/**
 * Validates that field must be at least 6 characters long.
 * TODO: impose better restrictions.
 * @param {"query" | "body" | "header" | "param"} fieldLocation the location where the field should be found
 * @param {string} fieldname name of the field that needs to be validated.
 * @param {boolean} optional whether the field is optional or not.
 */
function passwordValidator(fieldLocation, fieldname, optional = true) {
    const password = setProperValidationChainBuilder(
        fieldLocation,
        fieldname,
        "invalid password"
    );
    if (optional) {
        return password
            .optional({
                checkFalsy: true
            })
            .isLength({
                min: 6
            })
            .withMessage("must be longer than 6 characters");
    } else {
        return password
            .exists()
            .withMessage("password must exist")
            .isLength({
                min: 6
            })
            .withMessage("must be longer than 6 characters");
    }
}

/**
 * Validates that field must be a valid application.
 * @param {"query" | "body" | "header" | "param"} fieldLocation the location where the field should be found
 * @param {string} fieldname name of the field that needs to be validated.
 * @param {boolean} optional whether the field is optional or not.
 */
function applicationValidator(fieldLocation, fieldname, optional = true) {
    const application = setProperValidationChainBuilder(
        fieldLocation,
        fieldname,
        "invalid application"
    );

    //helper object to iterate through the items in the application and track which items are not valid.
    const hasValid = {
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
        return application
            .optional({
                checkFalsy: true
            })
            .custom((app) => {
                const jobInterests = Constants.JOB_INTERESTS;
                hasValid.github =
                    !app.portfolioURL.github ||
                    typeof app.portfolioURL.github === "string";
                hasValid.dropler =
                    !app.portfolioURL.dropler ||
                    typeof app.portfolioURL.dropler === "string";
                hasValid.personal =
                    !app.portfolioURL.personal ||
                    typeof app.portfolioURL.personal === "string";
                hasValid.linkedIn =
                    !app.portfolioURL.linkedIn ||
                    typeof app.portfolioURL.linkedIn === "string";
                hasValid.other =
                    !app.portfolioURL.other ||
                    typeof app.portfolioURL.other === "string";
                hasValid.jobInterest =
                    !app.jobInterest || jobInterests.includes(app.jobInterest);
                hasValid.skills =
                    !app.skills || alphaArrayValidationHelper(app.skills);
                hasValid.comments =
                    !app.comments || typeof app.comments === "string";
                hasValid.essay = !app.essay || typeof app.essay === "string";
                hasValid.team =
                    !app.team || mongoose.Types.ObjectId.isValid(app.team);
                return (
                    hasValid.comments &&
                    hasValid.github &&
                    hasValid.dropler &&
                    hasValid.personal &&
                    hasValid.linkedIn &&
                    hasValid.other &&
                    hasValid.jobInterest &&
                    hasValid.skills &&
                    hasValid.team
                );
            })
            .withMessage({
                message: "Not all items of the application are valid",
                isValid: hasValid
            });
    } else {
        return application
            .custom((app) => {
                const jobInterests = Constants.JOB_INTERESTS;
                hasValid.github =
                    !app.portfolioURL.github ||
                    typeof app.portfolioURL.github === "string";
                hasValid.dropler =
                    !app.portfolioURL.dropler ||
                    typeof app.portfolioURL.dropler === "string";
                hasValid.personal =
                    !app.portfolioURL.personal ||
                    typeof app.portfolioURL.personal === "string";
                hasValid.linkedIn =
                    !app.portfolioURL.linkedIn ||
                    typeof app.portfolioURL.linkedIn === "string";
                hasValid.other =
                    !app.portfolioURL.other ||
                    typeof app.portfolioURL.other === "string";
                hasValid.jobInterest = jobInterests.includes(app.jobInterest);
                hasValid.skills =
                    !app.skills || alphaArrayValidationHelper(app.skills);
                hasValid.comments =
                    !app.comments || typeof app.comments === "string";
                hasValid.essay = !app.essay || typeof app.essay === "string";
                hasValid.team =
                    !app.team || mongoose.Types.ObjectId.isValid(app.team);
                return (
                    hasValid.comments &&
                    hasValid.github &&
                    hasValid.dropler &&
                    hasValid.personal &&
                    hasValid.linkedIn &&
                    hasValid.other &&
                    hasValid.jobInterest &&
                    hasValid.skills &&
                    hasValid.team
                );
            })
            .withMessage({
                message: "Not all items of the application are valid",
                isValid: hasValid
            });
    }
}

/**
 * Function that checks whether the input array contains only mongoIds
 * @param {String[]} arr array of strings
 * @returns {boolean} whether the array contains only mongoIds
 */
function isMongoIdArray(arr) {
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

/**
 * Validates that field must be a valid json web token.
 * @param {"query" | "body" | "header" | "param"} fieldLocation the location where the field should be found
 * @param {string} fieldname name of the field that needs to be validated.
 * @param {*} jwtSecret The secret that the json web token was encrypted with.
 * @param {boolean} optional whether the field is optional or not.
 */
function jwtValidator(fieldLocation, fieldname, jwtSecret, optional = true) {
    const jwtValidationChain = setProperValidationChainBuilder(
        fieldLocation,
        fieldname,
        "Must be vali jwt"
    );
    if (optional) {
        return jwtValidationChain
            .optional({
                checkFalsy: true
            })
            .custom((value) => {
                const token = jwt.verify(value, jwtSecret);
                if (typeof token !== "undefined") {
                    return true;
                }
                return false;
            })
            .withMessage(`must be valid jwt`);
    } else {
        return jwtValidationChain
            .exists()
            .withMessage("Token must be provided")
            .custom((value) => {
                const token = jwt.verify(value, jwtSecret);
                if (typeof token !== "undefined") {
                    return true;
                }
                return false;
            })
            .withMessage(`must be valid jwt`);
    }
}

/**
 * Validates that field must be a valid searchable model
 * @param {"query" | "body" | "header" | "param"} fieldLocation the location where the field should be found
 * @param {string} fieldname name of the field that needs to be validated.
 */
function searchModelValidator(fieldLocation, fieldName) {
    const paramChain = setProperValidationChainBuilder(
        fieldLocation,
        fieldName,
        "Must be a valid searchable model"
    );
    return paramChain
        .exists()
        .withMessage("Model must be provided")
        .isLowercase()
        .withMessage("Model must be lower case")
        .isAlpha()
        .withMessage("must contain alphabet characters")
        .isIn([Constants.HACKER.toLowerCase()]);
}

/**==
 * Validates that field must be a valid search query.
 * @param {"query" | "body" | "header" | "param"} fieldLocation the location where the field should be found
 * @param {string} fieldname name of the field that needs to be validated.
 */
function searchValidator(fieldLocation, fieldname) {
    const search = setProperValidationChainBuilder(
        fieldLocation,
        fieldname,
        "Invalid search query"
    );

    return search
        .exists()
        .withMessage("Search query must be provided")
        .custom((value, { req }) => {
            //value is a serialized JSON
            value = JSON.parse(value);
            let modelString = req.query.model;
            //Supported models for searching
            let model;
            if (modelString === Constants.HACKER.toLowerCase()) {
                model = Models.Hacker;
            } else {
                return false;
            }
            //Validates each clause in the query
            for (var q in value) {
                //Checks that each clause has Param, Value, and Operation
                var clause = value[q];
                if (
                    !(
                        clause.hasOwnProperty("param") ||
                        clause.hasOwnProperty("value") ||
                        clause.hasOwnProperty("operation")
                    )
                ) {
                    return false;
                }
                var schemaPath = model.searchableField(clause.param);
                if (!schemaPath) return false;
                //Validates that operation corresponding to each clause is valid
                switch (schemaPath) {
                    case "String":
                        if (
                            !["equals", "ne", "regex", "in"].includes(
                                clause.operation
                            )
                        ) {
                            return false;
                        }
                        break;
                    case "Number":
                        if (
                            ![
                                "equals",
                                "ne",
                                "gte",
                                "lte",
                                "le",
                                "ge",
                                "in"
                            ].includes(clause.operation)
                        ) {
                            return false;
                        }
                        break;
                    case "Boolean":
                        if (!["equals", "ne"].includes(clause.operation)) {
                            return false;
                        }
                        break;
                }
            }
            return true;
        });
}

function searchSortValidator(fieldLocation, fieldName) {
    const searchSort = setProperValidationChainBuilder(
        fieldLocation,
        fieldName,
        "Invalid sort criteria"
    );
    return searchSort
        .optional({
            checkFalsy: true
        })
        .custom((value, { req }) => {
            let modelString = req.query.model;
            if (modelString.equals("hacker")) {
                model = Models.Hacker;
            } else {
                return false;
            }
            if (model.searchableField(value)) {
                let sortOrder = param("sort", "Sorting order not found");
                if (!sortOrder.equals("asc") || !sortOrder.equals("desc")) {
                    return false;
                }
            } else {
                return false;
            }
            return true;
        });
}

/**
 * Validates that field must be a valid date according to javascript Date.parse
 * @param {"query" | "body" | "header" | "param"} fieldLocation the location where the field should be found
 * @param {string} fieldname name of the field that needs to be validated.
 * @param {boolean} optional whether the field is optional or not.
 */
function dateValidator(fieldLocation, fieldname, optional = true) {
    const date = setProperValidationChainBuilder(
        fieldLocation,
        fieldname,
        "invalid date"
    );
    if (optional) {
        return date
            .optional({
                checkFalsy: true
            })
            .custom((value) => {
                return !isNaN(Date.parse(value));
            })
            .withMessage({
                message: "Date is not valid.",
                isValid: date
            });
    } else {
        return date
            .exists()
            .withMessage("Date field must be specified")
            .custom((value) => {
                return !isNaN(Date.parse(value));
            })
            .withMessage({
                message: "Date is not valid.",
                isValid: date
            });
    }
}

/**
 * Validates that field must be a valid phone number, having numbers and having a minimum length of 8
 * Regex was not chosen because the number is not restricted to a particular country or location
 * The smallest number length without country code is 5 digits. With the country code, it makes 8.
 * @param {"query" | "body" | "header" | "param"} fieldLocation the location where the field should be found
 * @param {string} fieldname name of the field that needs to be validated.
 * @param {boolean} optional whether the field is optional or not.
 */
function phoneNumberValidator(fieldLocation, fieldname, optional = true) {
    const number = setProperValidationChainBuilder(
        fieldLocation,
        fieldname,
        "invalid phone number"
    );
    if (optional) {
        return number
            .optional({
                checkFalsy: true
            })
            .isLength({
                min: 8
            })
            .isInt()
            .withMessage("Phone number must consist of numbers.");
    } else {
        return number
            .exists()
            .withMessage("Phone number must be specified.")
            .isLength({
                min: 8
            })
            .isInt()
            .withMessage("Phone number must consist of numbers.");
    }
}

/**
 * Validates that field must be an array of routes
 * @param {"query" | "body" | "header" | "param"} fieldLocation the location where the field should be found
 * @param {string} fieldname name of the field that needs to be validated.
 * @param {boolean} optional whether the field is optional or not.
 */
function routesValidator(fieldLocation, fieldname, optional = true) {
    const routes = setProperValidationChainBuilder(
        fieldLocation,
        fieldname,
        "Invalid routes"
    );

    if (optional) {
        return routes
            .optional({
                checkFalsy: true
            })
            .custom(routesArrayValidationHelper)
            .withMessage("The value must be a route");
    } else {
        return routes
            .exists()
            .withMessage("The route must exist.")
            .custom(routesArrayValidationHelper)
            .withMessage("The value must be a route");
    }
}

/**
 * Returns true if value an array of routes
 * @param {*} routes value to check against
 */
function routesArrayValidationHelper(routes) {
    if (!Array.isArray(routes)) {
        return false;
    }
    for (const route of routes) {
        if (route.uri === null || typeof route.uri !== "string") {
            return false;
        }
        if (
            route.requestType === null ||
            !checkEnum(route.requestType, Constants.REQUEST_TYPES)
        ) {
            return false;
        }
    }
    return true;
}

/**
 * Validates that field must be a value within the enum passed in through parameter 'enums'
 * @param {"query" | "body" | "header" | "param"} fieldLocation The location where the field should be found.
 * @param {string} fieldname The name of the field that needs to be validated.
 * @param {Object} enums The enum object that the field must be part of.
 * @param {boolean} optional Whether the field is optional or not.
 */
function enumValidator(fieldLocation, fieldname, enums, optional = true) {
    const enumValue = setProperValidationChainBuilder(
        fieldLocation,
        fieldname,
        "Invalid enums"
    );

    if (optional) {
        return enumValue
            .optional({
                checkFalsy: true
            })
            .custom((val) => {
                return checkEnum(val, enums);
            })
            .withMessage("The value must be part of the enum");
    } else {
        return enumValue
            .exists()
            .withMessage("The value being checked agains the enums must exist.")
            .custom((val) => {
                return checkEnum(val, enums);
            })
            .withMessage("The value must be part of the enum");
    }
}

/**
 * Checks that 'value' is part of 'enums'. 'enums' should be an enum dict.
 * @param {*} value Should be of the same type as the values of the enum
 * @param {Object} enums An object that represents an enum. They keys are the keys of the enum, and the values are the enum values.
 * @return {boolean} Returns true if the value is part of the enum, false otherwise.
 */
function checkEnum(value, enums) {
    for (var enumKey in enums) {
        if (value === enums[enumKey]) {
            return true;
        }
    }
    return false;
}

/**
 *
 * @param {"query" | "body" | "header" | "param"} fieldLocation the location where the field should be found
 * @param {string} fieldname name of the field that needs to be validated.
 * @param {*} errorString the string that is sent back to the user if the field is invalid
 */
function setProperValidationChainBuilder(
    fieldLocation,
    fieldName,
    errorString
) {
    /**
     * check: ValidationChainBuilder;
     * body: ValidationChainBuilder;
     * cookie: ValidationChainBuilder;
     * header: ValidationChainBuilder;
     * param: ValidationChainBuilder;
     * query: ValidationChainBuilder;
     */
    switch (fieldLocation) {
        case "query":
            return query(fieldName, errorString);
        case "body":
            return body(fieldName, errorString);
        case "header":
            return header(fieldName, errorString);
        case "param":
            return param(fieldName, errorString);
        default:
            logger.error(`${TAG} Invalid field location: ${fieldLocation}`);
    }
}

module.exports = {
    regexValidator: regexValidator,
    integerValidator: integerValidator,
    mongoIdValidator: mongoIdValidator,
    mongoIdArrayValidator: mongoIdArrayValidator,
    asciiValidator: asciiValidator,
    alphaValidator: alphaValidator,
    alphaArrayValidator: alphaArrayValidator,
    passwordValidator: passwordValidator,
    booleanValidator: booleanValidator,
    applicationValidator: applicationValidator,
    jwtValidator: jwtValidator,
    searchValidator: searchValidator,
    searchModelValidator: searchModelValidator,
    searchSortValidator: searchSortValidator,
    phoneNumberValidator: phoneNumberValidator,
    dateValidator: dateValidator,
    enumValidator: enumValidator,
    routesValidator: routesValidator,
    stringValidator: stringValidator
};
