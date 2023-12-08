/**
 * Syntax.js
 * 
 * A lightweight, and easy-to-use, JavaScript library for code syntax highlighting!
 * 
 * @file        syntax.js
 * @version     v1.6.2
 * @author      Bunoon
 * @license     MIT License
 * @copyright   Bunoon 2023
 */


( function() {
    var // Variables: Constructor Parameters
        _parameter_Document = null,
        _parameter_Navigator = null,
        _parameter_Window = null,

        // Variables: Configuration
        _configuration = {},

        // Variables: Strings
        _string = {
            empty: "",
            space: " ",
            newLine: "\n"
        },

        // Variables: Aliases
        _aliases_Rules = {},

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
        _languages = {},
        _languages_Unknown = "unknown",

        // Variables: Attribute Names
        _attribute_Name_Language = "data-syntax-language",
        _attribute_Name_Options = "data-syntax-options",
        _attribute_Name_Buttons = "data-syntax-buttons";

    
    /*
     * ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------
     * Rendering
     * ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------
     */

    function render() {
        var tagTypes = _configuration.highlightAllDomElementTypes,
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

        if ( isDefined( element ) && element.hasAttribute( _attribute_Name_Language ) ) {
            var syntaxLanguage = element.getAttribute( _attribute_Name_Language );

            if ( isDefinedString( syntaxLanguage ) ) {
                var language = getLanguage( syntaxLanguage );

                if ( isDefined( language ) || syntaxLanguage.toLowerCase() === _languages_Unknown ) {
                    var syntaxOptionsParsed = getObjectFromString( element.getAttribute( _attribute_Name_Options ) ),
                        syntaxButtonsParsed = getObjectFromString( element.getAttribute( _attribute_Name_Buttons ) );

                    if ( syntaxOptionsParsed.parsed ) {
                        var innerHTML = element.innerHTML,
                            syntaxOptions = buildAttributeOptions( syntaxOptionsParsed.result ),
                            isPreFormatted = false;

                        if ( element.children.length > 0 && element.children[ 0 ].nodeName.toLowerCase() === "pre" ) {
                            innerHTML = element.children[ 0 ].innerHTML;
                            isPreFormatted = true;
                        }
                        
                        var innerHTMLCopy = innerHTML.trim(),
                            numbers = null,
                            elementId = element.id;

                        if ( !isDefinedString( elementId ) ) {
                            elementId = newGuid();
                        }

                        _elements_Original[ elementId ] = element.innerHTML;

                        element.removeAttribute( _attribute_Name_Language );
                        element.removeAttribute( _attribute_Name_Options );
                        element.id = elementId;
                        element.className = element.className === _string.empty ? "syntax-highlight" : element.className + " syntax-highlight";
                        element.innerHTML = _string.empty;

                        var code = createElement( "div", "code custom-scroll-bars" );
                        element.appendChild( code );

                        if ( syntaxOptions.showLineNumbers ) {
                            numbers = createElement( "div", "numbers" );
                            code.appendChild( numbers );
                        }
            
                        var syntax = createElement( "div", "syntax" );
                        code.appendChild( syntax );

                        renderElementButtons( syntax, syntaxOptions, syntaxLanguage, syntaxButtonsParsed, innerHTMLCopy );

                        if ( syntaxLanguage.toLowerCase() !== _languages_Unknown ) {
                            if ( syntaxOptions.highlightComments ) {
                                innerHTML = renderElementCommentVariables( innerHTML, language, syntaxOptions );
                                innerHTML = renderElementMultiLineCommentVariables( innerHTML, language, syntaxOptions );
                            }
    
                            if ( syntaxOptions.highlightStrings ) {
                                innerHTML = renderElementStringQuotesPatternVariables( innerHTML, innerHTML.match( /"((?:\\.|[^"\\])*)"/g ), syntaxOptions );
    
                                if ( language.comment !== "'" ) {
                                    innerHTML = renderElementStringQuotesPatternVariables( innerHTML, innerHTML.match( /'((?:\\.|[^"\\])*)'/g ), syntaxOptions );
                                }
                            }

                            innerHTML = renderElementKeywords( innerHTML, language, syntaxOptions );
                            innerHTML = renderElementValues( innerHTML, language, syntaxOptions );
    
                            if ( syntaxOptions.highlightComments ) {
                                innerHTML = renderElementCommentsFromVariables( innerHTML );
                            }
                            
                            if ( syntaxOptions.highlightStrings ) {
                                innerHTML = renderElementStringQuotesFromVariables( innerHTML );
                            }
                        }

                        renderElementCompletedHTML( element, numbers, syntax, innerHTML, syntaxOptions, isPreFormatted );
                        fireCustomTrigger( syntaxOptions.onRenderComplete, element );

                        _elements.push( element );

                    } else {
                        if ( !_configuration.safeMode ) {
                            result = false;
                        }
                    }

                } else {
                    if ( !_configuration.safeMode ) {
                        console.error( "Language '" + syntaxLanguage + "' is not supported." );
                        result = false;
                    }
                }

            } else {
                if ( !_configuration.safeMode ) {
                    console.error( "The attribute '" + _attribute_Name_Language + "' has not been set correctly." );
                    result = false;
                }
            }
        }

        return result;
    }

    function renderElementButtons( syntax, syntaxOptions, syntaxLanguage, syntaxButtonsParsed, innerHTMLCopy ) {
        if ( syntaxOptions.showLanguageLabel || syntaxOptions.showCopyButton || syntaxOptions.showPrintButton || syntaxButtonsParsed.parsed ) {
            var buttons = createElement( "div", "buttons" ),
                buttonsElements = [];

            syntax.appendChild( buttons );

            if ( syntaxButtonsParsed.parsed && isDefinedArray( syntaxButtonsParsed.result ) ) {
                var customButtons = syntaxButtonsParsed.result,
                    customButtonsLength = customButtons.length;

                for ( var customButtonsIndex = 0; customButtonsIndex < customButtonsLength; customButtonsIndex++ ) {
                    var customButton = customButtons[ customButtonsIndex ];

                    if ( isDefined( customButton.text ) && isDefinedFunction( customButton.onClick ) ) {
                        var newCustomButton = createElement( "div", "button" );
                        newCustomButton.innerHTML = customButton.text;
                        newCustomButton.onclick = customButton.onClick;
                        newCustomButton.style.display = _configuration.buttonsVisible ? "inline-block" : "none";
                        buttons.appendChild( newCustomButton );

                        if ( isDefined( customButton.className ) ) {
                            newCustomButton.className += " " + customButton.className;
                        }

                        buttonsElements.push( newCustomButton );
                    }
                }
            }

            if ( syntaxOptions.showCopyButton ) {
                var copyButton = createElement( "div", "button" );
                copyButton.innerHTML = syntaxOptions.copyButtonText;
                copyButton.style.display = _configuration.buttonsVisible ? "inline-block" : "none";
                buttons.appendChild( copyButton );

                copyButton.onclick = function() {
                    _parameter_Navigator.clipboard.writeText( innerHTMLCopy );

                    fireCustomTrigger( syntaxOptions.onCopy, innerHTMLCopy );
                };

                buttonsElements.push( copyButton );
            }

            if ( syntaxOptions.showPrintButton ) {
                var printButton = createElement( "div", "button" );
                printButton.innerHTML = syntaxOptions.printButtonText;
                printButton.style.display = _configuration.buttonsVisible ? "inline-block" : "none";
                buttons.appendChild( printButton );

                printButton.onclick = function() {
                    var newWindow = window.open( _string.empty, "PRINT", "height=400,width=600" ),
                        newElementForPrint = syntax.cloneNode( true ),
                        newTitleElement = createElement( "div" );

                    newElementForPrint.removeChild( newElementForPrint.children[ 0 ] );
                    newTitleElement.innerHTML = getFriendlyLanguageName( syntaxLanguage );

                    newWindow.document.write( "<html>" );
                    newWindow.document.write( "<head>" );
                    newWindow.document.write( "<title>" );
                    newWindow.document.write( newTitleElement.innerHTML );
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

                buttonsElements.push( printButton );
            }

            if ( syntaxOptions.showLanguageLabel ) {
                var languageLabel = createElement( "div", "label" );
                languageLabel.innerHTML = getFriendlyLanguageName( syntaxLanguage );
                buttons.appendChild( languageLabel );
            }

            var buttonsElementsLength = buttonsElements.length;

            if ( buttonsElementsLength > _configuration.maximumButtons ) {
                var openButton = createElement( "div", "button button-opener" );
                openButton.innerText = _configuration.buttonsVisible ? _configuration.buttonsCloserText : _configuration.buttonsOpenerText;
                buttons.insertBefore( openButton, buttons.children[ 0 ] );

                openButton.onclick = function() {
                    var areButtonsVisible = openButton.innerText === _configuration.buttonsCloserText;

                    for ( var buttonsElementIndex = 0; buttonsElementIndex < buttonsElementsLength; buttonsElementIndex++ ) {
                        buttonsElements[ buttonsElementIndex ].style.display = areButtonsVisible ? "none" : "inline-block";
                    }

                    openButton.innerText = areButtonsVisible ? _configuration.buttonsOpenerText : _configuration.buttonsCloserText;
                };
            }
        }
    }

    function renderElementCommentVariables( innerHTML, language, syntaxOptions ) {
        var lookup = language.comment,
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

    function renderElementMultiLineCommentVariables( innerHTML, language, syntaxOptions ) {
        var lookup = language.multiLineComment;

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

    function renderElementKeywords( innerHTML, language, syntaxOptions ) {
        var keywords = getDefaultStringOrArray( language.keywords, [] ),
            caseSensitive = language.caseSensitive,
            keywordsCasing = language.keywordsCasing;

        if ( isDefinedString( keywordsCasing ) ) {
            keywordsCasing = keywordsCasing.toLowerCase().trim();
        }

        var keywordsLength = keywords.length;

        for ( var keywordIndex = 0; keywordIndex < keywordsLength; keywordIndex++ ) {
            var keyword = keywords[ keywordIndex ],
                keywordDisplay = keyword,
                regExFlags = caseSensitive ? "g" : "gi",
                regEx = new RegExp( "\\b" + keyword + "\\b", regExFlags );

            if ( keywordsCasing === "uppercase" ) {
                keywordDisplay = keywordDisplay.toUpperCase();
            } else if ( keywordsCasing === "lowercase" ) {
                keywordDisplay = keywordDisplay.toLowerCase();
            }

            if ( syntaxOptions.highlightKeywords ) {
                if ( isDefinedFunction( syntaxOptions.onKeywordClicked ) ) {
                    innerHTML = innerHTML.replace( regEx, "<span class=\"keyword-clickable\">" + keywordDisplay + "</span>" );
                } else {
                    innerHTML = innerHTML.replace( regEx, "<span class=\"keyword\">" + keywordDisplay + "</span>" );
                }

            } else {
                if ( isDefinedFunction( syntaxOptions.onKeywordClicked ) ) {
                    innerHTML = innerHTML.replace( regEx, "<span class=\"no-highlight-keyword-clickable\">" + keywordDisplay + "</span>" );
                }
            }

            fireCustomTrigger( syntaxOptions.onKeywordRender, keyword );
        }

        return innerHTML;
    }

    function renderElementValues( innerHTML, language, syntaxOptions ) {
        var values = getDefaultStringOrArray( language.values, [] ),
            valuesLength = values.length,
            caseSensitive = language.caseSensitive;

        for ( var valueIndex = 0; valueIndex < valuesLength; valueIndex++ ) {
            var value = values[ valueIndex ],
                regExFlags = caseSensitive ? "g" : "gi",
                regEx = new RegExp( "\\b" + value + "\\b", regExFlags );

            if ( syntaxOptions.highlightValues ) {
                if ( isDefinedFunction( syntaxOptions.onValueClicked ) ) {
                    innerHTML = innerHTML.replace( regEx, "<span class=\"value-clickable\">" + value + "</span>" );
                } else {
                    innerHTML = innerHTML.replace( regEx, "<span class=\"value\">" + value + "</span>" );
                }

            } else {
                if ( isDefinedFunction( syntaxOptions.onValueClicked ) ) {
                    innerHTML = innerHTML.replace( regEx, "<span class=\"no-highlight-value-clickable\">" + value + "</span>" );
                }
            }

            fireCustomTrigger( syntaxOptions.onValueRender, value );
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

    function renderElementCompletedHTML( element, numbers, syntax, innerHTML, syntaxOptions, isPreFormatted ) {
        var lines = innerHTML.split( _string.newLine ),
            linesLength = lines.length,
            linesLengthStringLength = linesLength.toString().length,
            numberContainer = numbers,
            codeContainer = syntax,
            replaceWhitespace = null,
            lineNumber = 1;

        if ( isPreFormatted ) {
            codeContainer = createElement( "pre" );
            syntax.appendChild( codeContainer );

            if ( isDefined( numbers ) ) {
                numberContainer = createElement( "pre" );
                numbers.appendChild( numberContainer );
            }
        }

        if ( isDefined( numbers ) ) {
            numbers.ondblclick = function() {
                selectTextInElement( codeContainer );
            };
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

                        if ( syntaxOptions.padLineNumbers ) {
                            numberCode.innerHTML = padNumber( lineNumber.toString(), linesLengthStringLength );
                        } else {
                            numberCode.innerHTML = lineNumber.toString();
                        }

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
                renderElementClickEvent( keywords[ keywordIndex ], syntaxOptions.onKeywordClicked );
            }
        }

        if ( isDefinedFunction( syntaxOptions.onValueClicked ) ) {
            var values = element.getElementsByClassName( "value-clickable" ),
                valuesLength = values.length;

            for ( var valueIndex = 0; valueIndex < valuesLength; valueIndex++ ) {
                renderElementClickEvent( values[ valueIndex ], syntaxOptions.onValueClicked );
            }
        }
    }

    function renderElementClickEvent( element, customTrigger ) {
        var text = element.innerText;

        element.onclick = function() {
            customTrigger( text );
        };
    }

    function getFriendlyLanguageName( syntaxLanguage ) {
        var result = null,
            language = getLanguage( syntaxLanguage );

        if ( isDefined( language ) && isDefinedString( language.friendlyName ) ) {
            result = language.friendlyName.toUpperCase();
        } else {
            result = syntaxLanguage.toUpperCase();
        }

        return result;
    }

    function getLanguage( syntaxLanguage ) {
        var result = null,
            lookup = syntaxLanguage.toLowerCase();

        if ( _languages.hasOwnProperty( lookup ) ) {
            result = _languages[ lookup ];
        } else {

            if ( _aliases_Rules.hasOwnProperty( lookup ) ) {
                lookup = _aliases_Rules[ lookup ];

                if ( _languages.hasOwnProperty( lookup ) ) {
                    result = _languages[ lookup ];
                }
            }
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
        options.highlightValues = getDefaultBoolean( options.highlightValues, true );
        options.highlightStrings = getDefaultBoolean( options.highlightStrings, true );
        options.highlightComments = getDefaultBoolean( options.highlightComments, true );
        options.showLanguageLabel = getDefaultBoolean( options.showLanguageLabel, true );
        options.showPrintButton = getDefaultBoolean( options.showPrintButton, true );
        options.padLineNumbers = getDefaultBoolean( options.padLineNumbers, false );
        
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
        options.onValueClicked = getDefaultFunction( options.onValueClicked, null );
        options.onKeywordRender = getDefaultFunction( options.onKeywordRender, null );
        options.onValueRender = getDefaultFunction( options.onValueRender, null );
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

    function isDefinedNumber( object ) {
        return isDefined( object ) && typeof object === "number";
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

    function selectTextInElement( element ) {
        if ( _parameter_Document.selection ) {
            var textRange = _parameter_Document.body.createTextRange();
            textRange.moveToElementText( element );
            textRange.select();

        } else if ( _parameter_Window.getSelection ) {
            var range = _parameter_Document.createRange();
            range.selectNode( element );

            _parameter_Window.getSelection().removeAllRanges();
            _parameter_Window.getSelection().addRange( range );
        }
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

    function getDefaultArray( value, defaultValue ) {
        return isDefinedArray( value ) ? value : defaultValue;
    }

    function getDefaultNumber( value, defaultValue ) {
        return isDefinedNumber( value ) ? value : defaultValue;
    }

    function getDefaultStringOrArray( value, defaultValue ) {
        if ( isDefinedString( value ) ) {
            value = value.split( _string.space );

            if ( value.length === 0 ) {
                value = defaultValue;
            }

        } else {
            value = getDefaultArray( value, defaultValue );
        }

        return value;
    }

    function getObjectFromString( objectString ) {
        var parsed = true,
            result = null;

        try {
            if ( isDefinedString( objectString ) ) {
                result = JSON.parse( objectString );
            }

        } catch ( e1 ) {

            try {
                result = eval( "(" + objectString + ")" );

                if ( isDefinedFunction( result ) ) {
                    result = result();
                }
                
            } catch ( e2 ) {
                if ( !_configuration.safeMode ) {
                    console.error( "Errors in object: " + e1.message + ", " + e2.message );
                    parsed = false;
                }
                
                result = null;
            }
        }

        return {
            parsed: parsed,
            result: result
        };
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

    function padNumber( number, length ) {
        var result = number;

        while ( result.length < length ) {
            result = "0" + result;
        }
            
        return result;
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
     * getElementsHighlighted().
     * 
     * Returns the elements that have been detected and rendered.
     * 
     * @public
     * 
     * @returns     {Object[]}                                              An array containing the rendered DOM elements.
     */

    this.getElementsHighlighted = function() {
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
        var added = false,
            lookup = name.toLowerCase();

        if ( !_languages.hasOwnProperty( lookup ) ) {
            triggerRender = !isDefinedBoolean( triggerRender ) ? true : triggerRender;

            _languages[ lookup ] = languageDetails;
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
     * Removes a language that can be rendered.
     * 
     * @public
     * 
     * @param       {string}    name                                        The name of the language.
     * 
     * @returns     {boolean}                                               States if the language has been removed.
     */
    this.removeLanguage = function( name ) {
        var removed = false,
            lookup = name.toLowerCase();

        if ( _languages.hasOwnProperty( lookup ) ) {
            delete _languages[ lookup ];

            for ( var alias in _aliases_Rules ) {
                if ( _aliases_Rules.hasOwnProperty( alias ) && _aliases_Rules[ alias ] === lookup ) {
                    delete _aliases_Rules[ alias ];
                }
            }

            removed = true;
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
        var details = null,
            lookup = name.toLowerCase();

        if ( _languages.hasOwnProperty( lookup ) ) {
            details = getClonedObject( lookup );
        }

        return details;
    };

    /**
     * getLanguages().
     * 
     * Returns all the languages that can be rendered.
     * 
     * @public
     * 
     * @returns     {Object}                                                The object that contains the languages.
     */
    this.getLanguages = function() {
        return getClonedObject( _languages );
    };


    /*
     * ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------
     * Public Functions:  Language Aliases
     * ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------
     */

    /**
     * addAlias().
     * 
     * Adds a new language alias.
     * 
     * @public
     * @fires       onRenderComplete
     * 
     * @param       {string}    alias                                       The name of the alias.
     * @param       {string}    language                                    The name of the language.
     * @param       {boolean}   [triggerRender]                             States if new language alias DOM elements available should be rendered.
     * 
     * @returns     {boolean}                                               States if the alias has been added.
     */
    this.addAlias = function( alias, language, triggerRender ) {
        var added = false;

        if ( _languages.hasOwnProperty( language.toLowerCase() ) && !_aliases_Rules.hasOwnProperty( alias.toLowerCase() ) ) {
            triggerRender = !isDefinedBoolean( triggerRender ) ? true : triggerRender;

            _aliases_Rules[ alias.toLowerCase() ] = language.toLowerCase();
            added = true;

            if ( triggerRender ) {
                render();
            }
        }

        return added;
    };

    /**
     * removeAlias().
     * 
     * Removes a language alias.
     * 
     * @public
     * 
     * @param       {string}    alias                                       The name of the alias.
     * 
     * @returns     {boolean}                                               States if the alias has been removed.
     */
    this.removeAlias = function( alias ) {
        var removed = false;

        if ( _aliases_Rules.hasOwnProperty( alias.toLowerCase() ) ) {
            delete _aliases_Rules[ alias.toLowerCase() ];

            removed = true;
        }

        return removed;
    };

    /**
     * getAlias().
     * 
     * Returns a language alias.
     * 
     * @public
     * 
     * @param       {string}    alias                                       The name of the alias.
     * 
     * @returns     {string}                                                The name of the language.
     */
    this.getAlias = function( alias ) {
        var result = null;

        if ( _aliases_Rules.hasOwnProperty( alias.toLowerCase() ) ) {
            result = _aliases_Rules[ alias.toLowerCase() ];
        }

        return result;
    };

    /**
     * getAliases().
     * 
     * Returns all the language aliases.
     * 
     * @public
     * 
     * @returns     {Object}                                                The object that contains the aliases.
     */
    this.getAliases = function() {
        return getClonedObject( _aliases_Rules );
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
        _configuration.highlightAllDomElementTypes = getDefaultStringOrArray( _configuration.highlightAllDomElementTypes, [ "div", "code" ] );
        _configuration.maximumButtons = getDefaultNumber( _configuration.maximumButtons, 2 );
        _configuration.buttonsVisible = getDefaultBoolean( _configuration.buttonsVisible, true );
        _configuration.buttonsOpenerText = getDefaultString( _configuration.buttonsOpenerText, "<" );
        _configuration.buttonsCloserText = getDefaultString( _configuration.buttonsCloserText, ">" );
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
        return "1.6.2";
    };


    /*
     * ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------
     * Initialize Syntax.js
     * ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------
     */

    ( function ( documentObject, navigatorObject, windowObject ) {
        _parameter_Document = documentObject;
        _parameter_Navigator = navigatorObject;
        _parameter_Window = windowObject;

        buildDefaultConfiguration();

        _parameter_Document.addEventListener( "DOMContentLoaded", function() {
            render();
        } );

        if ( !isDefined( _parameter_Window.$syntax ) ) {
            _parameter_Window.$syntax = this;
        }

    } ) ( document, navigator, window );
} )();