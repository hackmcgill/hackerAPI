"use strict";

const { HACKATHON_NAME } = require("./general.constant");

const EMAIL_GLOBALS = {
    // Branding and logos
    hackathonName: HACKATHON_NAME,
    hackathonEdition: `${HACKATHON_NAME} 14`,
    logoUrl: "https://mchacks.ca/martlet-text-14.webp",

    // Event dates & deadlines (shown verbatim in emails)
    eventDates: "Jan. 16-17, 2027",
    applicationDeadline: "December 14th, 2026 at 11:59pm EST",
    applicationEditDeadline: "December 31st, 2026 at 11:59 PM EST",
    confirmationDeadline: "January 3rd at 11:59PM EST",

    // Event links
    discordUrl: "https://discord.com/invite/Sa5P8yDgR6", // to-update
    devpostUrl: "https://mchacks10.devpost.com", // to-update
    volunteerFormUrl:
        "https://docs.google.com/forms/d/e/1FAIpQLScV7bk5yhAMqyI25r6ubHDoz5hlbG5UKZR9cf5NKgW2upCz4Q/viewform",

    // Venue (week-of email)
    venueName: "McGill SSMU Building", // to-update
    venueMapsUrl: "https://goo.gl/maps/2nHsXtvLDNK2", // to-update
};

module.exports = {
    EMAIL_GLOBALS: EMAIL_GLOBALS,
};
