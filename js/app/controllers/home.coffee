class HomeController
	@$inject: ['$scope','$routeParams','$timeout','$location','Baazar','GPauth','Alert','Project'] 

	constructor:(@scope,@routeParams,@timeout,@location,@Baazar,@gp,@Alert,@Project)->
		@getAllProjects()

		@gp.load().then(
			()=> @getUserInfo()
		,
			()=>
				@user = null
				@signedIn = no
				console.log("User not signed in")
		)

		@timeout ()=>
			tabs 	= document.getElementById('home')
			cbtab 	= new CBPFWTabs tabs
		,100
		,true

		@scope.$on('login',@getUserInfo)
		@scope.$on('logout',@deleteUserInfo)

		return

	getAllProjects:->
		projects = @Project.getAll()
		@projectIds = []
		for project_url,ids of projects
			@projectIds.push ids...

		@allProjects = []

		for id in @projectIds
			@allProjects.push @Project.get(id)
		return

	getUserInfo:=>
		@gp.getUserInfo().then(
					(user)=>
						@user = user
						@signedIn = yes
				,
					()=>@gp.signOut()
		)
		return

	deleteUserInfo:->
		@user = null
		@signedIn = no

	save:(project)->
		project.enabled = !project.enabled
		@Project.save(project)
		# @Alert.success("Hurray.....Recipe saved...")

	edit:(project)->
		if project.forked
			@Alert.error("Can't edit installed Recipe.....instead FORK it...")
		else
			p = "/Edit/"+project.id
			console.log "path is #{p}"
			@location.path(p)

	fork:(project)->
		forked = angular.copy(project)
		forked.forked = false
		forked.name += " (forked)"
		delete forked.id
		if forked._id?
			delete forked._id
		if forked.desc?
			delete forked.desc
		@Project.save(forked)
		@Alert.success("Successfully forked ")
		@getAllProjects()

	share:(project)->
		if project.forked
			@Alert.error("Can't share installed Recipe.....")
		else if not @scope.signedIn
			@Alert.error("You must Log In to share Recipe....")
		else
			p = "/Share/"+project.id
			@location.path(p)
		
	delete:(project)->
		if confirm "Are you sure you want to delete recipe \n '#{project.name}' ?"
			@Project.delete(angular.copy(project))
			@getAllProjects()

	importProject:(project)->
		if @Project.isValidProject(project)
			project = angular.fromJson(project)
			project.forked = false
			project.name += " (imported)"
			if project.id?
				delete project.id
			if project._id?
				delete project._id
			@Alert.success("Successfully imported recipe ...! #{project.name} will appear in 'My Recipes'")
			@Project.save(project)
			@getAllProjects()
		else		
			@Alert.error("Not a valid Recipe...!!")

	favourite:(recipe)->
		if recipe._id?
			@Baazar.favourite(@user._id,recipe.id).then(
				()=>
					recipe.favourited = yes
					@Project.save(recipe)
			,	
				()=>
					Alert.error("An army of heavily trained monkeys is dispatched to deal with situation...hang in there...!!")
			)
		else
			@Alert.error("You thought we are that dumb....!! Move on dude...")
		
MonkeyWrench.controller 'HomeController',HomeController
