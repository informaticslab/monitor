var moment = require('moment'),
	async = require('async'),
	utils = require('./utils');

function Reporter(store) {
	this.store = store;
}

var HOUR = 1000 * 60 * 60;
var DAY = HOUR * 24;
var WEEK = DAY * 7;

exports = module.exports = Reporter;

Reporter.prototype.getServices = function(options, callback) {
	var store = this.store;

	store.getServices(options, function(err, services) {
		function getInfo(service, cb) {
			getServiceInfo(service, store, cb);
		}

		async.mapSeries(services, getInfo, function(err, servicesData){
			if(err) {
				return callback(err);
			}
			callback(err, servicesData);
		});
	});
};

Reporter.prototype.getService = function(serviceId, callback) {
	var store = this.store;

	store.getService(serviceId, function(err, service) {
		if(err || !service) {
			return callback(err, service);
		}

		getServiceInfo(service, store, function(err, serviceData) {
			if(err) {
				return callback(err);
			}

			if(!serviceData){
				return callback(null, null);
			}

			var lastWeek = +new Date() - WEEK;
			var lastHour = +new Date() - HOUR;

			store.getServiceOutagesSince(service, lastWeek, function(err, outagesLastWeek) {
				if(err){
					return callback(err);
				}

				var now = +new Date();
				var outagesLastHour = outagesLastWeek.filter(function(outage){
					return outage.timestamp >= now - HOUR;
				});

				var uptimeInfoLastHour = getUptime(service, outagesLastHour, 
					serviceData.status.currentOutage, lastHour);

				store.getLatencySince(serviceData.service, +new Date() - WEEK, 'day', function(err, latencyLastWeek) {
					if(err){
						return callback(err);
					}

					store.getLatencySince(serviceData.service, +new Date() - DAY, 'hour', function(err, latencyLast24Hours) {
						if(err){
							return callback(err);
						}

						store.getLatencySince(serviceData.service, +new Date() - HOUR, 'hours', function(err, latencyLastHour) {
							if(err) {
								return callback(err);
							}

							serviceData.status.lastWeek = serviceData.status.lastWeek || {};
							serviceData.status.lastWeek.latency = latencyLastWeek;

							serviceData.status.lastHour = serviceData.status.lastHour || {};
							serviceData.status.lastHour.latency = latencyLastHour; 
							serviceData.status.lastHour.outages = outagesLastHour;
							serviceData.status.lastHour.uptime = uptimeInfoLastHour.uptime;
							serviceData.status.lastHour.downtime = uptimeInfoLastHour.totalDownTime;

							serviceData.status.last24Hours.latency = latencyLast24Hours;
							serviceData.status.latestOutages = outagesLastWeek.slice(0, 10);

							callback(err, serviceData);

						});
					});
				});
			});
		});
	});
};

/////////////// functinos to calaculate uptime and outages

function getUptime(service, outages, currentOutage, since) {
	var totalDownTime = 0;
	var now = +new Date();

	if(outages.length) {
		outages.forEach(function(outage) {
			if(outage.timestamp >= since) {
				totalDownTime += outage.downtime;
			}
		});
	}

	if(currentOutage) {
		if(currentOutage.timestamp >= since) {
			totalDownTime += (now - currentOutage.timestamp);
		} else {
			totalDownTime += (now - since);
		}
	}

	if(service.created > since) {
		since = service.created;
	}

	var totalTime = now - since;
	var uptime = utils.round((totalTime - totalDownTime) * 100 / totalTime, 3);

	if(uptime < 0 || uptime > 100) {
		console.error('Invalid uptime:');
	    console.error('totalTime:', totalTime);
	    console.error('currentOutage:', currentOutage);
	    console.error('uptime:', uptime);
	    console.error('totalDownTime:', totalDownTime);
	}

	return {
		uptime: uptime,
		totalDownTime: totalDownTime
	};
}

function getOutageDuration(service, currentOutage){
	var now = +new Date();
	var outageDuration = null;
	
	if(currentOutage) {
		var outageStart = currentOutage.timestamp;
		outageDuration = moment(outageStart).fromNow();
		return outageDuration;
	} else {
		return outageDuration;
	}
}



function getServiceInfo (service, store, callback) {
	store.getCurrentOutage(service, function(err, currentOutage){
		if(err) {
			return callback(err);
		}

		var last24h = +new Date() - DAY;
		var lastWeek = +new Date() - WEEK;

		store.getServiceOutagesSince(service, lastWeek, function(err, outagesLastWeek) {
			if(err) {
				return callback(err);
			}

			var uptimeInfoLastWeek = getUptime(service, outagesLastWeek, currentOutage, lastWeek);
			var outagesLast24Hours = outagesLastWeek.filter(function(outage){
				return outage.timestamp >= last24h;
			});
			var uptimeInfoLast24Hours = getUptime(service, outagesLast24Hours, currentOutage, last24h);
			var outageDuration = getOutageDuration(service, currentOutage);
			var upsince = moment(service.startMonitorTime).fromNow();
			return callback(null, {
				service: service,
				status: {
					upsince: upsince,
					currentOutage: {
						currentOutage: currentOutage,
						outageDuration: outageDuration
					},
					last24Hours:{
						outages: outagesLast24Hours,
						numberOutages: outagesLast24Hours.length,
						downtime: uptimeInfoLast24Hours.totalDownTime,
						uptime: uptimeInfoLast24Hours.uptime	
					},
					lastWeek:{
						outages: outagesLastWeek,
						numberOutages: outagesLastWeek.length,
						downtime: uptimeInfoLastWeek.totalDownTime,
						uptime: uptimeInfoLastWeek.uptime
					}
				}
			});
		});
	});
}