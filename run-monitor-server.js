var MonitorFactory = require('./lib/monitor');
var consoleUtil = require('./lib/console-util'); 
var MockedStorage = require('./test/mock/storage-mocked');
var moment = require('moment');

var RETURN_CODES = {
  OK: 0,
  BAD_STORAGE: 1,
  GENERIC_ERROR: 2
};

var service = {
			id: 'X34dF',
			host: {
				host: 'http://www.phiresearchlab.org',
				port: '80',
				name: 'IIU Website'
			},
			url: '/',
			interval: 4 * 1000,
			failureInterval: 5 * 1000,
			warninThreshold: 1500
		};

var monitor = new MonitorFactory([service], new MockedStorage(null));




