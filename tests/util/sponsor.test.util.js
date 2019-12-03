'use strict';
const Util = {
  Account: require('./account.test.util'),
  Hacker: require('./hacker.test.util'),
};
const Sponsor = require('../../models/sponsor.model');
const mongoose = require('mongoose');
const logger = require('../../services/logger.service');

const T1Sponsor0 = {
  _id: mongoose.Types.ObjectId(),
  accountId: Util.Account.sponsorT1Accounts.stored[0]._id,
  tier: 1,
  company: 'Best company NA',
  contractURL: 'https://linkto.con',
  nominees: [Util.Hacker.TeamHacker0._id],
};

const newT2Sponsor0 = {
  // no _id as that will be generated
  accountId: Util.Account.sponsorT2Accounts.new[0]._id,
  tier: 2,
  company: 'Best company EU',
  contractURL: 'https://linktocontract2.con',
  nominees: [Util.Hacker.NoTeamHacker0._id],
};

const duplicateAccountLinkSponsor1 = {
  _id: mongoose.Types.ObjectId(),
  accountId: Util.Account.sponsorT1Accounts.stored[0]._id,
  tier: 3,
  company: 'Best company NA1',
  contractURL: 'https://linkto1.con',
  nominees: [Util.Hacker.TeamHacker0._id],
};

const Sponsors = [T1Sponsor0];

function store(attributes) {
  const sponsorDocs = [];
  const sponsorComps = [];
  attributes.forEach((attribute) => {
    sponsorDocs.push(new Sponsor(attribute));
    sponsorComps.push(attribute.company);
  });

  return Sponsor.collection.insertMany(sponsorDocs);
}

async function storeAll() {
  await store(Sponsors);
}

async function dropAll() {
  try {
    await Sponsor.collection.drop();
  } catch (e) {
    if (e.code === 26) {
      logger.info('namespace %s not found', Sponsor.collection.name);
    } else {
      throw e;
    }
  }
}

module.exports = {
  T1Sponsor0: T1Sponsor0,
  newT2Sponsor0: newT2Sponsor0,

  duplicateAccountLinkSponsor1: duplicateAccountLinkSponsor1,

  Sponsors: Sponsors,
  storeAll: storeAll,
  dropAll: dropAll,
};
