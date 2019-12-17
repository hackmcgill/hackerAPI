# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased] 2.0.0

### Added

-   Send accounts back to account confirmation on email change where confirmed is false
-   Add Travis notifications to Slack
-   Add code formatting with ESLint and Prettier
-   Add `declined` hacker status
-   Add accept hacker route
-   Create changelog

### Changed

-   Match npm scripts with dashboard
-   Update application fields
-   Modify account creation/profile fields
-   Move deployment from GCP to Heroku
-   Change `cancelled` hacker status to `withdrawn`
-   Update pre-acceptance email templates: none hacker status, applied hacker status, account invitation, account confirmation, password reset
-   Group application enums
-   Change job interest enums

### Security

-   Fix vulnerabilities
-   Update packages
-   Bump node version to 10.17.0
