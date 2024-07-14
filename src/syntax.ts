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