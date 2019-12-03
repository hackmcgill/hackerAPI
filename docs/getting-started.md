# How to get started

## What you will need before you can use this

* A google cloud provider account:
  * Google storage bucket.
* Sendgrid account and the sendgrid_api_key

## Setting up this repo

1. Clone the repository: `git clone https://github.com/hackmcgill/hackerAPI.git`
2. Make sure you have the following tools:
    1. `git`: <https://git-scm.com/downloads>
    2. `mongodb`: <https://docs.mongodb.com/manual/installation/>
        1. Make sure you also have the `/data/db` directory.
        2. To test the installation, run `mongod`.
    3. `node`: <https://nodejs.org/en/download/>
    4. `npm`: <https://www.npmjs.com/get-npm>.
    5. `Postman`: <https://www.getpostman.com/downloads/>. We use this for testing the API locally.
3. Make sure you have the following (only if you are going to be publishing this as a kubernetes cluster on google cloud):
    1. `kubectl`: <https://kubernetes.io/docs/tasks/tools/install-kubectl/>
    2. `gcloud`: <https://cloud.google.com/sdk/install>
4. Create a `.env` file in the root directory, and populate the fields as per `.env.example`.
5. run `npm install`

## Setting up the database

1. Determine which environment the database you want to seed belongs to (`deployment`, `development`, or `test`).
2. Navigate to `package.json`, and confirm that at the `seed` script, `NODE_ENV` is set to the proper environment.
3. Run `npm run seed`.

## Testing the API

In order to test that you have set up the API properly, run `npm run test`.