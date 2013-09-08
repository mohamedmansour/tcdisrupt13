exports.attach = function(app) {
	// TODO: Make this automatic so we don't have to redefine them here
	// anymore, it should just read the folder.
	var staticEndpoint = require('./static')
	  , apiEndpoint = require('./api');

	staticEndpoint.attach(app);
	apiEndpoint.attach(app);
};