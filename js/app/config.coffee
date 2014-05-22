MonkeyWrench = angular.module 'MonkeyWrench',['ngRoute','AuthModule', 'BaazarModule','ngAnimate','Slider']
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
			).when('/Edit/:pid'
				,templateUrl:'/html/partials/new.html'
				,controller:'EditProjectController'
			).when('/Share/:pid'
				,templateUrl:'/html/partials/share.html'
				,controller:'ShareProjectController'
			).when('/'
				,templateUrl:'/html/partials/home.html'
				,controller:'BodyController'
			).otherwise(
				{redirectTo:'/'}
			)
	$locationProvider.html5Mode(false).hashPrefix('!');
	return
]

MonkeyWrench.run ['GPauth',(GPauth)->
	GPauth.load()
]