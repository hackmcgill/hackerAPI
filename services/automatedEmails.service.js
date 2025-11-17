"use strict";

const Services = {
    Email: require("./email.service"),
    Hacker: require("./hacker.service"),
    Logger: require("./logger.service"),
};

const TAG = "[AutomatedEmail.Service]";

class AutomatedEmailService {
    /**
     * Get count of hackers with the given status
     * @param {string} status - "Accepted", "Declined"
     * @returns {Promise<number>} Count of hackers with the status
     */
    async getStatusCount(status) {
        try {
            const hackers = await Services.Hacker.findByStatus(status);
            if (!hackers || !Array.isArray(hackers)) {
                return 0;
            }
            return hackers.length;
        } catch (err) {
            Services.Logger.error(`${TAG} Error in getStatusCount: ${err}`);
            throw err;
        }
    }

    /**
     * Send status emails to all hackers with the given status
     * @param {string} status - "Accepted", "Declined"
     * @returns {Promise<{success: number, failed: number}>}
     */
    async sendAutomatedStatusEmails(status) {
        const results = { success: 0, failed: 0 };
        try {
            const hackers = await Services.Hacker.findByStatus(status);

            if (!hackers || !Array.isArray(hackers)) {
                throw new Error(
                    `Expected array from findByStatus(${status}), got ${typeof hackers}`,
                );
            }

            const emailPromises = hackers.map(async (hacker) => {
                try {
                    await new Promise((resolve, reject) => {
                        Services.Email.sendStatusUpdate(
                            hacker.accountId.firstName,
                            hacker.accountId.email,
                            status,
                            (err) => {
                                if (err) {
                                    reject(err);
                                } else {
                                    resolve();
                                }
                            },
                        );
                    });
                    results.success++;
                } catch (err) {
                    Services.Logger.error(
                        `${TAG} Failed to send ${status} email to ${hacker.accountId.email}: ${err}`,
                    );
                    results.failed++;
                }
            });

            await Promise.all(emailPromises);
            return results;
        } catch (err) {
            Services.Logger.error(
                `${TAG} Error in sendAutomatedStatusEmails: ${err}`,
            );
            throw err;
        }
    }
}

module.exports = new AutomatedEmailService();
