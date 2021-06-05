"use strict";
const env = require("../services/env.service");
const db = require("../services/database.service");

const fs = require("fs").promises;
const path = require("path");
const templatesDirPath = path.join(__dirname, "../assets/email/marketingEmail/");

const EmailTemplate = require("../models/emailTemplate.model");

// load env
const envLoadResult = env.load(path.join(__dirname, "../.env"));
if (envLoadResult.error) {
    console.error(envLoadResult.error);
}

// connect to db
db.connect(undefined, () => {
    onConnected()
        .catch((reason) => {
            console.error(reason);
            process.exit(1);
        })
        .then(() => {
            process.exit(0);
        });
});

/**
 * Called when the db is connected.
 */
async function onConnected() {
    await migrateAll();
    console.log("Finished migrating.");
}

/**
 * Inserts all email templates in assets to the db.
 */
async function migrateAll() {
    const filenames = await fs.readdir(templatesDirPath);
    for (const filename of filenames) {
        const filepath = path.join(templatesDirPath, filename);
        const data = await fs.readFile(filepath, 'utf-8');
        const emailTemplateDoc = new EmailTemplate(
            {
                name: filename,
                content: data
            }
        );
        await insertOne(emailTemplateDoc);
    }
}


/**
 * Inserts an EmailTemplate document to the db. Prevents duplicate name.
 * @param {EmailTemplate} emailTemplateDoc 
 */
async function insertOne(emailTemplateDoc) {
    const dup = await EmailTemplate.collection.findOne({ name: emailTemplateDoc.name });
    if (!dup) {
        await EmailTemplate.collection.insertOne(emailTemplateDoc);
        console.log(`${emailTemplateDoc.name} is migrated.`);
    } else {
        console.error(`${emailTemplateDoc.name} already in database.`);
    }
}
