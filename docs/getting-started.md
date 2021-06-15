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
    3. `node`: <https://nodejs.org/en/download/> (Validated Node version is specified in [`.nvmrc`](../../hackerAPI/.nvmrc) )
    4. `npm`: <https://www.npmjs.com/get-npm>.
    5. `Postman`: <https://www.getpostman.com/downloads/>. We use this for testing the API locally.
3. Create a `.env` file in the root directory, and populate the fields as per `.env.example`.
4. run `npm install`

## Setting up the database

1. Determine which environment the database you want to seed belongs to (`deployment`, `development`, or `test`).
2. Navigate to `package.json`, and confirm that at the `seed` script, `NODE_ENV` is set to the proper environment.
3. Run `npm run seed`.

## Testing the API

### Automated Testing

In order to test that you have set up the API properly, run `npm run test`.

### Testing with Postman

1. Import Postman Collection from [`postman.json`](./api/postman.json)
2. [Create a new Environment](https://learning.postman.com/docs/sending-requests/managing-environments/) in Postman with **Variables** for `base_url`. Typical values for these might look like this. You may or may not have the same credentials in your Dev Environment as the Production Database.

    |                | Local Dev Environment | Production Environment |
    |----------------|-----------------------|------------------------|
    | base_url       | http://localhost:3000/api | https://api.mchacks.ca |

API parameters are not currently automatically imported by the Postman generation script. A change to a different API Doc generation tool in future could make this a more supported use case by Postman.
