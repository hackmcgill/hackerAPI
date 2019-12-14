# Coding Standards

## Github

Build off of develop. If you are working on a feature, make the branch name `feature/<issue #>-<feature name>`. If you are working on a bug fix, make the branch name `bugfix/<issue #>-<what you're working on>`.

We use github issues to track tasks, and projects to organize them. If you are working on a new issue that is not being tracked, please create one and file it into the proper project.

### Creating a PR

Create the pull-request on the GitHub website. It should pre-populate with a pull request template. Fill out all of the relevant information, such as the issue number, and the checkboxes. Request at least one person to conduct a PR. All tests must pass before you can merge into `develop` or `master`.

### Code Review

During a code review, look for the following pieces of information:

- Are the functions commented?
- Do the variable names make sense, and are in `camelCase`?
- Are the functions in the correct location?
- Does the logic make sense?
- Are there any unnecessary changes that should be removed?

(Things to look for are not limited to the above).

## Javascript

We follow ES6, and use jshint to tell us when we're not writing good code. We use async / await, which is not supported by jshint (yet).

For every `.js` file, `"use strict";` is required at the top of the file.

The naming convention for all `.js` files (with the exception of routes) is as such: `<type>.<folder-name>.js`. An example of this is: `account.controller.js`. From this, we know that the file contains all controller information for account routes. Another example is: `email.service.js`. We understand here that this file contains all services that have to do with emailing people.

### Middleware files

