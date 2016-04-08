var MonitorFactory = require('./lib/monitor');
var consoleUtil = require('./lib/console-util'); 
var MockedStorage = require('./test/mock/storage-mocked');
var moment = require('moment');
var commander = require('commander');

var RETURN_CODES = {
  OK: 0,
  BAD_STORAGE: 1,
  GENERIC_ERROR: 2
};

var services = [
		{
			name: 'IIU Lab Website',
			interval: 30 * 1000,
			failureInterval: 20 * 1000,
			url: 'http://www.phiresearchlab.org',
			port: '80',
			timeout: 10000,
			warningThreshold: 3000
		},
		{
			name: 'Google',
			interval: 30 * 1000,
			failureInterval: 20 * 1000,
			url: 'http://www.google.com',
			port: '80',
			timeout: 10000,
			warningThreshold: 3000
		},
		{
			name: 'App Lab',
			interval: 30 * 1000,
			failureInterval: 20 * 1000,
			url: 'http://applab.phiresearchlab.org',
			port: '80',
			timeout: 10000,
			warningThreshold: 3000
		},
		{
			name: 'App Lab Dev',
			interval: 30 * 1000,
			failureInterval: 20 * 1000,
			url: 'http://applpydev.phiresearchlab.org',
			port: '80',
			timeout: 10000,
			warningThreshold: 3000
		}
];

commander
	.option('-e, --env [env]', 'Storage environment key', process.env.NODE_ENV || 'development')
	.option('-d, --max-initial-delay [value]', 'Initial random delay max bound', 10000)
	.parse(process.argv);

var monitor = new MonitorFactory(services, new MockedStorage(null));

consoleUtil(monitor);

monitor.startAll({randomDelayOnInit: commander.maxInitialDelay});
console.log('Starting monitor ' + services.length +' services loaded');



