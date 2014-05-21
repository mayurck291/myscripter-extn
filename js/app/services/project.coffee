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
        var seq = localStorage.getItem( 'sequence' )
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

	save: ( project )->
 
        if not project.id?
            project.id = nextSequence( )

        saveProject( $scope.cur_project.id, $scope.cur_project )

		all_indexes = @getIndices( )

        cur_url = project.url

        if not all_indexes[ cur_url ]?
            all_indexes[ cur_url ] = [ ]

        if ( nullOrEmpty( $scope.cur_project_old_url ) ) {
            $scope.cur_project_old_url = cur_url
        }

        if ( all_indexes[ cur_url ].indexOf( $scope.cur_project.id ) == -1 ) {
            all_indexes[ cur_url ].push( $scope.cur_project.id )
        }

        if ( cur_url != $scope.cur_project_old_url && all_indexes[ $scope.cur_project_old_url ] && all_indexes[ $scope.cur_project_old_url ].indexOf( $scope.cur_project.id ) > -1 ) {
            all_indexes[ $scope.cur_project_old_url ].splice( all_indexes[ $scope.cur_project_old_url ].indexOf( $scope.cur_project.id ), 1 )
        }

        saveIndices( all_indexes )
    }

    $scope.delete_project = function ( ) {
        if ( !confirm( 'Are you sure you want to delete this project?' ) ) {
            return
        }

        var all_indexes = getIndices( )
        localStorage.removeItem( $scope.cur_project.id )
        all_indexes[ $scope.cur_project_old_url ].splice( all_indexes[ $scope.cur_project_old_url ].indexOf( $scope.cur_project.id ), 1 )
        saveIndices( all_indexes )

        $scope.close_screen( )
    }

