"use strict";

module.exports = {
    /**
     * Takes individual attributes within req.body and groups them into a single object
     * that houses all the attributes given by the model. Once done, it will create
     * a new attribute req.body.{modelName} and set it as the single object
     * @param {{*}} model A model object to contains all the attribute to match in req.body
     * @param {string} modelName The property name to store the new object of collected properties
     * @param {(err?)=>void} callback
     */
    parsePatch: function (model, modelName) {
        return function (req, res, next) {
            let modelAttributes = {};
            for (let val in req.body) {
                if (model.schema.obj.hasOwnProperty(val)) {
                    modelAttributes[val] = req.body[val];
                    delete req.body[val];
                }
            }
            req.body[modelName] = modelAttributes;
            return next();
        };
    }
};
