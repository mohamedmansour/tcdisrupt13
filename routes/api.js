exports.attach = function(app) {
	var vins = {};

	app.get('/api/sync', function(req, res) {

		var lat = parseFloat(req.query.lat);
		var lng = parseFloat(req.query.lng);
		var vin = req.query.vin;

		var result = null;
		if (!lat || !lng || !vin) {
			result = {
				status: false
			};
		}
		else {
			vins[vin] = {
				lat: lat,
				lng: lng
			};
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
		var vin = req.query.vin;
		var phone = req.query.phone;

		var result = null;
		if (!lat || !lng || !vin || !phone) {
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
		var vin = req.query.vin;

		var result = null;
		if (!vin) {
			result = {
				status: false
			};
		}
		else {
console.log(vins);
			var vinData = vins[vin] || { lat: 37.77493, lng: -122.41942 }; 
			result = {
				status: true,
				lat: vinData.lat,
				lng: vinData.lng
			};
		}

		res.send(result);
	});
};