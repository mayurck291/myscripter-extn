var obj = {
    'autoApply': true,
    'external': {
        'js': [],
        'css': []
    },
    'js': 'alert("hello");',
    'css': ''
};

chrome.browserAction.onClicked.addListener(function(tab) {
    myScripter(tab,true);
});

chrome.tabs.onUpdated.addListener(function(tabId, changeInfo, tab) {
    try {
        if (changeInfo.status == 'complete') {
            myScripter(tab,false);
        }
    } catch (err) {
        logger('some error::' + err.message);
    }
});

function logger(stmt) {
    console.log("******myscripter:: ");
    console.log(stmt);
}

function myScripter(tab,popUpClicked) {
	logger(tab);
    tabId = tab.id;
    urls = $.jStorage.index();
    var arr = tab.url.split('://');

    var ext_js_func = function(tabId, ext_js) {
        chrome.tabs.executeScript(tabId, {
            code: ext_js
        }, function() {
            logger('External JS insertion completed');
        });
    };

    // loop through localstorage to match url
    $.each(urls, function(u, v) {
        // when url is matched against localstorage
        if (v == arr[1]) {
            d = JSON.parse($.jStorage.get(v));
            if( false === d.autoApply && false == popUpClicked){
            	logger(v+" - url has autoApply as false.");
            	return false; 
            }

            ext_js_code = '\nvar myScripterI=0;\n inline_js_func=function(){var script = document.createElement("script");script.textContent = "' + d.js + '";document.body.appendChild(script);};';
            $.each(d.external.js, function(u, v) {
                ext_js_code += 'var s;\ns = document.createElement("script");\nmyScripterI +=1;\ns.src = "' + v + '";\ndocument.body.appendChild(s);\ns.onload=function(){\nmyScripterI-= 1;\nconsole.log("script loaded " +"' + v + '");\nif(myScripterI == 0){\nconsole.log("execute inline js code ");\n\n inline_js_func();}};\n\n';
            });

            $.each(d.external.css, function(u, v) {
                ext_js_code += 'var s;\nl = document.createElement("link");\n l.setAttribute("rel", "stylesheet");l.setAttribute("type", "text/css");l.setAttribute("href", "' + v + '");\ndocument.body.appendChild(l);';
            });

            if ("" !== ext_js_code) {
                ext_js_func(tabId, ext_js_code);
            }

            if ("" !== d.css) {
                chrome.tabs.insertCSS(tabId, {
                    code: d.css,
                    runAt: 'document_start'
                }, function() {
                    logger('inline css insertion completed');
                });
            }
        }
    });
}
