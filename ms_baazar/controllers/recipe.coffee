Recipe      = require '../models/recipe' 
Meta        = require '../models/meta' 
imgur       = require 'imgur-upload' 
async       = require 'async' 
logger      = require '../utils/logger' 

path        = require 'path' 

imgur.setClientID '8ef66eb1ddce0cf' 
    
uploadImagesToImgur = ( files, doneCallback )->
    logger.info "Trying to upload images to imgur" 
    filePaths = [ ]
    links = [ ]

    asyncTasks = [ ]

    for img in files
        filePaths.push img.path

    everythingDone= ->
        logger.info "doneCallback multiple File upload"
        doneCallback(links)
        return

    logger.info "async started => upload images to imgur"     
    async.each filePaths,( filePath, callback )->
        imgur.upload filePath,( error, response )->
            # logger.info "Got response ", error, response
            if not error and typeof response is "object"
                links.push response.data.link 
            else
                logger.error "Error uploading file", error, response
            callback( )
            return
        return
    ,everythingDone
    return


updateImageLinksInMongo = ( recipe, links )->
    conditions = 
        author: recipe.author,
        'ingredients.url': recipe.ingredients.url
    
    update = "$set" : {imgs: links}

    options = {}

    Recipe.update conditions, update, options,(error,noOfDocs)->
        logger.info "yeah baby....."
    return

insertMetaInfo = (recipe)->
    meta = {_id : recipe._id}
    meta = new Meta(meta)
    meta.users.push(recipe.author)
    meta.karma.users.push(recipe.author)

    Meta.findById meta._id,(error,recipeMeta)->
        if recipeMeta?
            return
        else 
            meta.save (error,recipeMeta)->
                return
        return

exports.saveRecipe = ( request, response )->
            
    params              = request.body
    files               = request.files.imgs

    recipe              = params
    recipe.ingredients  = JSON.parse recipe.ingredients
    if recipe.ingredients._id?
        recipe._id = recipe.ingredients._id

    upsertDate              = new Recipe recipe
    id                      = upsertDate._id
    upsertDate              = upsertDate.toObject()
    delete upsertDate._id

    options             = upsert : true,'new':true

    logger.info "upsert recips"

    Recipe.update {_id : id }, upsertDate, options, ( error, noOfUpdates)->
        logger.info error,noOfUpdates
        if not error
            logger.info "After update",error,noOfUpdates
            data        = recipe.ingredients
            data._id    = id

            resDoc = 
                response: "success",
                msg: "Successfully shared..."
                data:data

            response.json resDoc, 200

            logger.info "200 upload images to imgur"
            uploadImagesToImgur files, ( links )->
                updateImageLinksInMongo recipe, links
                return
            insertMetaInfo recipe
        else
            logger.error "Hell no something is seriously wrong",error
            error =
                response: "error",
                msg: "Error sharing your recipe."
            response.json error, 500
        return
    return

exports.list = ( req, res )->
    Recipe.list ( err, recipes )->
        logger.info recipes
        res.json recipes

exports.newestRecipes =  ( req, res )->
    Recipe.newestRecipes ( err, recipes )->
        logger.info recipes 
        res.json recipes 


exports.myRecipes = ( req, res )->

    email = req.params.email
    logger.info email
    Recipe.myRecipes email,( err, docs )->
        logger.info err, docs
        res.json docs, 200
