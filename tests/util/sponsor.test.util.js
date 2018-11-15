"use strict";
const Util = {
    Account: require("./account.test.util"),
    Hacker: require("./hacker.test.util"),
};
const Sponsor = require("../../models/sponsor.model");
const mongoose = require("mongoose");

const newSponsor1 = {
    // no _id as that will be generated
    "accountId": Util.Account.Account5._id,
    "tier": 5,
    "company": "Best company EU",
    "contractURL": "https://linktocontract2.con",
    "nominees": [Util.Hacker.HackerB._id]
};
const duplicateAccountLinkSponsor1 = {
    "_id": mongoose.Types.ObjectId(),
    "accountId": Util.Account.Account3._id,
    "tier": 3,
    "company": "Best company NA1",
    "contractURL": "https://linkto1.con",
    "nominees": [Util.Hacker.HackerA._id],
};

const Sponsor1 = {
    "_id": mongoose.Types.ObjectId(),
    "accountId": Util.Account.Account3._id,
    "tier": 3,
    "company": "Best company NA",
    "contractURL": "https://linkto.con",
    "nominees": [Util.Hacker.HackerA._id],
};
const Sponsors = [
    Sponsor1,
];

function storeAll(attributes) {
    const sponsorDocs = [];
    const sponsorComps = [];
    attributes.forEach((attribute) => {
        sponsorDocs.push(new Sponsor(attribute));
        sponsorComps.push(attribute.company);
    });

    return Sponsor.collection.insertMany(sponsorDocs);
}

function dropAll() {
    return Sponsor.collection.drop();
}

module.exports = {
    newSponsor1: newSponsor1,
    duplicateAccountLinkSponsor1: duplicateAccountLinkSponsor1,
    Sponsor1: Sponsor1,
    Sponsors: Sponsors,
    storeAll: storeAll,
    dropAll: dropAll,
};