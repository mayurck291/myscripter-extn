MonkeyWrench = angular.module 'MonkeyWrench',['ngRoute','AuthModule', 'BaazarModule']
MonkeyWrench.config ['$routeProvider','$locationProvider',
($routeProvider,$locationProvider)->
	$routeProvider.
		when '/Baazar',
			templateUrl:'/html/partials/baazar.html',
			controller:'BaazarController'
			resolve:
				recipes:(Baazar)->
					Baazar.get()
	$locationProvider.html5Mode(false).hashPrefix('!');
	return
]
