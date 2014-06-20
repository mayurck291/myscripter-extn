MonkeyWrench = angular.module 'MonkeyWrench'
class BaazarController
	@$inject: ['$scope','$routeParams','$timeout','$route','Baazar','recipes','GPauth','Alert','Project'] 
	constructor:(@scope,@routeParams,@timeout,@route,@Baazar,@recipes,@gp,@Alert,@Project)->
		### fucking masonary sucks ###
		reload = localStorage.getItem('reload')
		if reload? and reload is "true"
			console.log "will reload"
			localStorage.setItem('reload',no)
			window.location.reload()
		
		### fucking masonary sucks ###

		@scope.recipes = recipes
		
		@gp.load().then(
			()=> @getUserInfo()
		,
			()=>
				@scope.user = null
				@scope.signedIn = no
		)
		@scope.cf 		 		= {}
		@scope.cf.usercomment 	= null
		@scope.show 			= {}
		@scope.show.dokarma 	= false
		@scope.show.docomment 	= false

		@scope.getStars 		= @getStars
		@scope.getRemStars 		= @getRemStars
		@scope.rate				= @rate;
		@scope.fm 				= {}
		@scope.karma 			= @karma
		@scope.postComment		= @postComment
		@scope.disableKarmaSubmit  = @disableKarmaSubmit
		@scope.install 			= @install
		@scope.disableInstall = no
		@scope.$on('login',@getUserInfo)
		@scope.$on('logout',@deleteUserInfo)
		
		@timeout ()=>
			@scope.$apply ()=>	
				allTabs = document.getElementsByClassName('tabs')
				console.log allTabs
				for tabs in allTabs
					tab = new CBPFWTabs(tabs)
				localStorage.setItem('reload',yes)
				gg = new CBPGridGallery(document.getElementById( 'grid-gallery' ))
		,1000
		,true

	getStars:(range)->
		if range?
			[1..range]
		else
			return []

	getRemStars:(range)->
		if range is undefined
			range = 1
		else if range is 5
			[]
		else
			range +=1
			[range..5]

	getUserInfo :=>
		@gp.getUserInfo().then(
					(user)=>
						@scope.user = user
						@scope.signedIn = yes
				,
					()=>@gp.signOut()
		)

	deleteUserInfo:=>
		@scope.user = null
		@scope.signedIn = no

	rate:(star)=>
		if @scope.fm is null or @scope.fm is undefined
			@scope.fm = {} 
		
		@scope.fm.karma = star 

	disableKarmaSubmit:()=>
		if @scope.fm? and @scope.fm.karma? and @scope.fm.body? then return false else return true
			
		
	karma:(recipe)=>
		@Baazar.giveKarmaToRecipe(@scope.user._id,recipe['_id']['_id'],@scope.fm.karma,@scope.fm.body).then(
				()=>
					
					found = false
					for karma,i in recipe.karma
						if karma.user._id is @scope.user._id
							recipe.karma[i].body = @scope.fm.body 
							recipe.karma[i].karma = @scope.fm.karma
							found = true

					if not found
						obj = 
						karma:@scope.fm.karma,
						user:
							_id	:@scope.user._id,
							img	:@scope.user.img,
							name:@scope.user.name
						body:@scope.fm.body
						recipe.karma.unshift(obj)

					# @scope.fm 			= {}
					@scope.fm.karma		= 1
					@scope.fm.body		= null

					@scope.show.dokarma 		= false
					@Alert.success('Yeah ....!!..')

			,()=>
					@Alert.error('Failed to update.Try later...:(')
					@scope.fm.karma		= 1
					@scope.fm.body		= null
					@scope.show.dokarma 		= no
					return
			)
		return

	postComment:(recipe)=>
		@Baazar.postComment(recipe['_id']['_id'],@scope.user._id,@scope.cf.usercomment).then(
				()=>

					obj = 
						user:
							_id	:@scope.user._id,
							img	:@scope.user.img,
							name:@scope.user.name
						body: @scope.cf.usercomment
						date:Date.now()
					recipe._id.comments.push(obj)

					@scope.show.docomment 		= false
					@scope.cf.usercomment 		= null
					@Alert.success('Yeah ....!!..')

			,()=>
					@Alert.error('Failed to update.Try later...:(')
					@scope.show.docomment 		= false
					@scope.cf.usercomment 		= null
				)

	install:(recipeInfo)=>
		id = recipeInfo._id._id
		@showLoader = yes
		@scope.disableInstall = yes
		@Baazar.getRecipe(id).then((recipe)=>
				recipe.forked = true
				recipe.favourited = no
				recipe._id = id
				@scope.disableInstall = no
				@Project.save(recipe)
				@Alert.success("Yeahh...!! recipe installed.")
				found = no
				for user in recipeInfo.users
					if user._id is @scope.user._id
						found = yes
						return
				if not found
					user =
						_id	:@scope.user._id,
						img	:@scope.user.img,
						name:@scope.user.name
					recipeInfo.users.push(user)
					recipeInfo.userc += 1
				@Baazar.incUsersRecipes(@scope.user._id,id)
			,()=>
				@Alert.error("An army of heavily trained monkeys is dispatched to deal with this situation...hang in there...")
				)

MonkeyWrench.controller 'BaazarController',BaazarController
