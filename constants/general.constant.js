"use strict";

const HACKATHON_NAME = "McHacks";

// constants kept in alphabetical order
// matches optional http://, https://, http:, https:, and optional www., and then matches for devpost.com and further parameters
const DEVPOST_REGEX = /^(http(s)?:(\/\/)?)?(www\.)?(([-a-zA-Z0-9@:%._\+~#=]{2,256}\.)?devpost\.com)\b([-a-zA-Z0-9@:%_\+.~#?&//=]*)$/;
// from https://emailregex.com
const EMAIL_REGEX = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
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
const VALID_SEARCH_ACTIONS = [
    "change_status",
    "email",
    "change_status_and_email"
];

const CORRESPONDING_STATUSES = {
    "change_status": HACKER_STATUSES,
    "email": ["Acceptance", "Waitlist", "Reminder"]
}

const SAMPLE_DIET_RESTRICTIONS = [
    "None",
    "Vegan",
    "Vegetarian",
    "Keto",
    "Gluten free",
    "Pescetarian",
    "Peanut allergy",
    "Milk allergy",
    "Egg allergy",
    "Allergy",
    "No beef",
    "No porc",
    "No fish",
    "No shellfish"
];

const HACKER = "Hacker";
const VOLUNTEER = "Volunteer";
const STAFF = "Staff";
const SPONSOR = "Sponsor";

const SPONSOR_T1 = "SponsorT1";
const SPONSOR_T2 = "SponsorT2";
const SPONSOR_T3 = "SponsorT3";
const SPONSOR_T4 = "SponsorT4";
const SPONSOR_T5 = "SponsorT5";

const JOB_INTERESTS = ["Internship", "Full-time", "None"];
const ROLE_CATEGORIES = {
    SELF: ":self",
    ALL: ":all"
};
// enum of type of requests
const REQUEST_TYPES = {
    GET: "GET",
    POST: "POST",
    PATCH: "PATCH",
    DELETE: "DELETE",
    PUT: "PUT"
};

//Define names of the roles specifically associated with permission to create an account
const POST_ROLES = {};
POST_ROLES[HACKER] = "postHacker";
POST_ROLES[SPONSOR_T1] = "postSponsor";
POST_ROLES[SPONSOR_T2] = "postSponsor";
POST_ROLES[SPONSOR_T3] = "postSponsor";
POST_ROLES[SPONSOR_T4] = "postSponsor";
POST_ROLES[SPONSOR_T5] = "postSponsor";
POST_ROLES[VOLUNTEER] = "postVolunteer";
POST_ROLES[STAFF] = "postStaff";

const SHIRT_SIZES = ["XS", "S", "M", "L", "XL", "XXL"];
const USER_TYPES = [HACKER, VOLUNTEER, STAFF, SPONSOR];
const SPONSOR_TIERS = [SPONSOR_T1, SPONSOR_T2, SPONSOR_T3, SPONSOR_T4, SPONSOR_T5];
const EXTENDED_USER_TYPES = [HACKER, VOLUNTEER, STAFF, SPONSOR_T1, SPONSOR_T2, SPONSOR_T3, SPONSOR_T4, SPONSOR_T5];

// matches optional http://, https://, http:, https:, and optional www.
// matches the domain, and then optional route, path, query parameters
const URL_REGEX = /^(http(s)?:(\/\/)?)?(www\.)?([-a-zA-Z0-9@:%._\+~#=]{2,256}\.[a-z]{2,6})\b([-a-zA-Z0-9@:%_\+.~#?&//=]*)$/;
const ANY_REGEX = /^.+$/;

const MAX_TEAM_SIZE = 4;

const WEEK_OF = 'Week Of';

const EMAIL_SUBJECTS = {};
EMAIL_SUBJECTS[HACKER_STATUS_NONE] = `Application for ${HACKATHON_NAME} incomplete`;
EMAIL_SUBJECTS[HACKER_STATUS_APPLIED] = `Thanks for applying to ${HACKATHON_NAME}`;
EMAIL_SUBJECTS[HACKER_STATUS_ACCEPTED] = `Great update from ${HACKATHON_NAME}`;
EMAIL_SUBJECTS[HACKER_STATUS_WAITLISTED] = `Update from ${HACKATHON_NAME}`;
EMAIL_SUBJECTS[HACKER_STATUS_CONFIRMED] = `Thanks for confirming your attendance to ${HACKATHON_NAME}`;
EMAIL_SUBJECTS[HACKER_STATUS_CANCELLED] = "Sorry to see you go";
EMAIL_SUBJECTS[HACKER_STATUS_CHECKED_IN] = `Welcome to ${HACKATHON_NAME}`;

EMAIL_SUBJECTS[WEEK_OF] = `Welcome to ${HACKATHON_NAME}`;

const CONFIRM_ACC_EMAIL_SUBJECT = `Please complete your hacker application for ${HACKATHON_NAME}`;
const CREATE_ACC_EMAIL_SUBJECTS = {};
CREATE_ACC_EMAIL_SUBJECTS[HACKER] = `You've been invited to create a hacker account for ${HACKATHON_NAME}`;
CREATE_ACC_EMAIL_SUBJECTS[SPONSOR] = `You've been invited to create a sponsor account for ${HACKATHON_NAME}`;
CREATE_ACC_EMAIL_SUBJECTS[VOLUNTEER] = `You've been invited to create a volunteer account for ${HACKATHON_NAME}`;
CREATE_ACC_EMAIL_SUBJECTS[STAFF] = `You've been invited to create a staff account for ${HACKATHON_NAME}`;

const CACHE_TIMEOUT_STATS = 5 * 60 * 1000;
const CACHE_KEY_STATS = "hackerStats";

module.exports = {
    HACKATHON_NAME: HACKATHON_NAME,
    DEVPOST_REGEX: DEVPOST_REGEX,
    EMAIL_REGEX: EMAIL_REGEX,
    ANY_REGEX: ANY_REGEX,
    HACKER_STATUS_NONE: HACKER_STATUS_NONE,
    HACKER_STATUS_APPLIED: HACKER_STATUS_APPLIED,
    HACKER_STATUS_ACCEPTED: HACKER_STATUS_ACCEPTED,
    HACKER_STATUS_WAITLISTED: HACKER_STATUS_WAITLISTED,
    HACKER_STATUS_CONFIRMED: HACKER_STATUS_CONFIRMED,
    HACKER_STATUS_CANCELLED: HACKER_STATUS_CANCELLED,
    HACKER_STATUS_CHECKED_IN: HACKER_STATUS_CHECKED_IN,
    HACKER_STATUSES: HACKER_STATUSES,
    REQUEST_TYPES: REQUEST_TYPES,
    JOB_INTERESTS: JOB_INTERESTS,
    SHIRT_SIZES: SHIRT_SIZES,
    USER_TYPES: USER_TYPES,
    SPONSOR_TIERS: SPONSOR_TIERS,
    EXTENDED_USER_TYPES: EXTENDED_USER_TYPES,
    URL_REGEX: URL_REGEX,
    EMAIL_SUBJECTS: EMAIL_SUBJECTS,
    CREATE_ACC_EMAIL_SUBJECTS: CREATE_ACC_EMAIL_SUBJECTS,
    CONFIRM_ACC_EMAIL_SUBJECT: CONFIRM_ACC_EMAIL_SUBJECT,
    HACKER: HACKER,
    SPONSOR: SPONSOR,
    VOLUNTEER: VOLUNTEER,
    STAFF: STAFF,
    SPONSOR_T1: SPONSOR_T1,
    SPONSOR_T2: SPONSOR_T2,
    SPONSOR_T3: SPONSOR_T3,
    SPONSOR_T4: SPONSOR_T4,
    SPONSOR_T5: SPONSOR_T5,
    ROLE_CATEGORIES: ROLE_CATEGORIES,
    POST_ROLES: POST_ROLES,
    CACHE_TIMEOUT_STATS: CACHE_TIMEOUT_STATS,
    CACHE_KEY_STATS: CACHE_KEY_STATS,
    MAX_TEAM_SIZE: MAX_TEAM_SIZE,
    WEEK_OF: WEEK_OF,
    SAMPLE_DIET_RESTRICTIONS: SAMPLE_DIET_RESTRICTIONS,
    VALID_SEARCH_ACTIONS: VALID_SEARCH_ACTIONS,
    CORRESPONDING_STATUSES: CORRESPONDING_STATUSES
};