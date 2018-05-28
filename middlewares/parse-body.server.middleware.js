// copied from 421
const {validationResult} = require("express-validator/check");
const {matchedData} = require("express-validator/filter");
const logger = require("../services/logger.server.service");

module.exports = {
	middleware: function(req, res, next) {
	const errors = validationResult(req);
	
    if (!errors.isEmpty()) {
    	return res.status(422).json({ message: 'Validation failed', data: errors.mapped()});
	}
	
    req.body = matchedData(req);
    next();
  }
}
