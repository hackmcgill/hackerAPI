# hackerAPI

API for registration, live-site

## Getting started

* Run `npm install` to download all of the dependencies.

## How to deploy

Go to this page: [deployment guide](./docs/deploy.md)

## Coding Standards

Go to this page: [coding standards guide](./docs/standards.md)

## Folder Structure

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
│   └── standards.md                Coding standards docs
├── models                          All of the schema and model information reside here
│   ├── account.model.js            Schema for generic user account
│   ├── bus.model.js                Schema for a bus route.
│   ├── defaultPermission.model.js  Schema that maps account types with permission ids
│   ├── hacker.model.js             Schema for a hacker account.
│   ├── permission.model.js         Schema for a permission.
│   ├── skill.model.js              Schema for a skill that a Hacker has
│   ├── sponsor.model.js            Schema for sponsor account.
│   ├── staff.model.js              Schema for staff members (not volunteers)
│   ├── team.model.js               Schema for a hacker team.
│   └── volunteer.model.js          Schema for volunteers on the day-of
├── package-lock.json
├── package.json                    Stores npm script commands, dependencies
├── release.sh                      Creates and deploys container image.
├── routes                          API routes
│   ├── auth.js                     Handles all login / logout routes
│   └── index.js                    Root route
└── services                        Stores all services, such as logging, and versioning, and db access
    ├── logger.service.js
    └── version.service.js
```