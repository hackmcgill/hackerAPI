"use strict";
const multer = require('multer');
//Set up multer middleware
const m = multer({
    storage: multer.memoryStorage(),
    limits: {
        fileSize: 4000000 //4mb
    },
    fileFilter: function (req, file, cb) {
        if (file.mimetype !== "application/pdf") {
            cb(null, false);
        } else {
            cb(null, true);
        }
    }
});

/**
 * Wrapper function for all asynchronous middleware, aka middleware that returns promises.
 * @param {(req,res,next:(err?:any)=>void)=>any} fn The function that is asynchronous
 * @returns {(req,res,next:(err?:any)=>void)=>any} Another middleware that, when invoked, will attempt to resolve fn. If there is an error,
 * then it will pass the error to 'next' function.
 */
function asyncMiddleware(fn) {
    return (req, res, next) => {
        Promise.resolve(fn(req, res, next))
            .catch(next);
    };
}
module.exports = {
    asyncMiddleware: asyncMiddleware,
    Multer: m
};