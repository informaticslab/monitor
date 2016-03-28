'use strict';
///
var express = require('express');
var app = express();

var port = process.env.PORT || 3000;

app.get('/', function(req, res) {
	console.log(res.statusCode);
	res.send('Hello World');
});

app.listen(port, function() {
	console.log('Gulp should be running this app: ' + port);
});

module.exports = app;