meta: {
    users: {
        value: {
            type: Number,
            default: 1
        },
        users: {
            type: [ String ],
            default: [ author ]

        }
    },
    voters: {
        value: {
            type: Number,
            default: 0
        },
        users: [ String ]
    },
    favs: {
        value: {
            type: Number,
            default: 0
        },
        users: [ String ]
    },
    karma: {
        value: {
            type: Number,
            default: 1
        },
        users: [ String ]
    }
},

RecipeSchema.statics.myFavourite = function ( email, cb ) {
    return this.model( 'recipes' )
        .find( {
            'favs.users': email
        } )
        .sort( 'favs.value' );
}

RecipeSchema.statics.favourite = function ( recipe, email, cb ) {
    var conditions = {
        '_id': '5371c36e91f851917c8386c4',
        'favs.users': email
    };
    var update = {}
    return this.model( 'recipes' )
        .findOneAndUpdate( conditions, update, options )
        .limit( 10 )
        .exec( cb );
}

RecipeSchema.statics.topTenWeek = function ( cb ) {

}

RecipeSchema.statics.popular = function ( cb ) {

}

RecipeSchema.statics.trending = function ( cb ) {

}

RecipeSchema.statics.popular = function ( cb ) {

}

RecipeSchema.statics.favRecipe = function ( cb ) {

}

RecipeSchema.statics.giveKarmaToRecipe = function ( cb ) {

}
RecipeSchema.statics.incUsersRecipes = function ( cb ) {

}
