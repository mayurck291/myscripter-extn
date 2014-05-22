MonkeyWrench = angular.module 'MonkeyWrench'

class NewProjectController
	@$inject: ['$scope','$routeParams','Baazar','Project'] 

	constructor:(@scope,@routeParams,@Baazar,Project)->
		@scope.curProject = Project.new()
		@scope.curProject.name = 'parin rocks'
		setTimeout ()=>
			tabs 	= new CBPFWTabs document.getElementById('form')
			cbtab 	= new CBPFWTabs tabs
		,300  

		@scope.msg = "hello world"
		return

	create:=>
		


MonkeyWrench.controller 'NewProjectController',NewProjectController
