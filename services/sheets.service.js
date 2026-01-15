"use strict";

const { google } = require('googleapis');
const Logger = require('./logger.service');

class SheetsService {
    constructor() {
        this.spreadsheetId = process.env.SPREADSHEET_ID;
        this.sheetName = process.env.CHECKIN_SHEET_NAME || "Team Check-in";
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

    formatSheetRange(range) {
        const safeSheetName = this.sheetName.includes("'")
            ? this.sheetName.replace(/'/g, "''")
            : this.sheetName;
        const quotedName = /[^A-Za-z0-9_]/.test(safeSheetName)
            ? `'${safeSheetName}'`
            : safeSheetName;
        return `${quotedName}!${range}`;
    }

    sanitizeForSheet(value) {
        if (typeof value !== 'string') {
            return value;
        }
        if (
            value.startsWith('=') ||
            value.startsWith('+') ||
            value.startsWith('-') ||
            value.startsWith('@')
        ) {
            return `'${value}`;
        }
        return value;
    }

    sanitizeArrayForSheet(values) {
        if (!Array.isArray(values)) {
            return '';
        }
        return values
            .filter((value) => typeof value === 'string')
            .map((value) => this.sanitizeForSheet(value))
            .join(', ');
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
                this.sanitizeForSheet(formData.teamMember1 || ''),
                this.sanitizeForSheet(formData.teamMember2 || ''),
                this.sanitizeForSheet(formData.teamMember3 || ''),
                this.sanitizeForSheet(formData.teamMember4 || ''),
                this.sanitizeArrayForSheet(formData.prizeCategories),
                this.sanitizeArrayForSheet(formData.sponsorChallenges),
                this.sanitizeArrayForSheet(formData.mlhChallenges),
                // Array.isArray(formData.workshopsAttended) ? formData.workshopsAttended.join(', ') : '',
                this.sanitizeForSheet(formData.discordTag || ''),
                this.sanitizeForSheet(formData.devpostLink || ''),
                this.sanitizeForSheet(formData.teamId || '') // Add teamId at the 'K' column
            ]];

            Logger.info('Formatted data for spreadsheet:', values);

            const request = {
                spreadsheetId: this.spreadsheetId,
                range: this.formatSheetRange('A:K'),
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
