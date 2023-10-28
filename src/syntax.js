/**
 * Syntax.js
 * 
 * A javascript code syntax highlighter.
 * 
 * @file        syntax.js
 * @version     v0.1.0
 * @author      Bunoon
 * @license     MIT License
 * @copyright   Bunoon 2023
 */


( function() {
    var _parameter_Document = null,
        _parameter_Navigator = null,
        _string = {
            empty: "",
            space: " ",
            newLine: "\n"
        },
        _elements_Type = {},
        _strings_Cached = {},
        _strings_Cached_Count = 0,
        _comments_Cached = {},
        _comments_Cached_Count = 0,
        _language_Keywords = {
            javascript: [
                "function",
                "var",
                "new",
                "if",
                "while",
                "do",
                "switch",
                "case",
                "else",
                "null",
                "eval",
                "for",
                "in",
                "break",
                "debugger",
                "delete",
                "true",
                "false",
                "catch",
                "continue",
                "this",
                "yield",
                "default",
                "typeof",
                "try"
            ]
        };

    function render() {
        var domElements = _parameter_Document.getElementsByTagName( "*" ),
            elements = [].slice.call( domElements ),
            elementsLength = elements.length;

        for ( var elementIndex = 0; elementIndex < elementsLength; elementIndex++ ) {
            renderElement( elements[ elementIndex ] );
        }
    }

    function renderElement( element ) {
        if ( isDefined( element ) ) {
            var syntaxLanguage = element.getAttribute( "data-syntax-language" );

            if ( isDefined( syntaxLanguage ) && _language_Keywords.hasOwnProperty( syntaxLanguage ) ) {
                var innerHTML = element.innerHTML.trim(),
                    innerHTMLCopy = element.innerHTML.trim();

                element.className += " syntax-highlight";
                element.innerHTML = _string.empty;

                var code = createElement( "div", "code custom-scroll-bars" );
                element.appendChild( code );

                var number = createElement( "div", "number" );
                code.appendChild( number );
    
                var syntax = createElement( "div", "syntax" );
                code.appendChild( syntax );

                var copyButton = createElement( "div", "copy-button" );
                copyButton.innerHTML = "Copy";
                syntax.appendChild( copyButton );

                copyButton.onclick = function() {
                    _parameter_Navigator.clipboard.writeText( innerHTMLCopy );
                };

                innerHTML = renderElementCommentPatternVariables( innerHTML, innerHTML.match( new RegExp( "//.*", "g" ) ) );
                innerHTML = renderElementStringQuotesPatternVariables( innerHTML, innerHTML.match( /".*?"/g ) );
                innerHTML = renderElementStringQuotesPatternVariables( innerHTML, innerHTML.match( /'.*?'/g ) );
                innerHTML = renderElementKeywords( innerHTML, syntaxLanguage );
                innerHTML = renderElementCommentsFromVariables( innerHTML );
                innerHTML = renderElementStringQuotesFromVariables( innerHTML );

                renderElementCompletedHTML( number, syntax, innerHTML );
            }
        }
    }

    function renderElementCommentPatternVariables( innerHTML, patternItems ) {
        if ( patternItems !== null ) {
            var patternItemsLength = patternItems.length;
        
            for ( var patternItemsIndex = 0; patternItemsIndex < patternItemsLength; patternItemsIndex++ ) {
                var comment = patternItems[ patternItemsIndex ],
                    commentReplacement = comment.replaceAll( '"', _string.empty ).replaceAll( "'", _string.empty ),
                    commentVariable = "$C{" + _comments_Cached_Count.toString() + "}";

                _comments_Cached[ commentVariable ] = "<span class=\"comment\">" + commentReplacement + "</span>";
                _comments_Cached_Count++;
    
                innerHTML = innerHTML.replace( comment, commentVariable );
            }
        }

        return innerHTML;
    }

    function renderElementStringQuotesPatternVariables( innerHTML, patternItems ) {
        if ( patternItems !== null ) {
            var patternItemsLength = patternItems.length;
        
            for ( var patternItemsIndex = 0; patternItemsIndex < patternItemsLength; patternItemsIndex++ ) {
                var quote = patternItems[ patternItemsIndex ],
                    quoteReplacement = quote.replaceAll( '"', _string.empty ).replaceAll( "'", _string.empty ),
                    quoteVariable = "$S{" + _strings_Cached_Count.toString() + "}";

                _strings_Cached[ quoteVariable ] = "<q class=\"string\">" + quoteReplacement + "</q>";
                _strings_Cached_Count++;
    
                innerHTML = innerHTML.replace( quote, quoteVariable );
            }
        }

        return innerHTML;
    }

    function renderElementKeywords( innerHTML, syntaxLanguage ) {
        var keywords = _language_Keywords[ syntaxLanguage ],
            keywordsLength = keywords.length;

        for ( var keywordIndex = 0; keywordIndex < keywordsLength; keywordIndex++ ) {
            var keyword = keywords[ keywordIndex ],
                regEx = new RegExp( "\\b" + keyword + "\\b", "g" );

            innerHTML = innerHTML.replace( regEx, "<span class=\"keyword\">" + keyword + "</span>" );
        }

        return innerHTML;
    }

    function renderElementStringQuotesFromVariables( innerHTML ) {
        for ( var quoteVariable in _strings_Cached ) {
            if ( _strings_Cached.hasOwnProperty( quoteVariable ) ) {
                innerHTML = innerHTML.replace( quoteVariable, _strings_Cached[ quoteVariable ] );
            }
        }

        return innerHTML;
    }

    function renderElementCommentsFromVariables( innerHTML ) {
        for ( var commentVariable in _comments_Cached ) {
            if ( _comments_Cached.hasOwnProperty( commentVariable ) ) {
                innerHTML = innerHTML.replace( commentVariable, _comments_Cached[ commentVariable ] );
            }
        }

        return innerHTML;
    }

    function renderElementCompletedHTML( number, syntax, innerHTML ) {
        var lines = innerHTML.split( _string.newLine ),
            linesLength = lines.length;

        for ( var lineIndex = 0; lineIndex < linesLength; lineIndex++ ) {
            var line = lines[ lineIndex ].trim();

            var numberCode = createElement( "p" );
            numberCode.innerHTML = ( lineIndex + 1 ).toString();
            number.appendChild( numberCode );

            var syntaxCode = createElement( "p" );
            syntaxCode.innerHTML = line === _string.empty ? "<br>" : line;
            syntax.appendChild( syntaxCode );
        }
    }


    /*
     * ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------
     * Validation
     * ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------
     */

    function isDefined( value ) {
        return value !== undefined && value !== _string.empty;
    }


    /*
     * ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------
     * Element Handling
     * ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------
     */

    function createElement( type, className ) {
        var result = null,
            nodeType = type.toLowerCase(),
            isText = nodeType === "text";

        if ( !_elements_Type.hasOwnProperty( nodeType ) ) {
            _elements_Type[ nodeType ] = isText ? _parameter_Document.createTextNode( _string.empty ) : _parameter_Document.createElement( nodeType );
        }

        result = _elements_Type[ nodeType ].cloneNode( false );

        if ( isDefined( className ) ) {
            result.className = className;
        }

        return result;
    }


    /*
     * ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------
     * Public Functions:  Additional Data
     * ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------
     */

    /**
     * getVersion().
     * 
     * Returns the version of Syntax.js.
     * 
     * @public
     * 
     * @returns     {string}                                                The version number.
     */
    this.getVersion = function() {
        return "0.1.0";
    };


    /*
     * ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------
     * Initialize Syntax.js
     * ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------
     */

    ( function ( documentObject, navigatorObject, windowObject ) {
        _parameter_Document = documentObject;
        _parameter_Navigator = navigatorObject;

        _parameter_Document.addEventListener( "DOMContentLoaded", function() {
            render();
        } );

        if ( !isDefined( windowObject.$syntax ) ) {
            windowObject.$syntax = this;
        }

    } ) ( document, navigator, window );
} )();