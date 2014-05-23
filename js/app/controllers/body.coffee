MonkeyWrench = angular.module 'MonkeyWrench'
class BodyController
	@$inject: ['$scope','$routeParams','$location','Baazar','GPauth','Alert','Project'] 

	constructor:(@scope,@routeParams,@location,@Baazar,@gp,@Alert,@Project)->
		@scope.alert 		= @Alert.bind()
		@scope.signIn 		= @signIn
		@scope.signOut 		= @signOut
		# check if user is signed in 
		# if Yes get  userinfo
		@getAllProjects()

		@gp.load().then(
			()=> @getUserInfo()
		,
			()=>
				@scope.user = null
				@scope.signedIn = no
				console.log("User not signed in")
		)

		setTimeout ()=>
			tabs 	= new CBPFWTabs document.getElementById('home')
			cbtab 	= new CBPFWTabs tabs
		,100  

		#### Functions ####### 
		@scope.save = @save
		@scope.edit = @edit
		@scope.fork = @fork
		@scope.share = @share
		@scope.delete = @delete
		@scope.getDownloadLink = @getDownloadLink
		@scope.importProject = @importProject
		@scope.home  = @home
		@scope.new  = @new
		@scope.baazar  = @baazar
		@scope.help  = @help


		@scope.$on('$routeChangeStart',(next,current)=>
			console.log "loading......."
			@scope.showLoader = yes 
			)

		@scope.$on('$routeChangeSuccess',(next,current)=>
			console.log "end......."
			@scope.showLoader = no 
			)

		@scope.$on('$routeChangeError',(next,current)=>
			console.log "end......."
			@scope.showLoader = no 
			)
		return

	getAllProjects:=>
		projects = @Project.getAll()
		@scope.projectIds = []
		for project_url,ids of projects
			@scope.projectIds.push ids...

		@scope.allProjects = []

		for id in @scope.projectIds
			@scope.allProjects.push @Project.get(id)
		return

	getUserInfo :=>
		@gp.getUserInfo().then(
					(user)=>
						@scope.user = user
						@scope.signedIn = yes
				,
					()=>@gp.signOut()
		)
	signIn :=>
		console.log (@gp)
		console.log("signing in .....")
		@Alert.warning("Loading...........:)")
		@gp.signIn().then(
			() => @getUserInfo()
		,
			(error)=> console.log(error))
		return

	signOut:=>
		console.log "signing out....."
		@gp.signOut().then(
			()=>console.log("out"),
			()=>console.log("not out"))
		@scope.user = null
		@scope.signedIn = no
		return

	save:(project)=>
		project.enabled = !project.enabled
		@Project.save(project)
		@Alert.success("Hurray.....Recipe saved...")

	edit:(project)=>
		if project.forked
			@Alert.error("Can't edit installed Recipe.....instead FORK it...")
		else
			p = "/Edit/"+project.id
			console.log "path is #{p}"
			@location.path(p)

	fork:(project)=>
		forked = angular.copy(project)
		forked.forked = false
		forked.name += " (forked)"
		delete forked.id
		@Project.save(forked)
		@Alert.success("Successfully forked ...! #{project.name} will appear in 'My Recipes'")
		@getAllProjects()

	share:(project)=>
		if project.forked
			@Alert.error("Can't share installed Recipe.....")
		else
			p = "/Share/"+project.id
			@location.path(p)
		
	delete:(project)=>
		if confirm "Are you sure you want to delete recipe #{project.name}"
			@Project.delete(angular.copy(project))
			@getAllProjects()

	importProject:(project)=>
		@scope.$apply ()=>
			project = angular.fromJson(project)
			project.forked = false
			project.name += " (imported)"
			delete project.id
			@Alert.success("Successfully imported recipe ...! #{project.name} will appear in 'My Recipes'")
			@Project.save(project)
			@getAllProjects()

	home:=>
		# @scope.showLoader = yes
		document.getElementsByTagName('body')[0].click()
		@location.path('/')

	new:=>
		# @scope.showLoader = yes
		document.getElementsByTagName('body')[0].click()
		@location.path('/New')

	baazar:=>
		# @scope.showLoader = yes
		document.getElementsByTagName('body')[0].click()
		@location.path('/Baazar')

	help:=>
		# @scope.showLoader = yes
		document.getElementsByTagName('body')[0].click()
		@location.path('/Help')

	
MonkeyWrench.controller 'BodyController',BodyController
