Meta    = require '../models/meta'
Recipe  = require '../models/recipe'
logger  = require '../utils/logger'
async   = require 'async'

exports.favourite = (request,response)->
    params = request.body
    _id = params._id
    user = params.user

    logger.info "#{user} Favorited recipe #{_id}"

    query = 
        _id:_id
        favs:user

    update = 
        "$addToSet": { favs : user},

    Meta.where({_id:_id})
        .where('favs').ne(user)
        .update update,(e,r)->
            if e?
                response.json(500,{})
            else
                response.json(200,{})

exports.get = (request,response)->
    logger.info "Getting all meta info of all the recipes"
    userFilter = '-authToken -updatedAt'
    # recipeFilter = 'author desc title createdAt imgs comments'
    finalJson = []

    Meta.find({})
        .populate('_id','-ingredients')
        .populate('users',userFilter)
        .populate('favs',userFilter)
        .populate('karma.user',userFilter)
        .sort()
        .exec (error,recipes)->
            if error
                res.json(500)
            else
                options =
                    path    : "_id.author _id.comments.user"
                    model   : "user",
                    select  : userFilter

                Recipe.populate recipes,options,(error,recipes)->
                    logger.info "sending recip"
                    # setTimeout(
                    #     ()=>response.json(recipes,200)
                    #     3000
                    # )

                    response.json recipes,200


exports.karma = (request,response)->
    logger.info "[ karma ] START"
    params = request.body
    _id = params._id
    user = params.user
    karma = params.karma
    body   = params.body

    logger.info "[ karma ] #{user} -> #{karma} -> #{_id}"


    addNewEntry = ()->
        logger.info "[ addNewEntry ] START adding new entry for #{user} -> #{karma} -> #{body} -> #{_id}"
        updates = '$addToSet':{karma:{user:user,karma:karma,body:body}}
        query  = _id:_id
        Meta.update {_id:_id},updates,(error,noOfDocsUpdated)->
            logger.info "[ addNewEntry ] END #{user} gave #{karma} to recipe #{_id} , #{error}, updated #{noOfDocsUpdated} docs"
            response.json {},200


    query = 
        _id:_id,
        'karma.user':user

    Meta.findOne query,(error,doc)->
        logger.info "[ karma ] checking if entry exists for #{user} -> #{karma} -> #{_id}"
        if error?
            logger.info "[ karma ] END error occurred try later"
            response.json {response:"error",msg:"Error occurred...try later...:("},500
        else if doc?
            logger.info "[ karma ] exists !! updating karma for #{_id} by #{user} to #{karma}"
            for entry,i in doc.karma
                # console.log "processing doc #{entry}"
                if doc.karma[i].user is user
                    doc.karma[i].karma = karma  
                    doc.karma[i].body = body            
                    doc.save (error,updatedDoc)->
                        if error?
                            logger.info "[ karma ] END try again later...."
                            response.json {response:"error",msg:"try again after some time...:("},500
                        else
                            logger.info "[ karma ] END #{user} updated #{_id}'s karma to #{karma}"
                            response.json updatedDoc,200
        else
            logger.info "[ karma ] END doesn't exist calling [ addNewEntry ]"
            addNewEntry()
        return
    return
    
 

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