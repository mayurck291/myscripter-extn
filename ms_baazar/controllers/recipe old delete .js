var Meta = require( './meta' );
var m = require( 'mongoose' );
var Schema = m.Schema;

var RecipeSchema = new Schema( {
    title: String,
    desc: String,
    author: {
        type: String,
        trim: true,
        ref: 'user',
        lowercase: true
    },
    ingredients: {
        name: String,
        url: String,
        external: {
            js: [ String ],
            css: [ String ]
        },
        js: String,
        css: String,
        enabled: Boolean,
        autoApply: Boolean
    },
    imgs: {
        type: [ String ],
        'default': [ ]
    },
    comments: [ {
        body: String,
        user: String,
        date: Date
    } ],
    createdAt: {
        type: Date,
        'default': Date.now
    },
} );

RecipeSchema.statics.list = function ( cb ) {
    // TODO will change this to find all popular trending  mix s
    this.model( 'RecipeSchema' )
        .find( )
        .limit( 10 )
        .exec( cb );
}
RecipeSchema.statics.myRecipes = function ( email, cb ) {
    return this.model( 'recipe' )
        .find( {
            author: email
        } )
        .sort( 'createdAt' )
        .limit( 10 )
        .exec( cb );
}

RecipeSchema.statics.list = function ( cb ) {
    return this.model( 'recipe' )
        .find( {} )
        .limit( 10 )
        .exec( cb );
}

RecipeSchema.statics.newestRecipes = function ( cb ) {
    this.model( 'recipe' )
        .find( {} )
        .sort( {
            createdAt: 'descending'
        } )
        .limit( 10 )
        .exec( cb )
}

RecipeSchema.statics.save = function ( recipe, cb ) {
    var conditions = {
        author: recipe.author,
        'ingredients.url': recipe.ingredients.url
    }
    var options = {
        upsert: true
    }
    // recipe = new Recipe( recipe );
    // recipe = recipe.toObject( );
    // delete recipe._id;

    return this.model( 'recipe' )
        .findOneAndUpdate( conditions, recipe, options, cb );
}


RecipeSchema.statics.saveImageLinks = function ( recipe, links, cb ) {
    var conditions = {
        author: recipe.author,
        'ingredients.url': recipe.ingredients.url
    }
    var update = {
        "$set": {
            imgs: links
        }
    }
    var options = {};

    return this.model( 'recipe' )
        .update( conditions, update, options, cb );
}

var Recipe = m.model( 'recipe', RecipeSchema );

module.exports = Recipe;



// var obj = {
//     title: "Google",
//     desc: "Google alert",
//     author: "parin@zovi.com",
//     comments: [ ],
//     meta: {
//         karma: 0,
//         voters: 0,
//         favs: 0,
//         users: 1
//     },
//     ingredients: {
//         name: "google",
//         url: "https://www.google.co.in/*",
//         external: {
//             js: [ ],
//             css: [ ]
//         },
//         js: "alert('hello');",
//         css: "",
//         enabled: true,
//         autoApply: false
//     }
// }
