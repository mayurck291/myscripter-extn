MonkeyWrench = angular.module 'MonkeyWrench'
class BaazarController
	@$inject: ['$scope','$routeParams','Baazar','recipes','userInfo'] 
	constructor:(@scope,@routeParams,@Baazar,@recipes,userInfo)->
		@scope.recipes = recipes
		@scope.userInfo = userInfo;
		setTimeout ()=>
			gg 			= new CBPGridGallery document.getElementById( 'grid-gallery' )
			allTabs 	= document.getElementsByClassName('tabs')
			for tabs in allTabs
				new CBPFWTabs tabs
		,1000  

		@scope.msg = "hello world"
		return
		
MonkeyWrench.controller 'BaazarController',BaazarController
