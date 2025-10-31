"use strict";

const { body } = require('express-validator');

/**
 * Validator for check-in form submission
 */
const checkinValidator = [
    body('formData.teamMember1').notEmpty().withMessage('Team member 1 is required'),
    body('formData.teamMember2').optional(),
    body('formData.teamMember3').optional(),
    body('formData.teamMember4').optional(),
    body('formData.prizeCategories').isArray().withMessage('Prize categories must be an array'),
    body('formData.sponsorChallenges').isArray().withMessage('Sponsor challenges must be an array'),
    body('formData.workshopsAttended').isArray().withMessage('Workshops attended must be an array'),
    body('formData.discordTag').notEmpty().withMessage('Discord tag is required'),
    body('formData.devpostLink').notEmpty().withMessage('Devpost link is required')
];

module.exports = checkinValidator; 
