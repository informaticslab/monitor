'use strict';
///
var express = require('express'),
	ping = require('net-ping');
var app = express();

var port = process.env.PORT || 3000;

app.get('/', function(req, res) {
	console.log(res.statusCode);
	res.send('Hello World');
});

app.get('/ping', function(req, res) {
	var session = ping.createSession();
	var target = 'http://wwwd.phiresearchlab.org';
	session.pingHost(target, function(err, target) {
		if(err) {
			console.log(target + ': ' + err.toString());
		} else {
			console.log(target + ': Alive');
		}
	});
});

app.listen(port, function() {
	console.log('Gulp is running this app on: ' + port);
});

module.exports = app;