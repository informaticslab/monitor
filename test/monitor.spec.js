var sinon = require('sinon'),
	should = require('should'),
	Monitor =  require('../lib/monitor'),
	mockedStorage = require('./lib/mock/storage-mocked'),
	mockedPing = require('./lib/mock/request-mocked');

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
	});
});