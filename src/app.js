'use strict';
///
var express = require('express'),
	http = require('http'),
	request = require('request');

var app = express();

var port = process.env.PORT || 3000;

var hosts = ['www.google.com', 'www.yahoo.com', 'www.phiresearchlab.org'];

app.get('/', function(req, res) {
	//console.log(res.statusCode);
	res.send('Hello World');

});

app.listen(port, function() {
	console.log('Gulp is running this app on: ' + port);
});

module.exports = app;

///////TODO REMOVE THIS FOR LATER

function queryHost(host) {
	// console.log(host);
	ping(host, function(err, status) {
		console.log('status: ', status);
		console.log('err: ', err);
		setTimeout(queryHost(host), 100000);
	});
}

function ping (host, callback) {
	console.log(host);
	var startTime = +new Date();
	var options = {
		method: 'HEAD',
		uri: 'http://'+host
	};

	// var expectedStatusCode = 200;

	request.get(options, function(err, res, body) {
		if (err) {
			return callback(err, res);
		}
		// if (res && res.statusCode !== expectedStatusCode) {
		// 	var errMsg = 'Invalid status code. Found: ' + res.statusCode + 
		// 		'. Expected: ' + expectedStatusCode;
		// 	return callback(errMsg, body, res, +new Date() - startTime);
		// }
		callback(null, res.statusCode);
	});
}