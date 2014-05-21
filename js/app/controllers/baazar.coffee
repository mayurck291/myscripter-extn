MonkeyWrench = angular.module 'MonkeyWrench'
class BaazarController
	@$inject: ['$scope','$routeParams','Baazar','recipes'] 
	constructor:(@scope,@routeParams,@Baazar,@recipes)->
		@scope.recipes = recipes
		@scope.userInfo = @scope.$parent.user;
		@scope.signedIn = @scope.$parent.signedIn;
		@scope.getStars = @getStars
		@scope.getRemStars = @getRemStars
		setTimeout ()=>
			gg 			= new CBPGridGallery document.getElementById( 'grid-gallery' )
			allTabs 	= document.getElementsByClassName('tabs')
			for tabs in allTabs
				new CBPFWTabs(tabs)
			return
		,1000  

	getStars:(range)->
		[1..range]

	getRemStars:(range)->
		range += 1
		[range..10]

MonkeyWrench.controller 'BaazarController',BaazarController
