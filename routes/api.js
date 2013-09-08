exports.attach = function(app) {
	app.get('/api', function(req, res) {

		var lat = parseInt(req.query.lat);
		var lng = parseInt(req.query.lng);
		var result = null;
		if (!lat || !lng) {
			result = {
				status: false
			};
		}
		else {
			result = {
				status: true,
				lat: lat,
				lng: lng
			};
		}

		res.send(result);
	});	
};