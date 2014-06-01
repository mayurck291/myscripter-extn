class Baazar
	constructor:(@$q,@$http)->
		@domain 				= "http://localhost:3000";
		### USER RELATED METHODS ###
		@updateUserUrl			= "#{@domain}/updateUser"

		### GET CALLS ###
		@getUrl 	  			= "#{@domain}/get"				# PAGINATION
		@listUrl  				= "#{@domain}/list"				# PAGINATION
		@popularUrl  			= "#{@domain}/popular"			# ALL TIME POPULAR  
		@trendingUrl  			= "#{@domain}/trending"			# TRENDING TODAY
		@myRecipesUrl 			= "#{@domain}/myRecipes"			# SUBMITTED BY ME
		@myFavRecipesUrl  		= "#{@domain}/myFavourite"		# NEW 10
		@topTenWeekUrl  		= "#{@domain}/topTenWeek"		# TOP TEN OF CURRENT WEEK
		@newestRecipesUrl  		= "#{@domain}/newestRecipes"		# NEW 10
		@getRecipeUrl 			= "#{@domain}/getRecipe"
		### POST CALLS ###
		@postRecipeUrl 			= "#{@domain}/postRecipe"
		@favRecipeUrl 			= "#{@domain}/favourite"
		@unFavRecipeUrl 		= "#{@domain}/unfavourite"
		@postCommentUrl 		= "#{@domain}/comment"
		@giveKarmaToRecipeUrl 	= "#{@domain}/karma"
		@incUsersRecipesUrl  	= "#{@domain}/incUsersRecipes"		# NEW 10

		# search 			
		# search/favs
		# search/karma	
		# search/users

	handleGetCall :(defer,response)->
		if response.status is "success"
			defer.resolve response.data
		else
			defer.reject response.msg
		return

	handlePostCall :(defer,response)->
		if response.response is "success"
			defer.resolve response.msg
		else
			defer.reject response.msg
		return

	get:()->
		defer = @$q.defer()
		@$http.get(@getUrl)
			.success(
				(response,status) =>
					defer.resolve(response)
					return 
					)
			.error(
				(response,status) =>
					defer.reject(response);
					return 
				)
		defer.promise 

	updateUser:(user)=>
		console.log(user)
		@$http.post(@updateUserUrl,user)
		return 

	getRecipe:(id)->
		defer = @$q.defer()
		url = "#{@getRecipeUrl}/#{id}"

		@$http.get(url)
			.success(
				(response,status) =>
					defer.resolve(response)
					return 
					)
		defer.promise 

	topTenWeek:->
		defer = @$q.defer()
		@$http.get(@topTenWeekUrl)
			.success(
				(response,status) =>
					@handleGetCall(defer,response)
					return 
					)
			.error(
				(response,status) =>
					@handleGetCall(defer,response);
					return 
				)
		defer.promise 

	newestRecipes:->
		defer = @$q.defer()
		@$http.get(@newestRecipesUrl)
			.success(
				(response,status) =>
					@handleGetCall(defer,response)
					return 
					)
			.error(
				(response,status) =>
					@handleGetCall(defer,response);
					return 
				)
		defer.promise 

	popular:->
		defer = @$q.defer()
		@$http.get(@popularUrl)
			.success(
				(response,status) =>
					@handleGetCall(defer,response)
					return 
					)
			.error(
				(response,status) =>
					@handleGetCall(defer,response);
					return 
				)
		defer.promise 

	list:(pageno)->
		pageno = pageno ? 0
		url = "#{@listUrl}/#{pageno}"
		console.log(url,@listUrl)
		defer = @$q.defer()
		@$http.get(url)
			.success(
				(response,status) =>
					defer.resolve(response)
					return 
					)
			.error(
				(response,status) =>
					defer.reject(response);
					return 
				)
		defer.promise 



	myRecipes:(userID)->
		defer = @$q.defer()
		url = "#{@myRecipesUrl}/#{userID}"

		@$http.get(url)
			.success(
				(response,status) =>
					@handleGetCall(defer,response)
					return 
					)
			.error(
				(response,status) =>
					@handleGetCall(defer,response);
					return 
				)
		defer.promise 

	myFavourite:(userID)->
		defer = @$q.defer()
		url = "#{@myFavRecipesUrl}/#{userID}"

		@$http.get(url)
			.success(
				(response,status) =>
					@handleGetCall(defer,response)
					return 
					)
			.error(
				(response,status) =>
					@handleGetCall(defer,response);
					return 
				)
		defer.promise 


	############################
	### POST SERVICESE CALLS ###
	############################
	
	postRecipe:(recipe)->
		defer = @$q.defer()
		@$http.post(@postRecipeUrl,recipe)
			.success(
				(response,status) =>
					@handlePostCall(defer,response)
					return 
					)
			.error(
				(response,status) =>
					@handlePostCall(defer,response);
					return 
				)
		defer.promise 

	postComment:(recipeID,user,comment)->
		defer 		= @$q.defer()
		
		payload = 
			_id :recipeID
			user:user
			body:comment

		@$http.post(@postCommentUrl,payload)
			.success(
				(response,status) =>
					defer.resolve()
					return 
					)
			.error(
				(response,status) =>
					defer.reject()
					return 
				)
		defer.promise 	
	
	giveKarmaToRecipe:(user,recipeID,karma,body)->
		defer 		= @$q.defer()
		payload 	= 
			_id : recipeID,
			user:user,
			karma:karma,
			body:body

		@$http.post(@giveKarmaToRecipeUrl,payload)
			.success(
				(response,status) =>
					defer.resolve()
					return 
					)
			.error(
				(response,status) =>
					defer.reject()
					return 
				)
		defer.promise

	incUsersRecipes:(recipeID)->
		defer 		= @$q.defer()
		url 		= "#{@incUsersRecipesUrl}/#{recipeID}"

		@$http.post(url,karma)
			.success(
				(response,status) =>
					@handlePostCall(defer,response)
					return 
					)
			.error(
				(response,status) =>
					@handlePostCall(defer,response);
					return 
				)
		defer.promise 

	favourite:(user,recipeID)->
		defer 		= @$q.defer()
		
		payload = 
			user:user,
			_id:recipeID

		@$http.post(@favRecipeUrl,payload)
			.success(defer.resolve)
			.error(defer.reject)
		defer.promise 


	unfavourite:(user,recipeID)->
		defer 		= @$q.defer()
		
		payload = 
			user:user,
			_id:recipeID

		@$http.post(@unFavRecipeUrl,payload)
			.success(defer.resolve)
			.error(defer.reject)
		defer.promise 

BaazarModule = angular.module "BaazarModule",[]
BaazarModule.service 'Baazar',['$q','$http',Baazar]