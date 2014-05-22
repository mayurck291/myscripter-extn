MonkeyWrench = angular.module( 'MonkeyWrench' );
MonkeyWrench.directive( 'fileimport', function ( ) {
    return {
        scope: {
            // onfileselect: "&"
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
                        $scope.$parent.onselect( contents );
                    }
                    r.readAsDataURL( f );
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
