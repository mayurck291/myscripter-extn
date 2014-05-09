var http = require( 'http' );
var app = require( './app' );
var port = 3000;

http.createServer( app ).listen( port, function ( ) {
    console.log( 'Express server listening on port ' + port );
} );
