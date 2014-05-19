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
			new CBPGridGallery document.getElementById( 'grid-gallery' ) ,
		1000  
		# grid = 

		@scope.msg = "hello world"
		# @Baazar.get().then(success,error)



MonkeyWrench.controller 'BaazarController',BaazarController
