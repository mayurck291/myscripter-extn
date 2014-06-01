MonkeyWrench = angular.module 'MonkeyWrench'

class NewProjectController
	@$inject: ['$scope','$routeParams','$timeout','Baazar','Project','Alert'] 

	constructor:(@scope,@routeParams,@timeout,@Baazar,@Project,@Alert)->
		@config = @Project.new()
		@extjs = null
		@extcss = null
		@timeout ()=>
			tabs 	= document.getElementById('form')
			cbtab 	= new CBPFWTabs(tabs)
		,100
		,true

		
		@scope.$on('save',()=>@save())
		return

	save:()->
		if @config.name is null or @config.url is null
			@Alert.error("Recipe Name and URL can't be empty..")
			return
		
		console.log "saving...."
		@Project.save(@config)
		@Alert.success("Hurrah....project saved...")

	removejs:(index)->
		@config.external.js.splice(index,1)

	addjs:()->
		if @config.external.js.indexOf(@extjs) is -1 and @extjs isnt null and @extjs isnt undefined
			@config.external.js.push(@extjs)
		@extjs = null

	removecss:(index)->
		@config.external.css.splice(index,1)

	moveUp:(index,array)->
		max = array.length
		if index is 0
			array.push(array[0])
			array.splice(0,1)
		else 
			temp = array[index]
			array[index] = array[index-1]
			array[index-1] = temp

	moveDown:(index,array)->
		max = array.length
		if index is (max-1)
			array.unshift(array.pop())
		else
			temp = array[index]
			array[index] = array[index+1]
			array[index+1] = temp

	addcss:()->
		if @config.external.css.indexOf(@extcss) is -1 and @extcss isnt null and @extcss isnt undefined
			@config.external.css.push(@extcss)
		@extcss = null
	
MonkeyWrench.controller 'NewProjectController',NewProjectController
