"use strict";
const multer  = require('multer');
//Set up multer middleware
const m = multer({
    storage: multer.memoryStorage(),
    limits: {
        fileSize: 4000000 //4mb
    },
    fileFilter: function(req, file, cb) {
        if(file.mimetype !== "application/pdf") {
            cb(null, false);
        } else {
            cb(null, true);
        }
    }
});

module.exports = {
    asyncMiddleware: fn =>
        (req, res, next) => {
            Promise.resolve(fn(req, res, next))
                .catch(next);
        },
    Multer: m
};

