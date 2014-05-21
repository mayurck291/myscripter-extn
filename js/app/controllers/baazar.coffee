MonkeyWrench = angular.module 'MonkeyWrench'
class BaazarController
	@$inject: ['$scope','$routeParams','$timeout','$route','Baazar','recipes','GPauth'] 
	constructor:(@scope,@routeParams,@timeout,@route,@Baazar,@recipes,@gp)->
		### fucking masonary sucks ###
		reload = localStorage.getItem('reload')
		console.log "reload is of type",typeof reload
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

		@scope.getStars = @getStars
		@scope.getRemStars = @getRemStars
		@scope.incRating = @incRating
		@scope.decRating = @decRating
		@timeout ()=>
			@scope.$apply ()=>	
				allTabs = document.getElementsByClassName('tabs')
				console.log allTabs
				for tabs in allTabs
					tab = new CBPFWTabs(tabs)
				localStorage.setItem('reload',yes)
				gg = new CBPGridGallery(document.getElementById( 'grid-gallery' ))
		,200  

	getStars:(range)->
		[1..range]

	getRemStars:(range)->
		if range is undefined
			range = 1
		else
			range += 1
			
		[range..10]

	getUserInfo :=>
		@gp.getUserInfo().then(
					(user)=>
						@scope.user = user
						@scope.signedIn = yes
				,
					()=>@gp.signOut()
		)

	incRating:()=>
		if not @scope.fm?
			@scop.fm = {} 
		if @scope.fm.rating >= 5
			return
		else
			@scope.fm.rating -= 1 

	decRating:()=>
		if not @scope.fm?
			@scop.fm = {} 
		if @scope.fm.rating >= 5
			return
		else
			@scope.fm.rating -= 1 

MonkeyWrench.controller 'BaazarController',BaazarController
