MonkeyWrench = angular.module 'MonkeyWrench'

class ShareProjectController
	@$inject: ['$scope','$routeParams','$location','$timeout','GPauth','Baazar','Project','Alert'] 
	constructor:(@scope,@routeParams,@location,@timeout,@gp,@Baazar,@Project,@Alert)-> 
		pid = @routeParams.pid

		if pid isnt null and pid isnt undefined
			@config = angular.copy(@Project.get(pid))
		else
			@location.path('/')

		if @config is null or @config is undefined
			@location.path('/')

		if @config.forked 
			@location.path('/')
			@Alert.error('Opps...can not share installed Recipe...instead FORK it and then make it AWESOME.')

		@scope.$on('login',()=>@getUserInfo())
		@scope.$on('logout',()=>@deleteUserInfo())

		@gp.load().then(
			()=> @getUserInfo()
		,
			()=>
				@user = null
				@signedIn = no
				@Alert.error("You must LOG IN in-order to share Recipe.")
				@location.href('/')
		)
		######################################################################################
		@disableShareButton = false
		return

	isEmpty:(value)->
		[null,undefined,""].indexOf(value) > -1

	isDisabled:()->
		if @isEmpty(@config.name) or @isEmpty(@config.desc) or @disableShareButton
			return yes
		else 
			return no	

	resetFileInput:->
		@timeout ()=>
			@location.path('/')
		,1000
	
	handle_response:( response )->
		@Alert.success( response.msg )
		@updateRecipeId( response._id )
		@resetFileInput( )

	updateRecipeId:( recipeId )->
		@config[ '_id' ] = recipeId
		@Project.save(@config)

	share:->
		unless @signedIn
			@Alert.error("You must LOG IN in-order to share Recipe.")
			return
		curProject = angular.copy(@config)

		requestURL = @Baazar.domain + '/saveRecipe'
		fileSelect = document.getElementById( 'imgs' )

		files = fileSelect.files

		if files.length < 2
			alert( "please select atleast 2 files" )
			return

		@disableShareButton = yes

		formData = new FormData( )

		for file in files
			if not file.type.match( 'image.*' )
				continue
			formData.append( 'imgs', file, file.name )

		formData.append( 'title', curProject.name )
		formData.append( 'desc', curProject.desc )
		formData.append( 'author', @user._id )

		formData.append( 'ingredients', JSON.stringify( curProject ) )

		xhr = new XMLHttpRequest( )

		xhr.open( 'POST', requestURL, true )

		xhr.onload = ()=>
			if xhr.status is 200
				response = JSON.parse( xhr.responseText )
				@scope.$apply ()=>
					@handle_response( response )
			else
				@scope.$apply ()=>
					@disableShareButton = no
					resetFileInput( )
					@Alert.error( "An Army of heavily trained monkeys is dispatched to deal with this situation....hang in there...." )
		
		xhr.send( formData )

	getUserInfo :=>
		@gp.getUserInfo().then(
					(user)=>
						@user = user
						@signedIn = yes
				,
					()=>@gp.signOut()
		)

	deleteUserInfo:=>
		@user = null
		@signedIn = no
		
MonkeyWrench.controller 'ShareProjectController',ShareProjectController