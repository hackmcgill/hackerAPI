"use strict";
const express = require("express");
const version_service = require("../services/version.service");
const router = new express.Router();

/* GET home page. */
router.get("/", function (req, res) {
    const VERSION = version_service.get();
    res.status(200).send({
        name: "hackerAPI",
        version: VERSION
    });
});

module.exports = router;