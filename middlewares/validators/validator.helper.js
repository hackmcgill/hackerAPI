"use strict";
const {
    body,
    query,
} = require("express-validator/check");
const logger = require("../../services/logger.service");
const Skill = require("../../services/skill.service");
const Team = require("../../services/team.service");
const TAG = `[ VALIDATOR.HELPER.js ]`;

function mongoIdValidator (getOrPost, fieldname, optional = true) {
    var mongoId;

    if (getOrPost === "get") {
        mongoId = query(fieldname, "invalid mongoID");
    } else {
        mongoId = body(fieldname, "invalid mongoID");
    }

    if (optional) {
        return mongoId.optional({ checkFalsy: true }).isMongoId().withMessage("must be a valid mongoID");
    } else {
        return mongoId.exists().isMongoId().withMessage("must be a valid mongoID");
    }
}

function booleanValidator (getOrPost, fieldname, optional = true) {
    var booleanField;

    if (getOrPost === "get") {
        booleanField = query(fieldname, "invalid boolean");
    } else {
        booleanField = body(fieldname, "invalid boolean");
    }

    if (optional) {
        return booleanField.optional({ checkFalsy: true }).isBoolean().withMessage("must be boolean");
    } else {
        return booleanField.exists().isBoolean().withMessage("must be boolean");
    }
}

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

function emailValidator (getOrPost, fieldname, optional = true) {
    var email;
    if (getOrPost === "get") {
        email = query(fieldname, "invalid email");
    } else {
        email = body(fieldname, "invalid email");
    }

    if (optional) {
        return email.optional({ checkFalsy: true }).matches(/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/).withMessage("must be valid email");
    } else {
        return email.exists().withMessage("email must exist").matches(/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/).withMessage("must be valid email");
    }
}

function alphaValidator (getOrPost, fieldname, optional = true) {
    var diet;

    if (getOrPost === "get") {
        diet = query(fieldname, "invalid dietary restriction");
    } else {
        diet = body(fieldname, "invalid dietary restriction");
    }

    if (optional) {
        return diet.optional({ checkFalsy: true}).isAlpha().withMessage("must contain alphabet characters");
    } else {
        return diet.exists().withMessage("must exist").isAlpha().withMessage("must contain alphabet characters");
    }
}

function shirtSizeValidator (getOrPost, fieldname, optional = true) {
    var size;

    if (getOrPost === "get") {
        size = query(fieldname, "invalid size");
    } else {
        size = body(fieldname, "invalid size");
    }

    if (optional) {
        return size.optional({ checkFalsy: true}).isIn(["XS", "S", "M", "L", "XL", "XXL"]).withMessage("must be one of XS, S, M, L, XL, XXL");
    } else {
        return size.exists().withMessage("shirt size must exist").isIn(["XS", "S", "M", "L", "XL", "XXL"]).withMessage("must be one of XS, S, M, L, XL, XXL");
    }
}

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

function hackerStatusValidator (getOrPost, fieldname, optional = true) {
    var status;
    const statuses = ["None", "Applied", "Accepted", "Waitlisted", "Confirmed", "Cancelled", "Checked-in"];


    if (getOrPost === "get") {
        status = query(fieldname, "invalid status");
    } else {
        status = body(fieldname, "invalid status");
    }

    if (optional) {
        return status.optional({ checkFalsy: true}).isIn(statuses).withMessage("Must be one of valid statuses");
    } else {
        return status.exists().withMessage("must be one of valid statuses");
    }
}

function applicationValidator (getOrPost, optional = true) {
    var application;

    if (getOrPost === "get") {
        application = query("application", "invalid application");
    } else {
        application = body("application", "invalid application");
    }

    if (optional) {
        return application.custom(app => {
            let jobInterests = ["Internship", "Full-time", "None"];
            return (
                (!app.portfolioURL.resume || typeof(app.portfolioURL.resume === "string")) &&
                (!app.portfolioURL.github || typeof(app.portfolioURL.github === "string")) &&
                (!app.portfolioURL.dropler || typeof(app.portfolioURL.dropler === "string")) &&
                (!app.portfolioURL.personal || typeof(app.portfolioURL.personal === "string")) &&
                (!app.portfolioURL.linkedIn || typeof(app.portfolioURL.linkedIn === "string")) &&
                (!app.portfolioURL.other || typeof(app.portfolioURL.other === "other")) &&
                (!app.jobInterest || jobInterests.includes(app.jobInterests)) &&
                (!app.skills || skillsArrayValidator(app.skills)) &&
                (!app.comments || typeof(app.comments === "string")) &&
                (!app.essay || typeof(app.essay === "string")) &&
                (!app.team || Team.isTeamIdValid(app.team))
            );
        });
    } else {
        return application.custom(app => {
            let jobInterests = ["Internship", "Full-time", "None"];
            return (
                typeof(app.portfolioURL.resume === "string") &&
                typeof(app.portfolioURL.github === "string") &&
                typeof(app.portfolioURL.dropler === "string") &&
                typeof(app.portfolioURL.personal === "string") &&
                typeof(app.portfolioURL.linkedIn === "string") &&
                typeof(app.portfolioURL.other === "other") &&
                jobInterests.includes(app.jobInterests) &&
                skillsArrayValidator(app.skills) &&
                typeof(app.comments === "string") &&
                typeof(app.essay === "string") &&
                Team.isTeamIdValid(app.team)
            );
        });
    }
}

function skillsArrayValidator (skills) {
    let valid = true;
    skills.forEach(skill => {
        if (!Skill.isSkillIdValid(skill)) {
            valid = false;
        }
    });
    return valid;
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
};