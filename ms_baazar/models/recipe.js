var m = require( 'mongoose' );
var Schema = m.Schema;

var RecipeSchema = new Schema( {
    title: String,
    desc: String,
    author: {
        type: String,
        trim: true,
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
    imgs: [ String ],
    comments: [ {
        body: String,
        user: String,
        date: Date
    } ],
    meta: {
        karma: {
            type: Number,
            default: 1
        },
        voters: {
            type: Number,
            default: 0
        },
        favs: {
            type: Number,
            default: 0
        },
        users: {
            type: Number,
            default: 1
        }
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
} );

RecipeSchema.statics.myRecipes = function ( email, cb ) {
    return this.model( 'recipes' )
        .find( {
            author: email
        } )
        .sort( 'createdAt' )
        .limit( 10 )
        .exec( cb );
}



RecipeSchema.statics.save = function ( recipe, cb ) {
    var conditions = {
        author: recipe.author,
        'ingredients.url': recipe.ingredients.url
    }
    var options = {
        upsert: true
    }

    return this.model( 'recipes' )
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

    return this.model( 'recipes' )
        .update( conditions, update, options, cb );
}

var Recipe = m.model( 'recipes', RecipeSchema );

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
