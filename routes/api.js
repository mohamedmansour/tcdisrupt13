var twilio = require('twilio');


exports.attach = function(app) {
	var nconf = app.get('conf');
	var twilioClient = new twilio.RestClient(nconf.get('TWILIO_SID'), nconf.get('TWILIO_API'));

	var ids = {
		'abc123':  { lat: 37.77493, lng: -122.41942, startLat: 37.77493, startLng: -122.41942 }
	};

	app.get('/api/sync', function(req, res) {

		var lat = parseFloat(req.query.lat);
		var lng = parseFloat(req.query.lng);
		var id = req.query.id;

		var result = null;
		if (!id) {
			res.send({
				status: false,
				message: 'Need and ID to continue'
			});
			return;
		}

		if (!lat || !lng) {
			delete ids[id];
			res.send({status: true});
			return;
		}

		var idVal = ids[id];
		if (!idVal) {
			idVal = ids[id] = {
				lat: lat,
				lng: lng,
				startLat: lat,
				startLng: lng
			};
		}
		else {
			idVal.lat = ids[id].lat = lat;
			idVal.lng = ids[id].lng = lng;
		}
		
		res.send({
			status: true,
			phoneLat: idVal.phoneLat,
			phoneLng: idVal.phoneLng
		});
	});	

	app.get('/api/contacts', function(req, res) {
		res.send({
			status: false
		})
	});

	app.get('/api/notify', function(req, res) {
		var id = req.query.id;
		var phone = req.query.phone;

		var result = null;
		if (!id || !phone) {
			result = {
				status: false
			};
		}
		else {
			result = {
				status: true
			};

			// Send Twillio API the phone.
			twilioClient.sms.messages.create({
				to: phone,
				from: '+14123574043',
				body: 'Hello!! http://tcdisrupt13.azurewebsites.net/map?id=' + id
			}, function(error, message) {
				if (!error) {
					console.log(message.sid);
				}
			}); 
		}

		res.send(result);
	});

	app.get('/api/get', function(req, res) {
		var id = req.query.id;
		var phoneLat = parseFloat(req.query.lat);
		var phoneLng = parseFloat(req.query.lng);
		
		var result = null;
		if (!id) {
			res.send({
				status: false,
				message: 'Need and ID to continue'
			});
			return;
		}

		var idData = ids[id];
		if (!idData) {
			res.send({
				status: false,
				message: 'No longer exists'
			});
			return;
		}

		if (phoneLng && phoneLat) {
			ids[id].phoneLng = phoneLng;
			ids[id].phoneLat = phoneLat;
		}

		res.send({
			status: true,
			lat: idData.lat,
			lng: idData.lng,
			startLat: idData.startLat,
			startLng: idData.startLng
		});
	});
};