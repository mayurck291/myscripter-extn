var mwSidePanIframe = window.mwSidePanIframe;
var mwWrapperDiv = window.mwWrapperDiv;

function createIframe() {
	mwWrapperDiv = document.createElement( 'div' );
	mwWrapperDiv.id = 'mw_sidepan_div';
	mwWrapperDiv.classList.add( 'magictime' );
	mwWrapperDiv.style.display = "none";
	mwWrapperDiv.style.position = "fixed";
	mwWrapperDiv.style.top = "0";
	mwWrapperDiv.style.right = "-350px";
	mwWrapperDiv.style.bottom = "0";
	mwWrapperDiv.style.width = "350px";
	mwWrapperDiv.style.height = "100%";
	mwWrapperDiv.style.border = "0";
	mwWrapperDiv.style.background = "white";
	mwWrapperDiv.style.zIndex = "99999999999999999999999999999";
	mwWrapperDiv.style.boxSizing = "border-box !important";
	mwWrapperDiv.style.boxShadow = "-14px 0px 30px 0px rgba(50, 50, 50, 0.15)";

	mwSidePanIframe = document.createElement( 'iframe' );
	mwSidePanIframe.src = chrome.extension.getURL( 'html/mw-sidepan.html' );
	mwSidePanIframe.style.position = "fixed";
	mwSidePanIframe.style.top = "0";
	mwSidePanIframe.style.right = "0";
	mwSidePanIframe.style.bottom = "0";
	mwSidePanIframe.style.width = "100%";
	mwSidePanIframe.style.height = "100%";
	mwSidePanIframe.style.border = "0";
	mwSidePanIframe.style.background = "white";
	mwSidePanIframe.style.overflow = "hidden";
	mwSidePanIframe.id = "mw_sidepan";
	mwSidePanIframe.name = "mw_sidepan";

	mwWrapperDiv.appendChild( mwSidePanIframe );
	document.body.appendChild( mwWrapperDiv );
}

var clear;

function toggleMWSidePan( div ) {
	if ( div.style.display == "none" ) {
		clearTimeout( clear );
		div.classList.add( 'slideLeft' );
		div.classList.remove( 'slideRight' );
		div.style.display = "";
	} else {
		div.classList.remove( 'slideLeft' );
		div.classList.add( 'slideRight' );
		clear = setTimeout( function () {
			div.style.display = "none";
		}, 300 );
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
				toggleMWSidePan( document.getElementById( "mw_sidepan_div" ) );
			}
		} );
	}
}
