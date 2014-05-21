MonkeyWrench = angular.module 'MonkeyWrench'
class BaazarController
	@$inject: ['$scope','$routeParams','$timeout','Baazar','recipes'] 
	constructor:(@scope,@routeParams,@timeout,@Baazar,@recipes)->
		@scope.recipes = recipes
		@scope.userInfo = @scope.$parent.user;
		@scope.signedIn = @scope.$parent.signedIn;
		@scope.getStars = @getStars
		@scope.getRemStars = @getRemStars
		@timeout ()=>
			gg 			= new CBPGridGallery(document.getElementById( 'grid-gallery' ))
			console.log "gg called #{gg}"
			allTabs 	= document.getElementsByClassName('tabs')
			for tabs in allTabs
				tab = new CBPFWTabs(tabs)
			return
		,100  

	getStars:(range)->
		[1..range]

	getRemStars:(range)->
		range += 1
		[range..10]

MonkeyWrench.controller 'BaazarController',BaazarController
