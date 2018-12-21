"use strict";

const ACCOUNT_GET_BY_EMAIL = "Account found by user email.";
const ACCOUNT_GET_BY_ID = "Account found by user id.";
const ACCOUNT_READ = "Account retrieval successful.";
const ACCOUNT_CREATE = "Account creation successful.";
const ACCOUNT_UPDATE = "Account update successful.";
const ACCOUNT_INVITE = "Account invitation successful.";

const AUTH_LOGIN = "Login successful.";
const AUTH_LOGOUT = "Logout successful.";
const AUTH_SEND_RESET_EMAIL = "Send reset email successful.";
const AUTH_RESET_PASSWORD = "Reset password successful.";
const AUTH_CONFIRM_ACCOUNT = "Confirm account successful.";
const AUTH_GET_ROLE_BINDINGS = "Get role bindings successful.";
const AUTH_GET_ROLES = "Get roles successful.";
const AUTH_SEND_CONFIRMATION_EMAIL = "Send confirmation email successful.";

const HACKER_GET_BY_ID = "Hacker found by id.";
const HACKER_READ = "Hacker retrieval successful.";
const HACKER_CREATE = "Hacker creation successful.";
const HACKER_UPDATE = "Hacker update successful.";

const RESUME_UPLOAD = "Resume upload successful.";
const RESUME_DOWNLOAD = "Resume download successful.";

const SEARCH_QUERY = "Query search successful. Returning results.";
const SEARCH_NO_RESULTS = "Query search successful. No results found.";


const SPONSOR_GET_BY_ID = "Sponsor found by id.";
const SPONSOR_CREATE = "Sponsor creation successful.";

const TEAM_GET_BY_ID = "Team found by id.";
const TEAM_CREATE = "Team creation successful.";

const VOLUNTEER_CREATE = "Volunteer creation successful.";

module.exports = {
    ACCOUNT_GET_BY_EMAIL: ACCOUNT_GET_BY_EMAIL,
    ACCOUNT_GET_BY_ID: ACCOUNT_GET_BY_ID,
    ACCOUNT_CREATE: ACCOUNT_CREATE,
    ACCOUNT_UPDATE: ACCOUNT_UPDATE,
    ACCOUNT_INVITE: ACCOUNT_INVITE,
    ACCOUNT_READ: ACCOUNT_READ,

    AUTH_LOGIN: AUTH_LOGIN,
    AUTH_LOGOUT: AUTH_LOGOUT,
    AUTH_SEND_RESET_EMAIL: AUTH_SEND_RESET_EMAIL,
    AUTH_RESET_PASSWORD: AUTH_RESET_PASSWORD,
    AUTH_CONFIRM_ACCOUNT: AUTH_CONFIRM_ACCOUNT,
    AUTH_GET_ROLE_BINDINGS: AUTH_GET_ROLE_BINDINGS,
    AUTH_SEND_CONFIRMATION_EMAIL: AUTH_SEND_CONFIRMATION_EMAIL,
    AUTH_GET_ROLES: AUTH_GET_ROLES,

    HACKER_GET_BY_ID: HACKER_GET_BY_ID,
    HACKER_READ: HACKER_READ,
    HACKER_CREATE: HACKER_CREATE,
    HACKER_UPDATE: HACKER_UPDATE,

    RESUME_UPLOAD: RESUME_UPLOAD,
    RESUME_DOWNLOAD: RESUME_DOWNLOAD,

    SEARCH_QUERY: SEARCH_QUERY,
    SEARCH_NO_RESULTS: SEARCH_NO_RESULTS,

    SPONSOR_GET_BY_ID: SPONSOR_GET_BY_ID,
    SPONSOR_CREATE: SPONSOR_CREATE,

    TEAM_GET_BY_ID: TEAM_GET_BY_ID,
    TEAM_CREATE: TEAM_CREATE,

    VOLUNTEER_CREATE: VOLUNTEER_CREATE,
};