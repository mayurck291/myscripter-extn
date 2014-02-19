var counter_tweets = 0;
var scroll_top = 0;
// var container = document.querySelector('#stream-items-id');
var msnry = {}
var repaint = false;

//     $("head")
//         .prepend("<link href='https://fonts.googleapis.com/css?family=Roboto:400,100,300,500' rel='stylesheet' type='text/css'>");
//     // $("body")
//     //     .append("<p id='flashingMsg'>Beautifying...</p>");
//     $("head")
//         .prepend("<style type=\"text/css\">\n" +
//             " .mTweet{font-family:'Roboto';font-size:1.05rem !important;font-weight:300 !important;line-height:2rem !important;margin:2rem 0 2rem 0 !important;  }\n" +
//             " .mTweetCont{ box-shadow:0 0 5px rgba(0, 0, 0, 0.4);margin-right:0.34rem;margin-bottom:1rem;float:left;font-family:'Roboto';font-size:1.14rem !important;font-weight:100 !important;}\n" +
//             " .mDashBoardCont{ font-family:'Roboto';font-size:1.15rem !important;font-weight:300 !important;line-height:2rem !important;}\n" +
//             " .separation-module{width:92% !important;}\n" +
//             " .bio { font-size: 0.9rem;font-weight: 300;font-family: 'Roboto';margin-top: 10px;margin-bottom: 10px;margin-left: 10px;}\n" +
//             " #flashingMsg{ font-family:'Roboto';font-weight:100;z-index:999;margin-left:-7rem;margin-top:-1.5rem;left:50%;top:50%;position: fixed;font-size:3rem;color:rgba(228, 14, 14, 0.70);display:none;}\n" +
//             "/* Desktops and laptops ----------- */\n" +
//             "@media only screen \n" +
//             "and (min-width : 600px) {\n" +
//             "/* Styles */\n" +
//             ".mTweetCont{width:96%;} \n" +
//             ".profile-header.profile-page-header{width:58% !important;float:left;} \n" +
//             ".content-main{width:58% !important;float:left;} \n" +
//             "}\n" +
//             "\n" +
//             "@media only screen \n" +
//             "and (min-width : 900px) {\n" +
//             "/* Styles */\n" +
//             ".mTweetCont{width:96%;} \n" +
//             ".profile-header.profile-page-header{width:63% !important;float:left;} \n" +
//             ".content-main{width:63% !important;float:left;} \n" +
//             "}\n" +
//             "\n" +
//             "@media only screen \n" +
//             "and (min-width : 1024px) {\n" +
//             "/* Styles */\n" +
//             ".mTweetCont{width:48%;} \n" +
//             ".profile-header.profile-page-header{width:68% !important;float:left;} \n" +
//             ".content-main{width:68% !important;float:left;} \n" +
//             "}\n" +
//             "@media only screen \n" +
//             "and (min-width : 1224px) {\n" +
//             "/* Styles */\n" +
//             ".mTweetCont{width:48%;} \n" +
//             ".profile-header.profile-page-header{width:75% !important;float:left;} \n" +
//             ".content-main{width:75% !important;float:left;} \n" +
//             "}\n" +
//             "/* Large screens ----------- */\n" +
//             "@media only screen \n" +
//             "and (min-width : 1824px) {\n" +
//             "/* Styles */\n" +
//             ".mTweetCont{width:32.5%;} \n" +
//             ".profile-header.profile-page-header{width:78% !important;float:left;} \n" +
//             ".content-main{width:78% !important;float:left;} \n" +
//             "}\n" +
//             "\n" +
//             "</style>");
// }

// function cssChanges() {
//     logger('applying css changes');
//     $('#page-container')
//         .css({
//             'width': '98%',
//             'padding-left': '1%',
//             'padding-right': '1%'
//         });

//     $('.dashboard')
//         .addClass('mDashBoardCont')
//         .css({
//             'float': 'left',
//             'width': '20%',
//             'min-width': '300px',
//             'margin-right': '0.5rem'
//         });
//     $('#stream-items-id')
//         .css({
//             'height': 'auto',
//             'overflow': 'hidden',
//             "padding": '10px 0 0 10px'
//         });
//     $('#stream-items-id')
//         .parent()
//         .css("background-color", "rgba(240, 240, 240, 0.8)");
// }

// appendScripts();

// function tPaint() {
//     scroll_top = 0;
//     cssChanges();
//     initMsnry();
//     reloadMsnry();
//     attachEvents();
// }

// function attachEvents() {
//     $(window).bind('scroll', function(e) {
//         x = $(window)
//             .scrollTop();
//         if ((scroll_top - x) < -140) {
//             logger("----------scroll refreshing layout---------");
//             msnry.layout();
//             scroll_top = x;
//         }
//     });
//     $('.mDashBoardCont').on('click', '.js-trend-item a', function() {
//         location.href = this.href;
//         });
//     $('.mDashBoardCont').on('click', '.mini-profile a', function() {
//         location.href = this.href;
//         });
//     $('.mDashBoardCont').on('click', '.profile-nav a', function() {
//         location.href = this.href;
//         });
//     $('body').on('click', '.js-nav', function() {
//         location.href = this.href;
//         });
//     $('#global-actions')
//         .on('click', 'li a', function() {
//         location.href = this.href;
//         // detachEvents();
//         // destroyMsnry();
//         });

//     bindDomChangeEvent();
// }
// function bindDomChangeEvent() {
//     $('#stream-items-id')
//         .bind('DOMSubtreeModified', function(e) {
//             c = $('#stream-items-id > li').length;
//             logger('counter status ' + counter_tweets + " -- " + c);
//             if (counter_tweets == c) {
//                 return false;
//             }

//             if (c > counter_tweets) {
//                 logger('======================================================' + counter_tweets + " -- " + c);
//                 counter_tweets = c;
//                 appendNewTweets();
//             } else if (counter_tweets > c) {
//                 counter_tweets = c;
//             }

//         });
// }

// function detachEvents() {
//     try {
//         $('#stream-items-id').unbind('DOMSubtreeModified');
//     } catch (err) {}
//     try {
//         $(window).unbind('scroll');
//     } catch (err) {}
// }


// function appendNewTweets() {
//     refresh_action = ($('#stream-items-id > li').eq(0).hasClass('mTweetCont') == true) ? 'appended' : 'prepended';
//     var newTweets = $('#stream-items-id > li:not(.mTweetCont)');
//     logger('new tweets are ------------------------');
//     logger(newTweets);
//     $(newTweets).addClass('mTweetCont');
//     $('.js-tweet-text.tweet-text').addClass('mTweet');
//     logger("---------" + refresh_action);
//     eval("msnry." + refresh_action + "(newTweets);");
//     if (refresh_action == "prepended") {
//         scroll_top = 0;
//         setTimeout(layoutTweetItems(newTweets), 1400);
//     }
// }

// function layoutTweetItems(items) {
//     msnry.layoutItems(items);
// }

// function initMsnry() {
//     logger('===== Init masonry ============');
//     msnry = new Masonry(container, {
//         itemSelector: '#stream-items-id >li'
//     });
// }

// function reloadMsnry() {
//     var newTweets = $('#stream-items-id > li:not(.mTweetCont)');
//     logger('new tweets are ------------------------');
//     logger(newTweets);
//     $(newTweets).addClass('mTweetCont');
//     $('.js-tweet-text.tweet-text').addClass('mTweet');

//     setTimeout(function() {
//         msnry.reloadItems();
//         msnry.layout();
//     }, 500);
// }

// function destroyMsnry() {
//     msnry = {};
// }
// $(function() {
//     tPaint();
// });