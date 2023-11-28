/**
 * Syntax.js
 * 
 * A lightweight, and easy to use, JavaScript syntax highlighter!
 * 
 * @file        syntax.js
 * @version     v0.7.0
 * @author      Bunoon
 * @license     MIT License
 * @copyright   Bunoon 2023
 */


( function() {
    var // Variables: Constructor Parameters
        _parameter_Document = null,
        _parameter_Navigator = null,

        // Variables: Strings
        _string = {
            empty: "",
            space: " ",
            newLine: "\n"
        },

        // Variables: Elements
        _elements_Type = {},
        _elements = [],

        // Variables: Temporary String Variables
        _strings_Cached = {},
        _strings_Cached_Count = 0,
        _comments_Cached = {},
        _comments_Cached_Count = 0,
        
        // Variables: Languages
        _languages = {};

    
    /*
     * ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------
     * Rendering
     * ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------
     */

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

            if ( isDefined( syntaxLanguage ) && _languages.hasOwnProperty( syntaxLanguage ) ) {
                var innerHTML = element.innerHTML,
                    syntaxOptions = getObjectFromString( element.getAttribute( "data-syntax-options" ) ),
                    isPreFormatted = false;
                
                syntaxOptions = buildAttributeOptions( syntaxOptions );

                if ( element.children.length > 0 && element.children[ 0 ].nodeName.toLowerCase() === "pre" ) {
                    innerHTML = element.children[ 0 ].innerHTML;
                    isPreFormatted = true;
                }
                
                var innerHTMLCopy = innerHTML.trim();

                element.removeAttribute( "data-syntax-language" );
                element.removeAttribute( "data-syntax-options" );
                element.className = element.className === _string.empty ? "syntax-highlight" : element.className + " syntax-highlight";
                element.innerHTML = _string.empty;

                var code = createElement( "div", "code custom-scroll-bars" );
                element.appendChild( code );

                var number = createElement( "div", "number" );
                code.appendChild( number );
    
                var syntax = createElement( "div", "syntax" );
                code.appendChild( syntax );

                if ( syntaxOptions.showCopyButton ) {
                    var copyButton = createElement( "div", "copy-button" );
                    copyButton.innerHTML = syntaxOptions.copyButtonText;
                    syntax.appendChild( copyButton );
    
                    copyButton.onclick = function() {
                        _parameter_Navigator.clipboard.writeText( innerHTMLCopy );

                        fireCustomTrigger( syntaxOptions.onCopy, innerHTMLCopy );
                    };
                }

                innerHTML = renderElementCommentVariables( innerHTML, syntaxLanguage );
                innerHTML = renderElementMultiLineCommentVariables( innerHTML, syntaxLanguage );
                innerHTML = renderElementStringQuotesPatternVariables( innerHTML, innerHTML.match( /".*?"/g ) );

                if ( _languages[ syntaxLanguage ].comment !== "'" ) {
                    innerHTML = renderElementStringQuotesPatternVariables( innerHTML, innerHTML.match( /'.*?'/g ) );
                }

                innerHTML = renderElementKeywords( innerHTML, syntaxLanguage, syntaxOptions );
                innerHTML = renderElementCommentsFromVariables( innerHTML );
                innerHTML = renderElementStringQuotesFromVariables( innerHTML );

                renderElementCompletedHTML( element, number, syntax, innerHTML, syntaxOptions, isPreFormatted );
                fireCustomTrigger( syntaxOptions.onRender, element );

                _elements.push( element );
            }
        }
    }

    function renderElementCommentVariables( innerHTML, syntaxLanguage ) {
        var lookup = _languages[ syntaxLanguage ].comment,
            patternItems = innerHTML.match( new RegExp( lookup + ".*", "g" ) );

        if ( patternItems !== null ) {
            var patternItemsLength = patternItems.length;
        
            for ( var patternItemsIndex = 0; patternItemsIndex < patternItemsLength; patternItemsIndex++ ) {
                var comment = patternItems[ patternItemsIndex ],
                    commentVariable = "$C{" + _comments_Cached_Count.toString() + "}";

                _comments_Cached[ commentVariable ] = "<span class=\"comment\">" + comment + "</span>";
                _comments_Cached_Count++;
    
                innerHTML = innerHTML.replace( comment, commentVariable );
            }
        }

        return innerHTML;
    }

    function renderElementMultiLineCommentVariables( innerHTML, syntaxLanguage ) {
        var lookup = _languages[ syntaxLanguage ].multiLineComment;

        if ( isDefinedArray( lookup ) && lookup.length === 2 ) {
            var startIndex = 0,
                endIndex = 0;

            while ( startIndex >= 0 && endIndex >= 0 ) {
                startIndex = innerHTML.indexOf( lookup[ 0 ], endIndex );
    
                if ( startIndex > -1 ) {
                    endIndex = innerHTML.indexOf( lookup[ 1 ], startIndex + lookup[ 0 ].length );
    
                    if ( endIndex > -1 ) {
                        var comment = innerHTML.substring( startIndex, endIndex + lookup[ 1 ].length ),
                            commentLines = comment.split( _string.newLine ),
                            commentLinesLength = commentLines.length;
                        
                        for ( var commentLineIndex = 0; commentLineIndex < commentLinesLength; commentLineIndex++ ) {
                            var commentVariable = "$C{" + _comments_Cached_Count.toString() + "}",
                                commentLine = commentLines[ commentLineIndex ];
                            
                            _comments_Cached[ commentVariable ] = "<span class=\"comment\">" + commentLine + "</span>";
                            _comments_Cached_Count++;
                
                            innerHTML = innerHTML.replace( commentLine, commentVariable );
    
                        }
                    }
                }
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

    function renderElementKeywords( innerHTML, syntaxLanguage, syntaxOptions ) {
        var keywords = _languages[ syntaxLanguage ].keywords,
            keywordsLength = keywords.length;

        for ( var keywordIndex = 0; keywordIndex < keywordsLength; keywordIndex++ ) {
            var keyword = keywords[ keywordIndex ],
                regEx = new RegExp( "\\b" + keyword + "\\b", "g" );

            if ( isDefinedFunction( syntaxOptions.onKeywordClicked ) ) {
                innerHTML = innerHTML.replace( regEx, "<span class=\"keyword-clickable\">" + keyword + "</span>" );
            } else {
                innerHTML = innerHTML.replace( regEx, "<span class=\"keyword\">" + keyword + "</span>" );
            }
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

    function renderElementCompletedHTML( element, number, syntax, innerHTML, syntaxOptions, isPreFormatted ) {
        var lines = innerHTML.split( _string.newLine ),
            linesLength = lines.length,
            numberContainer = number,
            codeContainer = syntax,
            replaceWhitespace = null,
            lineNumber = 1;

        if ( isPreFormatted ) {
            codeContainer = createElement( "pre" );
            syntax.appendChild( codeContainer );

            numberContainer = createElement( "pre" );
            number.appendChild( numberContainer );
        }

        for ( var lineIndex = 0; lineIndex < linesLength; lineIndex++ ) {
            var line = lines[ lineIndex ];

            if ( line.trim() !== _string.empty && replaceWhitespace === null ) {
                replaceWhitespace = line.substring( 0, line.match( /^\s*/ )[ 0 ].length );
            }

            if ( ( lineIndex !== 0 && lineIndex !== linesLength - 1 ) || line.trim() !== _string.empty ) {
                if ( line.trim() !== _string.empty || !syntaxOptions.removeBlankLines ) {
                    var numberCode = createElement( "p" );
                    numberCode.innerHTML = lineNumber.toString();
                    numberContainer.appendChild( numberCode );

                    lineNumber++;
        
                    if ( replaceWhitespace !== null ) {
                        line = line.replace( replaceWhitespace, _string.empty );

                        if ( !isPreFormatted ) {
                            var remainingStartWhitespaceCount = line.match( /^\s*/ )[ 0 ].length,
                                remainingStartWhitespace = line.substring( 0, remainingStartWhitespaceCount ),
                                whitespaceReplacement = Array( remainingStartWhitespaceCount ).join( "&nbsp;" );

                            line = line.replace( remainingStartWhitespace, whitespaceReplacement );
                        }
                    }
        
                    var syntaxCode = createElement( "p" );
                    syntaxCode.innerHTML = line.trim() === _string.empty ? "<br>" : line;
                    codeContainer.appendChild( syntaxCode );
                }
            }
        }

        if ( isDefinedFunction( syntaxOptions.onKeywordClicked ) ) {
            var keywords = element.getElementsByClassName( "keyword-clickable" ),
                keywordsLength = keywords.length;

            for ( var keywordIndex = 0; keywordIndex < keywordsLength; keywordIndex++ ) {
                renderElementClickableKeyword( keywords[ keywordIndex ], syntaxOptions.onKeywordClicked );
            }
        }
    }

    function renderElementClickableKeyword( element, customTrigger ) {
        var text = element.innerText;

        element.onclick = function() {
            customTrigger( text );
        };
    }


    /*
     * ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------
     * Options
     * ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------
     */

    function buildAttributeOptions( newOptions ) {
        var options = !isDefinedObject( newOptions ) ? {} : newOptions;
        options.showCopyButton = getDefaultBoolean( options.showCopyButton, true );
        options.copyButtonText = getDefaultString( options.copyButtonText, "Copy" );
        options.removeBlankLines = getDefaultBoolean( options.removeBlankLines, false );
        options.onCopy = getDefaultFunction( options.onCopy, null );
        options.onRender = getDefaultFunction( options.onRender, null );
        options.onKeywordClicked = getDefaultFunction( options.onKeywordClicked, null );

        return options;
    }


    /*
     * ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------
     * Validation
     * ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------
     */

    function isDefined( value ) {
        return value !== null && value !== undefined && value !== _string.empty;
    }

    function isDefinedObject( object ) {
        return isDefined( object ) && typeof object === "object";
    }

    function isDefinedBoolean( object ) {
        return isDefined( object ) && typeof object === "boolean";
    }

    function isDefinedString( object ) {
        return isDefined( object ) && typeof object === "string";
    }

    function isDefinedFunction( object ) {
        return isDefined( object ) && isFunction( object );
    }

    function isDefinedArray( object ) {
        return isDefinedObject( object ) && object instanceof Array;
    }

    function isFunction( object ) {
        return typeof object === "function";
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
     * Triggering Custom Events
     * ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------
     */

    function fireCustomTrigger( triggerFunction ) {
        if ( isDefinedFunction( triggerFunction ) ) {
            triggerFunction.apply( null, [].slice.call( arguments, 1 ) );
        }
    }


    /*
     * ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------
     * Default Parameter/Option Handling
     * ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------
     */

    function getDefaultString( value, defaultValue ) {
        return isDefinedString( value ) ? value : defaultValue;
    }

    function getDefaultBoolean( value, defaultValue ) {
        return isDefinedBoolean( value ) ? value : defaultValue;
    }

    function getDefaultFunction( value, defaultValue ) {
        return isDefinedFunction( value ) ? value : defaultValue;
    }

    function getObjectFromString( objectString ) {
        var result = null;

        try {
            if ( isDefinedString( objectString ) ) {
                result = JSON.parse( objectString );
            }

        } catch ( e1 ) {

            try {
                result = eval( "(" + objectString + ")" );
            } catch ( e2 ) {
                console.error( "Errors in object: " + e1.message + ", " + e2.message );
                result = null;
            }
        }

        return result;
    }


    /*
     * ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------
     * Public Functions:  Building
     * ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------
     */

    /**
     * buildNewSyntaxElements().
     * 
     * Finds all new code elements and renders them.
     * 
     * @public
     * @fires       onRender
     * 
     * @returns     {Object}                                                The Syntax.js class instance.
     */
    this.buildNewSyntaxElements = function() {
        render();

        return this;
    };

    /**
     * getRenderedElements().
     * 
     * Returns all the elements that have been detected and rendered.
     * 
     * @public
     * 
     * @returns     {Object[]}                                              An array containing the rendered DOM elements.
     */

    this.getRenderedElements = function() {
        return _elements;
    };


    /*
     * ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------
     * Public Functions:  Languages
     * ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------
     */

    /**
     * addLanguage().
     * 
     * Adds a new language that can be rendered.
     * 
     * @public
     * @fires       onRender
     * 
     * @param       {string}    name                                        The name of the language.
     * @param       {boolean}   languageDetails                             The language details (refer to "Language" documentation for properties).
     * @param       {boolean}   [triggerRender]                             States if new language DOM elements available should be rendered.
     * 
     * @returns     {boolean}                                               States if the language has been added.
     */
    this.addLanguage = function( name, languageDetails, triggerRender ) {
        var added = false;

        if ( !_languages.hasOwnProperty( name.toLowerCase() ) ) {
            triggerRender = !isDefinedBoolean( triggerRender ) ? true : triggerRender;

            _languages[ name.toLowerCase() ] = languageDetails;
            added = true;

            if ( triggerRender ) {
                render();
            }
        }

        return added;
    };


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
        return "0.7.0";
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