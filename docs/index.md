# hackerAPI

API for registration, live-site

## Getting started

* Run `npm install` to download all of the dependencies.

## How to deploy

Go to this page: [deployment guide](./docs/deploy.md)

## Coding Standards

Go to this page: [coding standards guide](./docs/standards.md)

## Folder structure

```string
HackerAPI
├── Dockerfile:                     controls running of docker image
├── README.md:                      root of all information
├── VERSION:                        version number of the application
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
│   ├── defaultPermission.model.js  Schema that maps account types with permission ids
│   ├── hacker.model.js             Schema for a hacker account.
│   ├── passwordResetToken.model.js 
│   ├── permission.model.js         Schema for a permission.
│   ├── skill.model.js              Schema for a skill that a Hacker has
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
│   ├── auth.service.js
│   ├── database.service.js
│   ├── email.service.js
│   ├── hacker.service.js
│   ├── logger.service.js
│   ├── permission.service.js
│   ├── resetPassword.service.js
│   ├── skill.service.js
│   ├── team.service.js
│   └── version.service.js
└── tests
    ├── setup.spec.js
    └── util
        ├── account.test.util.js
        ├── bus.test.util.js
        ├── defaultPermission.test.util.js
        ├── hacker.test.util.js
        ├── permission.test.util.js
        ├── skill.test.util.js
        ├── sponsor.test.util.js
        ├── staff.test.util.js
        ├── team.test.util.js
        └── volunteer.test.util.js
```