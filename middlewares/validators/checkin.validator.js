"use strict";

const { body } = require('express-validator');
const {
    PRIZE_CATEGORIES,
    SPONSOR_CHALLENGES,
    MLH_CHALLENGES
} = require('../../constants/checkin-options');

/**
 * Validator for check-in form submission
 */
const checkinValidator = [
    body('formData.prizeCategories')
        .isArray()
        .withMessage('Prize categories must be an array')
        .custom((values) =>
            Array.isArray(values) &&
            values.every((value) => typeof value === 'string' && PRIZE_CATEGORIES.includes(value))
        )
        .withMessage('Prize categories contain invalid selections'),
    body('formData.sponsorChallenges')
        .isArray()
        .withMessage('Sponsor challenges must be an array')
        .custom((values) =>
            Array.isArray(values) &&
            values.every((value) => typeof value === 'string' && SPONSOR_CHALLENGES.includes(value))
        )
        .withMessage('Sponsor challenges contain invalid selections'),
    body('formData.mlhChallenges')
        .isArray()
        .withMessage('MLH challenges must be an array')
        .custom((values) =>
            Array.isArray(values) &&
            values.every((value) => typeof value === 'string' && MLH_CHALLENGES.includes(value))
        )
        .withMessage('MLH challenges contain invalid selections'),
    // body('formData.workshopsAttended').isArray().withMessage('Workshops attended must be an array'),
    body('formData.discordTag').notEmpty().withMessage('Discord tag is required'),
    body('formData.devpostLink')
        .notEmpty()
        .withMessage('Devpost link is required')
        .bail()
        .isURL({ require_protocol: true, protocols: ['http', 'https'] })
        .withMessage('Devpost link must be a valid URL')
        .bail()
        .custom((value) => {
            try {
                const url = new URL(value);
                return url.hostname === 'devpost.com' || url.hostname.endsWith('.devpost.com');
            } catch (error) {
                return false;
            }
        })
        .withMessage('Devpost link must be a devpost.com URL')
];

module.exports = checkinValidator; 
