'use strict';
///
var express = require('express'),
	http = require('http');
var app = express();

var port = process.env.PORT || 3000;

app.get('/', function(req, res) {
	console.log(res.statusCode);
	res.send('Hello World');
});

app.listen(port, function() {
	console.log('Gulp is running this app on: ' + port);
});

module.exports = app;