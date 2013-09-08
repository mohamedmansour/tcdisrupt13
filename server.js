var http = require('http')
  , express = require('express')
  , nconf = require('nconf')
  , path = require('path')
  , app = exports.app = express();

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
      next();
    });

    app.use(express.static(path.join(__dirname, 'public')));
});

app.configure('production', function() {
  nconf.env();
});

http.createServer(function (req, res) {
  res.writeHead(200, {'Content-Type': 'text/plain'});
  res.end('Hello World\n');
}).listen(app.get('port'));