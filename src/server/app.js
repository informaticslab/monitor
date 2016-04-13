'use strict';

var express = require('express'),
	bodyParser = require('body-parser'),
	compress = require('compression'),
	storeFactory = require('./../../lib/store/store-factory'),
	servicesApi = require('./api/services'),
	reportsApi = require('./api/reports');

var store = storeFactory.getStorageInstance('development');
if (!store) {
	console.error('Error creating storage for env');
}
var app = express(store);
var port = process.env.PORT || 3000;

app.use(compress());
app.use('/api/report', reportsApi.getRoutes(store));
app.use('/api', servicesApi.getRoutes(store));
app.get('/', function(req, res) {
	res.send('Home route');
});

app.listen(port, function() {
	console.log('Gulp is running this app on: ' + port);
});

module.exports = app;

