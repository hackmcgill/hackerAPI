"use strict";

const fs = require("fs"); // filesystem to read csv
const path = require("path");
const readline = require("readline");
const env = require("../services/env.service");
const db = require("../services/database.service");
const Team = require("../models/team.model");
const logger = require("../services/logger.service");

env.load(path.join(__dirname, "../.env"));

// parse the csv file
function parseDelimited(text, delimiter) {
    const rows = [];
    let row = [];
    let field = "";
    let inQuotes = false;

    for (let i = 0; i < text.length; i += 1) {
        const char = text[i];
        const nextChar = text[i + 1];

        if (inQuotes) {
        if (char === '"' && nextChar === '"') {
            field += '"';
            i += 1;
        } else if (char === '"') {
            inQuotes = false;
        } else {
            field += char;
        }
        continue;
        }

        if (char === '"') {
        inQuotes = true;
        continue;
        }

        if (char === delimiter) {
        row.push(field);
        field = "";
        continue;
        }

        if (char === "\n") {
        row.push(field.replace(/\r$/, ""));
        rows.push(row);
        row = [];
        field = "";
        continue;
        }

        field += char;
    }

    if (field.length > 0 || row.length > 0) {
        row.push(field.replace(/\r$/, ""));
        rows.push(row);
    }

    return rows;
}

// get the column index of a given header name
function findHeaderIndex(headers, name) {
    const target = name.trim().toLowerCase();
    return headers.findIndex((header) => header.trim().toLowerCase() === target);
}

// get the filepath of the csv file used to update
async function promptFilePath(defaultPath) {
    const rl = readline.createInterface({
        input: process.stdin,
        output: process.stdout,
    });

    const answer = await new Promise((resolve) => {
        rl.question(`CSV path (default: ${defaultPath}): `, resolve);
    });

    rl.close();
    return answer.trim() || defaultPath;
}

// update devpost links for each team
async function run() {
    // get the relative path of the csv file
    const defaultPath = "data/judging.csv";
    const inputPath = await promptFilePath(defaultPath);
    const resolvedPath = path.isAbsolute(inputPath)
    ? inputPath
    : path.join(__dirname, inputPath);

    // check the csv file exists
    if (!fs.existsSync(resolvedPath)) {
        logger.error(`File not found: ${resolvedPath}`);
        process.exit(1);
    }

    // parse content and format into rows
    const ext = path.extname(resolvedPath).toLowerCase();
    const delimiter = ext === ".tsv" ? "\t" : ",";
    const content = fs.readFileSync(resolvedPath, "utf8");
    const rows = parseDelimited(content, delimiter);
    // console.log(rows)
    // [
    //     [ 'Devpost Link', 'teamId' ],
    //     [ 'http://devpost.com/testing', '1234567890' ],
    // ]

    if (rows.length === 0) {
        logger.error("No rows found in file");
        process.exit(1);
    }

    // check if required columns exist in the csv file (Devpost Link and teamId)
    const headers = rows[0];
    const devpostIndex = findHeaderIndex(headers, "Devpost Link");
    const teamIdIndex = findHeaderIndex(headers, "teamId");
    if (devpostIndex === -1 || teamIdIndex === -1) {
        logger.error("Missing required columns: Devpost Link, teamId");
        logger.error(`Your csv file has headers: ${headers.join(", ")}`);
        process.exit(1);
    }

    // connect to db
    await new Promise((resolve) => db.connect(resolve));

    // counts
    let updatedCount = 0;
    let skippedCount = 0;
    const missingTeams = [];

    // iterate through rows starting at 1 (skip header row)
    for (let i = 1; i < rows.length; i += 1) {
        const row = rows[i];
        const teamId = (row[teamIdIndex] || "").trim();
        const devpostURL = (row[devpostIndex] || "").trim();

        // missing information
        if (!teamId) {
            logger.warn(`row ${i + 1}: missing teamId, skipping`);
            skippedCount += 1;
            continue;
        }
        if (!devpostURL) {
            logger.warn(
                `row ${i + 1}: missing Devpost Link for team ${teamId}, skipping`,
            );
            skippedCount += 1;
            continue;
        }

        // update devpost link using the team service
        const updatedTeam = await Team.findByIdAndUpdate(
            teamId,
            { devpostURL },
            { new: true }
        )
            .lean()
            .exec();

        // handle service return null which means team is not found
        if (!updatedTeam) {
            logger.warn(`row ${i + 1}: team not found for id ${teamId}`);
            missingTeams.push(teamId);
            continue;
        }

        updatedCount += 1;
    }

    // print update stats
    logger.info(`Updated teams: ${updatedCount}`);
    logger.info(`Skipped rows: ${skippedCount}`);
    if (missingTeams.length > 0) {
        logger.warn(`Missing teams: ${missingTeams.join(", ")}`);
    }

    process.exit(0);
}

run().catch((err) => {
    logger.error(`Failed to update devpost URLs: ${err}`);
    process.exit(1);
});
