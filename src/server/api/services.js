var moment = require('moment'),
	express = require('express'),
	validator = require('./../../../lib/service-validator');

module.exports.getRoutes = function(store) {

	if(!store) {
		throw new Error('data store needed');
	}

	var router = express.Router();

	// Add new service
	router.post('/services', function(req, res) {
		var service = req.body;

		var errors = validator.validate(service);
		if(errors.length) {
			return res.status(400).json({errors: errors});
		}
		store.addService(service, function(err, id) {
			if(err) {
				return res.status(500).json({error: err});
			}
			return res.status(200).json({id: id});
		});
	});

	// Delete service

	router.delete('/services/:id', function(req, res) {
		var id = req.params.id;
		if(!id) {
			return res.status(404).json({error: 'ID not found'});
		}
		store.getService(id, function(err, service) {
			if(err) {
				return res.status(500).json({error: err});
			}
			if(!service) {
				return res.status(404).json({error: 'service not found'});
			}
			store.deleteService(id, function(err){
				if(err) {
					return res.status(500).json({error: err});
				}
				return res.json({id: id});
			});
		});
	});

	// Update service

	router.post('/services/:id', function(req, res) {
		var id = req.params.id;
		if(!id) {
			return res.status(404).json({error: 'ID not found'});
		}

		var errors = validator.validate(req.body);
		if(errors.length) {
			return res.status(400).json({errors: errors});
		}

		store.getService(id, function(err, existingService) {
			if(err) {
				return res.status(500).json({error: err});
			}
			if(!existingService) {
				return res.status(404).json({error: 'service not found'});
			}

			store.updateService(req.body, function(err, service) {
				if(err) {
					return res.status(500).json({error: err});
				}
				return res.json(service);
			});
		});
	});

	// Reset service

	router.post('/services/:id/reset', function(req, res) {
		var id = req.params.id;
		if(!id) {
			return res.status(404).json({error: 'ID not found'});
		}

		store.getService(id, function(err, service) {
			if(err) {
				return res.status(500).json({error:err});
			}
			if(!service) {
				return res.status(404).json({error: 'service not found'});
			}

			store.resetService(id, function(err) {
				if(err) {
					return res.status(500).json({error:err});
				}
				return res.json({id:id});
			});
		});
	});

	//Load service

	router.get('/services/:id', function(req, res) {
		var id = req.params.id;
		if(!id) {
			return res.status(404).json({error: 'ID not found'});
		}
		store.getService(id, function(err, service) {
			if(err) {
				console.log(err);
				return res.status(500).json({error: err});
			}

			if(!service) {
				return res.status(404).json({error: 'Service not found'});
			}
			res.json(service);
		});
	});

	// Load services

	router.get('/services', function(req, res){
		store.getServices({}, function(err, services) {
			if(err) {
				console.log(err);
				return res.status(500).json({error: err});
			}
			res.json(services);
		});
	});

	return router;
};