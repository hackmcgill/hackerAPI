"use strict";

// constants kept in alphabetical order
// matches optional http://, https://, http:, https:, and optional www., and then matches for devpost.com and further parameters
const DEVPOST_REGEX = /^(http(s)?:(\/\/)?)?(www\.)?(([-a-zA-Z0-9@:%._\+~#=]{2,256}\.)?devpost\.com)\b([-a-zA-Z0-9@:%_\+.~#?&//=]*)$/;
const EMAIL_REGEX = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
const HACKER_STATUSES = ["None", "Applied", "Accepted", "Waitlisted", "Confirmed", "Cancelled", "Checked-in"];
const JOB_INTERESTS = ["Internship", "Full-time", "None"];
const SHIRT_SIZES = ["XS", "S", "M", "L", "XL", "XXL"];
const USER_TYPES = ["Hacker", "Volunteer", "Staff", "GodStaff", "Sponsor"];
// matches optional http://, https://, http:, https:, and optional www.
// matches the domain, and then optional route, path, query parameters
const URL_REGEX = /^(http(s)?:(\/\/)?)?(www\.)?([-a-zA-Z0-9@:%._\+~#=]{2,256}\.[a-z]{2,6})\b([-a-zA-Z0-9@:%_\+.~#?&//=]*)$/;

module.exports = {
    DEVPOST_REGEX: DEVPOST_REGEX,
    EMAIL_REGEX: EMAIL_REGEX,
    HACKER_STATUSES: HACKER_STATUSES,
    JOB_INTERESTS: JOB_INTERESTS,
    SHIRT_SIZES: SHIRT_SIZES,
    USER_TYPES: USER_TYPES,
    URL_REGEX,
};