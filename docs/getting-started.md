# How to get started

## What you will need before you can use this

* A google cloud provider account:
  * Google storage bucket.
* Sendgrid account:
  * Sendgrid API key. You may need to log in to the Sendgrid account and create a new key.

## Setting up this repo

1. Clone the repository: `git clone https://github.com/hackmcgill/hackerAPI.git`
2. Make sure you have [node **v20.10.0**](https://nodejs.org/en/download/) installed. You can check using `node -v`.
    * It is recommended to install and use [node version manager (nvm)](https://www.nvmnode.com/guide/download.html) as other McHacks repos may not use the same version of node.
    * If you have another standalone version of node installed, uninstall it or make sure that your shell calls the node from nvm and _not_ the standalone one.
    * Run `nvm install 20.10.0`
    * If you want your default node version to be a different version, you can install that version and follow instructions [here](https://www.nvmnode.com/guide/usage.html#setting-a-default-node-js-version)
    * The .nvmrc file should automatically have nvm use 20.10.0 when you execute node commands in this folder
2. Make sure you have [MongoDB Community edition](https://www.mongodb.com/try/download/community) installed.
    * Follow the setup instructions for your operating system at <https://www.mongodb.com/docs/manual/administration/install-community/>. Keeping all the default values provided by the installer should be fine.
    * Start the mongodb service if it was not started during installation.
    * You can check if it installed properly by running `mongod --version` as well as `mongosh`.
3. Create a `.env` file in the root directory, and populate the fields as per `.env.example`.
    * Most values can be found in the 1Password, including the dev and deploy database information, JWT and cookie secrets, and Google Cloud service account information.
    * The test database should be a local database.
    * See previous section for `SENDGRID_API_KEY`.
    * `NO_REPLY_EMAIL` should be the McHacks noreply email.
    * `SPREADSHEET_ID` and `CHECKIN_SHEET_NAME` shoud have the corresponding information for the Google Sheets spreadsheet that is connected to the team check-in form.
4. Run `npm install` to install all the dependencies.
5. Set up the database using instructions in the next section.
6. Run `npm run start` or `npm run start-windows` to serve locally!


## Setting up the database

1. Determine which environment the database you want to seed belongs to (`deployment`, `development`, or `test`).
2. Navigate to `package.json`, and confirm that at the `seed` and/or `seed-windows` script, `NODE_ENV` is set to the proper environment.
3. Run `npm run seed` or `npm run seed-windows`.

## Testing the API

In order to test that you have set up the API properly, run `npm run test`.
