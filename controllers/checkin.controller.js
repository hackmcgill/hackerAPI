"use strict";

const Services = {
    Sheets: require('../services/sheets.service'),
    Hacker: require('../services/hacker.service'),
    Team: require('../services/team.service'),
    Account: require('../services/account.service')
};

/**
 * @function submitCheckin
 * @param {{body: {formData: Object}, user: {id: string}}} req
 * @param {*} res
 * @return {JSON} Success status
 * @description Handles the check-in form submission and adds data to Google Sheets
 * Automatically fetches team member emails from the logged-in user's team
 */
async function submitCheckin(req, res) {
    try {
        // Get logged-in hacker
        const hacker = await Services.Hacker.findByAccountId(req.user.id);
        
        if (!hacker) {
            return res.status(404).json({
                message: "Hacker not found",
                data: {}
            });
        }

        // Check hacker has a team
        if (!hacker.teamId) {
            return res.status(400).json({
                message: "You must be part of a team to submit check-in",
                data: {}
            });
        }

        // Fetch team data
        const team = await Services.Team.findById(hacker.teamId);
        
        if (!team) {
            return res.status(404).json({
                message: "Team not found",
                data: {}
            });
        }

        // Fetch all team member emails
        const teamMemberEmails = [];
        for (const memberId of team.members) {
            const memberHacker = await Services.Hacker.findById(memberId);
            if (memberHacker) {
                const memberAccount = await Services.Account.findById(memberHacker.accountId);
                if (memberAccount) {
                    teamMemberEmails.push(memberAccount.email);
                }
            }
        }

        // Update team's devpostURL in the database if provided
        if (req.body.formData.devpostLink) {
            await Services.Team.updateOne(hacker.teamId, {
                devpostURL: req.body.formData.devpostLink
            });
        }

        // Prepare data for Google Sheets with team member emails
        const teamIdString = team._id ? team._id.toString() : hacker.teamId.toString();
        
        const checkinData = {
            teamMember1: teamMemberEmails[0] || '',
            teamMember2: teamMemberEmails[1] || '',
            teamMember3: teamMemberEmails[2] || '',
            teamMember4: teamMemberEmails[3] || '',
            prizeCategories: req.body.formData.prizeCategories,
            sponsorChallenges: req.body.formData.sponsorChallenges,
            workshopsAttended: req.body.formData.workshopsAttended,
            discordTag: req.body.formData.discordTag,
            devpostLink: req.body.formData.devpostLink,
            teamId: teamIdString
        };

        await Services.Sheets.appendCheckinData(checkinData);
        
        return res.status(200).json({
            message: "Check-in data successfully submitted",
            data: {}
        });
    } catch (error) {
        console.error('Checkin submission error:', error);
        return res.status(500).json({
            message: "Error submitting check-in data",
            data: {}
        });
    }
}

module.exports = {
    submitCheckin
}; 
