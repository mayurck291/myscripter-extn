MonkeyWrench = angular.module( 'MonkeyWrench' );
MonkeyWrench.directive( 'fileimport', function ( ) {
    return {
        scope: {
            // onfileselect: "&"
        },
        controller: function ( $scope, $element, $attrs, $transclude ) {
            $scope.imgs = [ ]
            $scope.handleFileSelect = function ( evt ) {
                $scope.filesData = [ ];
                var files = evt.target.files; // FileList object
                // console.log( files );
                for ( i = 0; i < files.length; i++ ) {
                    var f = files[ i ];
                    if ( f ) {
                        var r = new FileReader( );
                        r.onload = function ( e ) {
                            $scope.$apply( function ( ) {
                                var img = {}
                                img.data = e.target.result
                                img.name = f.name
                                $scope.imgs.push( img );
                            } );
                        }
                        r.readAsDataURL( f );
                    }
                }

            }

            $scope.openFile = function ( ) {
                console.log( "-------------------" );
                console.log( angular.element( document.querySelector( "#imgs" ) ) );
                angular.element( document.querySelector( "#imgs" ) )[ 0 ].click( );
            }
        },
        // require: 'ngModel', // Array = multiple requires, ? = optional, ^ = check parent elements
        restrict: 'E', // E = Element, A = Attribute, C = Class, M = Comment
        // template:
        templateUrl: '/html/partials/fileimport.html',
        replace: true,
        // transclude: true,
        // compile: function(tElement, tAttrs, function transclude(function(scope, cloneLinkingFn){ return function linking(scope, elm, attrs){}})),
        link: function ( $scope, iElm, iAttrs, controller ) {
            // var input = iElm[ 0 ];
            iElm.on( 'change', $scope.handleFileSelect );
        }
    };
} );

MonkeyWrench.directive( 'download', function ( ) {
    return {
        scope: {
            project: '='
        },
        controller: function ( $scope, $element, $attrs, $transclude ) {},
        restrict: 'E', // E = Element, A = Attribute, C = Class, M = Comment
        template: '<a></a>',
        replace: true,
        link: function ( $scope, iElm, iAttrs, controller ) {
            a = iElm[ 0 ];
            var obj = angular.copy( $scope.project );
            if ( obj.id ) {
                delete obj.id;
            }
            if ( obj._id ) {
                delete obj._id;
            }
            const MIME_TYPE = 'text/plain';
            window.URL = window.webkitURL || window.URL;

            var bb = new Blob( [ JSON.stringify( obj ) ], {
                type: MIME_TYPE
            } );

            name = obj[ 'name' ] + '.json';
            a.download = name;
            a.href = window.URL.createObjectURL( bb );
            a.innerHTML = '<span class="icon-download icc" style="margin-right:10px"></span>';
            iElm = a;
        }
    };
} );

MonkeyWrench.directive( 'import', function ( ) {
    return {
        scope: {
            callback: "&"
        },
        controller: function ( $scope, $element, $attrs, $transclude ) {
            $scope.handleFileSelect = function ( evt ) {
                $scope.filesData = [ ];
                var files = evt.target.files; // FileList object
                // console.log( files );

                var f = files[ 0 ];
                if ( f ) {
                    var r = new FileReader( );
                    r.onload = function ( e ) {
                        var contents = e.target.result;
                        $scope.callback( {
                            project: contents
                        } );
                    }
                    r.readAsText( f );
                } else {
                    alert( "Failed to load file" );
                }
            }

            $scope.openFile = function ( ) {
                console.log( "-------------------" );
                console.log( angular.element( document.querySelector( "#importjson" ) ) );
                angular.element( document.querySelector( "#importjson" ) )[ 0 ].click( );
            }
        },
        // require: 'ngModel', // Array = multiple requires, ? = optional, ^ = check parent elements
        restrict: 'E', // E = Element, A = Attribute, C = Class, M = Comment
        template: '<div class="pull-right" style="margin-bottom: 11px;"><a href="" ng-click="openFile()" style="color:#47a3da"><span class=" icon-import">&nbsp;&nbsp;Import Recipe</span><strong></strong></a><input style="display:none" type="file" accept=".json" class="btn btn-warning pull-right" name="importjson" id="importjson" title="Import Files"></div>',
        // templateUrl: '',
        replace: true,
        // transclude: true,
        // compile: function(tElement, tAttrs, function transclude(function(scope, cloneLinkingFn){ return function linking(scope, elm, attrs){}})),
        link: function ( $scope, iElm, iAttrs, controller ) {
            // var input = iElm[ 0 ];
            iElm.on( 'change', $scope.handleFileSelect );
        }
    };
} );
