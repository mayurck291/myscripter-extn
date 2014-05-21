MonkeyWrench = angular.module 'MonkeyWrench'

class Alert
	@$inject = ["$timeout"]
	constructor : (@timeout)->
		@classError     = "alert alert-danger"
		@classSuccess   = "alert alert-success"
		@classWarning   = "alert alert-warning"
		@alert =
			msg 	: null
			class 	: null
			show  	: no
		return

	helper :(msgType,msg,time)->
		@alert.msg  = msg
		@alert.show = yes
		switch msgType
			when "success" then @alert.class= @classSuccess
			when "error" then @alert.class= @classError
			when "warning" then @alert.class= @classWarning
			else 
				@alert.class    = "" 
				@alert.msg      = ""
				@alert.show     = no
		#hide alert after
		@timeout @hide,time
		return

	bind:()=> return @alert

	hide:()=>
		@helper(null,null,null)

	success:( msg )=>
		@helper "success",msg,4000
	
	error:( msg )=>
		@helper "error",msg,5500
	
	warning:( msg )=>
		@helper "warning",msg,4000
	

MonkeyWrench.service "Alert",["$timeout",Alert]

class AlertBox
	@$inject = ["Alert"]
	constructor:(@Alert)-> return @

	restrict: "E"
	transclude: true
	template: "<div data-ng-transclude></div>",
	controller: ["$scope","Alert",( $scope, Alert )->
		$scope.alert = Alert.bind( )
	]

MonkeyWrench.directive "alert",["Alert",AlertBox]			

# MyScriptsModule.directive "alert",["Alert",( Alert )->
# 	restrict: "E",
# 	transclude: true,
# 	template: "<div data-ng-transclude></div>",
# 	controller: ( $scope, Alert )->
# 		$scope.alert = Alert.bind( )
# ]
