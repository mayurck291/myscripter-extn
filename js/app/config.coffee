MonkeyWrench = angular.module 'MonkeyWrench',['ngRoute','AuthModule', 'BaazarModule']
MonkeyWrench.config ['$routeProvider','$locationProvider',
($routeProvider,$locationProvider)->
	$routeProvider.when('/Baazar',
			templateUrl:'/html/partials/baazar.html',
			controller:'BaazarController',
			resolve:
				recipes:['Baazar',(Baazar)->
					Baazar.get()
				]
			).when('/New'
				,templateUrl:'/html/partials/new.html'
				,controller:'NewProjectController'
			).when('/'
				,templateUrl:'/html/partials/home.html'
				,controller:'BodyController'
			)
	$locationProvider.html5Mode(false).hashPrefix('!');
	return
]

MonkeyWrench.run ['GPauth',(GPauth)->
	GPauth.load()
]