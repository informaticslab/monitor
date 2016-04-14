'use strict';

var express = require('express'),
	bodyParser = require('body-parser'),
	compress = require('compression'),
	storeFactory = require('./../../lib/store/store-factory'),
	servicesApi = require('./api/services'),
	path = require('path'),
	reportsApi = require('./api/reports');

var store = storeFactory.getStorageInstance('development');
if (!store) {
	console.error('Error creating storage for env');
}
var app = express(store);
var port = process.env.PORT || 3000;

app.use('/app', express.static(path.resolve(__dirname, '../', 'client/app')));
app.use('/node_modules', express.static(path.resolve(__dirname, '../../', 'node_modules')));
function serveIndex(req, res) {
	res.sendFile(path.resolve(__dirname, '../client/index.html'));
}

app.use(compress());
app.use('/api/report', reportsApi.getRoutes(store));
app.use('/api', servicesApi.getRoutes(store));
app.get('/*', serveIndex);

app.listen(port, function() {
	console.log('Gulp is running this app on: ' + port);
});

module.exports = app;

