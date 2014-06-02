MonkeyWrench = angular.module 'MonkeyWrench',['ngRoute','AuthModule', 'BaazarModule','ngAnimate','Slider']
MonkeyWrench.config ['$routeProvider','$locationProvider',
($routeProvider,$locationProvider)->
	$routeProvider.when('/New'
				,templateUrl:'/html/partials/new.html'
				,controller:'NewProjectController'
				,controllerAs:'NewProject'
			).when('/Edit/:pid'
				,templateUrl:'/html/partials/edit.html'
				,controller:'EditProjectController'
				,controllerAs:'EditProject'
			).when('/Share/:pid'
				,templateUrl:'/html/partials/share.html'
				,controller:'ShareProjectController'
				,controllerAs:'ShareProject'
			).when('/Help'
				,templateUrl:'/html/partials/help.html'
				,controller:'BodyController'
			).when('/'
				,templateUrl:'/html/partials/home.html'
				,controller:'HomeController'
				,controllerAs:'Home'
			).when('/Bazaar',
			templateUrl:'/html/partials/baazar.html',
			controller:'BaazarController',
			resolve:
				recipes:['Baazar',(Baazar)->
					Baazar.get()
				]
			).otherwise(
				{redirectTo:'/'}
			)
	$locationProvider.html5Mode(false).hashPrefix('!');
	return
]

MonkeyWrench.run ['GPauth',(GPauth)->
	GPauth.load()
]