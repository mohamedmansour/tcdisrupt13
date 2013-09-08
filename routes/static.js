exports.attach = function(app) {
	app.get('/', function(req, res) {
		res.render('index');
	});	
	app.get('/map', function(req, res) {
		res.render('map');
	});	
};