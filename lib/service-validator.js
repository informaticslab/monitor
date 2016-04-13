var validator = require('validator');

exports = module.exports = (function() {

	function validateOptionalInt(service, errors, field, options) {
		if(service[field]){
			validateInt(service, errors, field, options);
		}
	}

	function validateInt(service, errors, field, options) {
		if(!validator.isInt(service[field], options || {})) {
			errors.push({field: field, error: 'Invalid value for "'+ field + '"'});
		}
	}

	function validateExistence(service, errors, field) {
		if(!service[field]){
			errors.push({field: field, error: 'A value is required for field "' + field +'"'});
		}
	}

	return {
		// Validaes service. Returns array of errors if not valid || null

		validate: function(service) {
			var errors = [];

			if(service === null || typeof service !== 'object') {
				errors.push({field:'', error: 'Invalid service object'});
				return errors;
			}

			validateInt(service, errors, 'failureInterval', {min: 500});
			validateInt(service, errors, 'interval', {min:500});
			validateInt(service, errors, 'warningThreshold');
			validateOptionalInt(service, errors, 'failuresToBeOutage', {min:1});
			validateInt(service, errors, 'port', {min:0});
			validateInt(service, errors, 'timeout', {min:0});
			validateExistence(service, errors, 'pingServiceName');
			validateExistence(service, errors, 'name');
			validateExistence(service, errors, 'url');
			return errors;
		}
	};
})();