if ( window.top === window ) {

	// Inject the bridge script
	var inspectorScript = document.createElement( 'script' );
	inspectorScript.type = 'text/javascript';
	inspectorScript.src = chrome.extension.getURL( 'js/mw-sidepan.js' );
	document.head.appendChild( inspectorScript );

	// In Chrome, we use this thing
	if ( 'chrome' in window ) {
		chrome.runtime.onMessage.addListener( function ( message, sender ) {
			if ( message.command && message.command === 'MW' ) {

				window.localStorage[ "prjmyindexes_9" ] = JSON.stringify( message.projects );
				console.log( message.projects, window.localStorage );
				window.postMessage( message, window.location.origin );
			}
		} );
	}

}
