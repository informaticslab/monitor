var http = require('http'),
	express = require('express'),
	request = require('request');

module.exports.getRoutes = function() {
	var router = express.Router();

	router.get('/data', function(req, res){
		var url ='https://cloud.arest.io/l4dgx9/sensorData';

		request(url, function(error, response, body) {
			if(!error && response.statusCode === 200) {
				var parsedObj = JSON.parse(body);
				res.send(parsedObj.sensorData);
			} else {
				console.log('sensor error', error);
			}
		});
	});

	return router;
};