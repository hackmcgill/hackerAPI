const {
    body,
    query,
} = require("express-validator/check");
const logger = require("../../services/logger.server.service");
const TAG = `[ VALIDATOR.HELPER.js ]`

// untested
function nameValidator (getOrPost, fieldname, optional = true) {
    var name;
    if (getOrPost == "get") {
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

// untested
function emailValidator (getOrPost, fieldname, optional = true) {
    var email;
    if (getOrPost == "get") {
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

// untested
function alphaValidator (getOrPost, fieldname, optional = true) {
    var diet;

    if (getOrPost == "get") {
        diet = query(fieldname, "invalid dietary restriction");
    } else {
        diet = query(fieldname, "invalid dietary restriction");
    }

    if (optional) {
        return diet.optional({ checkFalsy: true}).isAlpha().withMessage("must contain alphabet characters");
    } else {
        return diet.exists().withMessage("must exist").isAlpha().withMessage("must contain alphabet characters");
    }
}

// untested
function shirtSizeValidator (getOrPost, fieldname, optional = true) {
    var size;

    if (getOrPost == "get") {
        size = query(fieldname, "invalid size");
    } else {
        size = query(fieldname, "invalid size");
    }

    if (optional) {
        return size.optional({ checkFalsy: true}).isIn(["XS", "S", "M", "L", "XL", "XXL"]).withMessage("must be one of XS, S, M, L, XL, XXL");
    } else {
        return size.exists().withMessage("shirt size must exist").isIn(["XS", "S", "M", "L", "XL", "XXL"]).withMessage("must be one of XS, S, M, L, XL, XXL");
    }
}

// untested
function passwordValidator (getOrPost, fieldname, optional = true) {
    var password;

    if (getOrPost == "get") {
        password = query(fieldname, "invalid password");
    } else {
        password = query(fieldname, "invalid password");
    }

    if (optional) {
        return password.optional({ checkFalsy: true}).isLength({ min: 6 }).withMessage("must be longer than 6 characters");
    } else {
        return password.exists().withMessage("password must exist").isLength({ min: 6 }).withMessage("must be longer than 6 characters");
    }
}

module.exports = {
    nameValidator: nameValidator,
    emailValidator: emailValidator,
    alphaValidator: alphaValidator,
    shirtSizeValidator: shirtSizeValidator,
    passwordValidator: passwordValidator
}