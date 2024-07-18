/**
 * Syntax.js
 * 
 * A lightweight, and easy-to-use, JavaScript library for code syntax highlighting!
 * 
 * @file        syntax.ts
 * @version     v3.0.1
 * @author      Bunoon
 * @license     MIT License
 * @copyright   Bunoon 2024
 */


import {
    type BindingOptions,
    type CustomButton,
    type BindingTabContentOptions,
    type Configuration,
    type SyntaxLanguage } from "./ts/type";

import { type PublicApi } from "./ts/api";
import { Constant } from "./ts/constant";
import { Default } from "./ts/data/default";
import { Is } from "./ts/data/is";
import { Char, Language, TextCasing } from "./ts/data/enum";
import { DomElement } from "./ts/dom/dom";
import { Str } from "./ts/data/str";
import { Trigger } from "./ts/area/trigger";
import { Config } from "./ts/options/config";
import { Binding } from "./ts/options/binding";
import { Tab } from "./ts/options/tab";


type StringToJson = {
    parsed: boolean;
    object: any;
};

type RenderElementResult = {
    rendered: boolean;
    tabContents: HTMLElement;
    tabTitle: string;
    tabBindingOptions: BindingTabContentOptions,
    syntaxLanguage: string
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

    function render() : void {
        const tagTypes: string[] = _configuration.highlightAllDomElementTypes as string[];
        const tagTypesLength: number = tagTypes.length;

        for ( let tagTypeIndex: number = 0; tagTypeIndex < tagTypesLength; tagTypeIndex++ ) {
            const domElements: HTMLCollectionOf<Element> = document.getElementsByTagName( tagTypes[ tagTypeIndex ] );
            const elements: HTMLElement[] = [].slice.call( domElements );
            const elementsLength: number = elements.length;

            if ( elementsLength > 0 ) {
                Trigger.customEvent( _configuration.events!.onBeforeRender! );
            }

            for ( let elementIndex: number = 0; elementIndex < elementsLength; elementIndex++ ) {
                const element: HTMLElement = elements[ elementIndex ];
                let elementBreak: boolean = false;

                if ( element.hasAttribute( Constant.SYNTAX_JS_ATTRIBUTE_NAME_LANGUAGE ) && element.getAttribute( Constant.SYNTAX_JS_ATTRIBUTE_NAME_LANGUAGE )!.toLowerCase() === Language.tabbed ) {
                    const divElements: HTMLElement[] = [].slice.call( element.children );
                    const divElementsLength: number = divElements.length;
                    const tabElements: HTMLElement[] = [];
                    const tabContentElements: HTMLElement[] = [];

                    element.removeAttribute( Constant.SYNTAX_JS_ATTRIBUTE_NAME_LANGUAGE );
                    element.className = element.className === Char.empty ? "syntax-highlight" : `${element.className} syntax-highlight`;
                    element.innerHTML = Char.empty;

                    const codeContainer: HTMLElement = DomElement.create( "div", "code custom-scroll-bars" );
                    element.appendChild( codeContainer );

                    const tabs: HTMLElement = DomElement.create( "div", "tabs" );
                    codeContainer.appendChild( tabs );

                    for ( let divElementIndex: number = 0; divElementIndex < divElementsLength; divElementIndex++ ) {
                        const renderResult: RenderElementResult = renderElement( divElements[ divElementIndex ], codeContainer );

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
                Trigger.customEvent( _configuration.events!.onAfterRender! );
            }
        }
    }

    function renderTab( tabs: HTMLElement, tabElements: HTMLElement[], tabContentElements: HTMLElement[], renderResult: RenderElementResult, divElementIndex: number, tabBindingOptions: BindingTabContentOptions, syntaxLanguage: string ) : void {
        const tab: HTMLElement = DomElement.create( "button", "tab" );
        tabs.appendChild( tab );

        DomElement.setNodeText( tab, renderResult.tabTitle, _configuration );

        tabElements.push( tab );
        tabContentElements.push( renderResult.tabContents );

        tab.onclick = () => {
            if ( tab.className !== "tab-active" ) {
                const tabElementsLength: number = tabElements.length;
                const tabContentElementsLength: number = tabContentElements.length;

                for ( let tabElementsIndex: number = 0; tabElementsIndex < tabElementsLength; tabElementsIndex++ ) {
                    tabElements[ tabElementsIndex ].className = "tab";
                }

                for ( let tabContentElementsIndex: number = 0; tabContentElementsIndex < tabContentElementsLength; tabContentElementsIndex++ ) {
                    tabContentElements[ tabContentElementsIndex ].style.display = "none";
                }

                tab.className = "tab-active";
                renderResult.tabContents.style.display = "flex";

                if ( Is.definedObject( tabBindingOptions ) ) {
                    Trigger.customEvent( tabBindingOptions.events!.onOpen!, syntaxLanguage );
                }
            }
        };

        if ( divElementIndex > 0 ) {
            renderResult.tabContents.style.display = "none";
        } else {
            tab.className = "tab-active";
        }
    }

    function renderElement( element: HTMLElement, codeContainer: HTMLElement = null! ) : RenderElementResult {
        const result: RenderElementResult = {} as RenderElementResult;
        result.rendered = true;

        if ( Is.defined( element ) && element.hasAttribute( Constant.SYNTAX_JS_ATTRIBUTE_NAME_LANGUAGE ) && ( !element.hasAttribute( Constant.SYNTAX_JS_ATTRIBUTE_NAME_TAB_CONTENTS ) || Is.defined( codeContainer ) ) ) {
            result.syntaxLanguage = element.getAttribute( Constant.SYNTAX_JS_ATTRIBUTE_NAME_LANGUAGE )!;

            if ( Is.definedString( result.syntaxLanguage ) ) {
                const language: SyntaxLanguage = getLanguage( result.syntaxLanguage );

                if ( Is.defined( language ) || result.syntaxLanguage.toLowerCase() === Language.unknown ) {
                    const bindingOptionsParsed: StringToJson = getObjectFromString( element.getAttribute( Constant.SYNTAX_JS_ATTRIBUTE_NAME_OPTIONS ) );
                    const syntaxButtonsParsed: StringToJson = getObjectFromString( element.getAttribute( Constant.SYNTAX_JS_ATTRIBUTE_NAME_BUTTONS ) );

                    if ( bindingOptionsParsed.parsed ) {
                        if ( element.innerHTML.trim() !== Char.empty ) {
                            let innerHTML: string = element.innerHTML;
                            const bindingOptions: BindingOptions = Binding.Options.get( bindingOptionsParsed.object );
                            let isPreFormatted: boolean = false;
                            let descriptionText: string = null!;

                            Trigger.customEvent( bindingOptions.events!.onBeforeRenderComplete!, element );

                            if ( element.children.length > 0 && element.children[ 0 ].nodeName.toLowerCase() === "pre" ) {
                                innerHTML = element.children[ 0 ].innerHTML;
                                isPreFormatted = true;
                            }
                            
                            const innerHTMLCopy: string = innerHTML.trim();
                            let numbers: HTMLElement = null!;
                            let description: HTMLElement = null!;
                            let elementId: string = element.id;

                            if ( !Is.definedString( elementId ) ) {
                                elementId = Str.newGuid();
                            }

                            _elements_Original[ elementId ] = element.innerHTML;

                            element.removeAttribute( Constant.SYNTAX_JS_ATTRIBUTE_NAME_LANGUAGE );
                            element.removeAttribute( Constant.SYNTAX_JS_ATTRIBUTE_NAME_OPTIONS );
                            element.id = elementId;

                            if ( !Is.defined( codeContainer ) ) {
                                element.className = element.className === Char.empty ? "syntax-highlight" : `${element.className} syntax-highlight`;
                                element.innerHTML = Char.empty;

                                codeContainer = DomElement.create( "div", "code custom-scroll-bars" );
                                element.appendChild( codeContainer );

                            } else {
                                if ( element.hasAttribute( Constant.SYNTAX_JS_ATTRIBUTE_NAME_TAB_CONTENTS ) && element.getAttribute( Constant.SYNTAX_JS_ATTRIBUTE_NAME_TAB_CONTENTS )!.toLowerCase() !== "true" ) {
                                    const tabOptions: StringToJson = getObjectFromString( element.getAttribute( Constant.SYNTAX_JS_ATTRIBUTE_NAME_TAB_CONTENTS ) );

                                    if ( tabOptions.parsed && Is.definedObject( tabOptions.object ) ) {
                                        result.tabBindingOptions = Tab.Options.get( tabOptions.object );
                                        descriptionText = result.tabBindingOptions.description!;

                                        if ( Is.definedString( result.tabBindingOptions.title ) ) {
                                            result.tabTitle = result.tabBindingOptions.title!;
                                        }
                                    }

                                } else {
                                    result.tabTitle = getFriendlyLanguageName( result.syntaxLanguage );
                                }
                            }

                            result.tabContents = DomElement.create( "div", "tab-contents" );
                            codeContainer.appendChild( result.tabContents );

                            if ( Is.definedString( descriptionText ) ) {
                                description = DomElement.create( "div", "description" );
                                result.tabContents.appendChild( description );

                                DomElement.setNodeText( description, descriptionText, _configuration );
                            }

                            if ( bindingOptions.showLineNumbers ) {
                                numbers = DomElement.create( "div", "numbers" );
                                result.tabContents.appendChild( numbers );
                            }
                
                            const syntax: HTMLElement = DomElement.create( "div", "syntax" );
                            result.tabContents.appendChild( syntax );

                            renderElementButtons( syntax, bindingOptions, result.syntaxLanguage, syntaxButtonsParsed, innerHTMLCopy );

                            if ( result.syntaxLanguage.toLowerCase() !== Language.unknown ) {
                                innerHTML = renderHTML( innerHTML, language, bindingOptions );
                            } else {
                                innerHTML = Str.encodeMarkUpCharacters( innerHTML );
                            }

                            renderElementCompletedHTML( description, numbers, syntax, innerHTML, bindingOptions, isPreFormatted );
                            Trigger.customEvent( bindingOptions.events!.onRenderComplete!, element );

                            if ( !Is.defined( result.tabContents ) ) {
                                renderSyntaxCustomTriggers( element, bindingOptions );
                            } else {
                                renderSyntaxCustomTriggers( result.tabContents, bindingOptions );
                            }

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
                            result.rendered = logError( _configuration.text!.noCodeAvailableToRenderErrorText! );
                        }

                    } else {
                        result.rendered = !_configuration.safeMode;
                    }

                } else {
                    result.rendered = logError( _configuration.text!.languageNotSupportedErrorText!.replace( "{{language}}", result.syntaxLanguage ) );
                }

            } else {
                result.rendered = logError( _configuration.text!.attributeNotSetErrorText!.replace( "{{attribute_name}}", Constant.SYNTAX_JS_ATTRIBUTE_NAME_LANGUAGE ) );
            }
        }

        return result;
    }

    function renderSyntaxCustomTriggers( element: HTMLElement, bindingOptions: BindingOptions ) : void {
        renderElementClickEvents( element, bindingOptions.events!.onKeywordClicked!, "keyword-clickable" );
        renderElementClickEvents( element, bindingOptions.events!.onKeywordClicked!, "no-highlight-keyword-clickable" );
        renderElementClickEvents( element, bindingOptions.events!.onValueClicked!, "value-clickable" );
        renderElementClickEvents( element, bindingOptions.events!.onValueClicked!, "no-highlight-value-clickable" );
        renderElementClickEvents( element, bindingOptions.events!.onAttributeClicked!, "attribute-clickable" );
        renderElementClickEvents( element, bindingOptions.events!.onAttributeClicked!, "no-highlight-attribute-clickable" );
    }

    function renderHTML( innerHTML: string, language: SyntaxLanguage, bindingOptions: BindingOptions ) : string {
        if ( !language.isMarkUp ) {
            innerHTML = Str.encodeMarkUpCharacters( innerHTML );
        }

        if ( bindingOptions.highlightComments ) {
            innerHTML = renderElementMultiLineCommentVariables( innerHTML, language, bindingOptions );
            innerHTML = renderElementCommentVariables( innerHTML, language, bindingOptions );
        }

        if ( bindingOptions.highlightStrings ) {
            innerHTML = renderElementStringPatternVariables( innerHTML, innerHTML.match( /"((?:\\.|[^"\\])*)"/g )!, bindingOptions );

            if ( language.comment !== "'" ) {
                innerHTML = renderElementStringPatternVariables( innerHTML, innerHTML.match( /'((?:\\.|[^"\\])*)'/g )!, bindingOptions );
            }
        }

        if ( !language.isMarkUp ) {
            innerHTML = renderElementKeywords( innerHTML, language, bindingOptions );
        } else {
            innerHTML = replaceMarkUpKeywords( innerHTML, language, bindingOptions );
        }
        
        innerHTML = renderElementValues( innerHTML, language, bindingOptions );

        if ( language.isMarkUp ) {
            innerHTML = renderElementAttributes( innerHTML, language, bindingOptions );
        }

        innerHTML = Str.encodeMarkUpCharacters( innerHTML );

        if ( bindingOptions.highlightComments ) {
            innerHTML = renderElementCommentsFromVariables( innerHTML, language );
        }
        
        if ( bindingOptions.highlightStrings ) {
            innerHTML = renderElementStringQuotesFromVariables( innerHTML );
        }

        innerHTML = renderElementVariables( innerHTML, _cached_Keywords );
        innerHTML = renderElementVariables( innerHTML, _cached_Values );

        if ( language.isMarkUp ) {
            innerHTML = renderElementVariables( innerHTML, _cached_Attributes );
        }

        return innerHTML;
    }

    function renderElementButtons( syntax: HTMLElement, bindingOptions: BindingOptions, syntaxLanguage: string, syntaxButtonsParsed: StringToJson, innerHTMLCopy: string ) : void {
        if ( bindingOptions.showLanguageLabel || bindingOptions.showCopyButton || bindingOptions.showPrintButton || syntaxButtonsParsed.parsed ) {
            const buttons: HTMLElement = DomElement.create( "div", "buttons" );
            const buttonsElements: HTMLElement[] = [];

            syntax.appendChild( buttons );

            if ( syntaxButtonsParsed.parsed && Is.definedArray( syntaxButtonsParsed.object ) ) {
                const customButtons: CustomButton[] = syntaxButtonsParsed.object;
                const customButtonsLength: number = customButtons.length;

                for ( let customButtonsIndex: number = 0; customButtonsIndex < customButtonsLength; customButtonsIndex++ ) {
                    const customButton: CustomButton = customButtons[ customButtonsIndex ];

                    if ( Is.defined( customButton.text ) && Is.definedFunction( customButton.events!.onClick! ) ) {
                        renderElementButton( customButton, buttonsElements, buttons, innerHTMLCopy, bindingOptions );
                    }
                }
            }

            if ( bindingOptions.showCopyButton ) {
                const copyButton: HTMLButtonElement = DomElement.create( "button", "button" ) as HTMLButtonElement;
                copyButton.style.display = bindingOptions.buttonsVisible ? "inline-block" : "none";
                buttons.appendChild( copyButton );

                DomElement.setNodeText( copyButton, _configuration.text!.copyButtonText!, _configuration );

                copyButton.onclick =() => {
                    navigator.clipboard.writeText( innerHTMLCopy );

                    Trigger.customEvent( bindingOptions.events!.onCopy!, innerHTMLCopy );
                };

                buttonsElements.push( copyButton );
            }

            if ( bindingOptions.showPrintButton ) {
                const printButton: HTMLButtonElement = DomElement.create( "button", "button" ) as HTMLButtonElement;
                printButton.style.display = bindingOptions.buttonsVisible ? "inline-block" : "none";
                buttons.appendChild( printButton );

                DomElement.setNodeText( printButton, _configuration.text!.printButtonText!, _configuration );

                printButton.onclick =() => {
                    const newWindow: WindowProxy = window.open( Char.empty, "PRINT", "height=400,width=600" )!;
                    const newElementForPrint: HTMLElement = syntax.cloneNode( true ) as HTMLElement;
                    const newTitleElement: HTMLElement = DomElement.create( "div" );

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

                    Trigger.customEvent( bindingOptions.events!.onPrint!, newElementForPrint.innerHTML );
                };

                buttonsElements.push( printButton );
            }

            if ( bindingOptions.showLanguageLabel ) {
                const languageLabel: HTMLElement = DomElement.create( "div", "language-label" );
                buttons.appendChild( languageLabel );

                DomElement.setNodeText( languageLabel, getFriendlyLanguageName( syntaxLanguage, bindingOptions.languageLabelCasing! ), _configuration );
            }

            const buttonsElementsLength: number = buttonsElements.length;

            if ( buttonsElementsLength > bindingOptions.maximumButtons! ) {
                const openButton: HTMLButtonElement = DomElement.create( "button", "button button-opener" ) as HTMLButtonElement;
                openButton.innerText = bindingOptions.buttonsVisible ? _configuration.text!.buttonsCloserText! : _configuration.text!.buttonsOpenerText!;
                buttons.insertBefore( openButton, buttons.children[ 0 ] );

                openButton.onclick =() => {
                    const areButtonsVisible: boolean = openButton.innerText === _configuration.text!.buttonsCloserText;

                    for ( let buttonsElementIndex: number = 0; buttonsElementIndex < buttonsElementsLength; buttonsElementIndex++ ) {
                        buttonsElements[ buttonsElementIndex ].style.display = areButtonsVisible ? "none" : "inline-block";
                    }

                    openButton.innerText = areButtonsVisible ? _configuration.text!.buttonsOpenerText! : _configuration.text!.buttonsCloserText!;

                    if ( areButtonsVisible ) {
                        Trigger.customEvent( bindingOptions.events!.onButtonsClosed! );
                    } else {
                        Trigger.customEvent( bindingOptions.events!.onButtonsOpened! );
                    }
                };

            } else if ( !bindingOptions.buttonsVisible && buttonsElementsLength <= bindingOptions.maximumButtons! ) {
                for ( let buttonsElementIndex: number = 0; buttonsElementIndex < buttonsElementsLength; buttonsElementIndex++ ) {
                    buttonsElements[ buttonsElementIndex ].style.display = "inline-block";
                }
            }
        }
    }

    function renderElementButton( customButton: CustomButton, buttonsElements: HTMLElement[], buttons: HTMLElement, innerHTMLCopy: string, bindingOptions: BindingOptions ) : void {
        const newCustomButton: HTMLButtonElement = DomElement.create( "button", "button" ) as HTMLButtonElement;
        newCustomButton.style.display = bindingOptions.buttonsVisible ? "inline-block" : "none";
        buttons.appendChild( newCustomButton );

        DomElement.setNodeText( newCustomButton, customButton.text!, _configuration );

        newCustomButton.onclick =() => {
            customButton.events!.onClick!( innerHTMLCopy );
        };

        if ( Is.defined( customButton.className ) ) {
            newCustomButton.className += Char.space + customButton.className;
        }

        buttonsElements.push( newCustomButton );
    }

    function renderElementCommentVariables( innerHTML: string, language: SyntaxLanguage, bindingOptions: BindingOptions ) : string {
        const lookup: string = language.comment!;

        if ( Is.definedString( lookup ) ) {
            const patternItems: RegExpMatchArray = innerHTML.match( new RegExp( `${lookup}.*`, "g" ) )!;

            if ( patternItems !== null ) {
                const patternItemsLength: number = patternItems.length;
            
                for ( let patternItemsIndex: number = 0; patternItemsIndex < patternItemsLength; patternItemsIndex++ ) {
                    const comment: string = patternItems[ patternItemsIndex ];
                    const commentVariable: string = `\$C{${_cached_Comments_Count.toString()}}`;
    
                    _cached_Comments[ commentVariable ] = `<span class=\"comment\">${comment}</span>`;
                    _cached_Comments_Count++;
        
                    innerHTML = innerHTML.replace( comment, commentVariable );
    
                    Trigger.customEvent( bindingOptions.events!.onCommentRender!, comment );
                }
            }
        }
        
        return innerHTML;
    }

    function renderElementMultiLineCommentVariables( innerHTML: string, language: SyntaxLanguage, bindingOptions: BindingOptions ) : string {
        const multiLineComment: string[] = language.multiLineComment as string[];

        if ( Is.definedArray( multiLineComment ) && multiLineComment.length === 2 ) {
            let startIndex: number = 0;
            let endIndex: number = 0;

            while ( startIndex >= 0 && endIndex >= 0 ) {
                startIndex = innerHTML.indexOf( multiLineComment[ 0 ], endIndex );
    
                if ( startIndex > -1 ) {
                    endIndex = innerHTML.indexOf( multiLineComment[ 1 ], startIndex + multiLineComment[ 0 ].length );
    
                    if ( endIndex > -1 ) {
                        const comment: string = innerHTML.substring( startIndex, endIndex + multiLineComment[ 1 ].length );
                        const commentLines: string[] = comment.split( Char.newLine );
                        const commentLinesLength: number = commentLines.length;
                        const commentCssClass: string = commentLinesLength === 1 ? "comment" : "multi-line-comment";
                        
                        for ( let commentLineIndex: number = 0; commentLineIndex < commentLinesLength; commentLineIndex++ ) {
                            const commentVariable: string = `\$C{${_cached_Comments_Count.toString()}}`;
                            const commentLine: string = commentLines[ commentLineIndex ];
                            
                            _cached_Comments[ commentVariable ] = `<span class=\"${commentCssClass}\">${commentLine}</span>`;
                            _cached_Comments_Count++;
                
                            innerHTML = innerHTML.replace( commentLine, commentVariable );
                        }

                        Trigger.customEvent( bindingOptions.events!.onCommentRender!, comment );
                    }
                }
            }
        }

        return innerHTML;
    }

    function renderElementStringPatternVariables( innerHTML: string, patternItems: string[], bindingOptions: BindingOptions ) : string {
        if ( patternItems !== null ) {
            const patternItemsLength: number = patternItems.length;
        
            for ( let patternItemsIndex: number = 0; patternItemsIndex < patternItemsLength; patternItemsIndex++ ) {
                const string: string = patternItems[ patternItemsIndex ];
                const stringLines: string[] = string.split( Char.newLine );
                const stringLinesLength: number = stringLines.length;
                const stringCssClass: string = stringLinesLength === 1 ? "string" : "multi-line-string";

                for ( let stringLineIndex: number = 0; stringLineIndex < stringLinesLength; stringLineIndex++ ) {
                    const stringLine: string = stringLines[ stringLineIndex ];
                    const stringVariable: string = `\$S{${_cached_Strings_Count.toString()}}`;

                    _cached_Strings[ stringVariable ] = `<span class=\"${stringCssClass}\">${stringLine}</span>`;
                    _cached_Strings_Count++;
        
                    innerHTML = innerHTML.replace( stringLine, stringVariable );
                }

                Trigger.customEvent( bindingOptions.events!.onStringRender!, string );
            }
        }

        return innerHTML;
    }

    function renderElementKeywords( innerHTML: string, language: SyntaxLanguage, bindingOptions: BindingOptions ) : string {
        const keywords: string[] = Default.getStringOrArray( language.keywords, [] );
        const keywordsLength: number = keywords.length;
        const caseSensitive: boolean = language.caseSensitive!;
        const keywordsCasing: string = getKeywordCasing( language.keywordsCasing! );

        Str.sortArrayOfStringByLength( keywords );

        for ( let keywordIndex: number = 0; keywordIndex < keywordsLength; keywordIndex++ ) {
            const keyword: string = keywords[ keywordIndex ];
            const keywordDisplay: string = getDisplayTextTestCasing( keyword, keywordsCasing );
            const keywordVariable: string = `KW${_cached_Keywords_Count.toString()};`;
            let keywordReplacement: string = null!;
            const regExFlags: string = caseSensitive ? "g" : "gi";
            const regEx: RegExp = new RegExp( getWordRegEx( keyword, language ), regExFlags );

            if ( bindingOptions.highlightKeywords ) {
                if ( Is.definedFunction( bindingOptions.events!.onKeywordClicked ) ) {
                    keywordReplacement = `<span class=\"keyword-clickable\">${keywordDisplay}</span>`;
                    innerHTML = innerHTML.replace( regEx, keywordVariable );
                } else {
                    keywordReplacement = `<span class=\"keyword\">${keywordDisplay}</span>`;
                    innerHTML = innerHTML.replace( regEx, keywordVariable );
                }

            } else {
                if ( Is.definedFunction( bindingOptions.events!.onKeywordClicked ) ) {
                    keywordReplacement = `<span class=\"no-highlight-keyword-clickable\">${keywordDisplay}</span>`;
                    innerHTML = innerHTML.replace( regEx, keywordVariable );
                }
            }

            _cached_Keywords[ keywordVariable ] = keywordReplacement;
            _cached_Keywords_Count++;

            Trigger.customEvent( bindingOptions.events!.onKeywordRender!, keyword );
        }

        return innerHTML;
    }

    function replaceMarkUpKeywords( innerHTML: string, language: SyntaxLanguage, bindingOptions: BindingOptions ) : string {
        const keywords: string[] = Default.getStringOrArray( language.keywords, [] );
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
                const keywordVariable: string = `KW${_cached_Keywords_Count.toString()};`;
                const regExReplace: RegExp = new RegExp( getWordRegEx( tag, language ), regExFlags );
                let keywordReplacement: string = null!;
                let replacementTagDisplay: string = getDisplayTextTestCasing( tag, keywordsCasing );

                if ( bindingOptions.highlightKeywords ) {
                    if ( Is.definedFunction( bindingOptions.events!.onKeywordClicked ) ) {
                        keywordReplacement = `<span class=\"keyword-clickable\">${replacementTagDisplay}</span>`;
                    } else {
                        keywordReplacement = `<span class=\"keyword\">${replacementTagDisplay}</span>`;
                    }
    
                } else {
                    if ( Is.definedFunction( bindingOptions.events!.onKeywordClicked ) ) {
                        keywordReplacement = `<span class=\"no-highlight-keyword-clickable\">${replacementTagDisplay}</span>`;
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

    function renderElementValues( innerHTML: string, language: SyntaxLanguage, bindingOptions: BindingOptions ) : string {
        const values: string[] = Default.getStringOrArray( language.values, [] );
        const valuesLength: number = values.length;
        const caseSensitive: boolean = language.caseSensitive!;

        Str.sortArrayOfStringByLength( values );

        for ( let valueIndex: number = 0; valueIndex < valuesLength; valueIndex++ ) {
            const value: string = values[ valueIndex ];
            const valueVariable: string = `VAL${_cached_Values_Count.toString()};`;
            let valueReplacement: string = null!;
            const regExFlags: string = caseSensitive ? "g" : "gi";
            const regEx: RegExp = new RegExp( getWordRegEx( value, language ), regExFlags );

            if ( bindingOptions.highlightValues ) {
                if ( Is.definedFunction( bindingOptions.events!.onValueClicked! ) ) {
                    valueReplacement = `<span class=\"value-clickable\">${value}</span>`;
                    innerHTML = innerHTML.replace( regEx, valueVariable );
                } else {
                    valueReplacement = `<span class=\"value\">${value}</span>`;
                    innerHTML = innerHTML.replace( regEx, valueVariable );
                }

            } else {
                if ( Is.definedFunction( bindingOptions.events!.onValueClicked! ) ) {
                    valueReplacement = `<span class=\"no-highlight-value-clickable\">${value}</span>`;
                    innerHTML = innerHTML.replace( regEx, valueVariable );
                }
            }

            _cached_Values[ valueVariable ] = valueReplacement;
            _cached_Values_Count++;

            Trigger.customEvent( bindingOptions.events!.onValueRender!, value );
        }

        return innerHTML;
    }

    function renderElementAttributes( innerHTML: string, language: SyntaxLanguage, bindingOptions: BindingOptions ) : string {
        const attributes: string[] = Default.getStringOrArray( language.attributes, [] );
        const attributesLength: number = attributes.length;
        const caseSensitive: boolean = language.caseSensitive!;

        Str.sortArrayOfStringByLength( attributes );

        for ( let attributeIndex: number = 0; attributeIndex < attributesLength; attributeIndex++ ) {
            const attribute: string = attributes[ attributeIndex ];
            const attributeVariable: string = `ATTR${_cached_Attributes_Count.toString()};`;
            let attributeReplacement: string = null!;
            let regExFlags: string = caseSensitive ? "g" : "gi";
            const regEx: RegExp = new RegExp( getWordRegEx( attribute, language ), regExFlags );

            if ( bindingOptions.highlightAttributes ) {
                if ( Is.definedFunction( bindingOptions.events!.onAttributeClicked ) ) {
                    attributeReplacement = `<span class=\"attribute-clickable\">${attribute}</span>`;
                    innerHTML = innerHTML.replace( regEx, attributeVariable );
                } else {
                    attributeReplacement = `<span class=\"attribute\">${attribute}</span>`;
                    innerHTML = innerHTML.replace( regEx, attributeVariable );
                }

            } else {
                if ( Is.definedFunction( bindingOptions.events!.onAttributeClicked ) ) {
                    attributeReplacement = `<span class=\"no-highlight-attribute-clickable\">${attribute}</span>`;
                    innerHTML = innerHTML.replace( regEx, attributeVariable );
                }
            }

            _cached_Attributes[ attributeVariable ] = attributeReplacement;
            _cached_Attributes_Count++;

            Trigger.customEvent( bindingOptions.events!.onAttributeRender!, attribute );
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
            start = Str.encodeMarkUpCharacters( multiLineComment[ 0 ] );
            end = Str.encodeMarkUpCharacters( multiLineComment[ 1 ] );
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

    function renderElementCompletedHTML( description: HTMLElement, numbers: HTMLElement, syntax: HTMLElement, innerHTML: string, bindingOptions: BindingOptions, isPreFormatted: boolean ) : void {
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

        if ( bindingOptions.doubleClickToSelectAll ) {
            if ( Is.defined( description ) ) {
                description.ondblclick =() => {
                    DomElement.selectTextInElement( codeContainer );
                };
            }

            if ( Is.defined( numbers ) ) {
                numbers.ondblclick =() => {
                    DomElement.selectTextInElement( codeContainer );
                };
            }
    
            syntax.ondblclick =() => {
                DomElement.selectTextInElement( codeContainer );
            };
        }

        for ( let lineIndex: number = 0; lineIndex < linesLength; lineIndex++ ) {
            let line: string = lines[ lineIndex ];

            if ( line.trim() !== Char.empty && replaceWhitespace === null ) {
                replaceWhitespace = line.substring( 0, line.match( /^\s*/ )![ 0 ].length );
            }

            if ( ( lineIndex !== 0 && lineIndex !== linesLength - 1 ) || line.trim() !== Char.empty ) {
                if ( line.trim() !== Char.empty || !bindingOptions.removeBlankLines ) {
                    const isBlank: boolean = line.trim() === Char.empty;

                    if ( isBlank && !lastLineWasBlank || !bindingOptions.removeDuplicateBlankLines || !isBlank ) {
                        lastLineWasBlank = isBlank;

                        if ( Is.defined( numberContainer ) ) {
                            const numberCode: HTMLElement = DomElement.create( "p" );
    
                            if ( bindingOptions.padLineNumbers ) {
                                numberCode.innerText = Str.padNumber( lineNumber.toString(), linesLengthStringLength );
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
    }

    function renderElementClickEvents( element: HTMLElement, customTrigger: Function, className: string ) : void {
        if ( Is.definedFunction( customTrigger ) ) {
            const domElements: HTMLCollectionOf<Element> = element.getElementsByClassName( className );
            const elements: HTMLElement[] = [].slice.call( domElements );
            const elementsLength: number = elements.length;

            for ( let elementIndex: number = 0; elementIndex < elementsLength; elementIndex++ ) {
                renderElementClickEvent( elements[ elementIndex ], customTrigger );
            }
        }
    }

    function renderElementClickEvent( element: HTMLElement, customTrigger: Function ) : void {
        const text: string = element.innerText;

        element.onclick =() => {
            customTrigger( text );
        };
    }

    function getFriendlyLanguageName( syntaxLanguage: string, languageLabelCasing: string = null! ) : string {
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
        if ( keywordsCasing === TextCasing.uppercase ) {
            keyword = keyword.toUpperCase();
        } else if ( keywordsCasing === TextCasing.lowercase ) {
            keyword = keyword.toLowerCase();
        }
        
        return keyword;
    }

    function getWordRegEx( word: string, language: SyntaxLanguage ) : string {
        let result: string = `(?<=^|[^-])\\b${word}\\b(?=[^-]|\$)`;

        if ( Is.definedString( language.wordRegEx ) ) {
            result = language.wordRegEx!.replace( "%word%", word );
        }

        return result;
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
            render();

            return _public;
        },

        highlightElement: function ( elementOrId: any ) : PublicApi {
            let element: any = elementOrId;

            if ( Is.definedString( element ) ) {
                element = document.getElementById( element );
            }
    
            if ( Is.defined( element ) ) {
                renderElement( element );
            }
    
            return _public;
        },

        getElementsHighlighted: function () : HTMLElement[] {
            return [].slice.call( _elements );
        },

        getCode: function ( elementId: string ) : string | null {
            let result: string = null!;

            if ( _elements_Original.hasOwnProperty( elementId ) ) {
                result = _elements_Original[ elementId ];
            }
    
            return result;
        },


        /*
         * ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------
         * Public API Functions:  Destroying
         * ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------
         */

        destroyAll: function () : PublicApi {
            for ( let elementId in _elements_Original ) {
                if ( _elements_Original.hasOwnProperty( elementId ) ) {
                    const renderedElement: HTMLElement = document.getElementById( elementId )!;
    
                    if ( Is.defined( renderedElement ) ) {
                        renderedElement.innerHTML = _elements_Original[ elementId ];
                    }
                }
            }
    
            _elements_Original = {};
            _elements = [];
    
            return _public;
        },
    
        destroy: function ( elementId: string ) : PublicApi {
            if ( _elements_Original.hasOwnProperty( elementId.toLowerCase() ) ) {
                const renderedElement: HTMLElement = document.getElementById( elementId )!;
    
                if ( Is.defined( renderedElement ) ) {
                    renderedElement.innerHTML = _elements_Original[ elementId.toLowerCase() ];
    
                    delete _elements_Original[ elementId.toLowerCase() ];
    
                    const elementsLength: number = _elements.length;
                    
                    for ( let elementIndex: number = 0; elementIndex < elementsLength; elementIndex++ ) {
                        if ( _elements[ elementIndex ].id === elementId ) {
                            delete _elements[ elementIndex ];
                            break;
                        }
                    }
                }
            }
    
            return _public;
        },


        /*
         * ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------
         * Public API Functions:  Languages
         * ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------
         */

        addLanguage: function ( name: string, languageDetails: SyntaxLanguage, triggerRender: boolean = true ) : boolean {
            let added: boolean = false;
            const lookup: string = name.toLowerCase();

            if ( !_languages.hasOwnProperty( lookup ) ) {
                _languages[ lookup ] = languageDetails;
                added = true;

                if ( triggerRender ) {
                    render();
                }
            }

            return added;
        },

        removeLanguage: function ( name: string ) : boolean {
            let removed: boolean = false;
            const lookup: string = name.toLowerCase();

            if ( _languages.hasOwnProperty( lookup ) ) {
                delete _languages[ lookup ];

                for ( let alias in _aliases_Rules ) {
                    if ( _aliases_Rules.hasOwnProperty( alias ) && _aliases_Rules[ alias ] === lookup ) {
                        delete _aliases_Rules[ alias ];
                    }
                }

                removed = true;
            }

            return removed;
        },

        getLanguage: function ( name: string ) : SyntaxLanguage | null {
            let details: SyntaxLanguage = null!;
            const lookup: string = name.toLowerCase();

            if ( _languages.hasOwnProperty( lookup ) ) {
                details = Default.getClonedObject( lookup );
            }

            return details;
        },

        getLanguages: function () : Record<string, SyntaxLanguage> {
            return Default.getClonedObject( _languages );
        },


        /*
         * ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------
         * Public API Functions:  Language Aliases
         * ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------
         */

        addAlias: function ( alias: string, language: string, triggerRender: boolean = true ) : boolean {
            let added: boolean = false;

            if ( _languages.hasOwnProperty( language.toLowerCase() ) && !_aliases_Rules.hasOwnProperty( alias.toLowerCase() ) ) {
                _aliases_Rules[ alias.toLowerCase() ] = language.toLowerCase();
                added = true;
    
                if ( triggerRender ) {
                    render();
                }
            }
    
            return added;
        },

        removeAlias: function ( alias: string ) : boolean {
            let removed: boolean = false;

            if ( _aliases_Rules.hasOwnProperty( alias.toLowerCase() ) ) {
                delete _aliases_Rules[ alias.toLowerCase() ];
    
                removed = true;
            }
    
            return removed;
        },

        getAlias: function ( alias: string ) : string | null {
            let result: string = null!;

            if ( _aliases_Rules.hasOwnProperty( alias.toLowerCase() ) ) {
                result = _aliases_Rules[ alias.toLowerCase() ];
            }
    
            return result;
        },

        getAliases: function () : Record<string, string> {
            return Default.getClonedObject( _aliases_Rules );
        },


        /*
         * ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------
         * Public API Functions:  Configuration
         * ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------
         */

        setConfiguration: function ( newConfiguration: any ) : PublicApi {
            if ( Is.definedObject( newConfiguration ) ) {
                let configurationHasChanged: boolean = false;
                const newInternalConfiguration: any = _configuration;
            
                for ( let propertyName in newConfiguration ) {
                    if ( newConfiguration.hasOwnProperty( propertyName ) && _configuration.hasOwnProperty( propertyName ) && newInternalConfiguration[ propertyName ] !== newConfiguration[ propertyName ] ) {
                        newInternalConfiguration[ propertyName ] = newConfiguration[ propertyName ];
                        configurationHasChanged = true;
                    }
                }
        
                if ( configurationHasChanged ) {
                    _configuration = Config.Options.get( newInternalConfiguration );
                }
            }
    
            return _public;
        },


        /*
         * ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------
         * Public API Functions:  Additional Data
         * ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------
         */

        getVersion: function () : string {
            return "3.0.1";
        }
    };


    /*
     * ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------
     * Initialize Syntax.js
     * ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------
     */

    ( () => {
        _configuration = Config.Options.get();

        document.addEventListener( "DOMContentLoaded", function() {
            render();
        } );

        if ( !Is.defined( window.$syntax ) ) {
            window.$syntax = _public;
        }
    } )();
} )();