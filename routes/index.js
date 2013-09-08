exports.attach = function(app) {
	var staticEndpoint = require('./static');

	staticEndpoint.attach(app);
};