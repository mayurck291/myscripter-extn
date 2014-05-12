var Recipe = require( '../models/recipe' );

var imgur = require( 'imgur-upload' ),
    path = require( 'path' );
imgur.setClientID( '8ef66eb1ddce0cf' );

function uploadImagesToImagur( ) {

}

exports.saveRecipe = function ( request, response ) {
    console.log( request.body );
    console.log( request.files );
    return;
    var params = request.body;
    var recipe = params;
    var files = params.files;
    // delete recipe.files;

    console.log( "trying to upload image" );
    imgur.upload( files[ 0 ], function ( err, r ) {
        console.log( "got response", err, r );
        console.log( r.data.link );
        if ( !err ) {
            console.log( err );
        }
    } );

    Recipe.save( params, function ( err, doc ) {
        if ( !err ) {
            response.json( doc, 200 );
            uploadImagesToImagur( files );
        } else {
            var error = {
                response: "error",
                msg: "Error sharing your recipe."
            };
            response.json( error, 500 );
        };
    } );
}

exports.getRecipes = function ( req, res ) {
    Recipe.find( )
        .limit( 10 )
        .exec( function ( err, recipes ) {
            res.json( recipes );
        } )
}
