class Project
	constructor:(@Alert)->

	new:()->
		template = 
			name	:null,
			url		:null,
			external:
				js	:[],
				css :[]
			js		:null,
			css 	:null,
			enabled :yes,
			autoApply:yes,
			forked	:false

	isEmpty:(value)->
		[null,undefined,""].indexOf(value) > -1

	nextSequence:->
		seq = $.jStorage.get('sequence')
		if seq?
			$.jStorage.set( 'sequence', seq + 1 )
			return seq
		else
			$.jStorage.set( 'sequence', 2 )
			return 1

	getIndices:->
		indexes = $.jStorage.get( 'prjmyindexes_9' )
		if indexes?
			return indexes
		else
			return {}  

	saveIndices:( indexes )->
		$.jStorage.set( 'prjmyindexes_9', indexes )

	saveProject :( id, project )->
		$.jStorage.set( id, project )
		# @Alert.success( "Hurrah.!! Project saved successfully" )

	save: ( project ,old_url)->
		if @isEmpty(project.id)
			project.id = @nextSequence( )
		# console.log("saving project",project)
		@saveProject( project.id, project )

		all_indexes = @getIndices( )
		# console.log("all indices",all_indexes)

		cur_url = project.url

		# console.log("is empty index for #{cur_url}")
		if @isEmpty(all_indexes[ cur_url ])
			all_indexes[ cur_url ] = [ ]

		# console.log("empty old url to #{cur_url}")
		if @isEmpty(old_url)
			old_url = cur_url

		# console.log("check index of #{project.id} in #{cur_url} index #{all_indexes[cur_url]}")
		if all_indexes[ cur_url ].indexOf( project.id ) is -1
			all_indexes[ cur_url ].push( project.id )

		# console.log("after update #{project.id} in #{cur_url} index #{all_indexes[cur_url]}")

		if cur_url isnt old_url and all_indexes[ old_url ] and all_indexes[ old_url ].indexOf( project.id ) > -1
			all_indexes[ old_url ].splice( all_indexes[ old_url ].indexOf( project.id ), 1 )

		# console.log("if edition remove old entry from indices #{project.id} in old url #{old_url} index #{all_indexes[old_url]}")
		@saveIndices( all_indexes )
		return project.id

	delete:(project)->
		all_indexes = @getIndices( )
		$.jStorage.deleteKey( project.id )
		all_indexes[ project.url ].splice( all_indexes[ project.url ].indexOf( project.id ), 1 )
		@saveIndices( all_indexes )
		return

	get:( id )->
		return $.jStorage.get( id );

	getAll:->
		projects = $.jStorage.get( 'prjmyindexes_9' ) 
		if projects isnt null and projects isnt undefined
			return projects
		else
			return {}

	isValidProject:(Project)=>
		@fields = ['name','url','external','js','css','enabled','autoApply','forked']		
		projectKeys = Object.keys(Project)
		for key in @fields
			if projectKeys.indexOf(key) is -1
				return no
		return yes		

MonkeyWrench = angular.module 'MonkeyWrench'
MonkeyWrench.service 'Project',['Alert',Project]