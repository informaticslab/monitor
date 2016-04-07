var sinon = require('sinon'),
	should = require('should'),
	Monitor =  require('../lib/monitor'),
	MockedStorage = require('./mock/storage-mocked'),
	MockedPing = require('./mock/request-mocked');

describe('monitor', function() {
	var ERROR_RESPONSE = {error: 'mocked error', body: null, response: null, latency: 0};
	var SUCCESS_RESPONSE = {error: null, body: 'ok', response: {body: 'ok', statusCode: 200}, latency: 300};
	var LATENCY_WARNING_RESPONSE = {error: null, body: 'ok', response: {body: 'ok', statusCode: 200}, latency: 1600};
	var INITIAL_TIME = 946684800;

	var service;
	var clock;

	var noop = function() {};

	beforeEach(function() {
		clock = sinon.useFakeTimers(INITIAL_TIME);
		service = {
			id: 'X34dF',
			host: {
				host: 'www.correcthost.com',
				port: '80',
				name: 'test'
			},
			url: '/',
			interval: 4 * 1000,
			failureInterval: 5 * 1000,
			warninThreshold: 1500,
			pingService: MockedPing
		};
	});

	afterEach(function(done) {
		if(clock) {
			clock.restore();
		}
		done();
	});

	describe('event emitter', function() {
		it('should emit "new-outage" if "failuresToBeOutage is not defined', function(done) {
			MockedPing.mockedResponse = ERROR_RESPONSE;
			var failedTimestamp = +new Date();
			

			var monitor = new Monitor([service], new MockedStorage());
			monitor.on('new-outage', function(service, outageData) {
				outageData.error.should.equal('mocked error', 'should have error property');
				outageData.timestamp.should.equal(failedTimestamp, 'should have timestamp property');
				done();
			});
			monitor.on('current-outage', function () {
	        done('should not be called');
	      });
	      monitor.ping({service: service, timestamp: failedTimestamp}, noop);
	      clock.tick(ERROR_RESPONSE.latency);
		});

		it('should emit "new-outage" when number of failed pings >= "failuresToBeOutage"', function(done) {
			MockedPing.mockedResponse = ERROR_RESPONSE;
			var failedTimestamp = +new Date();
			service.failuresToBeOutage = 2;

			var monitor = new Monitor([service], new MockedStorage());
			monitor.on('new-outage', function(service, outageData) {
				outageData.error.should.equal('mocked error', 'should have error property');
				outageData.timestamp.should.equal(failedTimestamp, 'should have timestamp property');
				done();
			});
			monitor.on('current-outage', function() {
				done('should not be called');
			});
			monitor.ping({service: service, timestamp: failedTimestamp}, noop);
			clock.tick(ERROR_RESPONSE.latency);
			monitor.ping({service: service, timestamp: failedTimestamp}, noop);
      	clock.tick(ERROR_RESPONSE.latency);
		});

		it('should emit "service-error" when ping fails', function (done) {
	      MockedPing.mockedResponse = ERROR_RESPONSE;
	      var failedTimestamp = +new Date();

	      var monitor = new Monitor([service], new MockedStorage());
	      monitor.on('service-error', function (service, outageData) {
	        outageData.error.should.equal('mocked error');
	        outageData.currentFailureCount.should.equal(1);
	        done();
	      });
	      monitor.ping({service: service, timestamp: failedTimestamp}, noop);
	      clock.tick(ERROR_RESPONSE.latency);
	    });

		it('should ping next on failureInterval interval when check fails', function(done) {
			MockedPing.mockedResponse = ERROR_RESPONSE;
			var failedTimestamp = +new Date();

			var monitor = new Monitor([service], new MockedStorage());
			monitor.ping({service: service, timestamp: failedTimestamp}, function(err, nextInterval){
				nextInterval.should.equal(service.failureInterval);
				done();
			});
			clock.tick(ERROR_RESPONSE.latency);
		});

		it('should not emit "new-outage" when # of failed pings < "failuresToBeOutage"', function(done) {
			MockedPing.mockedResponse = ERROR_RESPONSE;
			service.failuresToBeOutage = 2;
			var failedTimestamp = +new Date();

			var monitor = new Monitor([service], new MockedStorage());
			monitor.on('service-error', function() {
				done();
			});
			monitor.on('new-outage', function() {
				done('should not be called');		
			});
			monitor.ping({service: service, timestamp: failedTimestamp}, noop);
			clock.tick(ERROR_RESPONSE.latency);
		});

		it('should emit "current-outage" when ping fails for 2 or more times', function(done) {
			MockedPing.mockedResponse =  ERROR_RESPONSE;
			var failedTimestamp = +new Date();
	      var called = false;
	      var monitor = new Monitor([service], new MockedStorage());

	      monitor.on('current-outage', function(service, outageData) {
	      	outageData.error.should.equal('mocked error', 'should have error property');
	      	outageData.timestamp.should.equal(failedTimestamp, 'should have timestamp property');
	      	called = true;
	      });
	      monitor.ping({service: service, timestamp: failedTimestamp}, function() {
	      	monitor.ping({service: service, timestamp: failedTimestamp}, function() {
	      		done(called ? null : 'current-outage was not called');
	      	});
	      	clock.tick(ERROR_RESPONSE.latency);
	      });
	      clock.tick(ERROR_RESPONSE.latency);
		});

		it('should emit "service-ok" when ping success', function(done) {
			MockedPing.mockedResponse = SUCCESS_RESPONSE;
			var monitor = new Monitor([service], new MockedStorage(null));
			monitor.on('service-ok', function(service, data){
				data.elapsedTime.should.equal(300);
				done();
			});
			monitor.ping({service: service}, noop);
			clock.tick(SUCCESS_RESPONSE.latency);
		});

		it('should always emit "ping" after a ping', function (done) {
	      MockedPing.mockedResponse = SUCCESS_RESPONSE;
	      var monitor = new Monitor([service], new MockedStorage(null));
	      monitor.on('ping', function (service, data) {
	      	data.elapsedTime.should.equal(300);
	      	done();
	      });
	      monitor.ping({service: service}, noop);
	      clock.tick(SUCCESS_RESPONSE.latency);
	   });

	   it('should emit "service-back" when service is back', function (done) {
	      MockedPing.mockedResponse = SUCCESS_RESPONSE;
	      var currentOutage = {
	        timestamp: +new Date(),
	        error: 'some error'
	      };

	      var monitor = new Monitor([service], new MockedStorage({currentOutage: currentOutage}));
	      monitor.on('service-back', function (service, outageData) {
	        outageData.timestamp.should.equal(INITIAL_TIME);
	        done();
	      });
	      monitor.ping({service: service}, noop);
	      clock.tick(SUCCESS_RESPONSE.latency);
	   });

	   // it('should emit "warning" when ping takes too long', function(done) {
	   // 	MockedPing.mockedResponse = LATENCY_WARNING_RESPONSE;
	   //    var monitor = new Monitor([service], new MockedStorage(null));
	   //    monitor.on('latency-warning', function (service, data) {
	   //    	data.elapsedTime.should.equal(1500);
	   //     	done();
	   //    });
	   //    monitor.ping({service: service}, noop);
	   //    clock.tick(LATENCY_WARNING_RESPONSE.latency);
	   // });
	});

	describe('start', function() {
		it('should start all services', function(done) {
			var monitor = new Monitor([service], new MockedStorage(null));
			monitor._launch =function() {
				done(); //ping service invoked
			};
			monitor.startAll({ randomDelayOnInit: 1});
			clock.tick(1);
			should.ok(service.running);
		});

		it('should start a service by ID', function(done) {
			var monitor = new Monitor([service], new MockedStorage(null));
			monitor._launch = function() {
				done(); //ping service invoked
			};
			monitor.start(service.id);
			should.ok(service.running);
		});

		it('should throw if ID is not provided', function() {
			var monitor = new Monitor([service], new MockedStorage(null));
			should.throws(function() {
				monitor.start();
			});
		});

		it('should throw if invalid ID is provided', function() {
			var monitor = new Monitor([service], new MockedStorage(null));
			should.throws(function() {
				monitor.start('555555');
			});
		});

		it('should not throw errors if there are no services', function(done) {
			var monitor = new Monitor([], new MockedStorage(null));
			monitor._launch = function() {
				done('not called');
			};
			monitor.startAll();
			done();
		});

		it('should not throw errors if options are not provided', function () {
	      var monitor = new Monitor([service], new MockedStorage(null));
	      monitor.startAll();
	   });
	});

	describe('stop', function() {
		it('should stop a service by ID', function() {
			var monitor = new Monitor([service], new MockedStorage(null));
			monitor.start(service.id);
			should.ok(service.running);
			monitor.stop(service.id);
			should.ok(!service.running);
		});

		it('should stop all services', function() {
			var monitor = new Monitor([service], new MockedStorage(null));
			monitor.start(service.id);
			should.ok(service.running);
			monitor.stopAll();
			should.ok(!service.running);
		});

		it('should throw if ID is not provided', function() {
			var monitor = new Monitor([service], new MockedStorage(null));
			should.throws(function() {
				monitor.stop();
			});
		});

		it('should throw if invalid ID is not provided', function() {
			var monitor = new Monitor([service], new MockedStorage(null));
			should.throws(function() {
				monitor.stop('0900000');
			});
		});

		it('should not throw if there are no services', function() {
			var monitor = new Monitor([], new MockedStorage(null));
			monitor.stopAll();
		});
	});

	describe('add service', function(){
		it('should add service and start it', function(done){
		   var newService = {
		     id: 'X3333',
		     host: {host: 'www.new-service.com', port: '80', name: 'test'},
		     url: '/',
		     interval: 4 * 1000,
		     failureInterval: 5 * 1000,
		     warningThreshold: 1500,
		     pingService: MockedPing
		   };

		   var monitor = new Monitor([service], new MockedStorage(null));
		   monitor._launch = function () {
		     done(); // service ping is invoked
		   };
		   monitor.addService(newService);
		   monitor.services.length.should.equal(2);
		});
  	});

  	describe('remove service', function() {
  		it('should throw error if service Id is not provided', function() {
  			var monitor = new Monitor([service], new MockedStorage(null));
  			should.throws(function() {
  				monitor.removeService();
  			});
  		});

  		it('should throw error if service Id is invalid', function() {
  			var monitor = new Monitor([service], new MockedStorage(null));
  			should.throws(function() {
  				monitor.removeService('invalid-id');
  			});
  		});

  		it('should stop and remove service', function(done) {
  			var monitor = new Monitor([service], new MockedStorage(null));
  			monitor._launch = function() {
  				done('should not be invoked');
  			};
  			monitor.removeService(service.id);
  			monitor.services.length.should.equal(0);
  			monitor.startAll();
  			clock.tick(30000);
  			done();
  		});
  	});
});