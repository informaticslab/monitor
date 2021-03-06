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

var startMonitorTime = +new Date();

var seedServices = [
		{
			name: 'Phiresearchlab.org',
			interval: 60 * 1000,
			failureInterval: 20 * 1000,
			url: 'http://www.phiresearchlab.org',
			port: '80',
			timeout: 10000,
			warningThreshold: 6000,
			host: 'IIU',
			startMonitorTime: startMonitorTime
		},
		{
			name: 'App Lab',
			interval: 60 * 1000,
			failureInterval: 20 * 1000,
			url: 'http://applab.phiresearchlab.org',
			port: '80',
			timeout: 10000,
			warningThreshold: 6000,
			host:'IIU',
			startMonitorTime: startMonitorTime
		},
		{
			name: 'App Lab Dev',
			interval: 60 * 1000,
			failureInterval: 20 * 1000,
			url: 'http://applpydev.phiresearchlab.org',
			port: '80',
			timeout: 10000,
			warningThreshold: 6000,
			host:'IIU',
			startMonitorTime: startMonitorTime

		},
		{
			name: 'Jira',
			interval: 60 * 1000,
			failureInterval: 20 * 1000,
			url: 'http://jira.phiresearchlab.org/secure/Dashboard.jspa',
			port: '80',
			timeout: 10000,
			warningThreshold: 6000,
			host:'IIU',
			startMonitorTime: startMonitorTime
		},
		{
			name: 'Confluence',
			interval: 60*1000,
			failureInterval: 20 * 1000,
			url:'http://confluence.phiresearchlab.org/confluence',
			port:'80',
			timeout: 10000,
			warningThreshold: 6000,
			host: 'IIU',
			startMonitorTime: startMonitorTime
		},
		{
			name: 'View',
			interval: 60 * 1000,
			failureInterval: 20 * 1000,
			url: 'http://view.phiresearchlab.org',
			port:'80',
			timeout: 10000,
			warningThreshold: 6000,
			host: 'IIU',
			startMonitorTime: startMonitorTime
		}, 
		{
			name: 'Edemo',
			interval: 60 * 1000,
			failureInterval: 20 * 1000,
			url: 'http://edemo.phiresearchlab.org',
			port:'80',
			timeout: 10000,
			warningThreshold: 6000,
			host: 'IIU',
			startMonitorTime: startMonitorTime
		},
		{
			name: 'Apollo',
			interval: 60 * 1000,
			failureInterval: 20 * 1000,
			url: 'http://apollo.phiresearchlab.org/apollo',
			port:'80',
			timeout: 10000,
			warningThreshold: 6000,
			host: 'AWS',
			startMonitorTime: startMonitorTime
		},
		{
			name: 'Jupiter',
			interval: 60 * 1000,
			failureInterval: 20 * 1000,
			url: 'http://jupiter.phiresearchlab.org',
			port:'80',
			timeout: 10000,
			warningThreshold: 6000,
			host: 'AWS',
			startMonitorTime: startMonitorTime
		},
		{
			name: 'Anubis Dev',
			interval: 60 * 1000,
			failureInterval: 20 * 1000,
			url: 'http://anubisdev.phiresearchlab.org',
			port:'80',
			timeout: 10000,
			warningThreshold: 6000,
			host: 'AWS',
			startMonitorTime: startMonitorTime
		},
		{
			name: 'MMWR COTW',
			interval: 60 * 1000,
			failureInterval: 20 * 1000,
			url: 'http://mmwrcowtest.phiresearchlab.org',
			port:'80',
			timeout: 10000,
			warningThreshold: 6000,
			host: 'AWS',
			startMonitorTime: startMonitorTime
		},
		{
			name: 'CommSphere',
			interval: 60 * 1000,
			failureInterval: 20 * 1000,
			url: 'http://commspheretest.phiresearchlab.org',
			port:'80',
			timeout: 10000,
			warningThreshold: 6000,
			host: 'AWS',
			startMonitorTime: startMonitorTime
		},
		{
			name: 'Predict',
			interval: 60 * 1000,
			failureInterval: 20 * 1000,
			url: 'http://predict.phiresearchlab.org',
			port:'80',
			timeout: 10000,
			warningThreshold: 6000,
			host: 'IIU',
			startMonitorTime: startMonitorTime
		},
		{
			name: 'CRA',
			interval: 60 * 1000,
			failureInterval: 20 * 1000,
			url: 'http://cra.phiresearchlab.org/cra',
			port:'80',
			timeout: 10000,
			warningThreshold: 6000,
			host: 'IIU',
			startMonitorTime: startMonitorTime
		}, 
		{
			name: 'NHSN',
			interval: 60 * 1000,
			failureInterval: 20 * 1000,
			url: 'http://nhsn.phiresearchlab.org',
			port:'80',
			timeout: 10000,
			warningThreshold: 6000,
			host: 'IIU',
			startMonitorTime: startMonitorTime
		},
		{
			name: 'NHSN Test',
			interval: 60 * 1000,
			failureInterval: 20 * 1000,
			url: 'http://nhsn-test.phiresearchlab.org/nhsn',
			port:'80',
			timeout: 10000,
			warningThreshold: 6000,
			host:'IIU',
			startMonitorTime: startMonitorTime
		},
		{
			name: 'IMATS',
			interval: 60 * 1000,
			failureInterval: 20 * 1000,
			url: 'http://imats.phiresearchlab.org',
			port:'80',
			timeout: 10000,
			warningThreshold: 6000,
			host:'IIU',
			startMonitorTime: startMonitorTime
		},
		{
			name: 'DHIS2',
			interval: 60 * 1000,
			failureInterval: 20 * 1000,
			url: 'http://dhis2.phiresearchlab.org/dhis',
			port:'80',
			timeout: 10000,
			warningThreshold: 6000,
			host:'IIU',
			startMonitorTime: startMonitorTime
		},
		{
			name: 'Open MRS',
			interval: 60 * 1000,
			failureInterval: 20 * 1000,
			url: 'http://openmrs.phiresearchlab.org/openmrs',
			port:'80',
			timeout: 10000,
			warningThreshold: 6000,
			host: 'IIU',
			startMonitorTime: startMonitorTime
		}
];


var newServices = [
	{
			name: 'Anubis Test',
			interval: 60 * 1000,
			failureInterval: 20 * 1000,
			url: 'http://anubistest.phiresearchlab.org/',
			port:'80',
			timeout: 10000,
			warningThreshold: 6000,
			host: 'IIU',
			startMonitorTime: startMonitorTime
		},
		{
			name: 'CDC Info Dev',
			interval: 60 * 1000,
			failureInterval: 20 * 1000,
			url: 'http://cdcinfodev.phiresearchlab.org/',
			port:'80',
			timeout: 10000,
			warningThreshold: 6000,
			host: 'IIU',
			startMonitorTime: startMonitorTime
		},
		{
			name: 'CDC Info Test',
			interval: 60 * 1000,
			failureInterval: 20 * 1000,
			url: 'http://cdcinfotest.phiresearchlab.org/',
			port:'80',
			timeout: 10000,
			warningThreshold: 6000,
			host: 'IIU',
			startMonitorTime: startMonitorTime
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

	if(services.length === 19) {
		for(var j = 0; j < newServices.length; j++) {
			redisStore.addService(newServices[j], function(err, id) {
				if(err) {
					console.log(err);
				}
			});
		}
	}

	var monitor = new MonitorFactory(services, redisStore); 

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



