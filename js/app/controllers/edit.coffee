MonkeyWrench = angular.module 'MonkeyWrench'

class EditProjectController
	@$inject: ['$scope','$routeParams','$location','Baazar','Project','Alert'] 

	constructor:(@scope,@routeParams,@location,@Baazar,@Project,@Alert)->
		pid = @routeParams.pid

		if pid isnt null and pid isnt undefined
			@scope.curProject = @Project.get(pid)
		else
			@location.path('/')

		if @scope.curProject is null or @scope.curProject is undefined
			@location.path('/')

		console.log "pid is #{pid}"
		######################################################################################
		@scope.oldurl = @scope.curProject.url
		
		setTimeout ()=>
			tabs 	= new CBPFWTabs document.getElementById('form')
			cbtab 	= new CBPFWTabs tabs
		,300  

		@scope.save = @save
		return

	save:()=>
		console.log "saving...."
		@Project.save(angular.copy(@scope.curProject),@scope.oldurl)
		@Alert.success("Hurrah....project saved...")
		
MonkeyWrench.controller 'EditProjectController',EditProjectController
