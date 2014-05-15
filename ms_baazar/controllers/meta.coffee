Meta    = require '../models/meta'
Recipe  = require '../models/recipe'
logger  = require '../utils/logger'

exports.favourite = (request,response)->
    params = request.body
    _id = params._id
    user = params.user

    logger.info "#{user} Favorited recipe #{_id}"

    query = _id:_id
    update = "$addToSet": { favs : user}
    Meta.update query,update,(error,noOfDocsUpdated)->
        console.log user," Favorited recipe ", _id

exports.get = (request,response)->
    userFilter = '_id name img'
    # recipeFilter = 'author desc title createdAt imgs comments'
    Meta.find({})
        .populate('_id','-ingredients')
        .populate('users',userFilter)
        .populate('favs',userFilter)
        .populate('karma.user',userFilter)
        .exec (error,recipes)->
            response.json recipes,200

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