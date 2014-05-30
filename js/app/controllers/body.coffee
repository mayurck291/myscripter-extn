MonkeyWrench = angular.module 'MonkeyWrench'
class BodyController
	@$inject: ['$scope','$routeParams','$timeout','$location','Baazar','GPauth','Alert','Project'] 

	constructor:(@scope,@routeParams,@timeout,@location,@Baazar,@gp,@Alert,@Project)->
		@scope.alert 		= @Alert.bind()
		@scope.signIn 		= @signIn
		@scope.signOut 		= @signOut
		console.log @location.path()
		# check if user is signed in 
		# if Yes get  userinfo
		@gp.load().then(
			()=> @getUserInfo()
		,
			()=>
				@scope.user = null
				@scope.signedIn = no
				console.log("User not signed in")
		)

		#### Functions ####### 
		@scope.home  			= @home
		@scope.new  			= @new
		@scope.baazar  			= @baazar
		@scope.help  			= @help
		@scope.handleKeyBoardEvent = @handleKeyBoardEvent

		@scope.$on('$routeChangeStart',(next,current)=>
			# console.log "loading......."
			@scope.showLoader = yes 
			)

		@scope.$on('$routeChangeSuccess',(next,current)=>
			# console.log "end......."
			@scope.showLoader = no 
			)

		@scope.$on('$routeChangeError',(next,current)=>
			# console.log "end......."
			@scope.showLoader = no 
			)
		return

	

	getUserInfo :=>
		@gp.getUserInfo().then(
					(user)=>
						@scope.user = user
						@scope.signedIn = yes
						@scope.$broadcast('login')
				,
					()=>@gp.signOut()
		)

	deleteUserInfo:=>
		@scope.user = null
		@scope.signedIn = no
	
	signIn :=>
		# console.log (@gp)
		# console.log("signing in .....")
		@Alert.warning("Loading....")
		@gp.signIn().then(
			() => @getUserInfo()
		,
			(error)=> console.log(error))
		return

	signOut:=>
		console.log "signing out....."
		@gp.signOut().then(
			()=>console.log("out"),
			()=>console.log("not out"))
		@scope.user = null
		@scope.signedIn = no
		@scope.$broadcast('logout')
		return

	home:=>
		# @scope.showLoader = yes
		document.getElementsByTagName('body')[0].click()
		@timeout(
			()=>
				@location.path('/')
			,0
			,true
		)

	new:=>
		# @scope.showLoader = yes
		document.getElementsByTagName('body')[0].click()
		@timeout(
			()=>
				@location.path('/New')
			,0
			,true
		)

	baazar:=>
		# @scope.showLoader = yes
		document.getElementsByTagName('body')[0].click()
		@timeout(
			()=>
				@location.path('/Baazar')
			,0
			,true
		)

	help:=>
		# @scope.showLoader = yes
		document.getElementsByTagName('body')[0].click()
		@timeout(
			()=>
				@location.path('/Help')
			,0
			,true
		)

	handleKeyBoardEvent :(event)=>
		console.log "Called"
		if event.ctrlKey or event.metaKey
			key = String.fromCharCode( event.which ).toLowerCase( ) 
			path = @location.path()
			console.log path
			switch key
				when 's'
					if path is "/New" or path.indexOf('/Edit') > -1
						event.preventDefault( )
						@scope.$broadcast( 'save' )
				when 'p'
					event.preventDefault( )
					if  path is "/New" or path.indexOf('/Edit') > -1
						sure = confirm( "Are you sure ? all UNSAVED changes will be lost.!!" )
						if sure
							@new()
					else
						@new()
				when 'h'
					event.preventDefault( )
					@home()
				when 'b'
					event.preventDefault( )
					@baazar()



MonkeyWrench.controller 'BodyController',BodyController
