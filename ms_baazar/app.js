/**
 * Module dependencies.
 */

var express = require('express');
// var MongoStore = require( 'connect-mongo' )( express );
var routes = require('./routes');
var db = require('./db');
db.on('error', console.error.bind(console, 'connection error:'));
var app = module.exports = express.createServer();
var port = 8002;
// Configuration
app.configure(function () {
	app.set('views', __dirname + '/views');
	app.set('view engine', 'jade');
	app.use(express.bodyParser());
	app.use(express.methodOverride());
	app.use(app.router);
	app.use(express.static(__dirname + '/public'));
});

app.configure('development', function () {
	app.use(express.errorHandler({
		dumpExceptions: true,
		showStack: true
	}));
});

app.configure('production', function () {
	app.use(express.errorHandler());
});



// Routes

app.post('/saveRecipe', routes.saveRecipe);
app.get('/list', routes.getRecipes);

app.listen(port, function () {
	console.log('Express server listening on port ' + port);
});