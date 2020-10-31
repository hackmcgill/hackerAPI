# hackerAPI

API for registration, live-site

* Master: [![Build Status](https://travis-ci.org/hackmcgill/hackerAPI.svg?branch=master)](https://travis-ci.org/hackmcgill/hackerAPI)
* Develop: [![Build Status](https://travis-ci.org/hackmcgill/hackerAPI.svg?branch=develop)](https://travis-ci.org/hackmcgill/hackerAPI)

## Getting started

Check out [this page](./getting-started).
  
## Helpful links

* [**Getting started**](./getting-started)
* [**How to deploy**](./deploy)
* [**Coding standards**](./standards)
* [**API HTTP route documentation**](./api/)
* [**Architecture, Dependencies, Design**](./architecture)

## Folder structure

```string
HackerAPI
├── Dockerfile:                     controls running of docker image
├── README.md:                      root of all information
├── app.js:                         express app object
├── bin
│   └── www:                        entry point to the application
├── build.sh:                       builds a docker image
├── docs:                           For all of your documentation needs
│   ├── deploy.md                   Deployment docs
│   ├── standards.md                Coding standards docs
│   └── api
│       └── index.html              api documentation
├── controllers
│   ├── account.controller.js       Controller for account related responses
│   ├── auth.controller.js          Controller for authentication related responses
│   └── hacker.controller.js        Controller for hacker related responses
├── middlewares
│   ├── account.middleware.js       Middleware for account
│   ├── auth.middleware.js          Middleware for authentication
│   ├── parse-body.middleware.js    Middleware for parsing information sent in during request
│   ├── util.middleware.js          Common middleware used in many routes
│   └── validators                  Validation of passed in data
│       ├── account.validator.js
│       ├── auth.validator.js
│       ├── hacker.validator.js
│       ├── team.validator.js
│       └── validator.helper.js
├── models                          All of the schema and model information reside here
│   ├── account.model.js            Schema for generic user account
│   ├── bus.model.js                Schema for a bus route.
│   ├── hacker.model.js             Schema for a hacker account.
│   ├── passwordResetToken.model.js
│   ├── role.model.js
│   ├── roleBinding.model.js
│   ├── sponsor.model.js            Schema for sponsor account.
│   ├── staff.model.js              Schema for staff members (not volunteers)
│   ├── team.model.js               Schema for a hacker team.
│   └── volunteer.model.js          Schema for volunteers on the day-of
├── package-lock.json
├── package.json                    Stores npm script commands, dependencies
├── populatedb.js
├── release.sh                      Creates and deploys container image.
├── routes
│   ├── api
│   │   ├── account.js              Handles account related routes
│   │   ├── auth.js                 Handles all login, logout, password routes
│   │   ├── hacker.js               Handles hacker related routes
│   │   └── team.js                 Handles team related routes
│   └── index.js                    Root route
├── services                        Stores all services, such as logging, and versioning, and db access
│   ├── account.service.js
|   ├── accountConfirmation.service.js
│   ├── auth.service.js
│   ├── database.service.js
│   ├── email.service.js
│   ├── env.service.js
│   ├── hacker.service.js
│   ├── logger.service.js
│   ├── resetPassword.service.js
│   ├── role.service.js
│   ├── roleBinding.service.js
│   ├── search.js
│   ├── sponsor.service.js
│   ├── storage.service.js
│   ├── team.service.js
│   ├── version.service.js
│   └── volunteer.service.js
└── tests
    ├── setup.spec.js
    └── util
        ├── account.test.util.js
        ├── bus.test.util.js
        ├── hacker.test.util.js
        ├── sponsor.test.util.js
        ├── staff.test.util.js
        ├── team.test.util.js
        └── volunteer.test.util.js
```
