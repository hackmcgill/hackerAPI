const express = require('express');
const version_service = require('../services/version.service');
const router = express.Router();

/* GET home page. */
router.get('/', function(req, res) {
	const VERSION = version_service.get();
	res.send(`<h1>HackerAPI Version ${VERSION}</h1>`);
});

module.exports = router;
