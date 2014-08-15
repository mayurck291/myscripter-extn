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
        } else if ( request.command == "MW-INJECT" ) {
            console.log( "rqst recvd", request, sender.tab, sender.tab.url );
            injectProject( sender.tab.id, request.pid );
        } else if ( request.command == "MW-INJECT-ALL" ) {
            console.log( "rqst recvd", request, sender.tab, sender.tab.url );
            myScripter( sender.tab, true );
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
            if ( projectIds.length ) {
                projects = getProjects( projectIds );
                window.localStorage[ tab.url ] = JSON.stringify( projects );
            };
        }
    } catch ( err ) {
        console.log( 'some error::' + err.message );
    }
} );


function myScripter( tab, popUpClicked ) {
    tabId = tab.id;
    var prjmyindexes_9 = $.jStorage.get( 'prjmyindexes_9' );
    url_regexes = Object.keys( prjmyindexes_9 );

    // loop through localstorage to match url
    $.each( url_regexes, function ( u, regex_url ) {
        var cur_regex = new RegExp( regex_url );
        console.log( cur_regex );
        if ( !cur_regex.test( tab.url ) ) {
            return true;
        }
        var allProjects = prjmyindexes_9[ regex_url ].length;
        console.log( "pids", allProjects );
        for ( i = 0; i < allProjects; i++ ) {
            value = prjmyindexes_9[ regex_url ][ i ]
            var pid = parseInt( value, 10 );
            injectProject( tabId, pid );
        }
    } );
}

function injectProject( tabId, projectId ) {
    console.log( "[start] gettng data for ", projectId );
    var project = $.jStorage.get( projectId );
    console.log( project );
    console.log( "[end] gettng data for ", projectId );

    if ( false === project.enabled ) {
        console.log( project.url, " - url has enabled as false." );
    }
    if ( false === project.autoApply ) {
        console.log( projec.url, " - url has autoApply as false." );
    }

    un = [ "", undefined, null ];
    var inline_js = null;
    var rexp = /^\s*$/;
    if ( un.indexOf( project.js ) == -1 && ( false == rexp.test( project.js ) ) ) {
        inline_js = project.js;
        inline_js = inline_js.replace( /\n/g, ";" )
            .replace( /\"/g, '\\"' )
            .replace( /'/g, "\\'" );
    } else {
        inline_js = "console.log('No inline js ')";
    }
    console.log( "=========inline_js==========" );
    console.log( inline_js );
    console.log( "=======================" );
    ext_js_code = '\nvar myScripterI=0;\n inline_js_func=function(){var script = document.createElement("script");script.textContent = "' + inline_js + '";document.body.appendChild(script);};';
    console.log( ext_js_code );
    ext_js_flag = false;

    $.each( project.external.js, function ( u, v ) {
        ext_js_flag = true;
        ext_js_code += 'var s;\ns = document.createElement("script");\nmyScripterI +=1;\ns.src = "' + v + '";\ndocument.body.appendChild(s);\ns.onload=function(){\nmyScripterI-= 1;\nconsole.log("script loaded " +"' + v + '");\nif(myScripterI == 0){\nconsole.log("execute inline js code ");\n\n inline_js_func();}};\n\n';
    } );

    $.each( project.external.css, function ( u, v ) {
        ext_js_code += 'var s;\nl = document.createElement("link");\n l.setAttribute("rel", "stylesheet");l.setAttribute("type", "text/css");l.setAttribute("href", "' + v + '");\ndocument.body.appendChild(l);';
    } );

    if ( "" !== ext_js_code ) {
        if ( false == ext_js_flag )
            ext_js_code += "\n setTimeout(inline_js_func,0);";

        console.log( 'this is my js code ' );
        console.log( ext_js_code );
        executeScript( tabId, ext_js_code );
    }

    if ( "" !== project.css ) {
        chrome.tabs.insertCSS( tabId, {
            code: project.css,
            runAt: 'document_start'
        }, function () {
            console.log( 'inline css insertion completed' );
        } );
    }
}

var executeScript = function ( tabId, ext_js ) {
    chrome.tabs.executeScript( tabId, {
        code: ext_js
    }, function () {
        console.log( 'External JS insertion completed' );
    } );
};
