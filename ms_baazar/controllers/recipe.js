var Recipe = require( '../models/recipe' );
var imgur = require( 'imgur-upload' );
var async = require( 'async' );

var path = require( 'path' );

imgur.setClientID( '8ef66eb1ddce0cf' );

function uploadImagesToImgur( files, doneCallback ) {
    console.log( "Trying to upload images to imgur" );
    var filePaths = [ ]
    var links = [ ];

    if ( Object.prototype.toString.call( files ) === "[object Object]" ) {
        uploadSingleFile( files );
    } else if ( Object.prototype.toString.call( files ) === "[object Array]" ) {
        uploadMultipleFiles( files );
    }

    function uploadSingleFile( file ) {
        console.log( "Single File upload" );
        imgur.upload( path.join( file.path ), function ( err, r ) {
            console.log( "Got response ", err, r );
            if ( !err && typeof r === "object" ) {
                links.push( r.data.link )
                doneCallback( links );
            } else {
                console.log( "Error uploading file", err, r );
            }
        } );
    }

    function uploadMultipleFiles( imageFiles ) {
        console.log( "multiple File upload" );

        var asyncTasks = [ ];

        for ( var i = 0; i < imageFiles.length; i++ ) {
            filePaths.push( imageFiles[ i ].path );
        }


        async.each( filePaths, function ( filePath, callback ) {
            imgur.upload( path.join( filePath ), function ( err, r ) {
                console.log( "Got response ", err, r );
                if ( !err && typeof r === "object" ) {
                    links.push( r.data.link );
                } else {
                    console.log( "Error uploading file", err, r );
                }
                callback( );
            } );
        }, everythingDone );


        function everythingDone( ) {
            console.log( "doneCallback multiple File upload" );
            doneCallback( links );
        }
    }
}

function updateImageLinksInMongo( recipe, links ) {
    Recipe.saveImageLinks( recipe, links, function ( err, doc ) {
        console.log( "YEeeah baby.....", err, doc )
    } );
}

exports.saveRecipe = function ( request, response ) {
    console.log( "saveRecipe" );
    var params = request.body;
    var recipe = params;
    var files = request.files.imgs;
    recipe.ingredients = JSON.parse( recipe.ingredients );
    // Recipe.save( recipe, function ( err ) {
    //     console.log( "saveRecipe mongo ", err );
    //     if ( !err ) {
    //         resDoc = {
    //             response: "success",
    //             msg: "Successfully shared..."
    //         }
    //         response.json( resDoc, 200 );
    //         console.log( "200 upload images to imgur ", err );
    //         uploadImagesToImgur( files, function ( links ) {
    //             updateImageLinksInMongo( recipe, links )
    //         } );
    //     } else {
    //         console.log( "500 won't upload images to imgur ", err );

    //         var error = {
    //             response: "error",
    //             msg: "Error sharing your recipe."
    //         };
    //         response.json( error, 500 );
    //     };
    // } );
    // 
    // 
    // 
    // 
    var conditions = {
        author: recipe.author,
        'ingredients.url': recipe.ingredients.url
    }
    var options = {
        upsert: true
    }
    Recipe.findOneAndUpdate( conditions, recipe, options, function ( err, doc ) {
        console.log( "=========================================================================================" )
        console.log( err, doc );
        console.log( "=========================================================================================" )
    } )



}

exports.list = function ( req, res ) {
    Recipe.list( function ( err, recipes ) {
        console.log( recipes )
        res.json( recipes );
    } )
}

exports.newestRecipes = function ( req, res ) {
    Recipe.newestRecipes( function ( err, recipes ) {
        console.log( recipes )
        res.json( recipes );
    } )
}



exports.myRecipes = function ( req, res ) {

    email = req.params.email;
    // console.log( email );
    Recipe.myRecipes( email, function ( err, docs ) {
        console.log( err, docs );
        res.json( docs, 200 );
    } )
}
