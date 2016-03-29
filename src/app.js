'use strict';
///
var express = require('express'),
	ping = require('ping'),
	http = require('http');
var app = express();

var port = process.env.PORT || 3000;

app.get('/', function(req, res) {
	console.log(res.statusCode);
	res.send('Hello World');
});

app.get('/ping', function(req, res) {
	var http = require('http');

	//The url we want is: 'www.random.org/integers/?num=1&min=1&max=10&col=1&base=10&format=plain&rnd=new'
	var options = {
	  host: 'www.google.com.org'
	};

	var callback = function(response) {
	  var str = '';

	  //another chunk of data has been recieved, so append it to `str`
	  response.on('data', function (chunk) {
	    str += chunk;
	  });

	  //the whole response has been recieved, so we just print it out here
	  response.on('end', function () {
	    console.log(str);
	  });
	};

	http.request(options, callback).end();
});	

// app.get('/ping', function(req, res) {
// 	var hosts = ['http://www.phiresearchlab.org/','www.polygon.com', 
// 		'www.google.com', 'http://jupiter.phiresearchlab.org/'];
// 	hosts.forEach(function(host){
// 		console.log(host);
// 	    ping.sys.probe(host, function(isAlive){
// 	    	console.log(isAlive);
// 	        var msg = isAlive ? 'host ' + host + ' is alive' : 'host ' + host + ' is dead';
// 	        console.log(msg);
// 	    });
// 	});
// 	res.send('pinging in console');
// });

app.listen(port, function() {
	console.log('Gulp is running this app on: ' + port);
});

module.exports = app;