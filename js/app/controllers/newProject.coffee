MonkeyWrench = angular.module 'MonkeyWrench'

class NewProjectController
	@$inject: ['$scope','$routeParams','Baazar','Project','Alert'] 

	constructor:(@scope,@routeParams,@Baazar,@Project,@Alert)->
		@scope.curProject = @Project.new()
		console.log @routeParams
		@scope.curProject.name = 'parin rocks'
		setTimeout ()=>
			tabs 	= new CBPFWTabs document.getElementById('form')
			cbtab 	= new CBPFWTabs tabs
		,300  

		@scope.save = @save
		return

	save:()=>
		console.log "saving...."
		@Project.save(angular.copy(@scope.curProject))
		@Alert.success("Hurrah....project saved...")
		


MonkeyWrench.controller 'NewProjectController',NewProjectController
