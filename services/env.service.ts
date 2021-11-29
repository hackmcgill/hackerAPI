import { config } from "dotenv";
import * as fs from "fs";
import * as path from "path";
const Logger = require("./logger.service");

function load(path: string) {
    const result = config({
        path: path
    });
    createGCPFile();
    return result;
}

const isDevelopment = (): boolean => process.env.NODE_ENV === "test";

const isProduction = (): boolean => process.env.NODE_ENV === "deployment";

const isTest = (): boolean => process.env.NODE_ENV === "test";

export { load, isDevelopment, isProduction, isTest };

function createGCPFile() {
    const creds = {
        type: process.env.TYPE,
        project_id: process.env.PROJECT_ID,
        private_key_id: process.env.PRIVATE_KEY_ID,
        private_key: process.env.PRIVATE_KEY,
        client_email: process.env.CLIENT_EMAIL,
        client_id: process.env.CLIENT_ID,
        auth_uri: process.env.AUTH_URI,
        token_uri: process.env.TOKEN_URI,
        auth_provider_x509_cert_url: process.env.AUTH_PROVIDER_X509_CERT_URL,
        client_x509_cert_url: process.env.CLIENT_X509_CERT_URL
    };
    for (var property in creds) {
        if (creds.hasOwnProperty(property)) {
            if (typeof property === "undefined") {
                Logger.error(`GCP credential ${property} was undefined.`);
            }
        }
    }
    const stringified = JSON.stringify(creds);
    const unEscaped = stringified.replace(/\\\\n/g, "\\n");
    const fileLocation = path.join(__dirname, "../gcp_creds.json");
    fs.writeFileSync(fileLocation, unEscaped);
    process.env.GOOGLE_APPLICATION_CREDENTIALS = fileLocation;
}
