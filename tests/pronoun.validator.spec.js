"use strict";
const assert = require("chai").assert;
const { validationResult } = require("express-validator");
const VALIDATOR = require("../middlewares/validators/validator.helper");

function runPronounValidator(pronoun, optional = false) {
    const req = {
        body: pronoun === undefined ? {} : { pronoun: pronoun },
        query: {},
        params: {},
        headers: {},
        cookies: {}
    };
    const chain = VALIDATOR.pronounValidator("body", "pronoun", optional);
    return chain.run(req).then(() => ({
        req: req,
        errors: validationResult(req)
    }));
}

describe("Pronoun validator", function() {
    it("normalizes a legacy string into an array", async function() {
        const { req, errors } = await runPronounValidator("he/him");
        assert.isTrue(errors.isEmpty());
        assert.deepEqual(req.body.pronoun, ["he/him"]);
    });

    it("accepts an array of pronouns unchanged", async function() {
        const { req, errors } = await runPronounValidator([
            "he/him",
            "they/them"
        ]);
        assert.isTrue(errors.isEmpty());
        assert.deepEqual(req.body.pronoun, ["he/him", "they/them"]);
    });

    it("accepts an empty array", async function() {
        const { req, errors } = await runPronounValidator([]);
        assert.isTrue(errors.isEmpty());
        assert.deepEqual(req.body.pronoun, []);
    });

    it("rejects a required missing pronoun", async function() {
        const { errors } = await runPronounValidator(undefined, false);
        assert.isFalse(errors.isEmpty());
    });

    it("allows an optional missing pronoun", async function() {
        const { errors } = await runPronounValidator(undefined, true);
        assert.isTrue(errors.isEmpty());
    });

    it("rejects non-string pronoun values", async function() {
        const { errors } = await runPronounValidator(5);
        assert.isFalse(errors.isEmpty());
    });
});
