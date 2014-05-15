class Baazar
	constructor:(@$q,@$http)->
		@domain 				= "http://localhost:3000";
		### USER RELATED METHODS ###
		@updateUserUrl			= "#{@domain}/updateUser"

		### GET CALLS ###
		@listUrl  				= "#{@domain}/list"				# PAGINATION
		@popularUrl  			= "#{@domain}/popular"			# ALL TIME POPULAR  
		@trendingUrl  			= "#{@domain}/trending"			# TRENDING TODAY
		@myRecipesUrl 			= "#{@domain}/myRecipes"			# SUBMITTED BY ME
		@myFavRecipesUrl  		= "#{@domain}/myFavourite"		# NEW 10
		@topTenWeekUrl  		= "#{@domain}/topTenWeek"		# TOP TEN OF CURRENT WEEK
		@newestRecipesUrl  		= "#{@domain}/newestRecipes"		# NEW 10

		### POST CALLS ###
		@postRecipeUrl 			= "#{@domain}/postRecipe"
		@favRecipeUrl 			= "#{@domain}/favRecipe"
		@postCommentUrl 		= "#{@domain}/postComment"
		@giveKarmaToRecipeUrl 	= "#{@domain}/giveKarmaToRecipe"
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
		if response.status is "success"
			defer.resolve response.msg
		else
			defer.reject response.msg
		return

	updateUser:(user)=>
		console.log(user)
		@$http.post(@updateUserUrl,user)
		return 

	trending:->
		defer = @$q.defer()
		@$http.get(@trendingUrl)
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

	postComment:(recipeID,comment)->
		defer 		= @$q.defer()
		url 		= "#{@postCommentUrl}/#{recipeID}"

		@$http.post(url,comment)
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
	
	giveKarmaToRecipe:(recipeID,karma)->
		defer 		= @$q.defer()
		url 		= "#{@giveKarmaToRecipeUrl}/#{recipeID}"

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

BaazarModule = angular.module "BaazarModule",[]
BaazarModule.service 'Baazar',['$q','$http',Baazar]