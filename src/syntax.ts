/**
 * Syntax.js
 * 
 * A lightweight, and easy-to-use, JavaScript library for code syntax highlighting!
 * 
 * @file        syntax.js
 * @version     v3.0.0
 * @author      Bunoon
 * @license     MIT License
 * @copyright   Bunoon 2024
 */


import {
    BindingOptions,
    type BindingTabContentOptionEvents,
    type BindingTabContentOptions,
    type Configuration,
    type SyntaxLanguage
} from "./ts/type";

import { PublicApi } from "./ts/api";
import { Constants } from "./ts/constant";
import { Data } from "./ts/data";
import { Is } from "./ts/is";
import { Char } from "./ts/enum";
import { DomElement } from "./ts/dom";


type StringToJson = {
    parsed: boolean;
    object: any;
};


( () => {
    // Variables: Configuration
    let _configuration: Configuration = {} as Configuration;

    // Variables: Aliases
    let _aliases_Rules: Record<string, string> = {} as Record<string, string>;

    // Variables: Elements
    let _elements: HTMLElement[] = [];
    let _elements_Original: Record<string, string> = {} as Record<string, string>;

    // Variables: Temporary Caching
    let _cached_Keywords: Record<string, string> = {} as Record<string, string>;
    let _cached_Keywords_Count: number = 0;
    let _cached_Values: Record<string, string> = {} as Record<string, string>;
    let _cached_Values_Count: number = 0;
    let _cached_Attributes: Record<string, string> = {} as Record<string, string>;
    let _cached_Attributes_Count: number = 0;
    let _cached_Strings: Record<string, string> = {} as Record<string, string>;
    let _cached_Strings_Count: number = 0;
    let _cached_Comments: Record<string, string> = {} as Record<string, string>;
    let _cached_Comments_Count: number = 0;

    // Variables: Languages
    let _languages: Record<string, SyntaxLanguage> = {} as Record<string, SyntaxLanguage>;


    /*
     * ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------
     * Rendering
     * ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------
     */


    function renderElementStringPatternVariables( innerHTML: string, patternItems: string[], syntaxOptions: BindingOptions ) : string {
        if ( patternItems !== null ) {
            const patternItemsLength: number = patternItems.length;
        
            for ( let patternItemsIndex: number = 0; patternItemsIndex < patternItemsLength; patternItemsIndex++ ) {
                const string: string = patternItems[ patternItemsIndex ];
                const stringLines: string[] = string.split( Char.newLine );
                const stringLinesLength: number = stringLines.length;
                const stringCssClass: string = stringLinesLength === 1 ? "string" : "multi-line-string";

                for ( let stringLineIndex: number = 0; stringLineIndex < stringLinesLength; stringLineIndex++ ) {
                    const stringLine: string = stringLines[ stringLineIndex ];
                    const stringVariable: string = "$S{" + _cached_Strings_Count.toString() + "}";

                    _cached_Strings[ stringVariable ] = "<span class=\"" + stringCssClass + "\">" + stringLine + "</span>";
                    _cached_Strings_Count++;
        
                    innerHTML = innerHTML.replace( stringLine, stringVariable );
                }

                fireCustomTriggerEvent( syntaxOptions.events!.onStringRender!, string );
            }
        }

        return innerHTML;
    }

    function renderElementKeywords( innerHTML: string, language: SyntaxLanguage, syntaxOptions: BindingOptions ) : string {
        const keywords: string[] = Data.getDefaultStringOrArray( language.keywords, [] );
        const keywordsLength: number = keywords.length;
        const caseSensitive: boolean = language.caseSensitive!;
        const keywordsCasing: string = getKeywordCasing( language.keywordsCasing! );

        Data.String.sortArrayOfStringByLength( keywords );

        for ( let keywordIndex: number = 0; keywordIndex < keywordsLength; keywordIndex++ ) {
            const keyword: string = keywords[ keywordIndex ];
            const keywordDisplay: string = getDisplayTextTestCasing( keyword, keywordsCasing );
            const keywordVariable: string = "KW" + _cached_Keywords_Count.toString() + ";";
            let keywordReplacement: string = null!;
            const regExFlags: string = caseSensitive ? "g" : "gi";
            const regEx: RegExp = new RegExp( getWordRegEx( keyword, language ), regExFlags );

            if ( syntaxOptions.highlightKeywords ) {
                if ( Is.definedFunction( syntaxOptions.events!.onKeywordClicked ) ) {
                    keywordReplacement = "<span class=\"keyword-clickable\">" + keywordDisplay + "</span>";
                    innerHTML = innerHTML.replace( regEx, keywordVariable );
                } else {
                    keywordReplacement = "<span class=\"keyword\">" + keywordDisplay + "</span>";
                    innerHTML = innerHTML.replace( regEx, keywordVariable );
                }

            } else {
                if ( Is.definedFunction( syntaxOptions.events!.onKeywordClicked ) ) {
                    keywordReplacement = "<span class=\"no-highlight-keyword-clickable\">" + keywordDisplay + "</span>";
                    innerHTML = innerHTML.replace( regEx, keywordVariable );
                }
            }

            _cached_Keywords[ keywordVariable ] = keywordReplacement;
            _cached_Keywords_Count++;

            fireCustomTriggerEvent( syntaxOptions.events!.onKeywordRender!, keyword );
        }

        return innerHTML;
    }

    function replaceMarkUpKeywords( innerHTML: string, language: SyntaxLanguage, syntaxOptions: BindingOptions ) : string {
        const keywords: string[] = Data.getDefaultStringOrArray( language.keywords, [] );
        const caseSensitive: boolean = language.caseSensitive!;
        const keywordsCasing: string = getKeywordCasing( language.keywordsCasing! );

        const regEx: RegExp = /(<([^>]+)>)/ig;
        const regExFlags: string = caseSensitive ? "g" : "gi";
        let regExResult: RegExpExecArray = regEx.exec( innerHTML )!;

        while ( regExResult ) {
            if ( regExResult.index === regEx.lastIndex ) {
                regEx.lastIndex++;
            }

            let tag: string = regExResult[ 0 ];
            tag = tag.replace( "</", Char.empty ).replace( "<", Char.empty ).replace( ">", Char.empty );
            tag = tag.split( Char.space )[ 0 ];

            if ( keywords.indexOf( tag ) > -1 ) {
                const keywordVariable: string = "KW" + _cached_Keywords_Count.toString() + ";";
                const regExReplace: RegExp = new RegExp( getWordRegEx( tag, language ), regExFlags );
                let keywordReplacement: string = null!;
                let replacementTagDisplay: string = getDisplayTextTestCasing( tag, keywordsCasing );

                if ( syntaxOptions.highlightKeywords ) {
                    if ( Is.definedFunction( syntaxOptions.events!.onKeywordClicked ) ) {
                        keywordReplacement = "<span class=\"keyword-clickable\">" + replacementTagDisplay + "</span>";
                    } else {
                        keywordReplacement = "<span class=\"keyword\">" + replacementTagDisplay + "</span>";
                    }
    
                } else {
                    if ( Is.definedFunction( syntaxOptions.events!.onKeywordClicked ) ) {
                        keywordReplacement = "<span class=\"no-highlight-keyword-clickable\">" + replacementTagDisplay + "</span>";
                    }
                }

                innerHTML = innerHTML.replace( regExReplace, keywordVariable );

                _cached_Keywords[ keywordVariable ] = keywordReplacement;
                _cached_Keywords_Count++;
            }

            regExResult = regEx.exec( innerHTML )!;
        }

        return innerHTML;
    }

    function renderElementValues( innerHTML: string, language: SyntaxLanguage, syntaxOptions: BindingOptions ) : string {
        const values: string[] = Data.getDefaultStringOrArray( language.values, [] );
        const valuesLength: number = values.length;
        const caseSensitive: boolean = language.caseSensitive!;

        Data.String.sortArrayOfStringByLength( values );

        for ( let valueIndex: number = 0; valueIndex < valuesLength; valueIndex++ ) {
            const value: string = values[ valueIndex ];
            const valueVariable: string = "VAL" + _cached_Values_Count.toString() + ";";
            let valueReplacement: string = null!;
            const regExFlags: string = caseSensitive ? "g" : "gi";
            const regEx: RegExp = new RegExp( getWordRegEx( value, language ), regExFlags );

            if ( syntaxOptions.highlightValues ) {
                if ( Is.definedFunction( syntaxOptions.events!.onValueClicked! ) ) {
                    valueReplacement = "<span class=\"value-clickable\">" + value + "</span>";
                    innerHTML = innerHTML.replace( regEx, valueVariable );
                } else {
                    valueReplacement = "<span class=\"value\">" + value + "</span>";
                    innerHTML = innerHTML.replace( regEx, valueVariable );
                }

            } else {
                if ( Is.definedFunction( syntaxOptions.events!.onValueClicked! ) ) {
                    valueReplacement = "<span class=\"no-highlight-value-clickable\">" + value + "</span>";
                    innerHTML = innerHTML.replace( regEx, valueVariable );
                }
            }

            _cached_Values[ valueVariable ] = valueReplacement;
            _cached_Values_Count++;

            fireCustomTriggerEvent( syntaxOptions.events!.onValueRender!, value );
        }

        return innerHTML;
    }

    function renderElementAttributes( innerHTML: string, language: SyntaxLanguage, syntaxOptions: BindingOptions ) : string {
        const attributes: string[] = Data.getDefaultStringOrArray( language.attributes, [] );
        const attributesLength: number = attributes.length;
        const caseSensitive: boolean = language.caseSensitive!;

        Data.String.sortArrayOfStringByLength( attributes );

        for ( let attributeIndex: number = 0; attributeIndex < attributesLength; attributeIndex++ ) {
            const attribute: string = attributes[ attributeIndex ];
            const attributeVariable: string = "ATTR" + _cached_Attributes_Count.toString() + ";";
            let attributeReplacement: string = null!;
            let regExFlags: string = caseSensitive ? "g" : "gi";
            const regEx: RegExp = new RegExp( getWordRegEx( attribute, language ), regExFlags );

            if ( syntaxOptions.highlightAttributes ) {
                if ( Is.definedFunction( syntaxOptions.events!.onAttributeClicked ) ) {
                    attributeReplacement = "<span class=\"attribute-clickable\">" + attribute + "</span>";
                    innerHTML = innerHTML.replace( regEx, attributeVariable );
                } else {
                    attributeReplacement = "<span class=\"attribute\">" + attribute + "</span>";
                    innerHTML = innerHTML.replace( regEx, attributeVariable );
                }

            } else {
                if ( Is.definedFunction( syntaxOptions.events!.onAttributeClicked ) ) {
                    attributeReplacement = "<span class=\"no-highlight-attribute-clickable\">" + attribute + "</span>";
                    innerHTML = innerHTML.replace( regEx, attributeVariable );
                }
            }

            _cached_Attributes[ attributeVariable ] = attributeReplacement;
            _cached_Attributes_Count++;

            fireCustomTriggerEvent( syntaxOptions.events!.onAttributeRender!, attribute );
        }

        return innerHTML;
    }

    function renderElementStringQuotesFromVariables( innerHTML: string ) : string {
        for ( let quoteVariable in _cached_Strings ) {
            if ( _cached_Strings.hasOwnProperty( quoteVariable ) ) {
                innerHTML = innerHTML.replace( quoteVariable, _cached_Strings[ quoteVariable ] );
            }
        }

        return innerHTML;
    }

    function renderElementCommentsFromVariables( innerHTML: string, language: SyntaxLanguage ) : string {
        const multiLineComment: string[] = language.multiLineComment as string[];
        let start: string = null!;
        let end: string = null!;

        if ( Is.definedArray( multiLineComment ) && multiLineComment.length === 2 ) {
            start = Data.String.encodeMarkUpCharacters( multiLineComment[ 0 ] );
            end = Data.String.encodeMarkUpCharacters( multiLineComment[ 1 ] );
        }

        for ( let commentVariable in _cached_Comments ) {
            if ( _cached_Comments.hasOwnProperty( commentVariable ) ) {
                let replacement: string = _cached_Comments[ commentVariable ];

                if ( language.isMarkUp && Is.definedString( start ) && Is.definedString( end ) ) {
                    replacement = replacement.replace( multiLineComment[ 0 ], start );
                    replacement = replacement.replace( multiLineComment[ 1 ], end );
                }

                innerHTML = innerHTML.replace( commentVariable, replacement );
            }
        }

        return innerHTML;
    }

    function renderElementVariables( innerHTML: string, variables: Record<string, string> ) : string {
        for ( let variable in variables ) {
            if ( variables.hasOwnProperty( variable ) ) {
                const regExHtmlReplace: RegExp = new RegExp( variable, "g" );

                innerHTML = innerHTML.replace( regExHtmlReplace, variables[ variable ] );
            }
        }

        return innerHTML;
    }

    function renderElementCompletedHTML( element: HTMLElement, description: HTMLElement, numbers: HTMLElement, syntax: HTMLElement, innerHTML: string, syntaxOptions: BindingOptions, isPreFormatted: boolean ) : void {
        const lines: string[] = innerHTML.split( Char.newLine );
        const linesLength: number = lines.length;
        const linesLengthStringLength: number = linesLength.toString().length;
        let numberContainer: HTMLElement = numbers;
        let codeContainer: HTMLElement = syntax;
        let replaceWhitespace: string = null!;
        let lineNumber: number = 1;
        let lastLineWasBlank: boolean = false;

        if ( isPreFormatted ) {
            codeContainer = DomElement.create( "pre" );
            syntax.appendChild( codeContainer );

            if ( Is.defined( numbers ) ) {
                numberContainer = DomElement.create( "pre" );
                numbers.appendChild( numberContainer );
            }
        }

        if ( syntaxOptions.doubleClickToSelectAll ) {
            if ( Is.defined( description ) ) {
                description.ondblclick = function() {
                    DomElement.selectTextInElement( codeContainer );
                };
            }

            if ( Is.defined( numbers ) ) {
                numbers.ondblclick = function() {
                    DomElement.selectTextInElement( codeContainer );
                };
            }
    
            syntax.ondblclick = function() {
                DomElement.selectTextInElement( codeContainer );
            };
        }

        for ( let lineIndex: number = 0; lineIndex < linesLength; lineIndex++ ) {
            let line: string = lines[ lineIndex ];

            if ( line.trim() !== Char.empty && replaceWhitespace === null ) {
                replaceWhitespace = line.substring( 0, line.match( /^\s*/ )![ 0 ].length );
            }

            if ( ( lineIndex !== 0 && lineIndex !== linesLength - 1 ) || line.trim() !== Char.empty ) {
                if ( line.trim() !== Char.empty || !syntaxOptions.removeBlankLines ) {
                    const isBlank: boolean = line.trim() === Char.empty;

                    if ( isBlank && !lastLineWasBlank || !syntaxOptions.removeDuplicateBlankLines || !isBlank ) {
                        lastLineWasBlank = isBlank;

                        if ( Is.defined( numberContainer ) ) {
                            const numberCode: HTMLElement = DomElement.create( "p" );
    
                            if ( syntaxOptions.padLineNumbers ) {
                                numberCode.innerText = Data.String.padNumber( lineNumber.toString(), linesLengthStringLength );
                            } else {
                                numberCode.innerText = lineNumber.toString();
                            }
    
                            numberContainer.appendChild( numberCode );
                            lineNumber++;
                        }                    
            
                        if ( replaceWhitespace !== null ) {
                            line = line.replace( replaceWhitespace, Char.empty );
    
                            if ( !isPreFormatted ) {
                                const remainingStartWhitespaceCount: number = line.match( /^\s*/ )![ 0 ].length;
                                const remainingStartWhitespace: string = line.substring( 0, remainingStartWhitespaceCount );
                                const whitespaceReplacement: string = Array( remainingStartWhitespaceCount ).join( "&nbsp;" );
    
                                line = line.replace( remainingStartWhitespace, whitespaceReplacement );
                            }
                        }
            
                        const syntaxCode: HTMLElement = DomElement.create( "p" );
                        syntaxCode.innerHTML = line.trim() === Char.empty ? "<br>" : line;
                        codeContainer.appendChild( syntaxCode );
                    }
                }
            }
        }

        renderElementClickEvents( element, syntaxOptions.events!.onKeywordClicked!, "keyword-clickable" );
        renderElementClickEvents( element, syntaxOptions.events!.onValueClicked!, "value-clickable" );
    }

    function renderElementClickEvents( element: HTMLElement, customTrigger: Function, className: string ) : void {
        if ( Is.definedFunction( customTrigger ) ) {
            const domElements: HTMLCollectionOf<Element> = document.getElementsByTagName( className );
            const elements: HTMLElement[] = [].slice.call( domElements );
            const elementsLength: number = elements.length;

            for ( let elementIndex: number = 0; elementIndex < elementsLength; elementIndex++ ) {
                renderElementClickEvent( elements[ elementIndex ], customTrigger );
            }
        }
    }

    function renderElementClickEvent( element: HTMLElement, customTrigger: Function ) : void {
        const text: string = element.innerText;

        element.onclick = function() {
            customTrigger( text );
        };
    }

    function getFriendlyLanguageName( syntaxLanguage: string, languageLabelCasing: string ) : string {
        let result: string = null!;
        const language: SyntaxLanguage = getLanguage( syntaxLanguage );

        if ( Is.defined( language ) && Is.definedString( language.friendlyName ) ) {
            result = language.friendlyName!;
        } else {
            result = syntaxLanguage;
        }

        result = getDisplayTextTestCasing( result, languageLabelCasing );

        return result;
    }

    function getLanguage( syntaxLanguage: string ) : SyntaxLanguage {
        let result: SyntaxLanguage = null!;
        let language: string = syntaxLanguage.toLowerCase();

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

    function getKeywordCasing( keywordsCasing: string ) : string {
        if ( Is.definedString( keywordsCasing ) ) {
            keywordsCasing = keywordsCasing.toLowerCase().trim();
        }

        return keywordsCasing;
    }

    function getDisplayTextTestCasing( keyword: string, keywordsCasing: string ) : string {
        if ( keywordsCasing === "uppercase" ) {
            keyword = keyword.toUpperCase();
        } else if ( keywordsCasing === "lowercase" ) {
            keyword = keyword.toLowerCase();
        }
        
        return keyword;
    }

    function getWordRegEx( word: string, language: SyntaxLanguage ) : string {
        let result: string = "(?<=^|[^-])\\b" + word + "\\b(?=[^-]|$)";

        if ( Is.definedString( language.wordRegEx ) ) {
            result = language.wordRegEx!.replace( "%word%", word );
        }

        return result;
    }


    /*
     * ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------
     * Binding Options
     * ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------
     */

    function getBindingOptions( newOptions: any ) : BindingOptions {
        let options: BindingOptions = Data.getDefaultObject( newOptions, {} as BindingOptions );

        options = buildBindingAttributeOptions( options );
        options = buildBindingAttributeOptionCustomTriggers( options );

        return options;
    }

    function buildBindingAttributeOptions( options: BindingOptions ) : BindingOptions {
        options.showCopyButton = Data.getDefaultBoolean( options.showCopyButton, true );
        options.removeBlankLines = Data.getDefaultBoolean( options.removeBlankLines, false );
        options.showLineNumbers = Data.getDefaultBoolean( options.showLineNumbers, true );
        options.highlightKeywords = Data.getDefaultBoolean( options.highlightKeywords, true );
        options.highlightValues = Data.getDefaultBoolean( options.highlightValues, true );
        options.highlightAttributes = Data.getDefaultBoolean( options.highlightAttributes, true );
        options.highlightStrings = Data.getDefaultBoolean( options.highlightStrings, true );
        options.highlightComments = Data.getDefaultBoolean( options.highlightComments, true );
        options.showLanguageLabel = Data.getDefaultBoolean( options.showLanguageLabel, true );
        options.showPrintButton = Data.getDefaultBoolean( options.showPrintButton, true );
        options.padLineNumbers = Data.getDefaultBoolean( options.padLineNumbers, false );
        options.removeDuplicateBlankLines = Data.getDefaultBoolean( options.removeDuplicateBlankLines, true );
        options.doubleClickToSelectAll = Data.getDefaultBoolean( options.doubleClickToSelectAll, true );
        options.languageLabelCasing = Data.getDefaultString( options.languageLabelCasing, "uppercase" );
        options.buttonsVisible = Data.getDefaultBoolean( options.buttonsVisible, true );
        options.maximumButtons = Data.getDefaultNumber( options.maximumButtons, 2 );
        
        return options;
    }

    function buildBindingAttributeOptionCustomTriggers( options: BindingOptions ) : BindingOptions {
        options.events!.onCopy = Data.getDefaultFunction( options.events!.onCopy, null! );
        options.events!.onRenderComplete = Data.getDefaultFunction( options.events!.onRenderComplete, null! );
        options.events!.onKeywordClicked = Data.getDefaultFunction( options.events!.onKeywordClicked, null! );
        options.events!.onValueClicked = Data.getDefaultFunction( options.events!.onValueClicked, null! );
        options.events!.onAttributeClicked = Data.getDefaultFunction( options.events!.onAttributeClicked, null! );
        options.events!.onKeywordRender = Data.getDefaultFunction( options.events!.onKeywordRender, null! );
        options.events!.onValueRender = Data.getDefaultFunction( options.events!.onValueRender, null! );
        options.events!.onAttributeRender = Data.getDefaultFunction( options.events!.onAttributeRender, null! );
        options.events!.onStringRender = Data.getDefaultFunction( options.events!.onStringRender, null! );
        options.events!.onCommentRender = Data.getDefaultFunction( options.events!.onCommentRender, null! );
        options.events!.onPrint = Data.getDefaultFunction( options.events!.onPrint, null! );
        options.events!.onBeforeRenderComplete = Data.getDefaultFunction( options.events!.onBeforeRenderComplete, null! );
        options.events!.onButtonsOpened = Data.getDefaultFunction( options.events!.onButtonsOpened, null! );
        options.events!.onButtonsClosed = Data.getDefaultFunction( options.events!.onButtonsClosed, null! );

        return options;
    }


    /*
     * ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------
     * Binding Options - Tab Contents
     * ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------
     */

    function getBindingTabContentOptions( newOptions: any ) : BindingTabContentOptions {
        let options: BindingTabContentOptions = Data.getDefaultObject( newOptions, {} as BindingTabContentOptions );

        options = buildBindingTabContentAttributeOptionStrings( options );
        options = buildBindingTabContentAttributeOptionCustomTriggers( options );

        return options;
    }

    function buildBindingTabContentAttributeOptionStrings( options: BindingTabContentOptions ) : BindingTabContentOptions {
        options.title = Data.getDefaultString( options.title, null! );
        options.description = Data.getDefaultString( options.description, null! );

        return options;
    }

    function buildBindingTabContentAttributeOptionCustomTriggers( options: BindingTabContentOptions ) : BindingTabContentOptions {
        options.events = Data.getDefaultFunction( options.events, {} as BindingTabContentOptionEvents );
        options.events!.onOpen = Data.getDefaultFunction( options.events!.onOpen, null! );

        return options;
    }


    /*
     * ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------
     * Triggering Custom Events
     * ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------
     */

    function fireCustomTriggerEvent( triggerFunction: Function, ...args : any[] ) : void {
        if ( Is.definedFunction( triggerFunction ) ) {
            triggerFunction.apply( null, [].slice.call( args, 0 ) );
        }
    }


    /*
     * ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------
     * Default Parameter/Option Handling
     * ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------
     */

    function getObjectFromString( objectString: any ) : StringToJson {
        const result: StringToJson = {
            parsed: true,
            object: null
        } as StringToJson;

        try {
            if ( Is.definedString( objectString ) ) {
                result.object = JSON.parse( objectString );
            }

        } catch ( e1: any ) {
            try {
                result.object = eval( `(${objectString})` );

                if ( Is.definedFunction( result.object ) ) {
                    result.object = result.object();
                }
                
            } catch ( e2: any ) {
                if ( !_configuration.safeMode ) {
                    logError( _configuration.text!.objectErrorText!.replace( "{{error_1}}",  e1.message ).replace( "{{error_2}}",  e2.message ) );
                    result.parsed = false;
                }
                
                result.object = null;
            }
        }

        return result;
    }

    function logError( error: string ) : boolean {
        let result: boolean = true;

        if ( !_configuration.safeMode ) {
            console.error( error );
            result = false;
        }

        return result;
    }


	/*
	 * ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------
	 * Public API Functions:
	 * ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------
	 */

    const _public: PublicApi = {
        /*
         * ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------
         * Public API Functions:  Highlighting
         * ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------
         */

        highlightAll: function () : PublicApi {
            throw new Error("Function not implemented.");
        },

        highlightElement: function ( elementOrId: any ) : PublicApi {
            throw new Error("Function not implemented.");
        },

        getElementsHighlighted: function () : HTMLElement[] {
            throw new Error("Function not implemented.");
        },

        getCode: function ( elementId: string ) : string | null {
            throw new Error("Function not implemented.");
        },


        /*
         * ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------
         * Public API Functions:  Destroying
         * ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------
         */

        destroyAll: function () : PublicApi {
            throw new Error("Function not implemented.");
        },
    
        destroy: function ( elementId: string ) : PublicApi {
            throw new Error("Function not implemented.");
        },


        /*
         * ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------
         * Public API Functions:  Languages
         * ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------
         */

        addLanguage: function ( name: string, languageDetails: SyntaxLanguage, triggerRender: boolean = true ) : boolean {
            throw new Error("Function not implemented.");
        },

        removeLanguage: function ( name: string ) : boolean {
            throw new Error("Function not implemented.");
        },

        getLanguage: function ( name: string ) : SyntaxLanguage {
            throw new Error("Function not implemented.");
        },

        getLanguages: function () : Record<string, SyntaxLanguage> {
            throw new Error("Function not implemented.");
        },


        /*
         * ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------
         * Public API Functions:  Language Aliases
         * ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------
         */

        addAlias: function ( alias: string, language: string, triggerRender: boolean = true ) : boolean {
            throw new Error("Function not implemented.");
        },

        removeAlias: function ( alias: string ) : boolean {
            throw new Error("Function not implemented.");
        },

        getAlias: function ( alias: string ) : string {
            throw new Error("Function not implemented.");
        },

        getAliases: function () : Record<string, string> {
            throw new Error("Function not implemented.");
        },


        /*
         * ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------
         * Public API Functions:  Configuration
         * ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------
         */

        setConfiguration: function ( newConfiguration: any ) : PublicApi {
            throw new Error("Function not implemented.");
        },


        /*
         * ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------
         * Public API Functions:  Additional Data
         * ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------
         */

        getVersion: function () : string {
            throw new Error("Function not implemented.");
        }
    };


    /*
     * ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------
     * Initialize Syntax.js
     * ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------
     */
    ( () => {

    } )();
} )();