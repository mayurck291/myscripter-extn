// var obj = {
//     'autoApply': true,
//     'external': {
//         'js': [],
//         'css': []
//     },
//     'js': 'alert("hello");',
//     'css': ''
// };

chrome.browserAction.onClicked.addListener( function ( tab ) {
    myScripter( tab, true );
} );

chrome.tabs.onUpdated.addListener( function ( tabId, changeInfo, tab ) {
    try {
        if ( changeInfo.status == 'complete' ) {
            myScripter( tab, false );
        }
    } catch ( err ) {
        console.log( 'some error::' + err.message );
    }
} );

// function console.log( stmt ) {
//     console.log( "******myscripter:: " );
//     console.log( stmt );
// }

function myScripter( tab, popUpClicked ) {
    console.log( tab );
    tabId = tab.id;
    var prjmyindexes_9 = $.jStorage.get( 'prjmyindexes_9' );
    // var arr = tab.url.split('://');

    url_regexes = Object.keys( prjmyindexes_9 );

    var ext_js_func = function ( tabId, ext_js ) {
        console.log( "******JAY MATA DEE******" )
        chrome.tabs.executeScript( tabId, {
            code: ext_js
        }, function ( ) {
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

        $.each( prjmyindexes_9[ regex_url ], function ( key, value ) {
            var idsx = parseInt( value, 10 );
            console.log( "[start] gettng data for " + idsx );
            var d = $.jStorage.get( idsx );
            console.log( d );
            console.log( "[end] gettng data for " + idsx );

            // when url is matched against localstorage

            if ( false === d.autoApply && false == popUpClicked ) {
                console.log( cur_regex + " - url has autoApply as false." );
                return false;
            }

            ext_js_code = '\nvar myScripterI=0;\n inline_js_func=function(){var script = document.createElement("script");script.textContent = ' + d.js + ';document.body.appendChild(script);};';
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
                }, function ( ) {
                    console.log( 'inline css insertion completed' );
                } );
            }
        } );


    } );
}
