exports.attach = function(app) {
	app.get('/api', function(req, res) {
		res.send({
			status: true
		});
	});	
};