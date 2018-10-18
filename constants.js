"use strict";

// constants kept in alphabetical order
// matches optional http://, https://, http:, https:, and optional www., and then matches for devpost.com and further parameters
const DEVPOST_REGEX = /^(http(s)?:(\/\/)?)?(www\.)?(([-a-zA-Z0-9@:%._\+~#=]{2,256}\.)?devpost\.com)\b([-a-zA-Z0-9@:%_\+.~#?&//=]*)$/;
const EMAIL_REGEX = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
const HACKER_STATUS_NONE = "None";
const HACKER_STATUS_APPLIED = "Applied";
const HACKER_STATUS_ACCEPTED = "Accepted";
const HACKER_STATUS_WAITLISTED = "Waitlisted";
const HACKER_STATUS_CONFIRMED = "Confirmed";
const HACKER_STATUS_CANCELLED = "Cancelled";
const HACKER_STATUS_CHECKED_IN = "Checked-in";
const HACKER_STATUSES = [
    HACKER_STATUS_NONE,
    HACKER_STATUS_APPLIED,
    HACKER_STATUS_ACCEPTED,
    HACKER_STATUS_WAITLISTED,
    HACKER_STATUS_CONFIRMED,
    HACKER_STATUS_CANCELLED,
    HACKER_STATUS_CHECKED_IN
];

const HACKER = "Hacker";
const VOLUNTEER = "Volunteer";
const STAFF = "Staff";
const GODSTAFF = "GodStaff";
const SPONSOR = "Sponsor";

const JOB_INTERESTS = ["Internship", "Full-time", "None"];
const SHIRT_SIZES = ["XS", "S", "M", "L", "XL", "XXL"];
const USER_TYPES = [HACKER, VOLUNTEER, STAFF, GODSTAFF, SPONSOR];
// matches optional http://, https://, http:, https:, and optional www.
// matches the domain, and then optional route, path, query parameters
const URL_REGEX = /^(http(s)?:(\/\/)?)?(www\.)?([-a-zA-Z0-9@:%._\+~#=]{2,256}\.[a-z]{2,6})\b([-a-zA-Z0-9@:%_\+.~#?&//=]*)$/;

const EMAIL_SUBJECTS = {};
EMAIL_SUBJECTS[HACKER_STATUS_NONE] = `Application for ${process.env.HACKATHON} incomplete`;
EMAIL_SUBJECTS[HACKER_STATUS_APPLIED] = `Thanks for applying to ${process.env.HACKATHON}`;
EMAIL_SUBJECTS[HACKER_STATUS_ACCEPTED] = `Great update from ${process.env.HACKATHON}`;
EMAIL_SUBJECTS[HACKER_STATUS_WAITLISTED] = `Update from ${process.env.HACKATHON}`;
EMAIL_SUBJECTS[HACKER_STATUS_CONFIRMED] = `Thanks for confirming your attendance to ${process.env.HACKATHON}`;
EMAIL_SUBJECTS[HACKER_STATUS_CANCELLED] = "Sorry to see you go";
EMAIL_SUBJECTS[HACKER_STATUS_CHECKED_IN] = `Welcome to ${process.env.HACKATHON}`;

const CONFIRM_ACC_EMAIL_SUBJECTS = {};
CONFIRM_ACC_EMAIL_SUBJECTS[HACKER] = `Please complete your hacker application for ${process.env.HACKATHON}`;
CONFIRM_ACC_EMAIL_SUBJECTS[SPONSOR] = `You've been invited to create a sponsor account for ${process.env.HACKATHON}`;
CONFIRM_ACC_EMAIL_SUBJECTS[VOLUNTEER] = `You've been invited to create a volunteer account for ${process.env.HACKATHON}`;
CONFIRM_ACC_EMAIL_SUBJECTS[STAFF] = `You've been invited to create a staff account for ${process.env.HACKATHON}`;

module.exports = {
    DEVPOST_REGEX: DEVPOST_REGEX,
    EMAIL_REGEX: EMAIL_REGEX,
    HACKER_STATUS_NONE: HACKER_STATUS_NONE,
    HACKER_STATUS_APPLIED: HACKER_STATUS_APPLIED,
    HACKER_STATUS_ACCEPTED: HACKER_STATUS_ACCEPTED,
    HACKER_STATUS_WAITLISTED: HACKER_STATUS_WAITLISTED,
    HACKER_STATUS_CONFIRMED: HACKER_STATUS_CONFIRMED,
    HACKER_STATUS_CANCELLED: HACKER_STATUS_CANCELLED,
    HACKER_STATUS_CHECKED_IN: HACKER_STATUS_CHECKED_IN,
    HACKER_STATUSES: HACKER_STATUSES,
    JOB_INTERESTS: JOB_INTERESTS,
    SHIRT_SIZES: SHIRT_SIZES,
    USER_TYPES: USER_TYPES,
    URL_REGEX: URL_REGEX,
    EMAIL_SUBJECTS: EMAIL_SUBJECTS,
    CONFIRM_ACC_EMAIL_SUBJECTS: CONFIRM_ACC_EMAIL_SUBJECTS,
    HACKER: HACKER,
    SPONSOR: SPONSOR,
    VOLUNTEER: VOLUNTEER,
    STAFF: STAFF,
    GODSTAFF: GODSTAFF
};