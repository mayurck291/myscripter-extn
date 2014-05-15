meta = require '../models/meta'
logger = require '../utils/logger'

exports.favourite = (request,response)->
    params = request.body
    _id = params._id
    user = params.user

    logger.info "#{user} Favorited recipe #{_id}"

    query = _id:_id
    update = "$addToSet": { favs : user}
    meta.update query,update,(error,noOfDocsUpdated)->
        console.log user," Favorited recipe ", _id

# RecipeSchema.statics.myFavourite = function ( email, cb ) {
#     return this.model( 'recipes' )
#         .find( {
#             'favs.users': email
#         } )
#         .sort( 'favs.value' );
# }

# RecipeSchema.statics.favourite = function ( recipe, email, cb ) {
#     var conditions = {
#         '_id': '5371c36e91f851917c8386c4',
#         'favs.users': email
#     };
#     var update = {}
#     return this.model( 'recipes' )
#         .findOneAndUpdate( conditions, update, options )
#         .limit( 10 )
#         .exec( cb );
# }

# RecipeSchema.statics.topTenWeek = function ( cb ) {

# }

# RecipeSchema.statics.popular = function ( cb ) {

# }

# RecipeSchema.statics.trending = function ( cb ) {

# }

# RecipeSchema.statics.popular = function ( cb ) {

# }

# RecipeSchema.statics.favRecipe = function ( cb ) {

# }

# RecipeSchema.statics.giveKarmaToRecipe = function ( cb ) {

# }
# RecipeSchema.statics.incUsersRecipes = function ( cb ) {

# }