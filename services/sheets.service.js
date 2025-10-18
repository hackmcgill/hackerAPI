"use strict";

const { google } = require('googleapis');
const Logger = require('./logger.service');

class SheetsService {
    constructor() {
        this.spreadsheetId = process.env.SPREADSHEET_ID;
        if (!this.spreadsheetId) {
            Logger.error('SPREADSHEET_ID is not set in environment variables');
            throw new Error('SPREADSHEET_ID is not set in environment variables');
        }

        // Initialize Google Sheets API
        this.sheets = google.sheets('v4');
        
        // Set up authentication using the service account credentials file
        // The GOOGLE_APPLICATION_CREDENTIALS environment variable should point to the JSON file
        if (!process.env.GOOGLE_APPLICATION_CREDENTIALS) {
            Logger.error('GOOGLE_APPLICATION_CREDENTIALS is not set in environment variables');
            throw new Error('GOOGLE_APPLICATION_CREDENTIALS is not set in environment variables');
        }
        
        this.auth = new google.auth.GoogleAuth({
            keyFile: process.env.GOOGLE_APPLICATION_CREDENTIALS,
            scopes: ['https://www.googleapis.com/auth/spreadsheets']
        });
    }

    /**
     * Append check-in data to the spreadsheet
     * @param {Object} formData The check-in form data
     * @returns {Promise<void>}
     */
    async appendCheckinData(formData) {
        try {
            Logger.info('Attempting to append check-in data to spreadsheet');
            Logger.info('Spreadsheet ID:', this.spreadsheetId);
            Logger.info('Google Application Credentials path:', process.env.GOOGLE_APPLICATION_CREDENTIALS);
            
            const authClient = await this.auth.getClient();
            Logger.info('Successfully obtained auth client');
            
            // Validate form data
            if (!formData) {
                throw new Error('Form data is required');
            }
            
            // Format the data for the spreadsheet
            const values = [[
                new Date().toISOString(),
                formData.teamMember1 || '',
                formData.teamMember2 || '',
                formData.teamMember3 || '',
                formData.teamMember4 || '',
                Array.isArray(formData.prizeCategories) ? formData.prizeCategories.join(', ') : '',
                Array.isArray(formData.sponsorChallenges) ? formData.sponsorChallenges.join(', ') : '',
                Array.isArray(formData.workshopsAttended) ? formData.workshopsAttended.join(', ') : '',
                formData.teamId || '' // Add teamId as the 9th column
            ]];

            Logger.info('Formatted data for spreadsheet:', values);

            const request = {
                spreadsheetId: this.spreadsheetId,
                range: 'Sheet1!A:I', // Updated to include column I for teamId
                valueInputOption: 'USER_ENTERED',
                insertDataOption: 'INSERT_ROWS',
                resource: {
                    values: values
                },
                auth: authClient
            };

            Logger.info('Making request to Google Sheets API');
            const response = await this.sheets.spreadsheets.values.append(request);
            Logger.info('Google Sheets API response:', response.status, response.statusText);
            Logger.info('Successfully appended check-in data to spreadsheet');
        } catch (error) {
            Logger.error('Error appending data to spreadsheet:', error.message);
            if (error.response) {
                Logger.error('Google Sheets API error response:', error.response.status, error.response.data);
            }
            throw error;
        }
    }
}

module.exports = new SheetsService(); 
