/**
 * Syntax.js
 * 
 * A lightweight, and easy-to-use, JavaScript library for code syntax highlighting!
 * 
 * @file        syntax.js
 * @version     v2.5.0
 * @author      Bunoon
 * @license     MIT License
 * @copyright   Bunoon 2024
 */


( function() {
    "use strict";

    var // Variables: Constructor Parameters
        _parameter_Document = null,
        _parameter_Navigator = null,
        _parameter_Window = null,
        _parameter_Math = null,
        _parameter_Json = null,

        // Variables: Public Scope
        _public = {},

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

        // Variables: Temporary Caching
        _cached_Keywords = {},
        _cached_Keywords_Count = 0,
        _cached_Values = {},
        _cached_Values_Count = 0,
        _cached_Attributes = {},
        _cached_Attributes_Count = 0,
        _cached_Strings = {},
        _cached_Strings_Count = 0,
        _cached_Comments = {},
        _cached_Comments_Count = 0,
        
        // Variables: Languages
        _languages = {},
        _languages_Unknown = "unknown",
        _languages_Tabbed = "tabbed",

        // Variables: Attribute Names
        _attribute_Name_Language = "data-syntax-language",
        _attribute_Name_Options = "data-syntax-options",
        _attribute_Name_Buttons = "data-syntax-buttons",
        _attribute_Name_TabContents = "data-syntax-tab-contents";

    
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

            if ( elementsLength > 0 ) {
                fireCustomTrigger( _configuration.onBeforeRender );
            }

            for ( var elementIndex = 0; elementIndex < elementsLength; elementIndex++ ) {
                var element = elements[ elementIndex ],
                    elementBreak = false;

                if ( element.hasAttribute( _attribute_Name_Language ) && element.getAttribute( _attribute_Name_Language ).toLowerCase() === _languages_Tabbed ) {
                    var divElements = [].slice.call( element.children ),
                        divElementsLength = divElements.length,
                        tabElements = [],
                        tabContentElements = [];

                    element.removeAttribute( _attribute_Name_Language );
                    element.className = element.className === _string.empty ? "syntax-highlight" : element.className + " syntax-highlight";
                    element.innerHTML = _string.empty;

                    var codeContainer = createElement( "div", "code custom-scroll-bars" );
                    element.appendChild( codeContainer );

                    var tabs = createElement( "div", "tabs" );
                    codeContainer.appendChild( tabs );

                    for ( var divElementIndex = 0; divElementIndex < divElementsLength; divElementIndex++ ) {
                        var renderResult = renderElement( divElements[ divElementIndex ], codeContainer );

                        if ( !renderResult.rendered ) {
                            elementBreak = true;

                        } else {
                            renderTab( tabs, tabElements, tabContentElements, renderResult, divElementIndex, renderResult.tabBindingOptions, renderResult.syntaxLanguage );
                        }
                    }
                    
                } else {
                    if ( !renderElement( element ).rendered ) {
                        elementBreak = true;
                    }
                }

                if ( elementBreak ) {
                    break;
                }
            }

            if ( elementsLength > 0 ) {
                fireCustomTrigger( _configuration.onAfterRender );
            }
        }
    }

    function renderTab( tabs, tabElements, tabContentElements, renderResult, divElementIndex, tabBindingOptions, syntaxLanguage ) {
        var tab = createElement( "button", "tab" );
        tabs.appendChild( tab );

        setNodeText( tab, renderResult.tabTitle );

        tabElements.push( tab );
        tabContentElements.push( renderResult.tabContents );

        tab.onclick = function() {
            if ( tab.className !== "tab-active" ) {
                var tabElementsLength = tabElements.length,
                    tabContentElementsLength = tabContentElements.length;

                for ( var tabElementsIndex = 0; tabElementsIndex < tabElementsLength; tabElementsIndex++ ) {
                    tabElements[ tabElementsIndex ].className = "tab";
                }

                for ( var tabContentElementsIndex = 0; tabContentElementsIndex < tabContentElementsLength; tabContentElementsIndex++ ) {
                    tabContentElements[ tabContentElementsIndex ].style.display = "none";
                }

                tab.className = "tab-active";
                renderResult.tabContents.style.display = "flex";

                if ( isDefinedObject( tabBindingOptions ) ) {
                    fireCustomTrigger( tabBindingOptions.onOpen, syntaxLanguage );
                }
            }
        };

        if ( divElementIndex > 0 ) {
            renderResult.tabContents.style.display = "none";
        } else {
            tab.className = "tab-active";
        }
    }

    function renderElement( element, codeContainer ) {
        var result = true,
            tabTitle = null,
            tabContents = null,
            tabBindingOptions = null,
            syntaxLanguage = null;

        if ( isDefined( element ) && element.hasAttribute( _attribute_Name_Language ) && ( !element.hasAttribute( _attribute_Name_TabContents ) || isDefined( codeContainer ) ) ) {
            syntaxLanguage = element.getAttribute( _attribute_Name_Language );

            if ( isDefinedString( syntaxLanguage ) ) {
                var language = getLanguage( syntaxLanguage );

                if ( isDefined( language ) || syntaxLanguage.toLowerCase() === _languages_Unknown ) {
                    var syntaxOptionsParsed = getObjectFromString( element.getAttribute( _attribute_Name_Options ) ),
                        syntaxButtonsParsed = getObjectFromString( element.getAttribute( _attribute_Name_Buttons ) );

                    if ( syntaxOptionsParsed.parsed ) {
                        if ( element.innerHTML.trim() !== _string.empty ) {
                            var innerHTML = element.innerHTML,
                                syntaxOptions = getBindingOptions( syntaxOptionsParsed.result ),
                                isPreFormatted = false,
                                descriptionText = null;

                            fireCustomTrigger( syntaxOptions.onBeforeRenderComplete, element );

                            if ( element.children.length > 0 && element.children[ 0 ].nodeName.toLowerCase() === "pre" ) {
                                innerHTML = element.children[ 0 ].innerHTML;
                                isPreFormatted = true;
                            }
                            
                            var innerHTMLCopy = innerHTML.trim(),
                                numbers = null,
                                description = null,
                                elementId = element.id;

                            if ( !isDefinedString( elementId ) ) {
                                elementId = newGuid();
                            }

                            _elements_Original[ elementId ] = element.innerHTML;

                            element.removeAttribute( _attribute_Name_Language );
                            element.removeAttribute( _attribute_Name_Options );
                            element.id = elementId;

                            if ( !isDefined( codeContainer ) ) {
                                element.className = element.className === _string.empty ? "syntax-highlight" : element.className + " syntax-highlight";
                                element.innerHTML = _string.empty;

                                codeContainer = createElement( "div", "code custom-scroll-bars" );
                                element.appendChild( codeContainer );

                            } else {
                                if ( element.hasAttribute( _attribute_Name_TabContents ) && element.getAttribute( _attribute_Name_TabContents ).toLowerCase() !== "true" ) {
                                    var syntaxTabOptions = getObjectFromString( element.getAttribute( _attribute_Name_TabContents ) );

                                    if ( syntaxTabOptions.parsed && isDefinedObject( syntaxTabOptions.result ) ) {
                                        tabBindingOptions = getBindingTabContentOptions( syntaxTabOptions.result );
                                        descriptionText = tabBindingOptions.description;

                                        if ( isDefinedString( tabBindingOptions.title ) ) {
                                            tabTitle = tabBindingOptions.title;
                                        }
                                    }

                                } else {
                                    tabTitle = getFriendlyLanguageName( syntaxLanguage );
                                }
                            }

                            tabContents = createElement( "div", "tab-contents" );
                            codeContainer.appendChild( tabContents );

                            if ( isDefinedString( descriptionText ) ) {
                                description = createElement( "div", "description" );
                                tabContents.appendChild( description );

                                setNodeText( description, descriptionText );
                            }

                            if ( syntaxOptions.showLineNumbers ) {
                                numbers = createElement( "div", "numbers" );
                                tabContents.appendChild( numbers );
                            }
                
                            var syntax = createElement( "div", "syntax" );
                            tabContents.appendChild( syntax );

                            renderElementButtons( syntax, syntaxOptions, syntaxLanguage, syntaxButtonsParsed, innerHTMLCopy );

                            if ( syntaxLanguage.toLowerCase() !== _languages_Unknown ) {
                                innerHTML = renderHTML( innerHTML, language, syntaxOptions );
                            } else {
                                innerHTML = encodeMarkUpCharacters( innerHTML );
                            }

                            renderElementCompletedHTML( element, description, numbers, syntax, innerHTML, syntaxOptions, isPreFormatted );
                            fireCustomTrigger( syntaxOptions.onRenderComplete, element );

                            _elements.push( element );

                            _cached_Keywords = {};
                            _cached_Keywords_Count = 0;
                            _cached_Values = {};
                            _cached_Values_Count = 0;
                            _cached_Attributes = {};
                            _cached_Attributes_Count = 0;
                            _cached_Strings = {};
                            _cached_Strings_Count = 0;
                            _cached_Comments = {};
                            _cached_Comments_Count = 0;

                        } else {
                            result = logError( "No code is available available to render, skipping." );
                        }

                    } else {
                        result = !_configuration.safeMode;
                    }

                } else {
                    result = logError( "Language '" + syntaxLanguage + "' is not supported." );
                }

            } else {
                result = logError( "The attribute '" + _attribute_Name_Language + "' has not been set correctly." );
            }
        }

        return {
            rendered: result,
            tabContents: tabContents,
            tabTitle: tabTitle,
            tabBindingOptions: tabBindingOptions,
            syntaxLanguage: syntaxLanguage
        };
    }

    function renderHTML( innerHTML, language, syntaxOptions ) {
        if ( !language.isMarkUp ) {
            innerHTML = encodeMarkUpCharacters( innerHTML );
        }

        if ( syntaxOptions.highlightComments ) {
            innerHTML = renderElementMultiLineCommentVariables( innerHTML, language, syntaxOptions );
            innerHTML = renderElementCommentVariables( innerHTML, language, syntaxOptions );
        }

        if ( syntaxOptions.highlightStrings ) {
            innerHTML = renderElementStringPatternVariables( innerHTML, innerHTML.match( /"((?:\\.|[^"\\])*)"/g ), syntaxOptions );

            if ( language.comment !== "'" ) {
                innerHTML = renderElementStringPatternVariables( innerHTML, innerHTML.match( /'((?:\\.|[^"\\])*)'/g ), syntaxOptions );
            }
        }

        if ( !language.isMarkUp ) {
            innerHTML = renderElementKeywords( innerHTML, language, syntaxOptions );
        } else {
            innerHTML = replaceMarkUpKeywords( innerHTML, language, syntaxOptions );
        }
        
        innerHTML = renderElementValues( innerHTML, language, syntaxOptions );

        if ( language.isMarkUp ) {
            innerHTML = renderElementAttributes( innerHTML, language, syntaxOptions );
        }

        innerHTML = encodeMarkUpCharacters( innerHTML );

        if ( syntaxOptions.highlightComments ) {
            innerHTML = renderElementCommentsFromVariables( innerHTML, language );
        }
        
        if ( syntaxOptions.highlightStrings ) {
            innerHTML = renderElementStringQuotesFromVariables( innerHTML );
        }

        innerHTML = renderElementVariables( innerHTML, _cached_Keywords );
        innerHTML = renderElementVariables( innerHTML, _cached_Values );

        if ( language.isMarkUp ) {
            innerHTML = renderElementVariables( innerHTML, _cached_Attributes );
        }

        return innerHTML;
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
                        renderElementButton( customButton, buttonsElements, buttons, innerHTMLCopy, syntaxOptions );
                    }
                }
            }

            if ( syntaxOptions.showCopyButton ) {
                var copyButton = createElement( "button", "button" );
                copyButton.style.display = syntaxOptions.buttonsVisible ? "inline-block" : "none";
                buttons.appendChild( copyButton );

                setNodeText( copyButton, syntaxOptions.copyButtonText );

                copyButton.onclick = function() {
                    _parameter_Navigator.clipboard.writeText( innerHTMLCopy );

                    fireCustomTrigger( syntaxOptions.onCopy, innerHTMLCopy );
                };

                buttonsElements.push( copyButton );
            }

            if ( syntaxOptions.showPrintButton ) {
                var printButton = createElement( "button", "button" );
                printButton.style.display = syntaxOptions.buttonsVisible ? "inline-block" : "none";
                buttons.appendChild( printButton );

                setNodeText( printButton, syntaxOptions.printButtonText );

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
                var languageLabel = createElement( "div", "language-label" );
                buttons.appendChild( languageLabel );

                setNodeText( languageLabel, getFriendlyLanguageName( syntaxLanguage, syntaxOptions.languageLabelCasing ) );
            }

            var buttonsElementsLength = buttonsElements.length;

            if ( buttonsElementsLength > syntaxOptions.maximumButtons ) {
                var openButton = createElement( "button", "button button-opener" );
                openButton.innerText = syntaxOptions.buttonsVisible ? _configuration.buttonsCloserText : _configuration.buttonsOpenerText;
                buttons.insertBefore( openButton, buttons.children[ 0 ] );

                openButton.onclick = function() {
                    var areButtonsVisible = openButton.innerText === _configuration.buttonsCloserText;

                    for ( var buttonsElementIndex = 0; buttonsElementIndex < buttonsElementsLength; buttonsElementIndex++ ) {
                        buttonsElements[ buttonsElementIndex ].style.display = areButtonsVisible ? "none" : "inline-block";
                    }

                    openButton.innerText = areButtonsVisible ? _configuration.buttonsOpenerText : _configuration.buttonsCloserText;

                    if ( areButtonsVisible ) {
                        fireCustomTrigger( syntaxOptions.onButtonsClosed );
                    } else {
                        fireCustomTrigger( syntaxOptions.onButtonsOpened );
                    }
                };

            } else if ( !syntaxOptions.buttonsVisible && buttonsElementsLength <= syntaxOptions.maximumButtons ) {
                for ( var buttonsElementIndex = 0; buttonsElementIndex < buttonsElementsLength; buttonsElementIndex++ ) {
                    buttonsElements[ buttonsElementIndex ].style.display = "inline-block";
                }
            }
        }
    }

    function renderElementButton( customButton, buttonsElements, buttons, innerHTMLCopy, syntaxOptions ) {
        var newCustomButton = createElement( "button", "button" );
        newCustomButton.style.display = syntaxOptions.buttonsVisible ? "inline-block" : "none";
        buttons.appendChild( newCustomButton );

        setNodeText( newCustomButton, customButton.text );

        newCustomButton.onclick = function() {
            customButton.onClick( innerHTMLCopy );
        };

        if ( isDefined( customButton.className ) ) {
            newCustomButton.className += _string.space + customButton.className;
        }

        buttonsElements.push( newCustomButton );
    }

    function renderElementCommentVariables( innerHTML, language, syntaxOptions ) {
        var lookup = language.comment;

        if ( isDefinedString( lookup ) ) {
            var patternItems = innerHTML.match( new RegExp( lookup + ".*", "g" ) );

            if ( patternItems !== null ) {
                var patternItemsLength = patternItems.length;
            
                for ( var patternItemsIndex = 0; patternItemsIndex < patternItemsLength; patternItemsIndex++ ) {
                    var comment = patternItems[ patternItemsIndex ],
                        commentVariable = "$C{" + _cached_Comments_Count.toString() + "}";
    
                    _cached_Comments[ commentVariable ] = "<span class=\"comment\">" + comment + "</span>";
                    _cached_Comments_Count++;
        
                    innerHTML = innerHTML.replace( comment, commentVariable );
    
                    fireCustomTrigger( syntaxOptions.onCommentRender, comment );
                }
            }
        }
        
        return innerHTML;
    }

    function renderElementMultiLineCommentVariables( innerHTML, language, syntaxOptions ) {
        var multiLineComment = language.multiLineComment;

        if ( isDefinedArray( multiLineComment ) && multiLineComment.length === 2 ) {
            var startIndex = 0,
                endIndex = 0;

            while ( startIndex >= 0 && endIndex >= 0 ) {
                startIndex = innerHTML.indexOf( multiLineComment[ 0 ], endIndex );
    
                if ( startIndex > -1 ) {
                    endIndex = innerHTML.indexOf( multiLineComment[ 1 ], startIndex + multiLineComment[ 0 ].length );
    
                    if ( endIndex > -1 ) {
                        var comment = innerHTML.substring( startIndex, endIndex + multiLineComment[ 1 ].length ),
                            commentLines = comment.split( _string.newLine ),
                            commentLinesLength = commentLines.length,
                            commentCssClass = commentLinesLength === 1 ? "comment" : "multi-line-comment";
                        
                        for ( var commentLineIndex = 0; commentLineIndex < commentLinesLength; commentLineIndex++ ) {
                            var commentVariable = "$C{" + _cached_Comments_Count.toString() + "}",
                                commentLine = commentLines[ commentLineIndex ];
                            
                            _cached_Comments[ commentVariable ] = "<span class=\"" + commentCssClass + "\">" + commentLine + "</span>";
                            _cached_Comments_Count++;
                
                            innerHTML = innerHTML.replace( commentLine, commentVariable );
                        }

                        fireCustomTrigger( syntaxOptions.onCommentRender, comment );
                    }
                }
            }
        }

        return innerHTML;
    }

    function renderElementStringPatternVariables( innerHTML, patternItems, syntaxOptions ) {
        if ( patternItems !== null ) {
            var patternItemsLength = patternItems.length;
        
            for ( var patternItemsIndex = 0; patternItemsIndex < patternItemsLength; patternItemsIndex++ ) {
                var string = patternItems[ patternItemsIndex ],
                    stringLines = string.split( _string.newLine ),
                    stringLinesLength = stringLines.length,
                    stringCssClass = stringLinesLength === 1 ? "string" : "multi-line-string";

                for ( var stringLineIndex = 0; stringLineIndex < stringLinesLength; stringLineIndex++ ) {
                    var stringLine = stringLines[ stringLineIndex ],
                        stringVariable = "$S{" + _cached_Strings_Count.toString() + "}";

                    _cached_Strings[ stringVariable ] = "<span class=\"" + stringCssClass + "\">" + stringLine + "</span>";
                    _cached_Strings_Count++;
        
                    innerHTML = innerHTML.replace( stringLine, stringVariable );
                }

                fireCustomTrigger( syntaxOptions.onStringRender, string );
            }
        }

        return innerHTML;
    }

    function renderElementKeywords( innerHTML, language, syntaxOptions ) {
        var keywords = getDefaultStringOrArray( language.keywords, [] ),
            keywordsLength = keywords.length,
            caseSensitive = language.caseSensitive,
            keywordsCasing = getKeywordCasing( language.keywordsCasing );

        sortArrayOfStringByLength( keywords );

        for ( var keywordIndex = 0; keywordIndex < keywordsLength; keywordIndex++ ) {
            var keyword = keywords[ keywordIndex ],
                keywordDisplay = getDisplayTextTestCasing( keyword, keywordsCasing ),
                keywordVariable = "KW" + _cached_Keywords_Count.toString() + ";",
                keywordReplacement = null,
                regExFlags = caseSensitive ? "g" : "gi",
                regEx = new RegExp( getWordRegEx( keyword, language ), regExFlags );

            if ( syntaxOptions.highlightKeywords ) {
                if ( isDefinedFunction( syntaxOptions.onKeywordClicked ) ) {
                    keywordReplacement = "<span class=\"keyword-clickable\">" + keywordDisplay + "</span>";
                    innerHTML = innerHTML.replace( regEx, keywordVariable );
                } else {
                    keywordReplacement = "<span class=\"keyword\">" + keywordDisplay + "</span>";
                    innerHTML = innerHTML.replace( regEx, keywordVariable );
                }

            } else {
                if ( isDefinedFunction( syntaxOptions.onKeywordClicked ) ) {
                    keywordReplacement = "<span class=\"no-highlight-keyword-clickable\">" + keywordDisplay + "</span>";
                    innerHTML = innerHTML.replace( regEx, keywordVariable );
                }
            }

            _cached_Keywords[ keywordVariable ] = keywordReplacement;
            _cached_Keywords_Count++;

            fireCustomTrigger( syntaxOptions.onKeywordRender, keyword );
        }

        return innerHTML;
    }

    function replaceMarkUpKeywords( innerHTML, language, syntaxOptions ) {
        var keywords = getDefaultStringOrArray( language.keywords, [] ),
            caseSensitive = language.caseSensitive,
            keywordsCasing = getKeywordCasing( language.keywordsCasing );

        var regEx = /(<([^>]+)>)/ig,
            regExFlags = caseSensitive ? "g" : "gi",
            regExResult = regEx.exec( innerHTML );

        while ( regExResult ) {
            if ( regExResult.index === regEx.lastIndex ) {
                regEx.lastIndex++;
            }

            var tag = regExResult[ 0 ];
            tag = tag.replace( "</", _string.empty ).replace( "<", _string.empty ).replace( ">", _string.empty );
            tag = tag.split( _string.space )[ 0 ];

            if ( keywords.indexOf( tag ) > -1 ) {
                var keywordVariable = "KW" + _cached_Keywords_Count.toString() + ";",
                    regExReplace = new RegExp( getWordRegEx( tag, language ), regExFlags ),
                    keywordReplacement = null,
                    replacementTagDisplay = getDisplayTextTestCasing( tag, keywordsCasing );

                if ( syntaxOptions.highlightKeywords ) {
                    if ( isDefinedFunction( syntaxOptions.onKeywordClicked ) ) {
                        keywordReplacement = "<span class=\"keyword-clickable\">" + replacementTagDisplay + "</span>";
                    } else {
                        keywordReplacement = "<span class=\"keyword\">" + replacementTagDisplay + "</span>";
                    }
    
                } else {
                    if ( isDefinedFunction( syntaxOptions.onKeywordClicked ) ) {
                        keywordReplacement = "<span class=\"no-highlight-keyword-clickable\">" + replacementTagDisplay + "</span>";
                    }
                }

                innerHTML = innerHTML.replace( regExReplace, keywordVariable );

                _cached_Keywords[ keywordVariable ] = keywordReplacement;
                _cached_Keywords_Count++;
            }

            regExResult = regEx.exec( innerHTML );
        }

        return innerHTML;
    }

    function renderElementValues( innerHTML, language, syntaxOptions ) {
        var values = getDefaultStringOrArray( language.values, [] ),
            valuesLength = values.length,
            caseSensitive = language.caseSensitive;

        sortArrayOfStringByLength( values );

        for ( var valueIndex = 0; valueIndex < valuesLength; valueIndex++ ) {
            var value = values[ valueIndex ],
                valueVariable = "VAL" + _cached_Values_Count.toString() + ";",
                valueReplacement = null,
                regExFlags = caseSensitive ? "g" : "gi",
                regEx = new RegExp( getWordRegEx( value, language ), regExFlags );

            if ( syntaxOptions.highlightValues ) {
                if ( isDefinedFunction( syntaxOptions.onValueClicked ) ) {
                    valueReplacement = "<span class=\"value-clickable\">" + value + "</span>";
                    innerHTML = innerHTML.replace( regEx, valueVariable );
                } else {
                    valueReplacement = "<span class=\"value\">" + value + "</span>";
                    innerHTML = innerHTML.replace( regEx, valueVariable );
                }

            } else {
                if ( isDefinedFunction( syntaxOptions.onValueClicked ) ) {
                    valueReplacement = "<span class=\"no-highlight-value-clickable\">" + value + "</span>";
                    innerHTML = innerHTML.replace( regEx, valueVariable );
                }
            }

            _cached_Values[ valueVariable ] = valueReplacement;
            _cached_Values_Count++;

            fireCustomTrigger( syntaxOptions.onValueRender, value );
        }

        return innerHTML;
    }

    function renderElementAttributes( innerHTML, language, syntaxOptions ) {
        var attributes = getDefaultStringOrArray( language.attributes, [] ),
            attributesLength = attributes.length,
            caseSensitive = language.caseSensitive;

        sortArrayOfStringByLength( attributes );

        for ( var attributeIndex = 0; attributeIndex < attributesLength; attributeIndex++ ) {
            var attribute = attributes[ attributeIndex ],
                attributeVariable = "ATTR" + _cached_Attributes_Count.toString() + ";",
                attributeReplacement = null,
                regExFlags = caseSensitive ? "g" : "gi",
                regEx = new RegExp( getWordRegEx( attribute, language ), regExFlags );

            if ( syntaxOptions.highlightAttributes ) {
                if ( isDefinedFunction( syntaxOptions.onAttributeClicked ) ) {
                    attributeReplacement = "<span class=\"attribute-clickable\">" + attribute + "</span>";
                    innerHTML = innerHTML.replace( regEx, attributeVariable );
                } else {
                    attributeReplacement = "<span class=\"attribute\">" + attribute + "</span>";
                    innerHTML = innerHTML.replace( regEx, attributeVariable );
                }

            } else {
                if ( isDefinedFunction( syntaxOptions.onAttributeClicked ) ) {
                    attributeReplacement = "<span class=\"no-highlight-attribute-clickable\">" + attribute + "</span>";
                    innerHTML = innerHTML.replace( regEx, attributeVariable );
                }
            }

            _cached_Attributes[ attributeVariable ] = attributeReplacement;
            _cached_Attributes_Count++;

            fireCustomTrigger( syntaxOptions.onAttributeRender, attribute );
        }

        return innerHTML;
    }

    function renderElementStringQuotesFromVariables( innerHTML ) {
        for ( var quoteVariable in _cached_Strings ) {
            if ( _cached_Strings.hasOwnProperty( quoteVariable ) ) {
                innerHTML = innerHTML.replace( quoteVariable, _cached_Strings[ quoteVariable ] );
            }
        }

        return innerHTML;
    }

    function renderElementCommentsFromVariables( innerHTML, language ) {
        var multiLineComment = language.multiLineComment,
            start = null,
            end = null;

        if ( isDefinedArray( multiLineComment ) && multiLineComment.length === 2 ) {
            start = encodeMarkUpCharacters( multiLineComment[ 0 ] );
            end = encodeMarkUpCharacters( multiLineComment[ 1 ] );
        }

        for ( var commentVariable in _cached_Comments ) {
            if ( _cached_Comments.hasOwnProperty( commentVariable ) ) {
                var replacement = _cached_Comments[ commentVariable ];

                if ( language.isMarkUp && isDefinedString( start ) && isDefinedString( end ) ) {
                    replacement = replacement.replace( multiLineComment[ 0 ], start );
                    replacement = replacement.replace( multiLineComment[ 1 ], end );
                }

                innerHTML = innerHTML.replace( commentVariable, replacement );
            }
        }

        return innerHTML;
    }

    function renderElementVariables( innerHTML, variables ) {
        for ( var variable in variables ) {
            if ( variables.hasOwnProperty( variable ) ) {
                var regExHtmlReplace = new RegExp( variable, "g" );

                innerHTML = innerHTML.replace( regExHtmlReplace, variables[ variable ] );
            }
        }

        return innerHTML;
    }

    function renderElementCompletedHTML( element, description, numbers, syntax, innerHTML, syntaxOptions, isPreFormatted ) {
        var lines = innerHTML.split( _string.newLine ),
            linesLength = lines.length,
            linesLengthStringLength = linesLength.toString().length,
            numberContainer = numbers,
            codeContainer = syntax,
            replaceWhitespace = null,
            lineNumber = 1,
            lastLineWasBlank = false;

        if ( isPreFormatted ) {
            codeContainer = createElement( "pre" );
            syntax.appendChild( codeContainer );

            if ( isDefined( numbers ) ) {
                numberContainer = createElement( "pre" );
                numbers.appendChild( numberContainer );
            }
        }

        if ( syntaxOptions.doubleClickToSelectAll ) {
            if ( isDefined( description ) ) {
                description.ondblclick = function() {
                    selectTextInElement( codeContainer );
                };
            }

            if ( isDefined( numbers ) ) {
                numbers.ondblclick = function() {
                    selectTextInElement( codeContainer );
                };
            }
    
            syntax.ondblclick = function() {
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
                    var isBlank = line.trim() === _string.empty;

                    if ( isBlank && !lastLineWasBlank || !syntaxOptions.removeDuplicateBlankLines || !isBlank ) {
                        lastLineWasBlank = isBlank;

                        if ( isDefined( numberContainer ) ) {
                            var numberCode = createElement( "p" );
    
                            if ( syntaxOptions.padLineNumbers ) {
                                numberCode.innerText = padNumber( lineNumber.toString(), linesLengthStringLength );
                            } else {
                                numberCode.innerText = lineNumber.toString();
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
        }

        renderElementClickEvents( element, syntaxOptions.onKeywordClicked, "keyword-clickable" );
        renderElementClickEvents( element, syntaxOptions.onValueClicked, "value-clickable" );
    }

    function renderElementClickEvents( element, customTrigger, className ) {
        if ( isDefinedFunction( customTrigger ) ) {
            var elements = element.getElementsByClassName( className ),
                elementsLength = elements.length;

            for ( var elementIndex = 0; elementIndex < elementsLength; elementIndex++ ) {
                renderElementClickEvent( elements[ elementIndex ], customTrigger );
            }
        }
    }

    function renderElementClickEvent( element, customTrigger ) {
        var text = element.innerText;

        element.onclick = function() {
            customTrigger( text );
        };
    }

    function getFriendlyLanguageName( syntaxLanguage, languageLabelCasing ) {
        var result = null,
            language = getLanguage( syntaxLanguage );

        if ( isDefined( language ) && isDefinedString( language.friendlyName ) ) {
            result = language.friendlyName;
        } else {
            result = syntaxLanguage;
        }

        result = getDisplayTextTestCasing( result, languageLabelCasing );

        return result;
    }

    function getLanguage( syntaxLanguage ) {
        var result = null,
            language = syntaxLanguage.toLowerCase();

        if ( _languages.hasOwnProperty( language ) ) {
            result = _languages[ language ];
        } else {

            if ( _aliases_Rules.hasOwnProperty( language ) ) {
                language = _aliases_Rules[ language ];

                if ( _languages.hasOwnProperty( language ) ) {
                    result = _languages[ language ];
                }
            }
        }

        return result;
    }

    function getKeywordCasing( keywordsCasing ) {
        if ( isDefinedString( keywordsCasing ) ) {
            keywordsCasing = keywordsCasing.toLowerCase().trim();
        }

        return keywordsCasing;
    }

    function getDisplayTextTestCasing( keyword, keywordsCasing ) {
        if ( keywordsCasing === "uppercase" ) {
            keyword = keyword.toUpperCase();
        } else if ( keywordsCasing === "lowercase" ) {
            keyword = keyword.toLowerCase();
        }
        
        return keyword;
    }

    function getWordRegEx( word, language ) {
        var result = "(?<=^|[^-])\\b" + word + "\\b(?=[^-]|$)";

        if ( isDefinedString( language.wordRegEx ) ) {
            result = language.wordRegEx.replace( "%word%", word );
        }

        return result;
    }


    /*
     * ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------
     * Binding Options
     * ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------
     */

    function getBindingOptions( newOptions ) {
        var options = !isDefinedObject( newOptions ) ? {} : newOptions;

        options = buildBindingAttributeOptions( options );
        options = buildBindingAttributeOptionStrings( options );
        options = buildBindingAttributeOptionCustomTriggers( options );

        return options;
    }

    function buildBindingAttributeOptions( options ) {
        options.showCopyButton = getDefaultBoolean( options.showCopyButton, true );
        options.removeBlankLines = getDefaultBoolean( options.removeBlankLines, false );
        options.showLineNumbers = getDefaultBoolean( options.showLineNumbers, true );
        options.highlightKeywords = getDefaultBoolean( options.highlightKeywords, true );
        options.highlightValues = getDefaultBoolean( options.highlightValues, true );
        options.highlightAttributes = getDefaultBoolean( options.highlightAttributes, true );
        options.highlightStrings = getDefaultBoolean( options.highlightStrings, true );
        options.highlightComments = getDefaultBoolean( options.highlightComments, true );
        options.showLanguageLabel = getDefaultBoolean( options.showLanguageLabel, true );
        options.showPrintButton = getDefaultBoolean( options.showPrintButton, true );
        options.padLineNumbers = getDefaultBoolean( options.padLineNumbers, false );
        options.removeDuplicateBlankLines = getDefaultBoolean( options.removeDuplicateBlankLines, true );
        options.doubleClickToSelectAll = getDefaultBoolean( options.doubleClickToSelectAll, true );
        options.languageLabelCasing = getDefaultString( options.languageLabelCasing, "uppercase" );
        options.buttonsVisible = getDefaultBoolean( options.buttonsVisible, true );
        options.maximumButtons = getDefaultNumber( options.maximumButtons, 2 );
        
        return options;
    }

    function buildBindingAttributeOptionStrings( options ) {
        options.copyButtonText = getDefaultString( options.copyButtonText, "Copy" );
        options.printButtonText = getDefaultString( options.printButtonText, "Print" );

        return options;
    }

    function buildBindingAttributeOptionCustomTriggers( options ) {
        options.onCopy = getDefaultFunction( options.onCopy, null );
        options.onRenderComplete = getDefaultFunction( options.onRenderComplete, null );
        options.onKeywordClicked = getDefaultFunction( options.onKeywordClicked, null );
        options.onValueClicked = getDefaultFunction( options.onValueClicked, null );
        options.onAttributeClicked = getDefaultFunction( options.onAttributeClicked, null );
        options.onKeywordRender = getDefaultFunction( options.onKeywordRender, null );
        options.onValueRender = getDefaultFunction( options.onValueRender, null );
        options.onAttributeRender = getDefaultFunction( options.onAttributeRender, null );
        options.onStringRender = getDefaultFunction( options.onStringRender, null );
        options.onCommentRender = getDefaultFunction( options.onCommentRender, null );
        options.onPrint = getDefaultFunction( options.onPrint, null );
        options.onBeforeRenderComplete = getDefaultFunction( options.onBeforeRenderComplete, null );
        options.onButtonsOpened = getDefaultFunction( options.onButtonsOpened, null );
        options.onButtonsClosed = getDefaultFunction( options.onButtonsClosed, null );

        return options;
    }


    /*
     * ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------
     * Binding Options - Tab Contents
     * ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------
     */

    function getBindingTabContentOptions( newOptions ) {
        var options = !isDefinedObject( newOptions ) ? {} : newOptions;

        options = buildBindingTabContentAttributeOptionStrings( options );
        options = buildBindingTabContentAttributeOptionCustomTriggers( options );

        return options;
    }

    function buildBindingTabContentAttributeOptionStrings( options ) {
        options.title = getDefaultString( options.title, null );
        options.description = getDefaultString( options.description, null );

        return options;
    }

    function buildBindingTabContentAttributeOptionCustomTriggers( options ) {
        options.onOpen = getDefaultFunction( options.onOpen, null );

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

    function setNodeText( element, text ) {
        if ( !_configuration.allowHtmlInTextDisplay ) {
            var div = createElement( "div" );
            div.innerHTML = text;

            element.innerText = div.innerText;
        } else {
            element.innerHTML = text;
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
                result = _parameter_Json.parse( objectString );
            }

        } catch ( e1 ) {

            try {
                result = eval( "(" + objectString + ")" );

                if ( isDefinedFunction( result ) ) {
                    result = result();
                }
                
            } catch ( e2 ) {
                parsed = logError( "Errors in object: " + e1.message + ", " + e2.message );
                result = null;
            }
        }

        return {
            parsed: parsed,
            result: result
        };
    }

    function getClonedObject( object ) {
        var json = _parameter_Json.stringify( object ),
            result = _parameter_Json.parse( json );

        return result;
    }

    function logError( error ) {
        var result = true;

        if ( !_configuration.safeMode ) {
            console.error( error );
            result = false;
        }

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

            var character = _parameter_Math.floor( _parameter_Math.random() * 16 ).toString( 16 );
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

    function encodeMarkUpCharacters( data ) {
        data = data.replace(/</g, '&lt;');
        data = data.replace(/>/g, '&gt;');

        return data;
    }

    function sortArrayOfStringByLength( array ) {
        array.sort( function( a, b ){
            return b.length - a.length;
        } );
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
    _public.highlightAll = function() {
        render();

        return _public;
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
    _public.highlightElement = function( elementOrId ) {
        var element = elementOrId;

        if ( isDefinedString( element ) ) {
            element = _parameter_Document.getElementById( element );
        }

        if ( isDefined( element ) ) {
            renderElement( element );
        }

        return _public;
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

    _public.getElementsHighlighted = function() {
        return [].slice.call( _elements );
    };

    /**
     * getCode().
     * 
     * Returns the code inside a specific element (without rendering colors).
     * 
     * @public
     * 
     * @param       {string}    elementId                                   The element ID.
     * 
     * @returns     {string}                                                The code in the element.
     */

    _public.getCode = function( elementId ) {
        var result = null;

        if ( _elements_Original.hasOwnProperty( elementId ) ) {
            result = _elements_Original[ elementId ];
        }

        return result;
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
    _public.destroyAll = function() {
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

        return _public;
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
    _public.destroy = function( elementId ) {
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

        return _public;
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
    _public.addLanguage = function( name, languageDetails, triggerRender ) {
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
    _public.removeLanguage = function( name ) {
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
    _public.getLanguage = function( name ) {
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
    _public.getLanguages = function() {
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
    _public.addAlias = function( alias, language, triggerRender ) {
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
    _public.removeAlias = function( alias ) {
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
    _public.getAlias = function( alias ) {
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
    _public.getAliases = function() {
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
    _public.setConfiguration = function( newOptions ) {
        _configuration = !isDefinedObject( newOptions ) ? {} : newOptions;
        
        buildDefaultConfiguration();

        return _public;
    };

    function buildDefaultConfiguration() {
        _configuration.safeMode = getDefaultBoolean( _configuration.safeMode, true );
        _configuration.highlightAllDomElementTypes = getDefaultStringOrArray( _configuration.highlightAllDomElementTypes, [ "div", "code" ] );
        _configuration.allowHtmlInTextDisplay = getDefaultBoolean( _configuration.allowHtmlInTextDisplay, true );

        buildDefaultConfigurationStrings();
        buildDefaultConfigurationCustomTriggers();
    }

    function buildDefaultConfigurationStrings() {
        _configuration.buttonsOpenerText = getDefaultString( _configuration.buttonsOpenerText, "<" );
        _configuration.buttonsCloserText = getDefaultString( _configuration.buttonsCloserText, ">" );
    }

    function buildDefaultConfigurationCustomTriggers() {
        _configuration.onBeforeRender = getDefaultFunction( _configuration.onBeforeRender, null );
        _configuration.onAfterRender = getDefaultFunction( _configuration.onAfterRender, null );
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
    _public.getVersion = function() {
        return "2.5.0";
    };


    /*
     * ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------
     * Initialize Syntax.js
     * ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------
     */

    ( function ( documentObject, navigatorObject, windowObject, mathObject, jsonObject ) {
        _parameter_Document = documentObject;
        _parameter_Navigator = navigatorObject;
        _parameter_Window = windowObject;
        _parameter_Math = mathObject;
        _parameter_Json = jsonObject;

        buildDefaultConfiguration();

        _parameter_Document.addEventListener( "DOMContentLoaded", function() {
            render();
        } );

        if ( !isDefined( _parameter_Window.$syntax ) ) {
            _parameter_Window.$syntax = _public;
        }

    } ) ( document, navigator, window, Math, JSON );
} )();