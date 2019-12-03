'use strict';

const express = require('express');
const Controllers = {
  Volunteer: require('../../controllers/volunteer.controller'),
};
const Middleware = {
  Validator: {
    /* Insert the require statement to the validator file here */
    Volunteer: require('../../middlewares/validators/volunteer.validator'),
    RouteParam: require('../../middlewares/validators/routeParam.validator'),
  },
  /* Insert all of ther middleware require statements here */
  parseBody: require('../../middlewares/parse-body.middleware'),
  Volunteer: require('../../middlewares/volunteer.middleware'),
  Auth: require('../../middlewares/auth.middleware'),
};
const Services = {
  Volunteer: require('../../services/volunteer.service'),
};

const CONSTANTS = require('../../constants/general.constant');

module.exports = {
  activate: function(apiRouter) {
    const volunteerRouter = express.Router();

    /**
         * @api {get} /volunteer/:id get a volunteer's information
         * @apiName getVolunteer
         * @apiGroup Volunteer
         * @apiVersion 1.3.0
         * 
         * @apiParam (param) {ObjectId} id a volunteer's unique mongoID
         * 
         * @apiSuccess {String} message Success message
         * @apiSuccess {Object} data Volunteer object
         * @apiSuccessExample {object} Success-Response: 
         *      {
                    "message": "Successfully retrieved volunteer information", 
                    "data": {...}
                }

         * @apiError {String} message Error message
         * @apiError {Object} data empty
         * @apiErrorExample {object} Error-Response: 
         *      {"message": "Volunteer not found", "data": {}}
         */
    volunteerRouter.route('/:id').get(
      Middleware.Validator.RouteParam.idValidator,
      Middleware.Auth.ensureAuthenticated(),
      Middleware.Auth.ensureAuthorized([Services.Volunteer.findById]),

      Middleware.parseBody.middleware,

      Middleware.Volunteer.findById,
      Controllers.Volunteer.showVolunteer
    );

    /**
         * @api {post} /volunteer/ create a new volunteer
         * @apiName createVolunteer
         * @apiGroup Volunteer
         * @apiVersion 0.0.8
         * 
         * @apiParam (body) {MongoID} accountId MongoID of the account of the volunteer
         * 
         * @apiSuccess {string} message Success message
         * @apiSuccess {object} data Volunteer object
         * @apiSuccessExample {object} Success-Response: 
         *      {
                    "message": "Volunteer creation successful", 
                    "data": {...}
                }

         * @apiError {string} message Error message
         * @apiError {object} data empty
         * @apiErrorExample {object} Error-Response: 
         *      {"message": "Error while creating volunteer", "data": {}}
         */
    volunteerRouter.route('/').post(
      Middleware.Auth.ensureAuthenticated(),
      Middleware.Auth.ensureAuthorized(),

      Middleware.Validator.Volunteer.newVolunteerValidator,

      Middleware.parseBody.middleware,

      // validate type
      Middleware.Volunteer.validateConfirmedStatus,
      // validate that the accountId is not being used for any other thing
      Middleware.Volunteer.checkDuplicateAccountLinks,

      Middleware.Volunteer.parseVolunteer,

      Middleware.Auth.createRoleBindings(CONSTANTS.VOLUNTEER),

      Middleware.Volunteer.createVolunteer,
      Controllers.Volunteer.createdVolunteer
    );

    apiRouter.use('/volunteer', volunteerRouter);
  },
};
