MonkeyWrench = angular.module 'MonkeyWrench'

class NewProjectController
	@$inject: ['$scope','$routeParams','$timeout','Baazar','Project','Alert'] 

	constructor:(@scope,@routeParams,@timeout,@Baazar,@Project,@Alert)->
		@scope.curProject = @Project.new()
		console.log @routeParams
		@timeout ()=>
			tabs 	= new CBPFWTabs document.getElementById('form')
			cbtab 	= new CBPFWTabs tabs
		,100  

		@scope.save = @save
		@scope.removecss = @removecss
		@scope.removejs = @removejs
		@scope.addjs = @addjs
		@scope.addcss = @addcss
		return

	save:()=>
		if @scope.curProject.name is null or @scope.curProject.url is null
			@Alert.error("Recipe Name and URL can't be empty..")
			return
		
		console.log "saving...."
		@Project.save(angular.copy(@scope.curProject))
		@Alert.success("Hurrah....project saved...")

	removejs:(index)=>
		@scope.curProject.external.js.splice(index,1)

	addjs:()=>
		if @scope.curProject.external.js.indexOf @scope.extjs is -1
			@scope.curProject.external.js.push(@scope.extjs)
		@scope.extjs = null

	removecss:(index)=>
		@scope.curProject.external.css.splice(index,1)

	addcss:()=>
		if @scope.curProject.external.css.indexOf @scope.extcss is -1
			@scope.curProject.external.css.push(@scope.extcss)
		@scope.extcss = null
		


MonkeyWrench.controller 'NewProjectController',NewProjectController
