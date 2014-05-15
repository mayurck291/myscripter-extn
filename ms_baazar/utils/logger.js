var winston = require( 'winston' );

var logger = new( winston.Logger )( {
    transports: [
        new( winston.transports.Console )( {
            json: false,
            timestamp: true,
            colorize: true,
            timestamp: function ( ) {
                return ( new Date( ) )
                    .toLocaleTimeString( )
            }
        } ),
        new winston.transports.File( {
            filename: 'logs/debug.log',
            json: false,
            colorize: true,
            timestamp: function ( ) {
                return ( new Date( ) )
                    .toLocaleTimeString( )
            }
        } )
    ],
    // exceptionHandlers: [
    //     new( winston.transports.Console )( {
    //         json: false,
    //         timestamp: true,

    //     } ),
    //     new winston.transports.File( {
    //         filename: 'logs/exceptions.log',
    //         json: false,
    //         colorize: true,
    //         timestamp: function ( ) {
    //             return ( new Date( ) )
    //                 .toLocaleTimeString( )
    //         }
    //     } )
    // ],
    exitOnError: false
} );

module.exports = logger;
