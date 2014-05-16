var mongoose = require( 'mongoose' );

mongoose.connect( 'mongodb://localhost/ms_baazar' );

module.exports = mongoose.connection;
// mongoose.set( 'debug', true );
