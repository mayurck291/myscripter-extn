MonkeyWrench = angular.module 'MonkeyWrench',['ngRoute','AuthModule', 'BaazarModule']
MonkeyWrench.config ['$routeProvider','$locationProvider',
($routeProvider,$locationProvider)->
	$routeProvider.
		when '/Baazar',
			templateUrl:'/html/partials/baazar.html',
			controller:'BaazarController'
			resolve:
				recipes:['Baazar',(Baazar)->
					Baazar.get()
				]
				,userInfo:['GPauth',(GPauth)->
					GPauth.getUserInfo()
				]
			return
	$locationProvider.html5Mode(false).hashPrefix('!');
	return
]


MonkeyWrench.run ['GPauth',(GPauth)->
	GPauth.load()
]