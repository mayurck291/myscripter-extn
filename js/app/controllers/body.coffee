MonkeyWrench = angular.module 'MonkeyWrench'
class BodyController
	@$inject: ['$scope','$routeParams','$location','Baazar','GPauth','Alert','Project'] 

	constructor:(@scope,@routeParams,@location,@Baazar,@gp,@Alert,@Project)->
		@scope.alert 		= @Alert.bind()
		@scope.signIn 		= @signIn
		@scope.signOut 		= @signOut
		# check if user is signed in 
		# if Yes get  userinfo
		projects = @Project.getAll()
		@scope.projectIds = []
		for project_url,ids of projects
			@scope.projectIds.push ids...

		@scope.allProjects = []

		for id in @scope.projectIds
			@scope.allProjects.push Project.get(id)

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
		,300  

		#### Functions ####### 
		@scope.save = @save
		@scope.edit = @edit
		@scope.fork = @fork
		@scope.share = @share

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
		project.forked = false
		@Project.save(project)
		@Alert.success("Successfully forked ...! #{project.name} will appear in 'My Recipes'")

	share:(project)=>
		if project.forked
			@Alert.error("Can't share installed Recipe.....")
		else
			p = "/Share/"+project.id
			@location.path(p)
		
MonkeyWrench.controller 'BodyController',BodyController
