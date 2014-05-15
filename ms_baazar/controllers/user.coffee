User 			= require '../models/user'
logger		 	= require '../utils/logger'

exports.updateUser = (req,res)->
	logger.warn "hello there HOW YOU DOING ?"
	options		= 
		upsert : true
	
	user 		= new User(req.body)
	id 			= user._id

	
	upsertDate  = user.toObject()
	delete upsertDate._id

	logger.info upsertDate,id
	User.update {_id : id }, upsertDate, options, ( error, noOfUpdates)->
		logger.log error,noOfUpdates
		if not error
			logger.info "After update",error,noOfUpdates
		else
			logger.error "Hell no something is seriously wrong"
		return

