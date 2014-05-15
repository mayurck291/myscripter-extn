'use strict';

window.onload = googlePlusUserLoader.onload;



GPAuthentication = angular.module( "GPAuthentication", [ ] );
GPAuthentication.factory( 'AuthService', [ '$http',
    function ( $http ) {
        var STATE_START = 1;
        var STATE_ACQUIRING_AUTHTOKEN = 2;
        var STATE_AUTHTOKEN_ACQUIRED = 3;

        var state = STATE_START;

        var signin_button, xhr_button, revoke_button, user_info_div;

        function disableButton( button ) {
            button.setAttribute( 'disabled', 'disabled' );
        }

        function enableButton( button ) {
            button.removeAttribute( 'disabled' );
        }

        function changeState( newState ) {
            state = newState;
            switch ( state ) {
            case STATE_START:
                enableButton( signin_button );
                break;
            case STATE_ACQUIRING_AUTHTOKEN:
                disableButton( signin_button );
                break;
            case STATE_AUTHTOKEN_ACQUIRED:
                disableButton( signin_button );
                break;
            }
        }

        // @corecode_begin getProtectedData

        function xhrWithAuth( method, url, interactive, callback ) {
            var access_token;

            var retry = true;

            getToken( );

            function getToken( ) {
                chrome.identity.getAuthToken( {
                    interactive: interactive
                }, function ( token ) {
                    if ( chrome.runtime.lastError ) {
                        callback( chrome.runtime.lastError );
                        return;
                    }

                    access_token = token;
                    requestStart( );
                } );
            }

            function requestStart( ) {
                var xhr = new XMLHttpRequest( );
                xhr.open( method, url );
                xhr.setRequestHeader( 'Authorization', 'Bearer ' + access_token );
                xhr.onload = requestComplete;
                xhr.send( );
            }

            function requestComplete( ) {
                if ( this.status == 401 && retry ) {
                    retry = false;
                    chrome.identity.removeCachedAuthToken( {
                            token: access_token
                        },
                        getToken );
                } else {
                    callback( null, this.status, this.response );
                }
            }
        }

        function getUserInfo( interactive ) {
            xhrWithAuth( 'GET',
                'https://www.googleapis.com/plus/v1/people/me?fields=aboutMe,circledByCount,displayName,emails,image',
                interactive,
                onUserInfoFetched );
        }
        // @corecode_end getProtectedData


        // Code updating the user interface, when the user information has been
        // fetched or displaying the error.

        function onUserInfoFetched( error, status, response ) {
            if ( !error && status == 200 ) {
                changeState( STATE_AUTHTOKEN_ACQUIRED );
                console.log( response );
                var user_info = JSON.parse( response );
                populateUserInfo( user_info );
            } else {
                changeState( STATE_START );
            }
        }

        function populateUserInfo( user_info ) {
            user_info_div.innerHTML = "Hello " + user_info.displayName;
            fetchImageBytes( user_info );
        }

        function fetchImageBytes( user_info ) {
            if ( !user_info || !user_info.image || !user_info.image.url ) return;
            var xhr = new XMLHttpRequest( );
            xhr.open( 'GET', user_info.image.url, true );
            xhr.responseType = 'blob';
            xhr.onload = onImageFetched;
            xhr.send( );
        }

        function onImageFetched( e ) {
            if ( this.status != 200 ) return;
            var imgElem = document.createElement( 'img' );
            var objUrl = window.webkitURL.createObjectURL( this.response );
            imgElem.src = objUrl;
            imgElem.onload = function ( ) {
                window.webkitURL.revokeObjectURL( objUrl );
            }
            user_info_div.insertAdjacentElement( "afterbegin", imgElem );
        }

        // OnClick event handlers for the buttons.

        /**
    Retrieves a valid token. Since this is initiated by the user
    clicking in the Sign In button, we want it to be interactive -
    ie, when no token is found, the auth window is presented to the user.

    Observe that the token does not need to be cached by the app.
    Chrome caches tokens and takes care of renewing when it is expired.
    In that sense, getAuthToken only goes to the server if there is
    no cached token or if it is expired. If you want to force a new
    token (for example when user changes the password on the service)
    you need to call removeCachedAuthToken()
  **/

        function interactiveSignIn( ) {
            changeState( STATE_ACQUIRING_AUTHTOKEN );

            // @corecode_begin getAuthToken
            // @description This is the normal flow for authentication/authorization
            // on Google properties. You need to add the oauth2 client_id and scopes
            // to the app manifest. The interactive param indicates if a new window
            // will be opened when the user is not yet authenticated or not.
            // @see http://developer.chrome.com/apps/app_identity.html
            // @see http://developer.chrome.com/apps/identity.html#method-getAuthToken
            chrome.identity.getAuthToken( {
                'interactive': true
            }, function ( token ) {
                if ( chrome.runtime.lastError ) {
                    console.log( chrome.runtime.lastError );
                    changeState( STATE_START );
                } else {
                    console.log( 'Token acquired:' + token +
                        '. See chrome://identity-internals for details.' );
                    changeState( STATE_AUTHTOKEN_ACQUIRED );
                }
            } );
            // @corecode_end getAuthToken
        }



        return {
            onload: function ( ) {
                signin_button = document.querySelector( '#signin' );
                signin_button.addEventListener( 'click', interactiveSignIn );

                xhr_button = document.querySelector( '#getxhr' );
                xhr_button.addEventListener( 'click', getUserInfo.bind( xhr_button, true ) );

                revoke_button = document.querySelector( '#revoke' );
                revoke_button.addEventListener( 'click', revokeToken );

                user_info_div = document.querySelector( '#user_info' );

                // Trying to get user's info without signing in, it will work if the
                // application was previously authorized by the user.
                getUserInfo( false );
            }
        };
    }
] );