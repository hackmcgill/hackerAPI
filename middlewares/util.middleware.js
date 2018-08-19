"use strict";
module.exports = {
    asyncMiddleware: asyncMiddleware
};

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