Middleware functions are chained together in a route to process a request in a modular way. Look at Express.js [documentation](https://expressjs.com/en/guide/using-middleware.html) for a better understanding.
Below is an example middleware file:

```javascript
"use strict";
const Util = require("./util.middleware");
const Services = {
    User: require("../services/User.service")
}
...
/**
 * Attempts to find user by id, and attaches it onto req.body.
 * If it cannot find the user, then a 404 error is passed to next.
 * @function getUser
 * @param {{body: {id:string}}} req the request object passed in by Express.js
 * @param {*} res the result object passed in by Express.js
 * @param {(err?:*)=>void} next the callback passed in by Express.js
 * @returns {void} nothing
 */
async function getUser(req, res, next) {
    const id = req.body.id;
    const user = await Services.User.findById(id);
    if(!!user) {
        req.body.user = user;
        next();
    } else {
        next({
            status: 404,
            message: "User for id not found"
            error: id
        });
    }
}
...
module.exports = {
    getUser: Util.asyncMiddleware(updateAccount),
}
```

Things to take note of:

* **function comments**: All functions are commented in jsDocs style. Provide as much description about the function parameters as necessary. In addition, provide as descriptive of a comment about what the function actually does. *Please put down what you expect an object to contain. In this case, the function expects req to contain an attribute body, which should be an object with an attribute id.*
* **Error handling**: If there is a non `500` http error that arises during the HTTP request, you must pass the error into `next`. The object that you pass into next must be structured as such:

    ```javascript
    {
        status: number,
        message: string,
        error: any
    }
    ```  
* **Wrapping async functions**: Asynchronous middleware must be wrapped with `Util.asyncMiddleware(...)`. This is so that if a `Promise` is rejected, the reject reason is handled gracefully. To understand how this works, please look at the code for `asyncMiddleware`.
* **Organization of import statements**: We organize our import statements according to their general function. If a file is a `Service` (such as `user.service.js`), then we place it inside of the `Service` object. This is to make code readability better.

### Models files

Model files define the schemas we have in our database. Below is an example Model file:

```javascript
"use strict";
const mongoose = require("mongoose");
const Constants = require("../constants/general.constant.js");

const AccountSchema = new mongoose.Schema({
    email: {
        type: String,
        trim: true,
        lowercase: true,
        unique: true,
        required: "Email address is required",
        match: [Constants.EMAIL_REGEX, "Please fill a valid email address"]
    },
    password: {
        type: String,
        required: true
    }
});

AccountSchema.methods.toJSON = function () {
    const as = this.toObject();
    delete as.__v;
    as.id = as._id;
    delete as._id;
    return as;
};

AccountSchema.methods.toStrippedJSON = function () {
    const as = this.toJSON();
    delete as.password;
    return as;
};
...
module.exports = mongoose.model("Account", AccountSchema);
```

Things to take note of:

* **Constants file**: We place all shared constants into a constants file. If you are placing a string somewhere in a file, and will be referencing it elsewhere, please consider placing it there.
* **matching for complex values**: Emails are complex strings-- Therefore, we want to make sure that each entry that contains an email matches the regular expression. Do this for all attributes where just the type of the attribute is not sufficient enough to completely describe it. This applies to web addresses too.
* **`toJSON` function**: For each model, we provide a `.toJSON` function. This cleans up the Document before returning the JSON-ed version of it. One thing to notice in particular is that we convert `_id` to `id`, because it's nicer to work with.
* **`toStrippedJSON` function**: For any model with sensitive data that the end user should not see, we write another `toJSON` function, which we call `toStrippedJSON`. This removes all of the sensitive information (such as passwords).

### Routes files

Route files define the different endpoints for our API. Below is an example Routes file:

```javascript
"use strict";
const express = require("express");
const Services = {
    Account: require("../../services/account.service"),
    Auth: require("../../services/auth.service"),
};
const Middleware = {
    Validator: {
        Account: require("../../middlewares/validators/account.validator")
    },
    parseBody: require("../../middlewares/parse-body.middleware"),
    Account: require("../../middlewares/account.middleware")
}
const Controllers = {
    Account: require("../../controllers/account.controller")
};
module.exports = {
    activate: function (apiRouter) {
        const accountRouter = express.Router();
        /**
         * @api {post} /account/ create a new account
         * @apiName create
         * @apiGroup Account
         * @apiVersion 0.0.8
         *
         * @apiParam (body) {String} firstName First name of the account creator.
         * @apiParam (body) {String} lastName Last name of the account creator.
         * @apiParam (body) {String} email Email of the account.
         * @apiParam (body) {String} dietaryRestrictions Any dietary restrictions for the user. 'None' if there are no restrictions
         * @apiParam (body) {String} shirtSize Size of the shirt that the user will receive.
         * @apiParam (body) {String} passowrd The password of the account.
         *
         * @apiSuccess {string} message Success message
         * @apiSuccess {object} data Account object
         * @apiSuccessExample {object} Success-Response:
         *      {
         *          "message": "Account creation successful",
         *          "data": {AccountObject}
         *      }
         *
         * @apiError {string} message Error message
         * @apiError {object} data empty
         * @apiErrorExample {object} Error-Response:
         *      {"message": "Issue with account creation", "data": {}}
         */
        accountRouter.route("/create").post(
            Middleware.Validator.Account.newAccountValidator,
            Middleware.parseBody.middleware,
            Middleware.Account.parseAccount,
            Controllers.Account.addUser
        );
        apiRouter.use("/account", accountRouter);
};
```

Things to take note of:

* **Route comments**: All route comments follow <http://apidocjs.com/> format. Please look there on how to write them.
* **Organization of import statements**: We organize our import statements according to their general function. If a file is a `Service` (such as `user.service.js`), then we place it inside of the `Service` object. This is to make code readability better.
* **`activate` function**: Every route file contains one exported function, called `activate`. This takes as input an `ExpressRouter`, to which we will attach the sub router to. We will also define all of the sub-routes in this function.
* **Chaining middlewares in a route**: We chain middlewares together by placing them one after another as arguments to the http request of the route.
* **Ordering of middleware**:
  * If input is expected, validation of that input should be done promptly. Therefore validators are generally the first middlewares. 
    * The first middleware should be the validator for the inputted data of a route. In this case, we have the validator for a new account.
    * The next middleware should be `Middleware.parseBody.middleware` to parse the validated information. This middleware also places the data inside of `req.body`. If validation fails, it fails the request. 
  * The following middlewares will depend on what type of route it is. In this case, we are creating a new item in our database, so we want to create a new `Account` object. This is what `Middleware.Account.parseAccount` does.
  * Finally, we want to interact with the database. This is done either in the `Controller` function, or in another `middleware` function.
  * the last middleware should always be a `Controller` (since we want to respond to the user of the api).
* **Connecting inputted route with the newly created route**: We finally connect the newly created router with the inputted router at the end of the `activate` function by writing:

    ```javascript
            apiRouter.use("/account", accountRouter);
    ```

### Services files

Service files contain functions that interact with external services. The most common service file interacts with mongoose models to find, create, update documents. Service files are found in the services folder, and are named `<X>.service.js`. Service files are generally called in middleware functions. Below is an example service file:

```javascript
"use strict";
const Account = require("../models/account.model");

/**
 * @function findById
 * @param {ObjectId} id
 * @return {DocumentQuery} The document query will resolve to either account or null.
 * @description Finds an account by mongoID.
 */
function findById(id) {
    const TAG = `[Account Service # findById]:`;
    const query = {
        _id: id
    };

    return Account.findById(query, logger.queryCallbackFactory(TAG, "account", query));
}
...
module.exports = {
    findById: findById
}
```

Things to take note of:
* **async & await**: When the service call is to a mongoose model, they generally return a mongoose query. These can be handled as a promise, and Mongoose has further documentation on it [here](https://mongoosejs.com/docs/api.html). We handle then by using `await` on the service call. For example, a middleware function that uses `findById` would be: 
  ```javascript
    async function getById(req, res, next) {
        const acc = await Services.Account.findById(req.body.id);

        if (!acc) {
            return res.status(404).json({
                message: Constants.Error.ACCOUNT_404_MESSAGE,
                data: {}
            });
        }

        req.body.account = acc;
        return next();
    }   
  ```
It's important to: 
  * Use `await` when calling the service function
  * Put `async` in the method head
  * Check the output of the service function call for any errors. In the code snippet we need to check for a scenario where the account is not found, which is a 404 error. A full list of the current error messages are in [error.constant.js](../constants/error.constant.js).
More information on asynchronous functions can be found [here](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/async_function).
* **queryCallbackFactory**: The query callback factory returns a function that uses winston to log the success or failure of the service call. The callback factory is used for mongoose service calls.

### Test files

We use [Mocha](https://mochajs.org/) with [Chai](https://www.chaijs.com/) to test our routes and services. These test files are located in the `tests` folder, and are named `<X>.test.js` or `<X>.spec.js`. It is important to test both succcess and fail cases. For example, testing account retrieval may include scenarios of:
  * Failure due to authentication
  * Failure due to authorization
  * Failure due to the account not existing
  * Success case for a user
  * Success case for an admin
The code for this example can be found in [account.test.js](../tests/account.test.js).

We repopulate the test server before each test to ensure consistency. [setup.spec.js](../tests/setup.spec.js) contains the code for that. The `storeAll` and `dropAll` functions call test util functions that store and drop specific collections. For example, `account.test.util.js` contains the code a `storeAll` function that inserts all the test account documents into the test database.

#### Util files and Test Database Population

##### Motivation

We wanted to have a scalable way to create new entities that properly reference each other. The biggest challenge lied in creating enough accounts that can be properly referenced during specific tests. 

##### Util.js

Account.util.js contains the test data for accounts. When an account is created, it is placeed within an object whose name references the type of account it will be (ex: Hacker, Sponsor, etc). The object has keys that further define the state of the account. The keys are: `new` for new accounts, `stored` for accounts that already exist, and `invalid` for invalid accounts. Additionally, there are 2 more keys inside `stored` for hacker accounts, which are `team` and `noTeam` for accounts linked to hackers that are on a team, or not on a team respectively.

```javascript
let hackerAccounts = {
    new: createNAccounts(10, {
        "accountType": Constants.HACKER,
        "confirmed": true,
    }),
    stored: {
        team: createNAccounts(10, {
            "accountType": Constants.HACKER,
            "confirmed": true,
        }),
        noTeam: createNAccounts(10, {
            "accountType": Constants.HACKER,
            "confirmed": true,
        }),
    },
    invalid: createNAccounts(10, {
        "accountType": Constants.HACKER
    })
};
```

In this example the `new` accounts are accounts that exist, but the hacker objects have not been created. The `stored.team` accounts are those linked to a hacker object that is in a team. The `stored.noTeam` accounts link to  a hacker that is not in a team. The `invalid` accounts are created accounts that are linked to a hacker object that does not fit with the Hacker schema. The invalid accounts are used to test fail cases. The value for each key is an array of account objects. 

On the other end of the account-hacker link, [hacker.util.js](../tests/util/hacker.test.util.js) contains the hacker data in the form of hacker objects. These hacker objects have an `accountId` attribute which references an account's `_id`. The matching between the hacker object and the respective account object it needs to link to is also done by nomenclature. For example, a hacker on a team would be called `TeamHackerX` where X is a number. This hacker's account object would be within the array specified by `hackerAccounts.stored.team`. The specific account object is referenced by its index in the array. That index is the same as the value X in the name of the hacker object.

### Validation files

These files validate inputs using [express-validator](https://express-validator.github.io/docs/). Validation files are located in the `middlewares` directory under a subdirectory called `validators`. The filenames are `<X>.validator.js`. To be used in a route, a validator needs to be a list express validator functions. We have generic validator functions located in [validator.helper.js](../middlewares/validators/validator.helper.js). The goal is to have a generic validator function for each datatype, which can then be put in the list of validators as the situation requires. The generic validators may take several arguments, but generally require:
  * Where the variable is located: `body`, `query`, `header`, or `param`. To validate a value located in `req.body`, one should use `body`
  * The fieldname, such as `email` for `req.body.email`.
  * A boolean detailing whether this value is optional. `false` means that the value is necessary.

An example of a generic validator function:
```javascript
function stringValidator(fieldLocation, fieldname, optional = true) {
    const name = setProperValidationChainBuilder(fieldLocation, fieldname, "invalid string");
    if (optional) {
        return name.optional({
            checkFalsy: true
        }).isString().withMessage("must be a string");
    } else {
        return name.exists().withMessage("name must exist").isString().withMessage("must be a string");
    }
}
```
It's important to note the use of `setProperValidationChainBuilder` to parse the input value from the appropriate input location. This is consistent across generic validators. It is also important to create a validator for situations where the input is optional.

A validator example, using generic validator functions. 
```javascript
"use strict";
const VALIDATOR = require("./validator.helper");
const Constants = require("../../constants/general.constant");

module.exports = {
    idValidator: [
        VALIDATOR.mongoIdValidator("param", "id", false),
    ],
    updateAccountValidator: [
        VALIDATOR.stringValidator("body", "firstName", true),
        VALIDATOR.stringValidator("body", "lastName", true),
        VALIDATOR.stringValidator("body", "pronoun", true),
        VALIDATOR.regexValidator("body", "email", true, Constants.EMAIL_REGEX),
        VALIDATOR.alphaArrayValidator("body", "dietaryRestrictions", true),
        VALIDATOR.enumValidator("body", "shirtSize", Constants.SHIRT_SIZES, true),
        VALIDATOR.dateValidator("body", "birthDate", true),
        VALIDATOR.phoneNumberValidator("body", "phoneNumber", true)
    ],
};
```

A route would use a validator in the following manner: 
```javascript
    accountRouter.route("/:id").patch(
        ...
        // validators
        Middleware.Validator.RouteParam.idValidator,
        Middleware.Validator.Account.updateAccountValidator,

        Middleware.parseBody.middleware,
        ...
    );
```

`Middleware.parseBody.middleware` evaluates the validator functions, so it is generally placed right after the validators. If there is an error during validation, it will send a 422 error status to be handled. If all the validators pass, then it will move the validated values into req.body. If there a validator function was not found for a property in `req.body`, that property will be removed. For example, suppose `req.body` was originally:

```javascript
{
  "A": "foo",
  "B": true,
  "C": { 
    "bar": "baz" 
  }
}
```

and only `A` and `B` are validated. Then `req.body` after validation will be:

```javascript
{
  "A": "foo",
  "B": true
}
```


## Batch Scripts

There is a set of batch scripts written in [batch_scripts.py](../scripts/batch_scripts.py). The motivation for these scripts is to provide crucial functionality for the hackathon process that is lacking in the admin UX. The goal is to extend the functionality to provide a full-fledged CLI client so that we can interface with the API without using the admin dashboard.

### How to Run

This script expects python3, and will not work in python2. Before you run the script, make sure that you have installed the following library:

* [bson](https://pypi.org/project/bson/): `pip install bson`

Then, run the following command:
```python3 batch_scripts.py```

In order for the script to work with all of the actions, you must have a admin account. Otherwise, it's possible that you do not have the proper permission to execute all of the actions.

### Existing Actions in the Script file

There are 6 batch actions:

1. `updateStatus`: Update the status of a set of hackers. The script asks for a file which contains the IDs of hackers to update, and also for a pre-requisite status that the hacker must be in order for the update to properly go through.
2. `dayOf`: Send the day-of email to a set of hackers. The script asks for a file which contains the IDs of hackers to send the emails to, and also for a pre-requisite status that the hacker must be in order for the email to properly go through.
3. `weekOf`: Send the week-of email to a set of hackers. The script asks for a file which contains the IDs of hackers  to send the emails to, and also for a pre-requisite status that the hacker must be in order for the email to properly go through.
4. `downloadResume`: Download the resumes for a set of hackers. The script asks for a file which contains the IDs of hackers to download. and also for a pre-requisite status that the hacker must be in order to download the resume.
5. `inviteUsers`: Invites a set of emails to create accounts. The script asks for a CSV file, which should be formatted in the following way:
   | email       | accountType |
   | ----------- | ----------- |
   | foo@bar.com | Admin       |
   | baz@bar.com | Sponsor     |
6. `getHackers`: Downloads all of the hacker details whose status matches the inputted status. Places the hacker information into a CSV file in the inputted directory.

## Documentation of API

We use apidoc.js to generate documentation for the API. This documentation is found on our github pages link.

For more info on how to write your own documentation, see their docs: <http://apidocjs.com/>.

To update the docs, run: `npm run docs`. Make sure that the version number for each route is correct!
