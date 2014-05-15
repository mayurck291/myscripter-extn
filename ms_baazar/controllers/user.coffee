User = require '../models/user'

exports.updateUser = (req,res)->
	
	options		= 
		upsert : true
	
	user 		= req.body
	console.log(user)

	_id 		= user._id

	delete user._id
	
	update 		= user

	headers = {'Set-Cookie'	: 'mycookie=test','Content-Type':'text/plain'}

	res.writeHead 200, headers
	res.end()
	
	return;
	User.findByIdAndUpdate _id,update,options,(error,doc)->
		console.log error,doc,typeof doc
		if not error
			doc.name = "mayur kataria"
			doc.update (error,doc)->
				console.log "After update",error,doc
				return
		else
			user.save (error,doc)->
				console.log "New user",error,doc
				return
		return

