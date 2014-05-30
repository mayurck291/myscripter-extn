class HomeController
	@$inject: ['$scope','$routeParams','$timeout','$location','Baazar','GPauth','Alert','Project'] 

	constructor:(@scope,@routeParams,@timeout,@location,@Baazar,@gp,@Alert,@Project)->
		@scope.alert 		= @Alert.bind()
		@scope.signIn 		= @signIn
		@scope.signOut 		= @signOut
		@getAllProjects()

		@gp.load().then(
			()=> @getUserInfo()
		,
			()=>
				@scope.user = null
				@scope.signedIn = no
				console.log("User not signed in")
		)

		@timeout ()=>
			tabs 	= document.getElementById('home')
			cbtab 	= new CBPFWTabs tabs
		,100
		,true

		#### Functions ####### 
		@scope.save = @save
		@scope.edit = @edit
		@scope.fork = @fork
		@scope.share = @share
		@scope.delete = @delete
		@scope.getDownloadLink = @getDownloadLink
		@scope.importProject = @importProject

		@scope.$on('login',@getUserInfo)
		@scope.$on('logout',@deleteUserInfo)

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

	deleteUserInfo:=>
		@scope.user = null
		@scope.signedIn = no

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
		# @Alert.success("Hurray.....Recipe saved...")

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
		@Alert.success("Successfully forked ")
		@getAllProjects()

	share:(project)=>
		if project.forked
			@Alert.error("Can't share installed Recipe.....")
		else if not @scope.signedIn
			@Alert.error("You must Log In to share Recipe....")
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

		
MonkeyWrench.controller 'HomeController',HomeController
