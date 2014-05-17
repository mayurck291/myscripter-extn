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
    path = require( 'path' ),
    async = require( 'async' );

imgur.setClientID( '8ef66eb1ddce0cf' );
// Configuration
// 
var allowCrossDomain = function ( req, res, next ) {
    res.header( 'Access-Control-Allow-Origin', "chrome-extension" );
    res.header( 'Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE' );
    res.header( 'Access-Control-Allow-Headers', 'Content-Type' );
    res.header( 'X-Powered-By', 'Taro-Baap' )
    next( );
}

app.configure( function ( ) {
    app.set( 'views', __dirname + '/views' );
    app.set( 'view engine', 'jade' );
    app.use( express.bodyParser( ) );
    app.use( express.methodOverride( ) );
    app.use( allowCrossDomain );
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
userController = require( './controllers/user' )
recipeController = require( './controllers/recipe' )
metaController = require( './controllers/meta' )

app.post( '/updateUser', userController.updateUser )
app.get( '/list', recipeController.list );
app.get( '/list/:page', recipeController.list );
app.get( '/newestRecipes', recipeController.newestRecipes );
app.get( '/get', metaController.get );
app.get( '/myRecipes/:email', recipeController.myRecipes );
app.post( '/saveRecipe', recipeController.saveRecipe );
app.post( '/favourite', metaController.favourite );
app.post( '/karma', metaController.karma );
app.post( '/comment', recipeController.comment );


// for testing only
// app.get( '/meta/:id', recipeController.meta );

var port = 3000;
app.listen( port, function ( ) {
    console.log( 'Express server listening on port ' + port );
} );
