MonkeyWrench = angular.module 'MonkeyWrench'
class NewProjectController
	@$inject: ['$scope','$routeParams','Baazar'] 
	constructor:(@scope,@routeParams,@Baazar,@recipes,userInfo)->
		@scope.recipes = recipes
		@scope.userInfo = userInfo;
		setTimeout ()=>
			tabs 	= new CBPFWTabs document.getElementById('form')
			new CBPFWTabs tabs
		,1000  

		@scope.msg = "hello world"
		return
		
MonkeyWrench.controller 'NewProjectController',NewProjectController
