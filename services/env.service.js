"use strict";
const dotenv = require("dotenv");
const fs = require("fs");
module.exports = {
    load: function(path) {
        const result = dotenv.config({
            path: path
        });
        createGCPFile();
        return result;
    }
};
function createGCPFile() {
    const creds = {
        "type": process.env.TYPE,
        "project_id": process.env.PROJECT_ID,
        "private_key_id": process.env.PRIVATE_KEY_ID,
        "private_key": process.env.PRIVATE_KEY,
        "client_email": process.env.CLIENT_EMAIL,
        "client_id": process.env.CLIENT_ID,
        "auth_uri": process.env.AUTH_URI,
        "token_uri": process.env.TOKEN_URI,
        "auth_provider_x509_cert_url": process.env.AUTH_PROVIDER_X509_CERT_URL,
        "client_x509_cert_url":process.env.CLIENT_X509_CERT_URL
    };
    for (var property in creds) {
        if (creds.hasOwnProperty(property)) {
            if(typeof property === 'undefined') {
                //error
            }
        }
    }
    fs.writeFileSync("../gcp_creds.json", JSON.stringify(creds));
}