import { config, DotenvConfigOutput } from "dotenv";
import * as fs from "fs";
import { join } from "path";
import { autoInjectable, singleton } from "tsyringe";

interface GoogleCloudPlatformCredentials {
    type: string | undefined;
    project_id: string | undefined;
    private_key_id: string | undefined;
    private_key: string | undefined;
    client_email: string | undefined;
    client_id: string | undefined;
    auth_uri: string | undefined;
    token_uri: string | undefined;
    auth_provider_x509_cert_url: string | undefined;
    client_x509_cert_url: string | undefined;
}

@autoInjectable()
@singleton()
export class EnvService {
    constructor() {
        const result: DotenvConfigOutput = config({
            path: join(__dirname, "../.env")
        });
        if (result.error) throw result.error;
        this.createGoogleCloudPlatformFile();
    }

    private createGoogleCloudPlatformFile() {
        const credentials: GoogleCloudPlatformCredentials = {
            type: process.env.TYPE,
            project_id: process.env.PROJECT_ID,
            private_key_id: process.env.PRIVATE_KEY_ID,
            private_key: process.env.PRIVATE_KEY,
            client_email: process.env.CLIENT_EMAIL,
            client_id: process.env.CLIENT_ID,
            auth_uri: process.env.AUTH_URI,
            token_uri: process.env.TOKEN_URI,
            auth_provider_x509_cert_url:
                process.env.AUTH_PROVIDER_X509_CERT_URL,
            client_x509_cert_url: process.env.CLIENT_X509_CERT_URL
        };

        const stringified = JSON.stringify(credentials);
        const unEscaped = stringified.replace(/\\\\n/g, "\\n");
        const fileLocation = join(__dirname, "../../gcp_creds.json");
        fs.writeFileSync(fileLocation, unEscaped);
        process.env.GOOGLE_APPLICATION_CREDENTIALS = fileLocation;
    }

    public get(key: string) {
        return process.env[key];
    }

    public isDevelopment = (): boolean => process.env.NODE_ENV === "test";

    public isProduction = (): boolean => process.env.NODE_ENV === "deployment";

    public isTest = (): boolean => process.env.NODE_ENV === "test";
}
