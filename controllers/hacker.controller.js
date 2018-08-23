"use strict";
const mongoose = require("mongoose");

const Services = {
    Hacker: require("../services/hacker.service"),
    Logger: require("../services/logger.service")
};

module.exports = {
    adminChangeHacker: function (req, res) {
        const success = Services.Hacker.update(req.params.id, req.body);

        if (success) {
            return res.status(200).json({
                message: "Changed hacker",
                data: "Changed information to: " + req.body
            });
        } else {
            return res.status(400).json({
                message: "Issue with changing hacker information",
                data: {}
            });
        }
    },
    uploadedResume: uploadedResume,
    downloadedResume: downloadedResume
};

function uploadedResume (req, res) {
    return res.status(200).json({
        message: "Uploaded resume",
        data: {
            filename: req.body.gcfilename
        }
    });
}

function downloadedResume (req, res) {
    return res.status(200).json({
        message: "Downloaded resume",
        data: {
            id: req.body.id,
            resume: req.body.resume
        }
    });
}