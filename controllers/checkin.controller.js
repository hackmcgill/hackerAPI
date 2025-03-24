"use strict";

const Services = {
    Sheets: require('../services/sheets.service')
};

/**
 * @function submitCheckin
 * @param {{body: {formData: Object}}} req
 * @param {*} res
 * @return {JSON} Success status
 * @description Handles the check-in form submission and adds data to Google Sheets
 */
async function submitCheckin(req, res) {
    try {
        await Services.Sheets.appendCheckinData(req.body.formData);
        return res.status(200).json({
            message: "Check-in data successfully submitted",
            data: {}
        });
    } catch (error) {
        return res.status(500).json({
            message: "Error submitting check-in data",
            data: {}
        });
    }
}

module.exports = {
    submitCheckin
}; 
