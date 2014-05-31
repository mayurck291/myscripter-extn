MonkeyWrench = angular.module 'MonkeyWrench'

class EditProjectController
	@$inject: ['$scope','$routeParams','$timeout','$location','Baazar','Project','Alert'] 

	constructor:(@scope,@routeParams,@timeout,@location,@Baazar,@Project,@Alert)->
		pid = @routeParams.pid

		if pid isnt null and pid isnt undefined
			@config = @Project.get(pid)
		else
			@location.path('/')

		if @config is null or @config is undefined
			@location.path('/')

		if @config.forked 
			@location.path('/')
			@Alert.error('Opps...can not edit installed Recipe...instead FORK it and then make it AWESOME.')

		######################################################################################
		@oldurl = @config.url
		
		@timeout ()=>
			tabs 	= new CBPFWTabs document.getElementById('form')
			cbtab 	= new CBPFWTabs tabs
		,300
		,true

		@scope.$on('save',@save)
		return

	save:()->
		@Project.save(angular.copy(@config),@oldurl)
		@Alert.success("Hurrah....project saved...")
	
	delete:(project)->
		if confirm "Are you sure you want to delete recipe #{project.name} ?"
			@Project.delete(angular.copy(project))
			@Alert.success("Recipe #{project.name} deleted...")
			@config = {}
			@location.path('/')
	
	removejs:(index)->
		@config.external.js.splice(index,1)

	addjs:()->
		if @config.external.js.indexOf(@scope.extjs) is -1 and @scope.extjs isnt null and @scope.extjs isnt undefined
			@config.external.js.push(@scope.extjs)
		@scope.extjs = null

	removecss:(index)->
		@config.external.css.splice(index,1)

	addcss:()->
		if @config.external.css.indexOf(@scope.extcss) is -1 and @scope.extcss isnt null and @scope.extcss isnt undefined
			@config.external.css.push(@scope.extcss)
		@scope.extcss = null

	moveUp:(index,array)->
		temp = array[index]
		array[index] = array[index-1]
		array[index-1] = temp

	moveDown:(index,array)->
		temp = array[index]
		array[index] = array[index+1]
		array[index+1] = temp
	
MonkeyWrench.controller 'EditProjectController',EditProjectController
