class GPauth
	constructor:(@$http,@$q)->
		# console.log("INITIALIZED GPauth",arguments);
		@START_STATE = 1
		@STATE_ACQUIRING_AUTH_TOKEN = 2
		@STATE_AUTH_TOKEN_ACQUIRED = 3
		@state = @START_STATE
		@authenticationURL = 'https://www.googleapis.com/plus/v1/people/me?fields=aboutMe,displayName,emails,image,url'
		@accessToken = null;

	getState:-> @state

	getToken:(interactive)->
		# console.log("GPauth GETTING TOKEN");

		defer = @$q.defer()
		@state = @STATE_ACQUIRING_AUTH_TOKEN
		option = (interactive:interactive)

		chrome.identity.getAuthToken option,(accessToken) => 
			if chrome.runtime.lastError
				# console.log("Error: ", chrome.runtime.lastError)
				defer.reject(chrome.runtime.lastError)
			else 
				# console.log("accessToken: ",accessToken)
				@accessToken = accessToken
				defer.resolve()
			return

		defer.promise

	requestUserData:->
		# console.log("GPauth REQUESTING USER DATA");

		defer = @$q.defer()
		@retry = yes
		config = headers: "Authorization": "Bearer #{@accessToken}"

		@$http.get(@authenticationURL,config)
			.success(
				(response,status) =>
					if status is 200
						@state = @STATE_AUTH_TOKEN_ACQUIRED
						defer.resolve( response )
					else 
						@state = @START_STATE
						defer.reject( response )
					return
				)
			.error(
				(response,status) =>
					if @retry and status is 401 
						chrome.identity.removeCachedAuthToken {token: @accessToken},@getToken
						@retry = no
						return
				)
		defer.promise

	getUserInfo:(interactive)->
		# console.log("GPauth GET USER DATA");

		defer = @$q.defer()
		@requestUserData().then defer.resolve,defer.reject

		defer.promise

	signIn:->
		# console.log("GPauth signIn");

		defer = @$q.defer()
		@getToken(true).then defer.resolve,defer.reject

		defer.promise

	signOut:->
		# console.log("GPauth signOut");
		defer = @$q.defer()
		url = "https://accounts.google.com/o/oauth2/revoke?token=#{@accessToken}" 
		option = token : @accessToken
		chrome.identity.removeCachedAuthToken option,()->@$http.get(url).success(defer.resolve).error(defer.reject)
		@state = @START_STATE
		defer.promise

	load:->
		# console.log("GPauth LOAD");
		defer = @$q.defer()
		@getToken(false).then defer.resolve,defer.reject
		defer.promise

AuthModule = angular.module 'AuthModule',[]
AuthModule.service 'GPauth',["$http", "$q",GPauth]