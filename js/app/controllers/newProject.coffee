MonkeyWrench = angular.module 'MonkeyWrench'

class NewProjectController
	@$inject: ['$scope','$routeParams','Baazar','Project','Alert'] 

	constructor:(@scope,@routeParams,@Baazar,@Project,@Alert)->
		@scope.curProject = @Project.new()
		console.log @routeParams
		setTimeout ()=>
			tabs 	= new CBPFWTabs document.getElementById('form')
			cbtab 	= new CBPFWTabs tabs
		,100  

		@scope.save = @save
		return

	save:()=>
		if @scope.curProject.name is null or @scope.curProject.url is null
			@Alert.error("Recipe Name and URL can't be empty..")
			return
		
		console.log "saving...."
		@Project.save(angular.copy(@scope.curProject))
		@Alert.success("Hurrah....project saved...")
		


MonkeyWrench.controller 'NewProjectController',NewProjectController
