var mwSidePanIframe = window.mwSidePanIframe;

function createIframe() {
	mwSidePanIframe = document.createElement( 'iframe' )
	mwSidePanIframe.src = chrome.extension.getURL( 'html/mw-sidepan.html' );
	mwSidePanIframe.id = "mw_sidepan";
	mwSidePanIframe.style.position = "fixed";
	mwSidePanIframe.style.top = "0";
	mwSidePanIframe.style.right = "0";
	mwSidePanIframe.style.bottom = "0";
	mwSidePanIframe.style.width = "20%";
	mwSidePanIframe.style.height = "100%";
	mwSidePanIframe.style.border = "0";
	mwSidePanIframe.style.background = "white";
	mwSidePanIframe.style.border = "1px solid black";
	mwSidePanIframe.style.borderRadius = "2px";
	mwSidePanIframe.style.zIndex = "99999999999999999999999999999";
	mwSidePanIframe.style.display = "none";
	document.body.appendChild( mwSidePanIframe );
}

function toggleMWSidePan( mwSidePanIframe ) {
	if ( mwSidePanIframe.style.display == "none" ) {
		mwSidePanIframe.style.display = "";
	} else {
		mwSidePanIframe.style.display = "none";
	}
}

if ( window.top === window ) {

	// Inject the bridge script
	// var inspectorScript = document.createElement( 'script' );
	// inspectorScript.type = 'text/javascript';
	// inspectorScript.src = chrome.extension.getURL( 'js/mw-sidepan.js' );
	// document.head.appendChild( inspectorScript );
	createIframe();

	// In Chrome, we use this thing
	if ( 'chrome' in window ) {
		chrome.runtime.onMessage.addListener( function ( message, sender ) {
			if ( message.command && message.command === 'MW' ) {
				toggleMWSidePan( document.getElementById( "mw_sidepan" ) );
			}
			if ( message.command && message.command === 'MW-PRJS' ) {
				window.localStorage[ 'projects' ] = JSON.stringify( message.projects );
			}
		} );
	}
}
