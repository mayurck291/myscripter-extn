var mwApp = angular.module( 'mwApp', [] );
mwApp.value( 'projects', [] );

( function () {
	chrome.runtime.onMessage.addListener( function ( message, sender ) {
		if ( message.command && message.command === 'MW' ) {
			window.localStorage[ "projects" ] = JSON.stringify( message.projects );
			console.log( message.projects );
		}
	} );

} )();

// sendMessage( {
// 	command: "MW",
// 	name: "parin",
// 	projects: message.projects
// } );

// function sendMessage( message ) {
// 	console.log( "from iframe", "sending msg ", message );
// 	chrome.runtime.sendMessage( message, function ( response ) {
// 		console.log( "from iframe", response.status );
// 	} );
// }
// console.log( "from iframe", "mw-sidepan injected", window.localStorage[ "prjmyindexes_9" ] )

var projects = [ {
	name: "parin"
} ];

function mwController( $scope, projects ) {
	console.log( $.jStorage.get( "1" ) );
	if ( localStorage[ "projects" ] === undefined ) {
		localStorage[ "projects" ] = JSON.stringify( [] );
	};

	$scope.getProjects = function () {
		len = JSON.parse( localStorage[ "projects" ] ).length;
		console.log( len )
		return len;
	}
	$scope.$watch( $scope.getProjects, function () {
		$scope.projects = $scope.getProjects();
	} );
}
