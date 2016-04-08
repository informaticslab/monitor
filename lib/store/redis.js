var util = require('util'),
	redis = require('redis'),
	shortid = require('shortid');

var SERVICE_KEY_SUFIX = 'service';
var SERVICES_KEY_SUFIX = 'service';
var LATENCY_KEY_SUFIX = 'latency';
var CURRENT_OUTAGE_KEY_SUFIX = 'outages:current';
var OUTAGES_KEY_SUFIX = 'outages';
var FAILURE_COUNT_SUFIX = 'failurecount';

function RedisStore(options) {
	this.options = options || {};
	this.redis = redis.createClient(this.options.pport || 6379, this.options.host || '127.0.0.1');
	this.redis.select(this.options.db || 0);
}

exports = module.exports = RedisStore;

//Add Service

RedisStore.prototype.addService = function(service, callback) {
	var id = shortid.generate();
	service.id = id;
	var multi = this.redis.multi();
	multi.set(SERVICES_KEY_SUFIX + ':' + id, JSON.stringify(service));
	multi.sadd(SERVICES_KEY_SUFIX, id);
	multi.exec(function(err) {
		callback(err, id);
	});
};