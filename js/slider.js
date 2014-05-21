var Slider = angular.module( 'Slider', [ 'ngAnimate' ] );

Slider.directive( 'slider', function ( $timeout ) {
    return {
        restrict: 'AE',
        replace: true,
        scope: {
            srcs: '@'
        },
        link: function ( scope, elem, attrs ) {
            scope.images = angular.fromJson( scope.srcs );
            var finalArray = [ ];
            scope.images.forEach( function ( link ) {
                obj = {}
                obj.src = link;
                obj.visible = false;
                finalArray.push( obj )
            } );

            scope.images = finalArray;
            scope.currentIndex = 0;

            scope.next = function ( ) {
                scope.currentIndex < scope.images.length - 1 ? scope.currentIndex++ : scope.currentIndex = 0;
            };

            scope.prev = function ( ) {
                scope.currentIndex > 0 ? scope.currentIndex-- : scope.currentIndex = scope.images.length - 1;
            };

            scope.$watch( 'currentIndex', function ( ) {
                scope.images.forEach( function ( image ) {
                    image.visible = false;
                } );
                scope.images[ scope.currentIndex ].visible = true;
            } );

            /* Start: For Automatic slideshow*/

            var timer;

            var sliderFunc = function ( ) {
                timer = $timeout( function ( ) {
                    scope.next( );
                    timer = $timeout( sliderFunc, 5000 );
                }, 5000 );
            };

            sliderFunc( );

            scope.$on( '$destroy', function ( ) {
                $timeout.cancel( timer );
            } );

            /* End : For Automatic slideshow*/

        },
        templateUrl: '/html/partials/slider.html'
    }
} );


var Slider = angular.module( 'Slider', [ 'ngAnimate' ] );

Slider.directive( 'slider', function ( $timeout ) {
    return {
        restrict: 'AE',
        replace: true,
        scope: {
            srcs: '@'
        },
        link: function ( scope, elem, attrs ) {
            scope.images = angular.fromJson( scope.srcs );
            var finalArray = [ ];
            scope.images.forEach( function ( link ) {
                obj = {}
                obj.src = link;
                obj.visible = false;
                finalArray.push( obj )
            } );

            scope.images = finalArray;
            scope.currentIndex = 0;

            scope.next = function ( ) {
                scope.currentIndex < scope.images.length - 1 ? scope.currentIndex++ : scope.currentIndex = 0;
            };

            scope.prev = function ( ) {
                scope.currentIndex > 0 ? scope.currentIndex-- : scope.currentIndex = scope.images.length - 1;
            };

            scope.$watch( 'currentIndex', function ( ) {
                scope.images.forEach( function ( image ) {
                    image.visible = false;
                } );
                scope.images[ scope.currentIndex ].visible = true;
            } );

            /* Start: For Automatic slideshow*/

            var timer;

            var sliderFunc = function ( ) {
                timer = $timeout( function ( ) {
                    scope.next( );
                    timer = $timeout( sliderFunc, 5000 );
                }, 5000 );
            };

            sliderFunc( );

            scope.$on( '$destroy', function ( ) {
                $timeout.cancel( timer );
            } );

            /* End : For Automatic slideshow*/

        },
        templateUrl: '/html/partials/slider.html'
    }
} );
