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

Middleware functions are chained together in a route to process a request in a modular way. Look at Express.js documentation for a better understanding.
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
  * The first middleware should always be the validator for the inputted data of a route. In this case, we have the validator for a new account.
  * The next middleware should always be `Middleware.parseBody.middleware`. This middleware parses validated information, and places it inside of `req.body` if everything is properly validated. Else, it errors out.
  * The following middlewares will depend on what type of route it is. In this case, we are creating a new item in our database, so we want to create a new `Account` object. This is what `Middleware.Account.parseAccount` does.
  * Finally, we want to interact with the database. This is done either in the `Controller` function, or in another `middleware` function.
  * the last middleware should always be a `Controller` (since we want to respond to the user of the api).
* **Connecting inputted route with the newly created route**: We finally connect the newly created router with the inputted router at the end of the `activate` function by writing:
    ```javascript
            apiRouter.use("/account", accountRouter);
    ```

### Services files

`TODO`

### Test files

`TODO`

### Validation files

`TODO`

## Documentation of API

We use apidoc.js to generate documentation for the API. This documentation is found on our github pages link.

For more info on how to write your own documentation, see their docs: <http://apidocjs.com/>.

To update the docs, run: `npm run docs`. Make sure that the version number for each route is correct!