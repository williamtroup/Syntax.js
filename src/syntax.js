/**
 * Syntax.js
 * 
 * A lightweight, and easy-to-use, JavaScript library for code syntax highlighting!
 * 
 * @file        syntax.js
 * @version     v1.3.0
 * @author      Bunoon
 * @license     MIT License
 * @copyright   Bunoon 2023
 */


( function() {
    var // Variables: Constructor Parameters
        _parameter_Document = null,
        _parameter_Navigator = null,

        // Variables: Configuration
        _configuration = {},

        // Variables: Strings
        _string = {
            empty: "",
            space: " ",
            newLine: "\n"
        },

        // Variables: Elements
        _elements_Type = {},
        _elements = [],
        _elements_Original = {},

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
        var tagTypes = [ "div", "code" ],
            tagTypesLength = tagTypes.length;

        for ( var tagTypeIndex = 0; tagTypeIndex < tagTypesLength; tagTypeIndex++ ) {
            var domElements = _parameter_Document.getElementsByTagName( tagTypes[ tagTypeIndex ] ),
                elements = [].slice.call( domElements ),
                elementsLength = elements.length;

            for ( var elementIndex = 0; elementIndex < elementsLength; elementIndex++ ) {
                if ( !renderElement( elements[ elementIndex ] ) ) {
                    break;
                }
            }
        }
    }

    function renderElement( element ) {
        var result = true;

        if ( isDefined( element ) ) {
            var syntaxLanguage = element.getAttribute( "data-syntax-language" );

            if ( isDefined( syntaxLanguage ) ) {
                if ( _languages.hasOwnProperty( syntaxLanguage ) ) {
                    var innerHTML = element.innerHTML,
                        syntaxOptions = getObjectFromString( element.getAttribute( "data-syntax-options" ) ),
                        isPreFormatted = false;
                    
                    syntaxOptions = buildAttributeOptions( syntaxOptions );

                    if ( element.children.length > 0 && element.children[ 0 ].nodeName.toLowerCase() === "pre" ) {
                        innerHTML = element.children[ 0 ].innerHTML;
                        isPreFormatted = true;
                    }
                    
                    var innerHTMLCopy = innerHTML.trim(),
                        number = null,
                        elementId = element.id;

                    if ( !isDefinedString( elementId ) ) {
                        elementId = newGuid();
                    }

                    _elements_Original[ elementId ] = element.innerHTML;

                    element.removeAttribute( "data-syntax-language" );
                    element.removeAttribute( "data-syntax-options" );
                    element.id = elementId;
                    element.className = element.className === _string.empty ? "syntax-highlight" : element.className + " syntax-highlight";
                    element.innerHTML = _string.empty;

                    var code = createElement( "div", "code custom-scroll-bars" );
                    element.appendChild( code );

                    if ( syntaxOptions.showLineNumbers ) {
                        number = createElement( "div", "number" );
                        code.appendChild( number );
                    }
        
                    var syntax = createElement( "div", "syntax" );
                    code.appendChild( syntax );

                    renderElementButtons( syntax, syntaxOptions, syntaxLanguage, innerHTMLCopy );

                    if ( syntaxOptions.highlightComments ) {
                        innerHTML = renderElementCommentVariables( innerHTML, syntaxLanguage, syntaxOptions );
                        innerHTML = renderElementMultiLineCommentVariables( innerHTML, syntaxLanguage, syntaxOptions );
                    }

                    if ( syntaxOptions.highlightStrings ) {
                        innerHTML = renderElementStringQuotesPatternVariables( innerHTML, innerHTML.match( /"((?:\\.|[^"\\])*)"/g ), syntaxOptions );

                        if ( _languages[ syntaxLanguage ].comment !== "'" ) {
                            innerHTML = renderElementStringQuotesPatternVariables( innerHTML, innerHTML.match( /'((?:\\.|[^"\\])*)'/g ), syntaxOptions );
                        }
                    }

                    if ( syntaxOptions.highlightKeywords ) {
                        innerHTML = renderElementKeywords( innerHTML, syntaxLanguage, syntaxOptions );
                    }

                    if ( syntaxOptions.highlightComments ) {
                        innerHTML = renderElementCommentsFromVariables( innerHTML );
                    }
                    
                    if ( syntaxOptions.highlightStrings ) {
                        innerHTML = renderElementStringQuotesFromVariables( innerHTML );
                    }

                    renderElementCompletedHTML( element, number, syntax, innerHTML, syntaxOptions, isPreFormatted );
                    fireCustomTrigger( syntaxOptions.onRenderComplete, element );

                    _elements.push( element );

                } else {
                    
                    if ( !_configuration.safeMode ) {
                        console.error( "Language '" + syntaxLanguage + "' is not supported." );
                        result = false;
                    }
                }
            }
        }

        return result;
    }

    function renderElementButtons( syntax, syntaxOptions, syntaxLanguage, innerHTMLCopy ) {
        if ( syntaxOptions.showLanguageLabel || syntaxOptions.showCopyButton || syntaxOptions.showPrintButton ) {
            var buttons = createElement( "div", "buttons" );
            syntax.appendChild( buttons );

            if ( syntaxOptions.showCopyButton ) {
                var copyButton = createElement( "div", "button" );
                copyButton.innerHTML = syntaxOptions.copyButtonText;
                buttons.appendChild( copyButton );

                copyButton.onclick = function() {
                    _parameter_Navigator.clipboard.writeText( innerHTMLCopy );

                    fireCustomTrigger( syntaxOptions.onCopy, innerHTMLCopy );
                };
            }

            if ( syntaxOptions.showPrintButton ) {
                var printButton = createElement( "div", "button" );
                printButton.innerHTML = syntaxOptions.printButtonText;
                buttons.appendChild( printButton );

                printButton.onclick = function() {
                    var newWindow = window.open( _string.empty, "PRINT", "height=400,width=600" ),
                        newElementForPrint = syntax.cloneNode( true );

                    newElementForPrint.removeChild( newElementForPrint.children[ 0 ] );

                    newWindow.document.write( "<html>" );
                    newWindow.document.write( "<head>" );
                    newWindow.document.write( "<title>" );
                    newWindow.document.write( getFriendlyLanguageName( syntaxLanguage ) );
                    newWindow.document.write( "</title>" );
                    newWindow.document.write( "</head>" );
                    newWindow.document.write( "<body>" );
                    newWindow.document.write( "<code>" );
                    newWindow.document.write( "<pre>" );
                    newWindow.document.write( newElementForPrint.innerHTML );
                    newWindow.document.write( "</pre>" );
                    newWindow.document.write( "</code>" );
                    newWindow.document.write( "</body>" );
                    newWindow.document.write( "</html>" );
                
                    newWindow.document.close();
                    newWindow.focus();
                    newWindow.print();
                    newWindow.close();

                    fireCustomTrigger( syntaxOptions.onPrint, newElementForPrint.innerHTML );
                };
            }

            if ( syntaxOptions.showLanguageLabel ) {
                var languageLabel = createElement( "div", "label" );
                languageLabel.innerHTML = getFriendlyLanguageName( syntaxLanguage );
                buttons.appendChild( languageLabel );
            }
        }
    }

    function renderElementCommentVariables( innerHTML, syntaxLanguage, syntaxOptions ) {
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

                fireCustomTrigger( syntaxOptions.onCommentRender, comment );
            }
        }

        return innerHTML;
    }

    function renderElementMultiLineCommentVariables( innerHTML, syntaxLanguage, syntaxOptions ) {
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

                        fireCustomTrigger( syntaxOptions.onCommentRender, comment );
                    }
                }
            }
        }

        return innerHTML;
    }

    function renderElementStringQuotesPatternVariables( innerHTML, patternItems, syntaxOptions ) {
        if ( patternItems !== null ) {
            var patternItemsLength = patternItems.length;
        
            for ( var patternItemsIndex = 0; patternItemsIndex < patternItemsLength; patternItemsIndex++ ) {
                var quote = patternItems[ patternItemsIndex ],
                    quoteLines = quote.split( _string.newLine ),
                    quoteLinesLength = quoteLines.length;

                for ( var quoteLineIndex = 0; quoteLineIndex < quoteLinesLength; quoteLineIndex++ ) {
                    var quoteLine = quoteLines[ quoteLineIndex ],
                        quoteVariable = "$S{" + _strings_Cached_Count.toString() + "}";

                    _strings_Cached[ quoteVariable ] = "<span class=\"string\">" + quoteLine + "</span>";
                    _strings_Cached_Count++;
        
                    innerHTML = innerHTML.replace( quoteLine, quoteVariable );
                }

                fireCustomTrigger( syntaxOptions.onStringRender, quote );
            }
        }

        return innerHTML;
    }

    function renderElementKeywords( innerHTML, syntaxLanguage, syntaxOptions ) {
        var keywords = _languages[ syntaxLanguage ].keywords,
            caseSensitive = _languages[ syntaxLanguage ].caseSensitive;

        if ( isDefinedString( keywords ) ) {
            keywords = keywords.split( _string.space );
        }

        var keywordsLength = keywords.length;

        for ( var keywordIndex = 0; keywordIndex < keywordsLength; keywordIndex++ ) {
            var keyword = keywords[ keywordIndex ],
                regExFlags = caseSensitive ? "g" : "gi",
                regEx = new RegExp( "\\b" + keyword + "\\b", regExFlags );

            if ( isDefinedFunction( syntaxOptions.onKeywordClicked ) ) {
                innerHTML = innerHTML.replace( regEx, "<span class=\"keyword-clickable\">" + keyword + "</span>" );
            } else {
                innerHTML = innerHTML.replace( regEx, "<span class=\"keyword\">" + keyword + "</span>" );
            }

            fireCustomTrigger( syntaxOptions.onKeywordRender, keyword );
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

            if ( isDefined( number ) ) {
                numberContainer = createElement( "pre" );
                number.appendChild( numberContainer );
            }
        }

        for ( var lineIndex = 0; lineIndex < linesLength; lineIndex++ ) {
            var line = lines[ lineIndex ];

            if ( line.trim() !== _string.empty && replaceWhitespace === null ) {
                replaceWhitespace = line.substring( 0, line.match( /^\s*/ )[ 0 ].length );
            }

            if ( ( lineIndex !== 0 && lineIndex !== linesLength - 1 ) || line.trim() !== _string.empty ) {
                if ( line.trim() !== _string.empty || !syntaxOptions.removeBlankLines ) {
                    if ( isDefined( numberContainer ) ) {
                        var numberCode = createElement( "p" );
                        numberCode.innerHTML = lineNumber.toString();

                        numberContainer.appendChild( numberCode );
                        lineNumber++;
                    }                    
        
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

    function getFriendlyLanguageName( syntaxLanguage ) {
        var result = null;

        if ( isDefinedString( _languages[ syntaxLanguage ].friendlyName ) ) {
            result = _languages[ syntaxLanguage ].friendlyName.toUpperCase();
        } else {
            result = syntaxLanguage.toUpperCase();
        }

        return result;
    }


    /*
     * ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------
     * Options
     * ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------
     */

    function buildAttributeOptions( newOptions ) {
        var options = !isDefinedObject( newOptions ) ? {} : newOptions;
        options.showCopyButton = getDefaultBoolean( options.showCopyButton, true );
        options.removeBlankLines = getDefaultBoolean( options.removeBlankLines, false );
        options.showLineNumbers = getDefaultBoolean( options.showLineNumbers, true );
        options.highlightKeywords = getDefaultBoolean( options.highlightKeywords, true );
        options.highlightStrings = getDefaultBoolean( options.highlightStrings, true );
        options.highlightComments = getDefaultBoolean( options.highlightComments, true );
        options.showLanguageLabel = getDefaultBoolean( options.showLanguageLabel, true );
        options.showPrintButton = getDefaultBoolean( options.showPrintButton, true );
        
        options = buildAttributeOptionStrings( options );

        return buildAttributeOptionCustomTriggers( options );
    }

    function buildAttributeOptionStrings( options ) {
        options.copyButtonText = getDefaultString( options.copyButtonText, "Copy" );
        options.printButtonText = getDefaultString( options.printButtonText, "Print" );

        return options;
    }

    function buildAttributeOptionCustomTriggers( options ) {
        options.onCopy = getDefaultFunction( options.onCopy, null );
        options.onRenderComplete = getDefaultFunction( options.onRenderComplete, null );
        options.onKeywordClicked = getDefaultFunction( options.onKeywordClicked, null );
        options.onKeywordRender = getDefaultFunction( options.onKeywordRender, null );
        options.onStringRender = getDefaultFunction( options.onStringRender, null );
        options.onCommentRender = getDefaultFunction( options.onCommentRender, null );
        options.onPrint = getDefaultFunction( options.onPrint, null );

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
        return isDefined( object ) && typeof object === "function";
    }

    function isDefinedArray( object ) {
        return isDefinedObject( object ) && object instanceof Array;
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

    function getClonedObject( object ) {
        var json = JSON.stringify( object ),
            result = JSON.parse( json );

        return result;
    }


    /*
     * ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------
     * String Handling
     * ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------
     */

    function newGuid() {
        var result = [];

        for ( var charIndex = 0; charIndex < 32; charIndex++ ) {
            if ( charIndex === 8 || charIndex === 12 || charIndex === 16 || charIndex === 20 ) {
                result.push( "-" );
            }

            var character = Math.floor( Math.random() * 16 ).toString( 16 );
            result.push( character );
        }

        return result.join( _string.empty );
    }


    /*
     * ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------
     * Public Functions:  Highlighting
     * ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------
     */

    /**
     * highlightAll().
     * 
     * Finds all new code elements and renders them.
     * 
     * @public
     * @fires       onRenderComplete
     * 
     * @returns     {Object}                                                The Syntax.js class instance.
     */
    this.highlightAll = function() {
        render();

        return this;
    };

    /**
     * highlightElement().
     * 
     * Renders a specific DOM element.
     * 
     * @public
     * @fires       onRenderComplete
     * 
     * @param       {Object}    elementOrId                                 The element ID, or the element itself.
     * 
     * @returns     {Object}                                                The Syntax.js class instance.
     */
    this.highlightElement = function( elementOrId ) {
        var element = elementOrId;

        if ( isDefinedString( element ) ) {
            element = _parameter_Document.getElementById( element );
        }

        if ( isDefined( element ) ) {
            renderElement( element );
        }

        return this;
    };

    /**
     * getAllElementsHighlighted().
     * 
     * Returns all the elements that have been detected and rendered.
     * 
     * @public
     * 
     * @returns     {Object[]}                                              An array containing the rendered DOM elements.
     */

    this.getAllElementsHighlighted = function() {
        return [].slice.call( _elements );
    };


    /*
     * ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------
     * Public Functions:  Destroying
     * ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------
     */

    /**
     * destroyAll().
     * 
     * Reverts all rendered Syntax elements back to their original state (without render attributes).
     * 
     * @public
     * 
     * @returns     {Object}                                                The Syntax.js class instance.
     */
    this.destroyAll = function() {
        for ( var elementId in _elements_Original ) {
            if ( _elements_Original.hasOwnProperty( elementId ) ) {
                var renderedElement = _parameter_Document.getElementById( elementId );

                if ( isDefined( renderedElement ) ) {
                    renderedElement.innerHTML = _elements_Original[ elementId ];
                }
            }
        }

        _elements_Original = {};
        _elements = [];

        return this;
    };

    /**
     * destroy().
     * 
     * Reverts a Syntax element back to its original state (without render attributes).
     * 
     * @public
     * 
     * @param       {string}    elementId                                   The ID of the DOM element to destroy.
     * 
     * @returns     {Object}                                                The Syntax.js class instance.
     */
    this.destroy = function( elementId ) {
        if ( _elements_Original.hasOwnProperty( elementId.toLowerCase() ) ) {
            var renderedElement = _parameter_Document.getElementById( elementId );

            if ( isDefined( renderedElement ) ) {
                renderedElement.innerHTML = _elements_Original[ elementId.toLowerCase() ];

                delete _elements_Original[ elementId.toLowerCase() ];

                var elementsLength = _elements.length;
                
                for ( var elementIndex = 0; elementIndex < elementsLength; elementIndex++ ) {
                    if ( _elements[ elementIndex ].id === elementId ) {
                        delete _elements[ elementIndex ];
                        break;
                    }
                }
            }
        }

        return this;
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
     * @fires       onRenderComplete
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

    /**
     * removeLanguage().
     * 
     * Removes new language that can be rendered.
     * 
     * @public
     * 
     * @param       {string}    name                                        The name of the language.
     * 
     * @returns     {boolean}                                               States if the language has been removed.
     */
    this.removeLanguage = function( name ) {
        var removed = false;

        if ( _languages.hasOwnProperty( name.toLowerCase() ) ) {
            delete _languages[ name.toLowerCase() ];
        }

        return removed;
    };

    /**
     * getLanguage().
     * 
     * Returns the language details (by name) that can be rendered.
     * 
     * @public
     * 
     * @param       {string}    name                                        The name of the language.
     * 
     * @returns     {Object}                                                The language details.
     */
    this.getLanguage = function( name ) {
        var details = null;

        if ( _languages.hasOwnProperty( name.toLowerCase() ) ) {
            details = getClonedObject( _languages[ name.toLowerCase() ] );
        }

        return details;
    };

    /**
     * getAllLanguages().
     * 
     * Returns all the languages that can be rendered.
     * 
     * @public
     * 
     * @returns     {Object}                                                The object that contains the languages.
     */
    this.getAllLanguages = function() {
        return getClonedObject( _languages );
    };


    /*
     * ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------
     * Public Functions:  Configuration
     * ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------
     */

    /**
     * setConfiguration().
     * 
     * Sets the specific configuration options that should be used.
     * 
     * @public
     * 
     * @param       {Options}   newConfiguration                            All the configuration options that should be set (refer to "Options" documentation for properties).
     * 
     * @returns     {Object}                                                The Syntax.js class instance.
     */
    this.setConfiguration = function( newOptions ) {
        _configuration = !isDefinedObject( newOptions ) ? {} : newOptions;
        
        buildDefaultConfiguration();

        return this;
    };

    function buildDefaultConfiguration() {
        _configuration.safeMode = getDefaultBoolean( _configuration.safeMode, true );
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
        return "1.3.0";
    };


    /*
     * ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------
     * Initialize Syntax.js
     * ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------
     */

    ( function ( documentObject, navigatorObject, windowObject ) {
        _parameter_Document = documentObject;
        _parameter_Navigator = navigatorObject;

        buildDefaultConfiguration();

        _parameter_Document.addEventListener( "DOMContentLoaded", function() {
            render();
        } );

        if ( !isDefined( windowObject.$syntax ) ) {
            windowObject.$syntax = this;
        }

    } ) ( document, navigator, window );
} )();