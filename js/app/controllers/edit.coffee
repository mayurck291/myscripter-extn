MonkeyWrench = angular.module 'MonkeyWrench'

class EditProjectController
	@$inject: ['$scope','$routeParams','$timeout','$location','Baazar','Project','Alert'] 

	constructor:(@scope,@routeParams,@timeout,@location,@Baazar,@Project,@Alert)->
		pid = @routeParams.pid

		if pid isnt null and pid isnt undefined
			@scope.curProject = @Project.get(pid)
		else
			@location.path('/')

		if @scope.curProject is null or @scope.curProject is undefined
			@location.path('/')

		if @scope.curProject.forked 
			@location.path('/')
			@Alert.error('Opps...can not edit installed Recipe...instead FORK it and then make it AWESOME.')

		######################################################################################
		@scope.oldurl = @scope.curProject.url
		
		@timeout ()=>
			tabs 	= new CBPFWTabs document.getElementById('form')
			cbtab 	= new CBPFWTabs tabs
		,300
		,true

		@scope.save = @save
		@scope.delete = @delete
		@scope.removecss = @removecss
		@scope.removejs = @removejs
		@scope.addjs = @addjs
		@scope.addcss = @addcss
		@scope.$on('save',@save)
		return

	save:()=>
		console.log "saving...."
		@Project.save(angular.copy(@scope.curProject),@scope.oldurl)
		@Alert.success("Hurrah....project saved...")
	
	delete:(project)=>
		if confirm "Are you sure you want to delete recipe #{project.name} ?"
			@Project.delete(angular.copy(project))
			@Alert.success("Recipe #{project.name} deleted...")
			@scope.curProject = {}
			@location.path('/')
	
	removejs:(index)=>
		@scope.curProject.external.js.splice(index,1)

	addjs:()=>
		if @scope.curProject.external.js.indexOf(@scope.extjs) is -1 and @scope.extjs isnt null and @scope.extjs isnt undefined
			@scope.curProject.external.js.push(@scope.extjs)
		@scope.extjs = null

	removecss:(index)=>
		@scope.curProject.external.css.splice(index,1)

	addcss:()=>
		if @scope.curProject.external.css.indexOf(@scope.extcss) is -1 and @scope.extcss isnt null and @scope.extcss isnt undefined
			@scope.curProject.external.css.push(@scope.extcss)
		@scope.extcss = null

MonkeyWrench.controller 'EditProjectController',EditProjectController
