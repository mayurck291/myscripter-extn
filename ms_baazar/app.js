/**
 * Module dependencies.
 */

var express = require( 'express' );
// var MongoStore = require( 'connect-mongo' )( express );
var routes = require( './routes' );
var db = require( './db' );
db.on( 'error', console.error.bind( console, 'connection error:' ) );
var app = module.exports = express.createServer( );
var imgur = require( 'imgur-upload' ),
    path = require( 'path' );
imgur.setClientID( '8ef66eb1ddce0cf' );
// Configuration
app.configure( function ( ) {
    app.set( 'views', __dirname + '/views' );
    app.set( 'view engine', 'jade' );
    app.use( express.bodyParser( ) );
    app.use( express.methodOverride( ) );
    app.use( app.router );
    app.use( express.static( __dirname + '/public' ) );
} );

app.configure( 'development', function ( ) {
    app.use( express.errorHandler( {
        dumpExceptions: true,
        showStack: true
    } ) );
} );

app.configure( 'production', function ( ) {
    app.use( express.errorHandler( ) );
} );


// Routes
userController = require( './controllers/users' )
recipeController = require( './controllers/recipes' )

app.get( '/list', routes.getRecipes );
app.post( '/saveRecipe', recipeController.saveRecipe );
app.post( '/addUser', userController.addUser );

var port = 3000;
app.listen( port, function ( ) {
    console.log( 'Express server listening on port ' + port );
} );
