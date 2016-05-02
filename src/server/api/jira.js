var http = require('http'),
	express = require('express'),
	request = require('request'),
	_ = require('lodash'),
	redis = require('redis');

module.exports.getRoutes = function() {
	var router = express.Router();
	var auth = {
			'auth': {
				'user':'tami',
				'pass':'Overwatch.1'
				}
			};

	function IssueObject(id, key, priority, status, summary, reservedDate) {
		this.id = id;
		this.key = key;
		this.priority = priority;
		this.status = status;
		this.summary = summary;
		this.reservedDate = reservedDate;
	}

	router.get('/reservations', function(req, res) {
		var reservationsQuery = 'http://jiradev.phiresearchlab.org/rest/api/2/search?jql=project%20%3D%20IIUSD%20AND%20issuetype%20%3D%20%22Room%20Request%22%20AND%20status%20%3D%20%22Room%20Reserved%22';

		request(reservationsQuery, auth, function(error,response, body) {
			if(!error && response.statusCode === 200) {
				var dateNow = +new Date();
				var parsedObj = JSON.parse(body);
				var roomReservationArray = [];
				parsedObj = parsedObj.issues;

				for(var i=0; i< parsedObj.length; i++){
					if(parsedObj[i].fields.customfield_10863 !== null){
						var date1Obj = 
							new IssueObject(
								parsedObj[i].id, 
								parsedObj[i].key,
								parsedObj[i].fields.priority.name,
								parsedObj[i].fields.status.name,
								parsedObj[i].fields.summary,
								Date.parse(parsedObj[i].fields.customfield_10863)
							);
						roomReservationArray.push(date1Obj);
					}
					if(parsedObj[i].fields.customfield_11102 !== null){
						var date2Obj = 
							new IssueObject(
								parsedObj[i].id, 
								parsedObj[i].key,
								parsedObj[i].fields.priority.name,
								parsedObj[i].fields.status.name,
								parsedObj[i].fields.summary,
								Date.parse(parsedObj[i].fields.customfield_11102)
							);
						roomReservationArray.push(date2Obj);
					}
					if(parsedObj[i].fields.customfield_11103 !== null){
						var date3Obj = 
							new IssueObject(
								parsedObj[i].id, 
								parsedObj[i].key,
								parsedObj[i].fields.priority.name,
								parsedObj[i].fields.status.name,
								parsedObj[i].fields.summary,
								Date.parse(parsedObj[i].fields.customfield_11103)
							);
						roomReservationArray.push(date3Obj);
					}
					if(parsedObj[i].fields.customfield_11104!== null){
						var date4Obj = 
							new IssueObject(
								parsedObj[i].id, 
								parsedObj[i].key,
								parsedObj[i].fields.priority.name,
								parsedObj[i].fields.status.name,
								parsedObj[i].fields.summary,
								Date.parse(parsedObj[i].fields.customfield_11104)
							);
						roomReservationArray.push(date4Obj);
					}
					if(parsedObj[i].fields.customfield_11105!== null){
						var date5Obj = 
							new IssueObject(
								parsedObj[i].id, 
								parsedObj[i].key,
								parsedObj[i].fields.priority.name,
								parsedObj[i].fields.status.name,
								parsedObj[i].fields.summary,
								Date.parse(parsedObj[i].fields.customfield_11105)
							);
						roomReservationArray.push(date5Obj);
					}
					if(parsedObj[i].fields.customfield_11106!== null){
						var date6Obj = 
							new IssueObject(
								parsedObj[i].id, 
								parsedObj[i].key,
								parsedObj[i].fields.priority.name,
								parsedObj[i].fields.status.name,
								parsedObj[i].fields.summary,
								Date.parse(parsedObj[i].fields.customfield_11106)
							);
						roomReservationArray.push(date6Obj);
					}
				}
				var filteredArray = [];
				for(var j=0; j < roomReservationArray.length; j++){
					if(roomReservationArray[j].reservedDate >= dateNow){
						filteredArray.push(roomReservationArray[j]);
					}
				}
				filteredArray = _.orderBy(filteredArray, ['reservedDate'], ['asc']);
				return res.send(filteredArray);
			} else {
				console.log(error);
			}
		});
		
	});


	router.get('/completedIssues', function(req, res) {
		var completedCountQuery = 'http://jiradev.phiresearchlab.org/rest/api/2/search?jql=project%20%3D%2011900%20AND%20resolution%20%3D%20Complete';

		request(completedCountQuery, auth, function(error, response, body){
			if (!error && response.statusCode === 200){
				var parsedObj =JSON.parse(body);
				
				return res.send(parsedObj);
			} else {
				console.log(error);
			}
		});
	});

	router.get('/unresolvedIssues', function(req, res) {
		var unresolvedCountQuery = 'http://jiradev.phiresearchlab.org/rest/api/2/search?jql=project%20%3D%2011900%20AND%20resolution%20is%20EMPTY';

		request(unresolvedCountQuery, auth, function(error, response, body){
			if (!error && response.statusCode === 200){
				var parsedObj =JSON.parse(body);
				return res.send(parsedObj);
			} else {
				console.log(error);
			}
		});
	});

	router.get('/canceledIssues', function(req, res) {
		var canceledCountQuery = 'http://jiradev.phiresearchlab.org/rest/api/2/search?jql=project%20%3D%2011900%20AND%20resolution%20%3D%20Canceled';

		request(canceledCountQuery, auth, function(error, response, body){
			if (!error && response.statusCode === 200){
				var parsedObj =JSON.parse(body);
				return res.send(parsedObj);
			} else {
				console.log(error);
			}
		});
	});


	return router;
};

