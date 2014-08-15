function openOptionPage() {
    chrome.tabs.create( {
        url: "html/options.html"
    } );
}

function simulateBrowserAction() {
    chrome.tabs.getSelected( null, function ( tab ) {
        myScripter( tab, true );
    } );
}

function handleKeyBoardShortcuts( command ) {

    switch ( command ) {
    case "options":
        openOptionPage();
        break;
    case "browserAction":
        simulateBrowserAction();
        break;
    }
}
// old one
// chrome.browserAction.onClicked.addListener( function ( tab ) {
//     myScripter( tab, true );
// } );
function getFilteredUrls( tab ) {
    var prjmyindexes_9 = $.jStorage.get( 'prjmyindexes_9' ) || {};
    var url_regexes = Object.keys( prjmyindexes_9 );
    projectIds = [];
    $.each( url_regexes, function ( u, regex_url ) {
        var cur_regex = new RegExp( regex_url );
        if ( cur_regex.test( tab.url ) ) {
            projectIds = projectIds.concat( prjmyindexes_9[ regex_url ] );
        }
    } );
    return projectIds;
}

function getProjects( prids ) {
    var projects = [];
    for ( var i = prids.length - 1; i >= 0; i-- ) {
        projects = projects.concat( $.jStorage.get( prids[ i ] ) )
    };
    return projects;
}

chrome.runtime.onMessage.addListener(
    function ( request, sender, sendResponse ) {
        if ( request.command == "MW" ) {
            console.log( "rqst recvd", request, sender.tab, sender.tab.url );
            sendResponse( {
                status: "success"
            } );
        };
        if ( request.command == "MW-INJECT" ) {
            console.log( "rqst recvd", request, sender.tab, sender.tab.url );
        };
    } );

chrome.browserAction.onClicked.addListener( function ( tab ) {
    projectIds = getFilteredUrls( tab );
    projects = getProjects( projectIds );

    var message = {
        command: 'MW',
        projects: projects
    };
    chrome.tabs.query( {
        active: true,
        currentWindow: true
    }, function ( tabs ) {
        chrome.tabs.sendMessage( tabs[ 0 ].id, message );
    } );
} );

chrome.tabs.onUpdated.addListener( function ( tabId, changeInfo, tab ) {
    try {
        if ( changeInfo.status == 'complete' ) {
            console.log( 'new tab...', tab.url );
            projectIds = getFilteredUrls( tab );
            projects = getProjects( projectIds );

            var message = {
                command: 'MW-PRJS',
                projects: projects
            };
            chrome.tabs.sendMessage( tabId, message );
        }
    } catch ( err ) {
        console.log( 'some error::' + err.message );
    }
} );


function myScripter( tab, popUpClicked ) {
    // console.log( tab );
    tabId = tab.id;
    var prjmyindexes_9 = $.jStorage.get( 'prjmyindexes_9' );
    // var arr = tab.url.split('://');

    url_regexes = Object.keys( prjmyindexes_9 );

    var ext_js_func = function ( tabId, ext_js ) {
        chrome.tabs.executeScript( tabId, {
            code: ext_js
        }, function () {
            console.log( 'External JS insertion completed' );
        } );
    };

    // loop through localstorage to match url
    $.each( url_regexes, function ( u, regex_url ) {
        var cur_regex = new RegExp( regex_url );
        console.log( cur_regex );
        if ( !cur_regex.test( tab.url ) ) {
            return true;
        }
        // all projects = prjmyindexes_9[regex_url].length
        var ap = prjmyindexes_9[ regex_url ].length;
        for ( i = 0; i < ap; i++ ) {
            value = prjmyindexes_9[ regex_url ][ i ]
            var idsx = parseInt( value, 10 );
            console.log( "[start] gettng data for " + idsx );
            var d = $.jStorage.get( idsx );
            console.log( d );
            console.log( "[end] gettng data for " + idsx );

            // when url is matched against localstorage
            if ( false === d.enabled ) {
                console.log( cur_regex + " - url has enabled as false." );
                continue;
            }

            if ( false === d.autoApply && false == popUpClicked ) {
                console.log( cur_regex + " - url has autoApply as false." );
                continue;
            }

            un = [ "", undefined, null ];
            var inline_js = null;
            var rexp = /^\s*$/;
            if ( un.indexOf( d.js ) == -1 && ( false == rexp.test( d.js ) ) ) {
                inline_js = d.js;
                inline_js = inline_js.replace( /\n/g, ";" )
                    .replace( /\"/g, '\\"' )
                    .replace( /'/g, "\\'" )
            } else {
                inline_js = "console.log('No inline js ')";
            }
            console.log( "=========inline_js==========" );
            console.log( inline_js );
            console.log( "=======================" );
            // d.js = d.js.replace( /"/g, '\"' );

            ext_js_code = '\nvar myScripterI=0;\n inline_js_func=function(){var script = document.createElement("script");script.textContent = "' + inline_js + '";document.body.appendChild(script);};';

            console.log( ext_js_code );

            ext_js_flag = false;

            $.each( d.external.js, function ( u, v ) {
                ext_js_flag = true;
                ext_js_code += 'var s;\ns = document.createElement("script");\nmyScripterI +=1;\ns.src = "' + v + '";\ndocument.body.appendChild(s);\ns.onload=function(){\nmyScripterI-= 1;\nconsole.log("script loaded " +"' + v + '");\nif(myScripterI == 0){\nconsole.log("execute inline js code ");\n\n inline_js_func();}};\n\n';
            } );

            $.each( d.external.css, function ( u, v ) {
                ext_js_code += 'var s;\nl = document.createElement("link");\n l.setAttribute("rel", "stylesheet");l.setAttribute("type", "text/css");l.setAttribute("href", "' + v + '");\ndocument.body.appendChild(l);';
            } );

            if ( "" !== ext_js_code ) {
                if ( false == ext_js_flag )
                    ext_js_code += "\n setTimeout(inline_js_func,0);";

                console.log( 'this is my js code ' );
                console.log( ext_js_code );
                ext_js_func( tabId, ext_js_code );
            }

            if ( "" !== d.css ) {
                chrome.tabs.insertCSS( tabId, {
                    code: d.css,
                    runAt: 'document_start'
                }, function () {
                    console.log( 'inline css insertion completed' );
                } );
            }
        }


    } );
}
