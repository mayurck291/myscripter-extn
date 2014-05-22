Recipe      = require '../models/recipe' 
Meta        = require '../models/meta' 
imgur       = require 'imgur-upload' 
async       = require 'async' 
logger      = require '../utils/logger' 
helpers     = require '../utils/helpers' 

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

	recipeInstance          = new Recipe recipe

	id                      = recipeInstance._id
	upsertDate              = recipeInstance.toObject()
	delete upsertDate._id

	options             = upsert : true,'new':true

	logger.info "[ saveRecipe ] do upsert query"

	Recipe.update {_id : id }, upsertDate, options, ( error, noOfUpdates)->
		logger.info "[ saveRecipe ] #{noOfUpdates} docs updated with error : #{error} "
		if not error
			logger.info "[ saveRecipe ] calling [ insertMetaInfo ]"

			insertMetaInfo recipeInstance

			logger.info "[ saveRecipe ] 200 sending http response "
			_id    = recipeInstance._id
			resDoc = 
				response: "success",
				msg: "Successfully shared..."
				_id:_id
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

exports.comment = (request,response)->
	logger.info "[ comment ] START"
	params  = request.body
	body    = params.body
	user    = params.user
	_id     = params._id

	logger.info "[ comment ] #{user} commented #{body} on recipe #{_id}"

	query   =
		_id:_id

	comment = 
		body:body
		user:user
		date:Date.now()
	updates = 
		'$addToSet':{comments:comment}

	logger.info "[ comment ] trying to update recipe #{_id}"

	Recipe.update query,updates,(error,noOfUpdates)->
		logger.info "[ comment ] ran query for recipe #{_id} with error: #{error} and #{noOfUpdates} updates"
		if error?
			doc     =
				response:"error"
				msg     :"Error occurred try after some time"

			response.json doc,500
			logger.info "[ comment ] END sending 500"
		else
			doc     =
				response:"success"
				msg     :"commented Successfully"

			response.json doc,200
			logger.info "[ comment ] END sending 200"

exports.getRecipe = (request,response)->
	id = request.params.id
	console.log "getting recipe with id #{id}"
	if id?
		Recipe.findOne({_id:id})
			.exec((error,recipe)=>
				if error?
					response.json {},500
				else
					ingredients = recipe.ingredients
					ingredients.forked = true
					response.json ingredients,200
				)
	else
		response.json {},500