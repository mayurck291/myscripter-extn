var flo = require( 'fb-flo' );
var fs = require( 'fs' );

var server = flo( './design/', {
    port: 3333,
    dir: './zdev/zhq/designs/',
    glob: [ './design/**/*.js', './design/**/*.css' ]
}, resolver );

server.once( 'ready', function ( ) {
    console.log( 'Ready!' );
} );

function resolver( filepath, callback ) {
    // 1. Call into your compiler / bundler.
    // 2. Assuming that `bundle.js` is your output file, update `bundle.js`
    //    and `bundle.css` when a JS or CSS file changes.
    //    
    console.log( "file changed", filepath );
    if ( filepath.match( /main-controller\.js$/ ) ) {
        callback( {
            resourceURL: 'bundle.js' + path.extname( filepath ),
            contents: fs.readFileSync( filepath )
        } );
    };
}
