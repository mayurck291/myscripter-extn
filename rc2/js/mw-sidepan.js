var mwApp = angular.module( 'mwApp', [] );
mwApp.value( 'projects', [] );

function sendMessage( message ) {
	console.log( "from iframe", "sending msg ", message );
	chrome.runtime.sendMessage( message, function ( response ) {
		console.log( "from iframe", response.status );
	} );
}

// console.log( "from iframe", "mw-sidepan injected", window.localStorage[ "prjmyindexes_9" ] )

function mwController( $scope, projects ) {
	$scope.projects = JSON.parse( window.localStorage[ 'projects' ] );
	var message;
	$scope.inject = function ( project ) {
		message = {};
		message.command = "MW-INJECT";
		message.project = project;
		project.injected = true;
		// sendMessage( message );
	}
}
