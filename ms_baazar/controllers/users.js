exports.addUser = function ( req, response ) {
    var params = req.body;
    console.log( params );

    User.insert( params, function ( err, doc ) {
        if ( !err ) {
            response.send( doc, 200 );
        } else {
            response.json( {
                response: "error",
                msg: "Error saving user details."
            }, 500 )
        }
    } );
}
