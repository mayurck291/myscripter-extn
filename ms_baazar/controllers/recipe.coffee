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

exports.meta = (request,recipe)->
    recipe = {
        "_id" : request.params.id,
        "author" : "parin2092@gmail.com",
    }
    insertMetaInfo(recipe)


insertMetaInfo = (recipe)->
    logger.info "[ insertMetaInfo ] [ START ]"
    meta = 
        _id : recipe._id,
        users : [recipe.author]
        karma : [{_id:recipe.author,karma:8}]

    meta = new Meta(meta)

    logger.info "[ insertMetaInfo ] new meta is #{meta}"
    logger.info "[ insertMetaInfo ] query for #{meta._id}"

    Meta.findById meta._id,(error,recipeMeta)->
        if recipeMeta?
            logger.info "[ insertMetaInfo ] [ END ] #{meta._id} already there "
            return
        else
            logger.info "[ insertMetaInfo ] inserting new"
            meta.save (error,recipeMeta)->
                logger.info "[ insertMetaInfo ] [ END ] #{meta._id} inserted new metainfo #{recipeMeta} with #{error} error"
                return
        return

exports.saveRecipe = ( request, response )->
    logger.info "[ saveRecipe ] [ START ]"
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

    logger.info "[ saveRecipe ] do upsert query"

    Recipe.update {_id : id }, upsertDate, options, ( error, noOfUpdates)->
        logger.info "[ saveRecipe ] #{noOfUpdates} docs updated with error : #{error} "
        if not error
            logger.info "[ saveRecipe ] calling [ insertMetaInfo ]"

            insertMetaInfo recipe

            logger.info "[ saveRecipe ] 200 sending http response "
            data        = recipe.ingredients
            data._id    = id
            resDoc = 
                response: "success",
                msg: "Successfully shared..."
                data:data
            response.json resDoc, 200
            logger.info "[ saveRecipe ] 200 response sent "

            logger.info "200 upload images to imgur"
            uploadImagesToImgur files, ( links )->
                updateImageLinksInMongo recipe, links
                return
        else
            logger.error "[ saveRecipe ] hell no this is error : #{error}"
            logger.error "[ saveRecipe ] 500 sending http response"            
            error =
                response: "error",
                msg: "Error sharing your recipe."
            response.json error, 500
            logger.error "[ saveRecipe ] 500 response sent"            
        return
        logger.error "[ saveRecipe ] [ END ]"            
    return

exports.list = ( req, res )->
    Recipe.list ( err, recipes )->
        # logger.info recipes
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
