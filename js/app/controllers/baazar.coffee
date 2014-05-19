MonkeyWrench = angular.module 'MonkeyWrench'
class BaazarController
	@$inject: ['$scope','$routeParams','Baazar','recipes'] 
	constructor:(@scope,@routeParams,@Baazar,@recipes)->
		# success = (data)=>
		# 	console.log data
		# 	@scope.recipes = data
		# error 	= (data)=>
		# 	console.log data
		@scope.recipes = recipes
		setTimeout ()->
			gg 			= new CBPGridGallery document.getElementById( 'grid-gallery' )
			for tab in document.getElementsByClassName('tabs')
				new CBPFWTabs tab
		,1000  
		# grid = 

		@scope.msg = "hello world"
		# @Baazar.get().then(success,error)



MonkeyWrench.controller 'BaazarController',BaazarController
