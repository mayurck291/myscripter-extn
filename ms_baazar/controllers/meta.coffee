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
        .populate('karma._id',userFilter)
        .exec (error,recipes)->
            response.json recipes,200

exports.karma = (request,response)->
    params = request.body
    _id = params._id
    user = params.user
    karma = params.karma

    addNewEntry = ()->
        updates = '$addToSet':{karma:{_id:user,karma:karma}}
        query  = _id:_id
        Meta.update {_id:_id},updates,(error,noOfDocsUpdated)->
            logger.info "#{user} gave #{karma} to recipe #{_id} , #{error}, updated #{noOfDocsUpdated} docs"
            response.json {},200


    query = 
        _id:_id,
        'karma._id':user

    Meta.findOne query,(error,doc)->
        if error?
            response.json {response:"error",msg:"Error occurred...try later...:("},500
        else if doc?
            for entry,i in doc.karma
                if doc.karma[i]._id is user
                    doc.karma[i].karma = karma                   
                    doc.save (error,updatedDoc)->
                        console.log error,updatedDoc
                        logger.info "#{user} updated #{karma} to recipe #{_id} , #{error}, updated #{updatedDoc} docs"
                        response.json updatedDoc,200
        else
            addNewEntry()

    
 

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