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
			when "success" 
				@alert.class= @classSuccess
				@alert.type = msgType
			when "error" 
				@alert.class= @classError
				@alert.type = msgType
			when "warning" 
				@alert.class= @classWarning
				@alert.type = msgType
			else 
				@alert.class    = "" 
				@alert.msg      = ""
				@alert.show     = no
		#hide alert after
		if @timeout.cancel(@promise)
			@promise = @timeout @hide,time
		else
			@promise = @timeout @hide,time
		return

	bind:()=> return @alert

	hide:()=>
		@helper(null,null,null)

	success:( msg )=>
		@helper "success",msg,2000
	
	error:( msg )=>
		@helper "error",msg,3000
	
	warning:( msg )=>
		@helper "warning",msg,2000
	

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
