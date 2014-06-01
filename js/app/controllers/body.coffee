MonkeyWrench = angular.module 'MonkeyWrench'
class BodyController
	@$inject: ['$scope','$routeParams','$timeout','$location','Baazar','GPauth','Alert','Project'] 

	constructor:(@scope,@routeParams,@timeout,@location,@Baazar,@gp,@Alert,@Project)->
		@alert = @Alert.bind()
		# check if user is signed in 
		# if Yes get  userinfo
		@gp.load().then(
			()=> @getUserInfo()
		,
			()=>
				@user = null
				@signedIn = no
				console.log("User not signed in")
		)

		@scope.$on('$routeChangeSuccess',(next,current)=>
			@showLoader = no 
			)

		@scope.$on('$routeChangeError',(next,current)=>
			@showLoader = no 
			)
		return

	

	getUserInfo :->
		@gp.getUserInfo().then(
					(user)=>
						@user = user
						@signedIn = yes
						@showCircle = yes
						@scope.$broadcast('login')
				,
					()=>@gp.signOut()
		)

	deleteUserInfo:->
		@user = null
		@signedIn = no
	
	signIn :->
		@showCircle = yes
		@gp.signIn().then(
			() => @getUserInfo()
		,
			(error)=> console.log(error))
		return

	signOut:->
		console.log "signing out....."
		@gp.signOut().then(
			()=>console.log("out"),
			()=>console.log("not out"))
		@user = null
		@signedIn = no
		@scope.$broadcast('logout')
		return

	home:->
		if @location.path() is '/'
			return
		@showLoader = yes
		@location.path('/')
		
	new:->
		if @location.path() is '/New'
			return
		@showLoader = yes
		@location.path('/New')

	baazar:->
		if @location.path() is '/Baazar'
			return
		@showLoader = yes
		@location.path('/Baazar')

	help:->
		if @location.path() is '/Help'
			return
		@showLoader = yes
		@location.path('/Help')

	handleKeyBoardEvent :(event)->
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
