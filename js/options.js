// $( document ).ready( function ( ) {
//     var obj = {
//         a: 123,
//         b: "4 5 6"
//     };

//     var data = "text/json;charset=utf-8," + encodeURIComponent( JSON.stringify( obj ) );

//     $( '<a type="button" class="btn btn-info" href="data:' + data + '" download="parin.json">Export</a>' ).appendTo( '#download' );

// } );
// var MyScriptsModule = angular.module('MyScriptsModule', []);

function MyScriptsController( $scope ) {
    $scope.view_mode = 'search_mode';
    $( '.alert_box' ).hide( );


    $scope.create_new = function ( ) {
        $scope.cur_project = {
            name: '',
            url: '',
            external: {
                js: [ ],
                css: [ ]
            },
            js: '',
            css: '',
            enabled: true,
            autoApply: false
        };

        $scope.view_mode = 'edit_mode';
        $scope.cur_project_old_url = undefined;
    };

    $scope.add_custom_js = function ( ) {
        var custom_url = $scope.custom_js;
        if ( nullOrEmpty( custom_url ) ) {
            return;
        }

        $scope.cur_project.external.js.push( custom_url );
        $scope.custom_js = undefined;
    };

    $scope.add_custom_css = function ( ) {
        var custom_url = $scope.custom_css;
        if ( nullOrEmpty( custom_url ) ) {
            return;
        }

        $scope.cur_project.external.css.push( custom_url );
        $scope.custom_css = undefined;
    };

    $scope.remove_external_js = function ( key ) {
        $scope.cur_project.external.js.splice( key, 1 );
    };

    $scope.remove_external_css = function ( key ) {
        $scope.cur_project.external.css.splice( key, 1 );
    };

    $scope.move_up = function ( key, array ) {
        var value = array[ key ];
        array[ key ] = array[ key - 1 ];
        array[ key - 1 ] = value;
    };

    $scope.move_down = function ( key, array ) {
        var value = array[ key ];
        array[ key ] = array[ key + 1 ];
        array[ key + 1 ] = value;
    };

    function nullOrEmpty( input ) {
        return [ '', undefined, null ].indexOf( input ) > -1;
    }

    $scope.save_project = function ( ) {
        if ( nullOrEmpty( $scope.cur_project.name ) || nullOrEmpty( $scope.cur_project.url ) ) {
            alert( "Project NAME and URL can not be empty. !!" );
            return;
        }

        if ( nullOrEmpty( $scope.cur_project.id ) ) {
            $scope.cur_project.id = get_sequence( );
        }

        save_project( $scope.cur_project.id, $scope.cur_project );

        var all_indexes = get_all_indexes( );

        var cur_url = $scope.cur_project.url;

        if ( nullOrEmpty( all_indexes[ cur_url ] ) ) {
            all_indexes[ cur_url ] = [ ];
        }

        if ( nullOrEmpty( $scope.cur_project_old_url ) ) {
            $scope.cur_project_old_url = cur_url;
        }

        if ( all_indexes[ cur_url ].indexOf( $scope.cur_project.id ) == -1 ) {
            all_indexes[ cur_url ].push( $scope.cur_project.id );
        }

        if ( cur_url != $scope.cur_project_old_url && all_indexes[ $scope.cur_project_old_url ] && all_indexes[ $scope.cur_project_old_url ].indexOf( $scope.cur_project.id ) > -1 ) {
            all_indexes[ $scope.cur_project_old_url ].splice( all_indexes[ $scope.cur_project_old_url ].indexOf( $scope.cur_project.id ), 1 );
        }

        save_all_indexes( all_indexes );

    };

    $scope.delete_project = function ( ) {
        if ( !confirm( 'Are you sure you want to delete this project?' ) ) {
            return;
        }

        var all_indexes = get_all_indexes( );
        $.jStorage.deleteKey( $scope.cur_project.id );
        all_indexes[ $scope.cur_project_old_url ].splice( all_indexes[ $scope.cur_project_old_url ].indexOf( $scope.cur_project.id ), 1 );
        save_all_indexes( all_indexes );

        $scope.close_screen( );
    };

    $scope.get_project = function ( id ) {
        $scope.cur_project = $.jStorage.get( id );
        $scope.cur_project_old_url = $scope.cur_project.url;
        $scope.view_mode = 'edit_mode';
    };

    $scope.close_screen = function ( ) {
        get_all_project_names( );
        $scope.view_mode = 'search_mode';
    };

    function get_all_projects( ) {
        return nullOrEmpty( $.jStorage.get( 'prjmyscripts_9' ) ) ? {} : $.jStorage.get( 'prjmyscripts_9' );
    }

    function get_all_project_names( ) {
        var prjmyindexes_9 = nullOrEmpty( $.jStorage.get( 'prjmyindexes_9' ) ) ? {} : $.jStorage.get( 'prjmyindexes_9' );

        var project_ids = [ ];
        for ( url in prjmyindexes_9 ) {
            var arr = prjmyindexes_9[ url ];
            project_ids = project_ids.concat( arr );
        }

        var project_names = [ ];
        project_ids.forEach( function ( id ) {
            var project = $.jStorage.get( id );

            var cur_project = {};
            cur_project.id = project.id;
            cur_project.name = project.name;
            cur_project.url = project.url;
            cur_project.enabled = project.enabled;

            project_names.push( cur_project );
        } );

        $scope.all_project_names = project_names;

    };

    get_all_project_names( );

    $scope.have_projects = function ( ) {
        return $scope.all_project_names.length != 0;
    };

    $scope.toggle_status = function ( project ) {
        $scope.get_project( project.id );
        $scope.cur_project.enabled = !$scope.cur_project.enabled;
        $scope.save_project( );
        $scope.close_screen( );
    };

    function save_all_projects( projects ) {
        $.jStorage.set( 'prjmyscripts_9', projects );
    }

    function save_project( id, project ) {
        $.jStorage.set( id, project );
        $( '.alert_box' ).show( );

        setTimeout( function ( ) {
            $( '.alert_box' ).hide( );
        }, 2500 );
        return true;
    }

    function get_all_indexes( ) {
        return nullOrEmpty( $.jStorage.get( 'prjmyindexes_9' ) ) ? {} : $.jStorage.get( 'prjmyindexes_9' );
    }

    function save_all_indexes( indexes ) {
        $.jStorage.set( 'prjmyindexes_9', indexes );
    }

    $scope.show_help = function ( ) {
        $( '#modal_help' ).modal( 'show' );
    };

    function get_sequence( ) {
        var seq = $.jStorage.get( 'sequence' );
        if ( nullOrEmpty( seq ) ) {
            $.jStorage.set( 'sequence', 1 );
            return 1;
        } else {
            $.jStorage.set( 'sequence', seq + 1 );
            return seq;
        }
    }

    $scope.handleKeyBoardEvent = function ( ) {
        if ( event.ctrlKey || event.metaKey ) {
            // console.log( String.fromCharCode( event.which ).toLowerCase( ) )
            switch ( String.fromCharCode( event.which ).toLowerCase( ) ) {
            case 's':
                if ( $scope.view_mode === "edit_mode" ) {
                    $scope.save_project( );
                    event.preventDefault( );
                }
                break;
            case 'p':
                event.preventDefault( );
                $scope.create_new( );
                break;
            case 'h':
                event.preventDefault( );
                $scope.close_screen( );
                break;
            }
        }
    }
    $scope.exportProject = function ( id ) {
        // export monkey
        var projects = get_all_projects( );
        var data = "data:text/json;charset=utf-8," + encodeURIComponent( JSON.stringify( projects ) );
        window.open( "_blank", data );
        $scope.settings = data;
        var data = $scope.get_project( id )
    }

};
