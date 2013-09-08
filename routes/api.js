exports.attach = function(app) {
	var ids = {};

	app.get('/api/sync', function(req, res) {

		var lat = parseFloat(req.query.lat);
		var lng = parseFloat(req.query.lng);
		var id = req.query.id;

		var result = null;
		if (!id) {
			result = {
				status: false
			};
		}
		else {
			if (!lat || !lng) {
				delete ids[id]
			}
			else {
				ids[id] = {
					lat: lat,
					lng: lng
				};
			}
			result = {
				status: true
			};
		}

		res.send(result);
	});	

	app.get('/api/contacts', function(req, res) {
		res.send({
			status: false
		})
	});

	app.get('/api/notify', function(req, res) {
		var lat = parseFloat(req.query.lat);
		var lng = parseFloat(req.query.lng);
		var id = req.query.id;
		var phone = req.query.phone;

		var result = null;
		if (!lat || !lng || !id || !phone) {
			result = {
				status: false
			};
		}
		else {
			result = {
				status: true
			};

			// Send Twillio API the phone.
		}

		res.send(result);
	});

	app.get('/api/get', function(req, res) {
		var id = req.query.id;

		var result = null;
		if (!id) {
			result = {
				status: false
			};
		}
		else {
			var idData = ids[id] || { lat: 37.77493, lng: -122.41942 }; 
			result = {
				status: true,
				lat: idData.lat,
				lng: idData.lng
			};
		}

		res.send(result);
	});

	app.get('/api/start', function(req, res) {
		var lat = parseFloat(req.query.lat);
		var lng = parseFloat(req.query.lng);
		var id = req.query.id;
		res.send({});
	});
};