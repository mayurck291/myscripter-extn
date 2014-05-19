RequestInterceptor = angular.module 'RequestInterceptor', [ ]
.config ( $httpProvider )->
        $httpProvider.interceptors.push( 'requestInterceptor' );
.factory 'requestInterceptor',( $q, $rootScope )->
    def = 
        'response': ( response )->
                console.log( "[ HTTP => INTERCEPTOR => SUCCESS ]", response )
                return response || $q.when( response );
    return def
