MonkeyWrench = angular.module 'MonkeyWrench'

class ShareProjectController
	@$inject: ['$scope','$routeParams','$location','$timeout','GPauth','Baazar','Project','Alert'] 
	constructor:(@scope,@routeParams,@location,@timeout,@gp,@Baazar,@Project,@Alert)-> 
		pid = @routeParams.pid

		if pid isnt null and pid isnt undefined
			@scope.curProject = angular.copy(@Project.get(pid))
		else
			@location.path('/')

		if @scope.curProject is null or @scope.curProject is undefined
			@location.path('/')

		if @scope.curProject.forked 
			@location.path('/')
			@Alert.error('Opps...can not share installed Recipe...instead FORK it and then make it AWESOME.')

		@gp.load().then(
			()=> @getUserInfo()
		,
			()=>
				@scope.user = null
				@scope.signedIn = no
				@Alert.error("You must LOG IN in-order to share Recipe.")
		)
		######################################################################################
		@scope.share = @share
		@scope.isDisabled = @isDisabled
		@scope.disableShareButton = false
		return

	isEmpty:(value)=>
		[null,undefined,""].indexOf(value) > -1

	isDisabled:()=>
		if @isEmpty(@scope.curProject.name) or @isEmpty(@scope.curProject.desc) or @scope.disableShareButton
			return yes
		else 
			return no	

	resetFileInput:( )=>
		@scope.disableShareButton = yes
		@timeout ()=>
			@location.path('/')
		,3000
		#     newInput = document.createElement( "input" )
		#     newInput.type = "file"
		#     newInput.id = fileSelect.id
		#     newInput.name = fileSelect.name
		#     newInput.className = fileSelect.className
		#     newInput.multiple = "multiple"
		#     newInput.style.cssText = fileSelect.style.cssText
		#     // copy any other relevant attributes 
		#     fileSelect.parentNode.replaceChild( newInput, fileSelect )
		# }
	
	handle_response:( response )=>
		@resetFileInput( )
		@updateRecipeId( response._id )
		@Alert.success( response.msg )

	updateRecipeId:( recipeId )=>
		@scope.curProject[ '_id' ] = recipeId
		@Project.save(@scope.curProject)

	share:()=>
		unless @scope.signedIn
			@Alert.error("You must LOG IN in-order to share Recipe.")
			return
		curProject = angular.copy(@scope.curProject)

		requestURL = @Baazar.domain + '/saveRecipe'
		fileSelect = document.getElementById( 'imgs' )

		files = fileSelect.files

		if files.length < 2
			alert( "please select atleast 2 files" )
			return

		formData = new FormData( )

		for file in files
			# // Check the file type.
			if not file.type.match( 'image.*' )
				continue
			formData.append( 'imgs', file, file.name )

		formData.append( 'title', curProject.name )
		formData.append( 'desc', curProject.desc )
		formData.append( 'author', @scope.user._id )

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
					resetFileInput( )
					@Alert.error( "An Army of heavily trained monkeys is dispatched to deal with this situation....hang in there...." )

		xhr.send( formData )

		

		

	getUserInfo :=>
		@gp.getUserInfo().then(
					(user)=>
						@scope.user = user
						@scope.signedIn = yes
				,
					()=>@gp.signOut()
		)
		
MonkeyWrench.controller 'ShareProjectController',ShareProjectController
