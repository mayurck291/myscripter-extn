var mwApp = angular.module( 'mwApp', [] );
mwApp.value( 'projects', [] );

function sendMessage( message ) {
	console.log( "from iframe", "sending msg ", message );
	chrome.runtime.sendMessage( message, function ( response ) {
		console.log( "from iframe", response.status );
	} );
}

function mwController( $scope, projects ) {
	var pageURL = document.location.ancestorOrigins[ 0 ];
	$scope.projects = JSON.parse( window.localStorage[ pageURL ] );
	var message;
	$scope.inject = function ( project ) {
		console.log( " this is how we roll..." );
		message = {};
		message.command = "MW-INJECT";
		message.pid = project.id;
		project.injected = true;
		sendMessage( message );
	}
	$scope.injectAll = function () {
		message = {};
		message.command = "MW-INJECT-ALL";
		sendMessage( message );
		for ( var i = $scope.projects.length - 1; i >= 0; i-- ) {
			$scope.projects[ i ].injected = true;
		};
	}
}
