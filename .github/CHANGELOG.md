# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

### Added

-   Add batch accept script

## [2.4.0](https://github.com/hackmcgill/hackerapi/tree/2.4.0) - 2020-01-31

### Added

-   Added the live site link to the check in email

## [2.3.1](https://github.com/hackmcgill/hackerapi/tree/2.3.1) - 2020-01-15

### Removed

-   Removed travel routes from hacker

## [2.3.0](https://github.com/hackmcgill/hackerapi/tree/2.3.0) - 2020-01-14

### Added

-   Added travel model
-   Added route to create travel
-   Added routes to look up travel by id, email or self
-   Added routes to status or offer of an existing travel

### Changed

-   Update hacker status emails: accepted, checked-in, confirmed, declined, waitlisted, withdrawn

## [2.2.0](https://github.com/hackmcgill/hackerapi/tree/2.2.0) - 2020-01-12

### Added

-   Add route to accept hacker by email

## [2.1.3](https://github.com/hackmcgill/hackerapi/tree/2.1.3) - 2020-01-11

### Changed

-   Comment out application close validation

## [2.1.2](https://github.com/hackmcgill/hackerapi/tree/2.1.2) - 2020-01-05

### Changed

-   Extend application close time

## [2.1.1](https://github.com/hackmcgill/hackerapi/tree/2.1.1) - 2020-01-03

### Fixed

-   Fixed application close time

## [2.1.0](https://github.com/hackmcgill/hackerapi/tree/2.1.0) - 2020-01-01

### Added

-   Add email blast marketing email
-   Add 3 days left marketing email
-   Add check to ensure application creation deadline has not passed yet

### Fixed

-   Fix unsubscribe button in marketing emails

## [2.0.1](https://github.com/hackmcgill/hackerapi/tree/2.0.1) - 2019-12-24

### Added

-   Add tests for `travel` field in hacker's application

### Changed

-   Removed all instances of `needsBus`

### Fixed

-   Change the attribute used to check already exisiting emails when updating one's account

## [2.0.0](https://github.com/hackmcgill/hackerapi/tree/2.0.0) - 2019-12-17

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

### Fixed

-   Fix duplicate email bug

### Security

-   Fix vulnerabilities
-   Update packages
-   Bump node version to 10.17.0
