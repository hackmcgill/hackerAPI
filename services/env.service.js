"use strict";
const dotenv = require("dotenv");
const fs = require("fs");
const path = require("path");
const Logger = require("./logger.service");
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
            if(typeof property === "undefined") {
                Logger.error(`GCP credential ${property} was undefined.`);
            }
        }
    }
    const stringified = JSON.stringify(creds);
    let unEscaped;
    if(stringified.includes("\\\\\\\\n")) {
        //This will happen if process.env.PRIVATE_KEY is stored as an env variable originally, so all 
        //of the \n will be converted to \\n, and then JSON.stringify converts that to \\\\n.
        unEscaped = stringified.replace(/\\\\\\\\n/g, "\\n");
    } else if(stringified.includes("\\\\n")) {
        //This will happen if process.env.PRIVATE_KEY is stored originally in a .env file, so all of the
        // \n will remain as \n, and then JSON.stringify converts that to \\n.
        unEscaped = stringified.replace(/\\\\n/g, "\\n");
    } else {
        unEscaped = stringified;
    }
    fs.writeFileSync(path.join(__dirname, "../gcp_creds.json"), unEscaped);
}