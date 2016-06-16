'use strict';

var events = require('events'),
	moment = require('moment'),
	debug = require('debug')('monitor'),
	util = require('util'),
	utils = require('./utils'),
	Pinger = require('./pinger');

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
			service.pingService = new Pinger();
		}

		service.pingService.ping(service, function(error, body, response, elapsedTime) {
			var timestamp = +new Date();

			self.emit('ping', service, {elapsedTime: elapsedTime});

			if(error){
				debug('error', error);
				var nPingsToBeConsideredOutage = isNaN(service.failuresToBeOutage) ? 18 : service.failuresToBeOutage;

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

				storage.resetOutageFailureCount(service, function(err) {
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
								storage.updateService(service, function(err, id) {
									// console.log('updated service: ', id);
								});
							}
							self.emit('service-ok', service, {elapsedTime: elapsedTime});
							service.startMonitorTime = timestamp;
							callback(null, service.interval);
							// storage.updateService(service, function(err, id) {
							// 	console.log('updated service: ', id);
							// 	callback(null, service.interval);
							// });
							
						});
					});
				});
			}
		});
	};

	Monitor.prototype._launch = function(service){
		var self = this;
		this.ping({service: service}, function(err, nextDelay) {
			if(err) {
				console.error(err);
			}
			if(service.running) {
				service.timeoutId = setTimeout(function () {
					self._launch(service);
				}, nextDelay);
			}
		});
	};

	Monitor.prototype.startAll = function(options) {
		var self = this;

		var delay = 0;
		options = options || {};
		if(!isNaN(options.randomDelayOnInit)) {
			delay = utils.getRandomInt(0, options.randomDelayOnInit);
			debug('Using a delay of max. ', options.randomDelayOnInit, 'ms. on service initialization');
		}

		this.services.forEach(function(service) {
			if(!service.running){
				setTimeout(function() {
					self._launch(service);
					service.running = true;
				}, delay);
			}
		});
	};

	Monitor.prototype.stopAll = function () {
	  var self = this;
	  this.services.forEach(function (service) {
	    if (service.running) {
	      self.stop(service.id);
	    }
	  });
	};

	Monitor.prototype.start = function (id) {
	  var service = this.getServiceById(id);
	  if (!id || !service) {
	    throw new Error('invalid service id');
	  } else {
	    if (!service.running) {
	      service.running = true;
	      this._launch(service);
	    }
	  }
	};

	Monitor.prototype.stop = function (id) {
	  var service = this.getServiceById(id);
	  if (!id || !service) {
	    throw new Error('invalid service id');
	  } else {
	    clearTimeout(service.timeoutId);
	    service.running = false;
	  }
	};

	Monitor.prototype.addService = function (service) {
	  this.services.push(service);
	  this.start(service.id);
	};

	Monitor.prototype.removeService = function (id) {
	  if (!id) {
	 		throw new Error('no id provided');
	  }
	  var pos = this.services.map(function (s) {
	    return s.id;
	  }).indexOf(id);

	  if (pos === -1) {
	    throw new Error('service with id ' + id + ' not found');
	  } else {
	    this.stop(id);
	    this.services.splice(pos, 1);
	  }
	};

	Monitor.prototype.getServiceById = function (id) {
	  return this.services.filter(function (s) {
	    return s.id === id;
	  })[0];
	};