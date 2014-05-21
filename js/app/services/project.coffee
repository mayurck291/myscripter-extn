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
			autoApply:no

	nextSequence:->
		seq = localStorage.getItem 'sequence'
		if seq?
			localStorage.set( 'sequence', seq + 1 )
			return seq
		else
			localStorage.set( 'sequence', 2 )
			return 1

	getIndices:->
		indexes = localStorage.get( 'prjmyindexes_9' )
		if indexes?
			return indexes
		else
			return {}  

	saveIndices:->( indexes ) {
		localStorage.setItem( 'prjmyindexes_9', indexes )

	saveProject :( id, project )->
		localStorage.setItem( id, project )
		@Alert.success( "Hurrah.!! Project saved successfully" )

	save: ( project ,old_url)->
 
		if not project.id?
			project.id = nextSequence( )

		saveProject( project.id, project )

		all_indexes = @getIndices( )

		cur_url = project.url

		if not all_indexes[ cur_url ]?
			all_indexes[ cur_url ] = [ ]

		if not old_url?
			old_url = cur_url

		if all_indexes[ cur_url ].indexOf( project.id ) is -1
			all_indexes[ cur_url ].push( project.id )

		if cur_url isnt old_url and all_indexes[ old_url ] and all_indexes[ old_url ].indexOf( project.id ) > -1
			all_indexes[ old_url ].splice( all_indexes[ old_url ].indexOf( project.id ), 1 )

		saveIndices( all_indexes )
		return

	delete_project:(project)->
		all_indexes = getIndices( )
		localStorage.removeItem( project.id )
		all_indexes[ project.url ].splice( all_indexes[ project.url ].indexOf( $scope.cur_project.id ), 1 )
		saveIndices( all_indexes )