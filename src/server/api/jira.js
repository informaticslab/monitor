var http = require('http'),
	express = require('express'),
	request = require('request'),
	_ = require('lodash');

module.exports.getRoutes = function() {
	var router = express.Router();

	router.get('/reservations', function(req, res) {
		var host = 'http://jiradev.phiresearchlab.org';
		var path = '/rest/api/2/search?jql=project=IIUSD&startAt=0&maxResults=1000';
		var options = {
			host: host,
			path: path,
			headers:{
				'Authorization': 'Basic dGFtaTpPdmVyd2F0Y2guMQ=='
			}
		};

		request(host+path, {
			'auth': {
				'user':'tami',
				'pass':'Overwatch.1'
			}

		}, function(error, response, body) {   //REFACTOR, DEAR GOD REFACTOR
			if (!error && response.statusCode === 200) {
				var requestId = '10103';
				var roomReservationArray = [];
				var dateNow = +new Date();
								// console.log(body);
				var parsedObj = JSON.parse(body);
				parsedObj = parsedObj.issues;
				for(var i =0; i < parsedObj.length; i++) {
					var issueObj = {};
					if(parsedObj[i].fields.issuetype.id === requestId) {
						if(parsedObj[i].fields.customfield_10863 !==null){
							issueObj.id = parsedObj[i].id;
							issueObj.key = parsedObj[i].key;
							issueObj.priority = parsedObj[i].fields.priority.name;
							issueObj.status = parsedObj[i].fields.status.name;
							issueObj.type = parsedObj[i].fields.issuetype.name;
							issueObj.summary = parsedObj[i].fields.summary;
							issueObj.reservedDate = Date.parse(parsedObj[i].fields.customfield_10863);
							roomReservationArray.push(issueObj);
						}
						if(parsedObj[i].fields.customfield_11102 !==null){
							issueObj.id = parsedObj[i].id;
							issueObj.key = parsedObj[i].key;
							issueObj.priority = parsedObj[i].fields.priority.name;
							issueObj.status = parsedObj[i].fields.status.name;
							issueObj.type = parsedObj[i].fields.issuetype.name;
							issueObj.summary = parsedObj[i].fields.summary;
							issueObj.reservedDate = Date.parse(parsedObj[i].fields.customfield_11102);
							roomReservationArray.push(issueObj);
						}
						if(parsedObj[i].fields.customfield_11103 !==null){
							issueObj.id = parsedObj[i].id;
							issueObj.key = parsedObj[i].key;
							issueObj.priority = parsedObj[i].fields.priority.name;
							issueObj.status = parsedObj[i].fields.status.name;
							issueObj.type = parsedObj[i].fields.issuetype.name;
							issueObj.summary = parsedObj[i].fields.summary;
							issueObj.reservedDate = Date.parse(parsedObj[i].fields.customfield_11103);
							roomReservationArray.push(issueObj);
						}
						if(parsedObj[i].fields.customfield_11104 !==null){
							issueObj.id = parsedObj[i].id;
							issueObj.key = parsedObj[i].key;
							issueObj.priority = parsedObj[i].fields.priority.name;
							issueObj.status = parsedObj[i].fields.status.name;
							issueObj.type = parsedObj[i].fields.issuetype.name;
							issueObj.summary = parsedObj[i].fields.summary;
							issueObj.reservedDate = Date.parse(parsedObj[i].fields.customfield_11104);
							roomReservationArray.push(issueObj);
						}
						if(parsedObj[i].fields.customfield_11105 !==null){
							issueObj.id = parsedObj[i].id;
							issueObj.key = parsedObj[i].key;
							issueObj.priority = parsedObj[i].fields.priority.name;
							issueObj.status = parsedObj[i].fields.status.name;
							issueObj.type = parsedObj[i].fields.issuetype.name;
							issueObj.summary = parsedObj[i].fields.summary;
							issueObj.reservedDate = Date.parse(parsedObj[i].fields.customfield_11105);
							roomReservationArray.push(issueObj);
						}
						if(parsedObj[i].fields.customfield_11106!==null){
							issueObj.id = parsedObj[i].id;
							issueObj.key = parsedObj[i].key;
							issueObj.priority = parsedObj[i].fields.priority.name;
							issueObj.status = parsedObj[i].fields.status.name;
							issueObj.type = parsedObj[i].fields.issuetype.name;
							issueObj.summary = parsedObj[i].fields.summary;
							issueObj.reservedDate = Date.parse(parsedObj[i].fields.customfield_11106);
							roomReservationArray.push(issueObj);
						}
					}
				}
				var filteredArray = [];
				for(var j=0; j < roomReservationArray.length; j++){
					if(roomReservationArray[j].reservedDate > dateNow){
						filteredArray.push(roomReservationArray[j]);
					}
				}
				// console.log('Array Post filter', roomReservationArray);

				filteredArray = _.orderBy(filteredArray, ['reservedDate'], ['asc']);
				return res.send(filteredArray);
			} else {
				console.log(error);
			}
		});
	});

	return router;
};

