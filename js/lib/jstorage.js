( function ( ) {
    function C( ) {
        var a = "{}";
        if ( "userDataBehavior" == h ) {
            d.load( "jStorage" );
            try {
                a = d.getAttribute( "jStorage" )
            } catch ( b ) {}
            try {
                r = d.getAttribute( "jStorage_update" )
            } catch ( c ) {}
            g.jStorage = a
        }
        D( );
        x( );
        E( )
    }

    function u( ) {
        var a;
        clearTimeout( F );
        F = setTimeout( function ( ) {
            if ( "localStorage" == h || "globalStorage" == h ) a = g.jStorage_update;
            else if ( "userDataBehavior" == h ) {
                d.load( "jStorage" );
                try {
                    a = d.getAttribute( "jStorage_update" )
                } catch ( b ) {}
            }
            if ( a && a != r ) {
                r = a;
                var k = l.parse( l.stringify( c.__jstorage_meta.CRC32 ) ),
                    p;
                C( );
                p = l.parse( l.stringify( c.__jstorage_meta.CRC32 ) );
                var e, y = [ ],
                    f = [ ];
                for ( e in k ) k.hasOwnProperty( e ) && ( p[ e ] ? k[ e ] != p[ e ] && "2." == String( k[ e ] )
                    .substr( 0, 2 ) && y.push( e ) : f.push( e ) );
                for ( e in p ) p.hasOwnProperty( e ) && ( k[ e ] || y.push( e ) );
                s( y, "updated" );
                s( f, "deleted" )
            }
        }, 25 )
    }

    function s( a, b ) {
        a = [ ].concat( a || [ ] );
        if ( "flushed" == b ) {
            a = [ ];
            for ( var c in j ) j.hasOwnProperty( c ) && a.push( c );
            b = "deleted"
        }
        c = 0;
        for ( var p = a.length; c < p; c++ ) {
            if ( j[ a[ c ] ] )
                for ( var e = 0, d = j[ a[ c ] ].length; e < d; e++ ) j[ a[ c ] ][ e ]( a[ c ], b );
            if ( j[ "*" ] ) {
                e = 0;
                for ( d = j[ "*" ].length; e < d; e++ ) j[ "*" ][ e ]( a[ c ], b )
            }
        }
    }

    function v( ) {
        var a =
            ( +new Date )
            .toString( );
        "localStorage" == h || "globalStorage" == h ? g.jStorage_update = a : "userDataBehavior" == h && ( d.setAttribute( "jStorage_update", a ), d.save( "jStorage" ) );
        u( )
    }

    function D( ) {
        if ( g.jStorage ) try {
            c = l.parse( String( g.jStorage ) )
        } catch ( a ) {
            g.jStorage = "{}"
        } else g.jStorage = "{}";
        z = g.jStorage ? String( g.jStorage )
            .length : 0;
        c.__jstorage_meta || ( c.__jstorage_meta = {} );
        c.__jstorage_meta.CRC32 || ( c.__jstorage_meta.CRC32 = {} )
    }

    function w( ) {
        if ( c.__jstorage_meta.PubSub ) {
            for ( var a = +new Date - 2E3, b = 0, k = c.__jstorage_meta.PubSub.length; b <
                k; b++ )
                if ( c.__jstorage_meta.PubSub[ b ][ 0 ] <= a ) {
                    c.__jstorage_meta.PubSub.splice( b, c.__jstorage_meta.PubSub.length - b );
                    break
                }
            c.__jstorage_meta.PubSub.length || delete c.__jstorage_meta.PubSub
        }
        try {
            g.jStorage = l.stringify( c ), d && ( d.setAttribute( "jStorage", g.jStorage ), d.save( "jStorage" ) ), z = g.jStorage ? String( g.jStorage )
                .length : 0
        } catch ( p ) {}
    }

    function q( a ) {
        if ( !a || "string" != typeof a && "number" != typeof a ) throw new TypeError( "Key name must be string or numeric" );
        if ( "__jstorage_meta" == a ) throw new TypeError( "Reserved key name" );
        return !0
    }

    function x( ) {
        var a, b, k, d, e = Infinity,
            g = !1,
            f = [ ];
        clearTimeout( G );
        if ( c.__jstorage_meta && "object" == typeof c.__jstorage_meta.TTL ) {
            a = +new Date;
            k = c.__jstorage_meta.TTL;
            d = c.__jstorage_meta.CRC32;
            for ( b in k ) k.hasOwnProperty( b ) && ( k[ b ] <= a ? ( delete k[ b ], delete d[ b ], delete c[ b ], g = !0, f.push( b ) ) : k[ b ] < e && ( e = k[ b ] ) );
            Infinity != e && ( G = setTimeout( x, e - a ) );
            g && ( w( ), v( ), s( f, "deleted" ) )
        }
    }

    function E( ) {
        var a;
        if ( c.__jstorage_meta.PubSub ) {
            var b, k = A;
            for ( a = c.__jstorage_meta.PubSub.length - 1; 0 <= a; a-- )
                if ( b = c.__jstorage_meta.PubSub[ a ],
                    b[ 0 ] > A ) {
                    var k = b[ 0 ],
                        d = b[ 1 ];
                    b = b[ 2 ];
                    if ( t[ d ] )
                        for ( var e = 0, g = t[ d ].length; e < g; e++ ) t[ d ][ e ]( d, l.parse( l.stringify( b ) ) )
                }
            A = k
        }
    }
    var n = window.jQuery || window.$ || ( window.$ = {} ),
        l = {
            parse: window.JSON && ( window.JSON.parse || window.JSON.decode ) || String.prototype.evalJSON && function ( a ) {
                return String( a )
                    .evalJSON( )
            } || n.parseJSON || n.evalJSON,
            stringify: Object.toJSON || window.JSON && ( window.JSON.stringify || window.JSON.encode ) || n.toJSON
        };
    if ( !l.parse || !l.stringify ) throw Error( "No JSON support found, include //cdnjs.cloudflare.com/ajax/libs/json2/20110223/json2.js to page" );
    var c = {
        __jstorage_meta: {
            CRC32: {}
        }
    }, g = {
            jStorage: "{}"
        }, d = null,
        z = 0,
        h = !1,
        j = {}, F = !1,
        r = 0,
        t = {}, A = +new Date,
        G, B = {
            isXML: function ( a ) {
                return ( a = ( a ? a.ownerDocument || a : 0 )
                    .documentElement ) ? "HTML" !== a.nodeName : !1
            },
            encode: function ( a ) {
                if ( !this.isXML( a ) ) return !1;
                try {
                    return ( new XMLSerializer )
                        .serializeToString( a )
                } catch ( b ) {
                    try {
                        return a.xml
                    } catch ( c ) {}
                }
                return !1
            },
            decode: function ( a ) {
                var b = "DOMParser" in window && ( new DOMParser )
                    .parseFromString || window.ActiveXObject && function ( a ) {
                        var b = new ActiveXObject( "Microsoft.XMLDOM" );
                        b.async =
                            "false";
                        b.loadXML( a );
                        return b
                    };
                if ( !b ) return !1;
                a = b.call( "DOMParser" in window && new DOMParser || window, a, "text/xml" );
                return this.isXML( a ) ? a : !1
            }
        };
    n.jStorage = {
        version: "0.4.3",
        set: function ( a, b, d ) {
            q( a );
            d = d || {};
            if ( "undefined" == typeof b ) return this.deleteKey( a ), b;
            if ( B.isXML( b ) ) b = {
                _is_xml: !0,
                xml: B.encode( b )
            };
            else {
                if ( "function" == typeof b ) return;
                b && "object" == typeof b && ( b = l.parse( l.stringify( b ) ) )
            }
            c[ a ] = b;
            for ( var g = c.__jstorage_meta.CRC32, e = l.stringify( b ), j = e.length, f = 2538058380 ^ j, h = 0, m; 4 <= j; ) m = e.charCodeAt( h ) & 255 |
                ( e.charCodeAt( ++h ) & 255 ) << 8 | ( e.charCodeAt( ++h ) & 255 ) << 16 | ( e.charCodeAt( ++h ) & 255 ) << 24, m = 1540483477 * ( m & 65535 ) + ( ( 1540483477 * ( m >>> 16 ) & 65535 ) << 16 ), m ^= m >>> 24, m = 1540483477 * ( m & 65535 ) + ( ( 1540483477 * ( m >>> 16 ) & 65535 ) << 16 ), f = 1540483477 * ( f & 65535 ) + ( ( 1540483477 * ( f >>> 16 ) & 65535 ) << 16 ) ^ m, j -= 4, ++h;
            switch ( j ) {
            case 3:
                f ^= ( e.charCodeAt( h + 2 ) & 255 ) << 16;
            case 2:
                f ^= ( e.charCodeAt( h + 1 ) & 255 ) << 8;
            case 1:
                f ^= e.charCodeAt( h ) & 255, f = 1540483477 * ( f & 65535 ) + ( ( 1540483477 * ( f >>> 16 ) & 65535 ) << 16 )
            }
            f ^= f >>> 13;
            f = 1540483477 * ( f & 65535 ) + ( ( 1540483477 * ( f >>> 16 ) &
                65535 ) << 16 );
            g[ a ] = "2." + ( ( f ^ f >>> 15 ) >>> 0 );
            this.setTTL( a, d.TTL || 0 );
            s( a, "updated" );
            return b
        },
        get: function ( a, b ) {
            q( a );
            return a in c ? c[ a ] && "object" == typeof c[ a ] && c[ a ]._is_xml ? B.decode( c[ a ].xml ) : c[ a ] : "undefined" == typeof b ? null : b
        },
        deleteKey: function ( a ) {
            q( a );
            return a in c ? ( delete c[ a ], "object" == typeof c.__jstorage_meta.TTL && a in c.__jstorage_meta.TTL && delete c.__jstorage_meta.TTL[ a ], delete c.__jstorage_meta.CRC32[ a ], w( ), v( ), s( a, "deleted" ), !0 ) : !1
        },
        setTTL: function ( a, b ) {
            var d = +new Date;
            q( a );
            b = Number( b ) || 0;
            return a in
                c ? ( c.__jstorage_meta.TTL || ( c.__jstorage_meta.TTL = {} ), 0 < b ? c.__jstorage_meta.TTL[ a ] = d + b : delete c.__jstorage_meta.TTL[ a ], w( ), x( ), v( ), !0 ) : !1
        },
        getTTL: function ( a ) {
            var b = +new Date;
            q( a );
            return a in c && c.__jstorage_meta.TTL && c.__jstorage_meta.TTL[ a ] ? ( a = c.__jstorage_meta.TTL[ a ] - b ) || 0 : 0
        },
        flush: function ( ) {
            c = {
                __jstorage_meta: {
                    CRC32: {}
                }
            };
            w( );
            v( );
            s( null, "flushed" );
            return !0
        },
        storageObj: function ( ) {
            function a( ) {}
            a.prototype = c;
            return new a
        },
        index: function ( ) {
            var a = [ ],
                b;
            for ( b in c ) c.hasOwnProperty( b ) && "__jstorage_meta" !=
                b && a.push( b );
            return a
        },
        storageSize: function ( ) {
            return z
        },
        currentBackend: function ( ) {
            return h
        },
        storageAvailable: function ( ) {
            return !!h
        },
        listenKeyChange: function ( a, b ) {
            q( a );
            j[ a ] || ( j[ a ] = [ ] );
            j[ a ].push( b )
        },
        stopListening: function ( a, b ) {
            q( a );
            if ( j[ a ] )
                if ( b )
                    for ( var c = j[ a ].length - 1; 0 <= c; c-- ) j[ a ][ c ] == b && j[ a ].splice( c, 1 );
                else delete j[ a ]
        },
        subscribe: function ( a, b ) {
            a = ( a || "" )
                .toString( );
            if ( !a ) throw new TypeError( "Channel not defined" );
            t[ a ] || ( t[ a ] = [ ] );
            t[ a ].push( b )
        },
        publish: function ( a, b ) {
            a = ( a || "" )
                .toString( );
            if ( !a ) throw new TypeError( "Channel not defined" );
            c.__jstorage_meta || ( c.__jstorage_meta = {} );
            c.__jstorage_meta.PubSub || ( c.__jstorage_meta.PubSub = [ ] );
            c.__jstorage_meta.PubSub.unshift( [ +new Date, a, b ] );
            w( );
            v( )
        },
        reInit: function ( ) {
            C( )
        }
    };
    a: {
        n = !1;
        if ( "localStorage" in window ) try {
            window.localStorage.setItem( "_tmptest", "tmpval" ), n = !0, window.localStorage.removeItem( "_tmptest" )
        } catch ( H ) {}
        if ( n ) try {
            window.localStorage && ( g = window.localStorage, h = "localStorage", r = g.jStorage_update )
        } catch ( I ) {} else if ( "globalStorage" in window ) try {
            window.globalStorage && ( g = window.globalStorage[ window.location.hostname ],
                h = "globalStorage", r = g.jStorage_update )
        } catch ( J ) {} else if ( d = document.createElement( "link" ), d.addBehavior ) {
            d.style.behavior = "url(#default#userData)";
            document.getElementsByTagName( "head" )[ 0 ].appendChild( d );
            try {
                d.load( "jStorage" )
            } catch ( K ) {
                d.setAttribute( "jStorage", "{}" ), d.save( "jStorage" ), d.load( "jStorage" )
            }
            n = "{}";
            try {
                n = d.getAttribute( "jStorage" )
            } catch ( L ) {}
            try {
                r = d.getAttribute( "jStorage_update" )
            } catch ( M ) {}
            g.jStorage = n;
            h = "userDataBehavior"
        } else {
            d = null;
            break a
        }
        D( );
        x( );
        "localStorage" == h || "globalStorage" ==
            h ? "addEventListener" in window ? window.addEventListener( "storage", u, !1 ) : document.attachEvent( "onstorage", u ) : "userDataBehavior" == h && setInterval( u, 1E3 );
        E( );
        "addEventListener" in window && window.addEventListener( "pageshow", function ( a ) {
            a.persisted && u( )
        }, !1 )
    }
} )( );
