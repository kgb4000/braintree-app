'use strict';

var appController = require('../controllers/appController');

module.exports = function(app) {
	app.get('/api/getUsers', appController.getUsers);
	app.get('/api/getTithes', appController.getTithes);
	app.get('/api/token', appController.getToken);
};