# How to deploy

This application can be most easily deployed via Heroku. A "deploy to heroku" button is available in the `README.md` file. Once in Heroku, several environment variables will need to be filled out including: 

```plain
##front-end server
FRONTEND_ADDRESS_DEPLOY=

#The info for the deployment database
DB_ADDRESS_DEPLOY=
DB_USER_DEPLOY=
DB_PASS_DEPLOY=

#Secret key for the cookies
COOKIE_SECRET=

#Secret key for the invite tokens
JWT_INVITE_SECRET=

#Reset password secret
JWT_RESET_PWD_SECRET=

#Secret key fo account confirmation token
JWT_CONFIRM_ACC_SECRET=

#mail server information
SENDGRID_API_KEY=
NO_REPLY_EMAIL=

#Google Cloud Storage information
BUCKET_NAME=
TYPE=
PROJECT_ID=-api
PRIVATE_KEY_ID=
PRIVATE_KEY=
CLIENT_EMAIL=
CLIENT_ID=
AUTH_URI=
TOKEN_URI=
AUTH_PROVIDER_X509_CERT_URL=
CLIENT_X509_CERT_URL=
```
