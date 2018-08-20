"use strict";
const express = require("express");
const versionService = require("../services/version.service");
const router = new express.Router();

/* GET home page. */
router.get("/", function (req, res) {
    const VERSION = versionService.get();
    res.status(200).send({
        name: "hackerAPI",
        version: VERSION
    });
});

module.exports = router;