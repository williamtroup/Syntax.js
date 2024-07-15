/**
 * Syntax.js
 * 
 * A lightweight, and easy-to-use, JavaScript library for code syntax highlighting!
 * 
 * @file        type.js
 * @version     v3.0.1
 * @author      Bunoon
 * @license     MIT License
 * @copyright   Bunoon 2024
 */


export type Configuration = {
    safeMode?: boolean;
    highlightAllDomElementTypes?: string | string[];
    allowHtmlInTextDisplay?: boolean;
    text?: ConfigurationText;
    events?: ConfigurationEvents;
};

export type ConfigurationEvents = {
    onBeforeRender?: () => void;
    onAfterRender?: () => void;
};

export type ConfigurationText = {
    buttonsOpenerText?: string;
    buttonsCloserText?: string;
    objectErrorText?: string;
    attributeNotSetErrorText?: string;
    languageNotSupportedErrorText?: string;
    noCodeAvailableToRenderErrorText?: string;
    copyButtonText?: string;
    printButtonText?: string;
};

export type BindingOptions = {
    showCopyButton?: boolean;
    removeBlankLines?: boolean;
    showLineNumbers?: boolean;
    highlightKeywords?: boolean;
    highlightValues?: boolean;
    highlightAttributes?: boolean;
    highlightStrings?: boolean;
    highlightComments?: boolean;
    showLanguageLabel?: boolean;
    showPrintButton?: boolean;
    padLineNumbers?: boolean;
    removeDuplicateBlankLines?: boolean;
    doubleClickToSelectAll?: boolean;
    languageLabelCasing?: string;
    buttonsVisible?: boolean;
    maximumButtons?: number;
    events?: BindingOptionEvents;
};

export type BindingOptionEvents = {
    onCopy?: ( code: string ) => void;
    onRenderComplete?: ( element: HTMLElement ) => void;
    onKeywordClicked?: ( keyword: string ) => void;
    onValueClicked?: ( value: string ) => void;
    onAttributeClicked?: ( attribute: string ) => void;
    onKeywordRender?: ( keyword: string ) => void;
    onValueRender?: ( value: string ) => void;
    onAttributeRender?: ( attribute: string ) => void;
    onStringRender?: ( string: string ) => void;
    onCommentRender?: ( comment: string ) => void;
    onPrint?: ( code: string ) => void;
    onBeforeRenderComplete?: ( element: HTMLElement ) => void;
    onButtonsOpened?: () => void;
    onButtonsClosed?: () => void;
};

export type BindingTabContentOptions = {
    title?: string;
    description?: string;
    events?: BindingTabContentOptionEvents;
};

export type BindingTabContentOptionEvents = {
    onOpen?: ( language: string ) => void;
};

export type SyntaxLanguage = {
    keywords?: string | string[];
    values?: string | string[];
    attributes?: string | string[];
    comment?: string;
    multiLineComment?: string[];
    caseSensitive?: boolean;
    friendlyName?: string;
    keywordsCasing?: string;
    isMarkUp?: boolean;
    wordRegEx?: string;
};

export type CustomButton = {
    text?: string;
    className?: string;
    events?: CustomButtonEvent;
};

export type CustomButtonEvent = {
    onClick?: ( code: string ) => void;
};