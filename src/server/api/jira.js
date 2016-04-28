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
							issueObj.reservedDate = parsedObj[i].fields.customfield_10863;
							roomReservationArray.push(issueObj);
						}
						if(parsedObj[i].fields.customfield_11108 !==null){
							issueObj.id = parsedObj[i].id;
							issueObj.key = parsedObj[i].key;
							issueObj.priority = parsedObj[i].fields.priority.name;
							issueObj.status = parsedObj[i].fields.status.name;
							issueObj.type = parsedObj[i].fields.issuetype.name;
							issueObj.summary = parsedObj[i].fields.summary;
							issueObj.reservedDate = parsedObj[i].fields.customfield_11108;
							roomReservationArray.push(issueObj);
						}
						if(parsedObj[i].fields.customfield_11109 !==null){
							issueObj.id = parsedObj[i].id;
							issueObj.key = parsedObj[i].key;
							issueObj.priority = parsedObj[i].fields.priority.name;
							issueObj.status = parsedObj[i].fields.status.name;
							issueObj.type = parsedObj[i].fields.issuetype.name;
							issueObj.summary = parsedObj[i].fields.summary;
							issueObj.reservedDate = parsedObj[i].fields.customfield_11109;
							roomReservationArray.push(issueObj);
						}
						if(parsedObj[i].fields.customfield_11110 !==null){
							issueObj.id = parsedObj[i].id;
							issueObj.key = parsedObj[i].key;
							issueObj.priority = parsedObj[i].fields.priority.name;
							issueObj.status = parsedObj[i].fields.status.name;
							issueObj.type = parsedObj[i].fields.issuetype.name;
							issueObj.summary = parsedObj[i].fields.summary;
							issueObj.reservedDate = parsedObj[i].fields.customfield_11110;
							roomReservationArray.push(issueObj);
						}
						if(parsedObj[i].fields.customfield_11111 !==null){
							issueObj.id = parsedObj[i].id;
							issueObj.key = parsedObj[i].key;
							issueObj.priority = parsedObj[i].fields.priority.name;
							issueObj.status = parsedObj[i].fields.status.name;
							issueObj.type = parsedObj[i].fields.issuetype.name;
							issueObj.summary = parsedObj[i].fields.summary;
							issueObj.reservedDate = parsedObj[i].fields.customfield_11111;
							roomReservationArray.push(issueObj);
						}
						if(parsedObj[i].fields.customfield_11112!==null){
							issueObj.id = parsedObj[i].id;
							issueObj.key = parsedObj[i].key;
							issueObj.priority = parsedObj[i].fields.priority.name;
							issueObj.status = parsedObj[i].fields.status.name;
							issueObj.type = parsedObj[i].fields.issuetype.name;
							issueObj.summary = parsedObj[i].fields.summary;
							issueObj.reservedDate = parsedObj[i].fields.customfield_11112;
							roomReservationArray.push(issueObj);
						}
					}
				}
				roomReservationArray = _.orderBy(roomReservationArray, ['reservedDate','reservedDate1'], ['asc']);
				return res.send(roomReservationArray);
			} else {
				console.log(error);
			}
		});
	});

	return router;
};

