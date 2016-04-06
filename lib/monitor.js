'use strict';

var events = require('events'),
	moment = require('moment'),
	debug = require('debug')('monitor'),
	util = require('util'),
	utils = require('./utils'),
	pinger = require('./pinger');

	exports = module.exports = Monitor;

	//Monitor Service

	function Monitor(services, storage) {
		this.storage = storage;
		this.services = services;
	}

	util.inherits(Monitor, events.EventEmitter);

	Monitor.prototype.ping = function(params, callback) {
		var self = this;
		var storage = self.storage;
		var service = params.service;

		debug('pinging ' + service.name);

		if(!service.pingService) {
			service.pingService = pinger;
		}

		service.pingService.ping(service, function(error, body, response, elapsedTime) {
			var timestamp = +new Date();

			self.emit('ping', service, {elapsedTime: elapsedTime});

			if(error){
				debug('error', error);
				var nPingsToBeConsideredOutage = isNaN(service.failuresToBeOutage) ? 1 : service.failuresToBeOutage;

				debug('failure threshold', nPingsToBeConsideredOutage);

				storage.increaseOutageFailureCount(service, function(err, currentFailureCount) {
					if(err) {
						return callback(err);
					}

					debug('currentFailureCount', currentFailureCount);
					self.emit('service-error', service, {
						error: error,
						currentFailureCount: currentFailureCount
					});

					storage.getCurrentOutage(service, function(err, outage) {
						if(err) {
							return callback(err);
						}

						if(!outage) {
							//First failure

							if(currentFailureCount >= nPingsToBeConsideredOutage) {
								var outageData = {
									timestamp: timestamp,
									error: error
								};
								storage.startOutage(service, outageData, function(err) {
									if(err) {
										return callback(err);
									}
									self.emit('new-outage', service, outageData);
									callback(null, service.failureInterval);
								});
							} else {
								callback(null, service.failureInterval);
							}
						} else {

							//not first failure
							self.emit('current-outage', service, outage);
            			callback(null, service.failureInterval);
						}
					});
				});
			} else {

				//Ping Success!

				debug('success');

				storage.resetOutageFailurCount(service, function(err) {
					if(err) {
						return callback(err);
					}

					var limit = service.warningThreshold;
					if(limit && (elapsedTime > limit)) {
						self.emit('latency-warning', service, {elapsedTime: elapsedTime});
					}

					storage.saveLatency(service, timestamp, elapsedTime, function(err) {
						if(err) {
							return callback(err);
						}

						debug('latency was', elapsedTime);

						storage.archiveCurrentOutageIfExists(service, function(err, currentOutage) {
							if(err) {
								return callback(err);
							}

							if(currentOutage) {
								debug('emit current outage');
								self.emit('service-back', service, currentOutage);
							}

							self.emit('service-ok', service, {elapsedTime: elapsedTime});
							callback(null, service.interval);
						});
					});
				});
			}
		});
	};