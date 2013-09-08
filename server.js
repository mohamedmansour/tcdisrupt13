var http = require('http')
  , express = require('express')
  , nconf = require('nconf')
  , path = require('path')
  , app = exports.app = express()
  , routes = require('./routes');

app.configure(function() {
    app.set('trust proxy', true);
    app.set('conf', nconf);
    app.set('port', process.env.PORT || 3000);
    app.set('views', __dirname + '/views');
    app.set('view engine', 'jade');

    app.use(express.compress());
    app.use(express.cookieParser());
    app.use(express.bodyParser());
    app.use(express.methodOverride());
    app.use(express.session({ secret: 'tcdisrupt' }));


    app.use(function (req, res, next) {
      res.locals.user = req.user;
      res.locals.env = process.env.NODE_ENV || 'development';
	  res.locals.mapsKey = nconf.get("BING_MAPS_API");
      next();
    });

    app.use(express.static(path.join(__dirname, 'public')));
});

app.configure('production', function() {
  nconf.env().file({ file: "config_production.json" });
  app.use(express.errorHandler());
  nconf.env();
});

app.configure('development', function() {
  nconf.env().file({ file: "config_development.json" });
  app.use(express.errorHandler());
  app.locals.pretty = true;
});

routes.attach(app);

http.createServer(app).listen(app.get('port'), function() {
  console.log("Node server listening on port " + app.get('port'));
});

