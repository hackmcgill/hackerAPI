'use strict';
const Hacker = require('../models/hacker.model');
const logger = require('./logger.service');

/**
 * @function executeQuery
 * @param {string} model the model which is being searched
 * @param {Array} queryArray array of clauses for the query
 * @param {number} page the page number you want
 * @param {number} limit the limit to the number of responses you want
 * @param {"asc"|"desc"} sort which direction you want to sort by
 * @param {string} sort_by the attribute you want to sort by
 * @returns {Promise<[Array]>}
 * @description Builds and executes a search query based on a subset of mongodb
 */
function executeQuery(
  model,
  queryArray,
  page,
  limit,
  sort,
  sort_by,
  shouldExpand = false
) {
  var query;
  switch (model.toLowerCase()) {
    case 'hacker':
      query = shouldExpand
        ? Hacker.find().populate([
            {
              path: 'accountId',
              select: ' -password',
            },
            {
              path: 'teamId',
            },
          ])
        : Hacker.find();
      break;
    default:
      return [];
  }
  for (var i in queryArray) {
    var clause = queryArray[i];
    var param = clause.param;
    var val = clause.value;
    switch (clause.operation) {
      case 'equals':
        query.where(param).equals(val);
        break;
      case 'ne':
        query.where(param).ne(val);
        break;
      case 'lt':
        query.where(param).lt(val);
        break;
      case 'gt':
        query.where(param).gt(val);
        break;
      case 'lte':
        query.where(param).lte(val);
        break;
      case 'gte':
        query.where(param).gte(val);
        break;
      case 'in':
        query.where(param).in(val);
        break;
      case 'regex':
        query.where(param).regex(val);
        break;
      case 'elemMatch':
        query.where(param).elemMatch(val);
        break;
    }
  }

  if (sort == 'desc') {
    query.sort('-' + sort_by);
  } else if (sort == 'asc') {
    query.sort(sort_by);
  }
  return query
    .limit(limit)
    .skip(limit * page)
    .exec();
}

module.exports = {
  executeQuery: executeQuery,
};
