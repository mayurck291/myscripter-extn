var mwApp = angular.module( 'mwApp', [] );
mwApp.service( 'ChromeApi', [ '$q', ChromeApi ] );
mwApp.config( [
	'$compileProvider',
	function ( $compileProvider ) {
		$compileProvider.aHrefSanitizationWhitelist( /^\s*(https?|ftp|mailto|chrome-extension):/ );
	}
] );

function ChromeApi( q ) {
	this.q = q;
};
ChromeApi.prototype.onMessage = function () {
	defer = this.q.defer();
	if ( 'chrome' in window ) {
		chrome.runtime.onMessage.addListener( function ( message, sender ) {
			if ( message.command && message.command === 'MW' ) {
				defer.resolve( message );
			}
		} );
	}
	return defer.promise;
}

ChromeApi.prototype.sendMessage = function ( message ) {
	chrome.runtime.sendMessage( message, function ( response ) {
		console.log( "from extension", response.status );
	} );
}

function mwController( $scope, ChromeApi ) {
	$scope.pageURL = "";
	var message;
	$scope.projects = [];
	$scope.getOptionPageUrl = function () {
		return ( chrome.extension.getURL( 'html/options2.html' ) + "#!/New/" + $scope.url )
	}

	function listen() {
		ChromeApi.onMessage()
			.then( function ( message ) {
				$scope.projects = message.projects;
				$scope.url = message.url;
				listen();
			} );
	}
	listen();
	$scope.inject = function ( project ) {
		message = {};
		message.command = "MW-INJECT";
		message.pid = project.id;
		project.injected = true;
		ChromeApi.sendMessage( message );
	}
	$scope.injectAll = function () {
		message = {};
		message.command = "MW-INJECT-ALL";
		ChromeApi.sendMessage( message );
		$scope.allInjected = true;
		for ( var i = $scope.projects.length - 1; i >= 0; i-- ) {
			$scope.projects[ i ].injected = true;
		};
	}
	$scope.hide = function () {
		parent.toggleMWSidePan();
	}
}
