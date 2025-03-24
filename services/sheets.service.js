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
        
        // Set up authentication using service account credentials
        this.auth = new google.auth.GoogleAuth({
            credentials: {
                type: process.env.TYPE,
                project_id: process.env.PROJECT_ID,
                private_key_id: process.env.PRIVATE_KEY_ID,
                private_key: process.env.PRIVATE_KEY.replace(/\\n/g, '\n'),
                client_email: process.env.CLIENT_EMAIL,
                client_id: process.env.CLIENT_ID,
                auth_uri: process.env.AUTH_URI,
                token_uri: process.env.TOKEN_URI,
                auth_provider_x509_cert_url: process.env.AUTH_PROVIDER_X509_CERT_URL,
                client_x509_cert_url: process.env.CLIENT_X509_CERT_URL
            },
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
            const authClient = await this.auth.getClient();
            
            // Format the data for the spreadsheet
            const values = [[
                new Date().toISOString(),
                formData.teamMember1,
                formData.teamMember2,
                formData.teamMember3,
                formData.teamMember4,
                formData.prizeCategories.join(', '),
                formData.sponsorChallenges.join(', '),
                formData.workshopsAttended.join(', ')
            ]];

            const request = {
                spreadsheetId: this.spreadsheetId,
                range: 'Sheet1!A:H', // Adjust range as needed
                valueInputOption: 'USER_ENTERED',
                insertDataOption: 'INSERT_ROWS',
                resource: {
                    values: values
                },
                auth: authClient
            };

            await this.sheets.spreadsheets.values.append(request);
            Logger.info('Successfully appended check-in data to spreadsheet');
        } catch (error) {
            Logger.error('Error appending data to spreadsheet:', error);
            throw error;
        }
    }
}

module.exports = new SheetsService(); 
