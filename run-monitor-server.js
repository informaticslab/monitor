var MonitorFactory = require('./lib/monitor');
var consoleUtil = require('./lib/console-util'); 
var MockedStorage = require('./test/mock/storage-mocked');
var StorageFactory = require('./lib/store/store-factory');
var moment = require('moment');
var commander = require('commander');
var color = require('colors');

var RETURN_CODES = {
  OK: 0,
  BAD_STORAGE: 1,
  GENERIC_ERROR: 2
};

var seedServices = [
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
		},
		{
			name: 'Jira',
			interval: 30 * 1000,
			failureInterval: 20 * 1000,
			url: 'http://jira.phiresearchlab.org/secure/Dashboard.jspa',
			port: '80',
			timeout: 10000,
			warningThreshold: 3000
		}
];

commander
	.option('-e, --env [env]', 'Storage environment key', process.env.NODE_ENV || 'development')
	.option('-d, --max-initial-delay [value]', 'Initial random delay max bound', 10000)
	.parse(process.argv);

var redisStore = new StorageFactory.getStorageInstance(commander.env);
if(!redisStore) {
	console.log('Error in creating storage for env: ', commander.env);
	return process.exit(RETURN_CODES.BAD_STORAGE);
}

redisStore.getServices({}, function(err, services) {
	if(err) {
		console.log('error loading services'.red);
		console.log(err);
		return exit(RETURN_CODES.GENERIC_ERROR);
	}
	// console.log(services);
	if(services.length === 0){
		for(var i = 0; i < seedServices.length; i++) {
			redisStore.addService(seedServices[i], function(err, id){
				if(err){
					console.log(err);
				}
			});
		}
	}

	var monitor = new MonitorFactory(services, new MockedStorage(null));

	consoleUtil(monitor);
	monitor.startAll({randomDelayOnInit: commander.maxInitialDelay});
	console.log('Starting monitor ' + services.length +' services loaded...');
});

function exit(code){
	redisStore.quit();
	process.exit(code);
}

// var monitor = new MonitorFactory(services, new MockedStorage(null));
// consoleUtil(monitor);
// monitor.startAll({randomDelayOnInit: commander.maxInitialDelay});
// console.log('Starting monitor ' + services.length +' services loaded...');



