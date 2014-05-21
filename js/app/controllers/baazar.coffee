MonkeyWrench = angular.module 'MonkeyWrench'
class BaazarController
	@$inject: ['$scope','$routeParams','Baazar','recipes'] 
	constructor:(@scope,@routeParams,@Baazar,@recipes)->
		@scope.recipes = recipes
		@scope.userInfo = @scope.$parent.user;
		@scope.signedIn = @scope.$parent.signedIn;
		setTimeout ()=>
			gg 			= new CBPGridGallery document.getElementById( 'grid-gallery' )
			allTabs 	= document.getElementsByClassName('tabs')
			for tabs in allTabs
				new CBPFWTabs tabs
		,1000  

MonkeyWrench.controller 'BaazarController',BaazarController
