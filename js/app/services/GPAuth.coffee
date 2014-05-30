class GPauth
	constructor:(@$http,@$q,@Baazar,@Alert)->
		console.log("service intanciated");
		@START_STATE = 1
		@STATE_ACQUIRING_AUTH_TOKEN = 2
		@STATE_AUTH_TOKEN_ACQUIRED = 3
		@state = @START_STATE
		@authenticationURL = 'https://www.googleapis.com/plus/v1/people/me?fields=aboutMe,displayName,emails,image,url'
		@accessToken = null;
		@userInfo = null;

	getState:-> @state

	setUserInfo:(user)->
		@userInfo = 
			_id		: user.emails[ 0 ]["value"]
			,name 	: user.displayName
			,img  	: user.image.url
			,authToken: @accessToken
			,url 	: user.url
			
		@Baazar.updateUser(@userInfo)

	getToken:(interactive)->
		# console.log("GPauth GETTING TOKEN");

		defer = @$q.defer()
		@state = @STATE_ACQUIRING_AUTH_TOKEN
		option = (interactive:interactive)

		chrome.identity.getAuthToken option,(accessToken) => 
			if chrome.runtime.lastError
				# console.log("Error: ", chrome.runtime.lastError)
				@userInfo = null
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
						@setUserInfo(response)
						@state = @STATE_AUTH_TOKEN_ACQUIRED
						defer.resolve( @userInfo )
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
		if @state is @STATE_AUTH_TOKEN_ACQUIRED
			defer.resolve @userInfo
		else
			return @requestUserData()

		defer.promise

	signIn:->
		# console.log("GPauth signIn");
		@getToken(true)

	signOut:->
		# console.log("GPauth signOut");
		@userInfo = null
		defer = @$q.defer()
		url = "https://accounts.google.com/o/oauth2/revoke?token=#{@accessToken}" 
		option = token : @accessToken
		chrome.identity.removeCachedAuthToken option,()=>
			@$http.get(url).success(defer.resolve).error(defer.reject)
		@state = @START_STATE
		defer.promise

	load:->
		# console.log("GPauth LOAD");
		@getToken(false)

	onChange:(callback)->
		chrome.identity.onSignInChanged.addListener (account,signedIn)=>
			console.log "====================================="
			console.log "#{account} is signedIn : #{signedIn}"
			# callback()

AuthModule = angular.module 'AuthModule',[]
AuthModule.service 'GPauth',["$http", "$q","Baazar",GPauth]