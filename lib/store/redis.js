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
	this.redis = redis.createClient(this.options.port || 6379, this.options.host || '127.0.0.1');
	this.redis.select(this.options.db || 0);
}

exports = module.exports = RedisStore;

//Add Service

RedisStore.prototype.addService = function (service, callback) {
  var id = shortid.generate();
  service.id = id;
  service.created = +new Date();
  var multi = this.redis.multi();
  multi.set(SERVICE_KEY_SUFIX + ':' + id, JSON.stringify(service));
  multi.sadd(SERVICES_KEY_SUFIX, id);
  multi.exec(function (err) {
    callback(err, id);
  });
};

// Update Service

RedisStore.prototype.updateService = function (service, callback) {
  var self = this;
  var multi = this.redis.multi();
  multi.set(SERVICE_KEY_SUFIX + ':' + service.id, JSON.stringify(service));
  multi.exec(function (err) {
    if (err) {
      return callback(err);
    }
    self.getService(service.id, callback);
  });
};

//Get Service by ID

RedisStore.prototype.getService = function (id, callback) {
  this.redis.get(SERVICE_KEY_SUFIX + ':' + id, function (err, data) {
    callback(err, (!err && data) ? JSON.parse(data) : null);
  });
};

//Delete Service

RedisStore.prototype.deleteService = function (id, callback) {
  var multi = this.redis.multi();
  // delete service
  multi.del(SERVICE_KEY_SUFIX + ':' + id);
  multi.srem(SERVICES_KEY_SUFIX, id);

  // delete reporting data
  multi.del(id + ':' + CURRENT_OUTAGE_KEY_SUFIX);
  multi.del(id + ':' + OUTAGES_KEY_SUFIX);
  multi.del(id + ':' + LATENCY_KEY_SUFIX);
  multi.del(id + ':' + FAILURE_COUNT_SUFIX);
  multi.exec(callback);
};

//Reset service data

RedisStore.prototype.resetService = function (id, callback) {
  var multi = this.redis.multi();
  multi.del(id + ':' + CURRENT_OUTAGE_KEY_SUFIX);
  multi.del(id + ':' + OUTAGES_KEY_SUFIX);
  multi.del(id + ':' + LATENCY_KEY_SUFIX);
  multi.del(id + ':' + FAILURE_COUNT_SUFIX);
  multi.exec(callback);
};

//Get all services

RedisStore.prototype.getServices = function (options, callback) {
  var self = this;
  this.redis.smembers(SERVICES_KEY_SUFIX, function (err, ids) {
    if (err) {
      return callback(err);
    }

    var multi = self.redis.multi();
    for (var i = 0; i < ids.length; i++) {
      multi.get(SERVICE_KEY_SUFIX + ':' + ids[i]);
    }
    multi.exec(function (err, services) {
      callback(err, services.map(function (service) {
        return JSON.parse(service);
      }));
    });
  });
};


//returns current outage for given service

RedisStore.prototype.getCurrentOutage = function (service, callback) {
  this.redis.get(service.id + ':' + CURRENT_OUTAGE_KEY_SUFIX, function (err, data) {
    callback(err, err ? null : JSON.parse(data));
  });
};

//Records start of an outage

RedisStore.prototype.startOutage = function (service, outageData, callback) {
  this.redis.set(service.id + ':' + CURRENT_OUTAGE_KEY_SUFIX, JSON.stringify(outageData), function (err) {
    callback(err);
  });
};

// If exists, ends the current outage and saves the details into the outages collection

RedisStore.prototype.archiveCurrentOutageIfExists = function (service, callback) {
  var self = this;
  this.getCurrentOutage(service, function (err, outage) {
    if (err) {
      return callback(err);
    }

    if (outage) {
      if (!outage.timestamp) {
        return callback('missing timestamp');
      }
      outage.downtime = +new Date() - outage.timestamp;

      var multi = self.redis.multi();
      // remove current outage
      multi.del(service.id + ':' + CURRENT_OUTAGE_KEY_SUFIX);
      // add to outages ordered set
      multi.zadd(service.id + ':' + OUTAGES_KEY_SUFIX, outage.timestamp, JSON.stringify(outage));
      multi.exec(function (err) {
        callback(err, outage);
      });
    } else {
      callback();
    }
  });
};

//Get outage history for a given service

RedisStore.prototype.getServiceOutagesSince = function (service, timestamp, callback) {
  this.redis.zrevrangebyscore(service.id + ':' + OUTAGES_KEY_SUFIX, '+inf', timestamp, function (err, data) {
    callback(err, err ? null : data.map(function (entry) {
      return JSON.parse(entry);
    }));
  });
};

//Records ping latency

RedisStore.prototype.saveLatency = function (service, timestamp, elapsed, callback) {
  //ZADD set_name score member
  //member should be unique, that's why it is timestamp:elapsed
  this.redis.zadd(service.id + ':' + LATENCY_KEY_SUFIX, timestamp, timestamp + ':' + elapsed, callback);
};

//Get latency for given time


RedisStore.prototype.resetOutageFailureCount = function (service, cb) {
  this.redis.del(service.id + ':' + FAILURE_COUNT_SUFIX, cb);
};

RedisStore.prototype.increaseOutageFailureCount = function (service, cb) {
  this.redis.incr(service.id + ':' + FAILURE_COUNT_SUFIX, cb);
};

//available on redis
RedisStore.prototype.flush_database = function (callback) {
  this.redis.flushdb(callback);
};

RedisStore.prototype.quit = function (callback) {
  this.redis.quit();
};



function parseLatencyDataFromZset(zset) {
  var list = [];
  var currentObj;
  var accLatency = 0;
  for (var i = 0; i < zset.length; i++) {
    if (i % 2 === 0) { // odd
      var lat = zset[i];
      //backward compatibility: only split timestamp:score if found this format
      if (lat.indexOf(':') !== -1){
        lat = lat.split(':')[1];
      }
      currentObj = {l: +lat};
      if (!isNaN(lat) && lat > 0) { // valid positive numbers
        accLatency += (+lat);
      }
    } else {
      currentObj.t = +zset[i]; // timestamp
      list.push(currentObj);
    }
  }
  return {
    arr: list, // TODO: change to list
    mean: Math.round(accLatency / list.length)
  };
}
