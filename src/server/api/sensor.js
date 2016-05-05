var http = require('http'),
	express = require('express'),
	request = require('request');

module.exports.getRoutes = function() {
	var router = express.Router();

	router.get('/data', function(req, res){
		var url ='https://cloud.arest.io/l4dgx9/sensorData';

		request(url, function(error, response, body) {
			if(!error) {
				res.send(body);
			} else {
				console.log(error);
			}
		});
	});

	return router;
};