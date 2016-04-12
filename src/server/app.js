'use strict';

var express = require('express'),
	bodyParser = require('bodyParser')
	storeFactory = require('./../../lib/store/store-factory')
	servicesApi = require('./api/services') ;

var store = storeFactory.getStorageInstance('development');
if (!store) {
	console.error('Error creating storage for env');
}

var app = express(store);

var port = process.env.PORT || 3000;

app.get('/', function(req, res) {
	//console.log(res.statusCode);
	res.send('Hello World');

});

app.listen(port, function() {
	console.log('Gulp is running this app on: ' + port);
});

module.exports = app;

