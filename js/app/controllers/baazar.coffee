MonkeyWrench = angular.module 'MonkeyWrench'
class BaazarController
	@$inject: ['$scope','$routeParams','$timeout','$route','Baazar','recipes'] 
	constructor:(@scope,@routeParams,@timeout,@route,@Baazar,@recipes)->
		reload = localStorage.getItem('reload')
		console.log "reload is of type",typeof reload
		if reload? and reload is "true"
			console.log "will reload"
			localStorage.setItem('reload',no)
			window.location.reload()
		
		@scope.recipes = recipes
		@scope.userInfo = @scope.$parent.user;
		@scope.signedIn = @scope.$parent.signedIn;
		@scope.getStars = @getStars
		@scope.getRemStars = @getRemStars
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
		range += 1
		[range..10]

MonkeyWrench.controller 'BaazarController',BaazarController
