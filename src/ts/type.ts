/**
 * Syntax.js
 * 
 * A lightweight, and easy-to-use, JavaScript library for code syntax highlighting!
 * 
 * @file        type.js
 * @version     v3.0.0
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
    onBeforeRender?: Function;
    onAfterRender?: Function;
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
    onCopy?: Function;
    onRenderComplete?: Function;
    onKeywordClicked?: Function;
    onValueClicked?: Function;
    onAttributeClicked?: Function;
    onKeywordRender?: Function;
    onValueRender?: Function;
    onAttributeRender?: Function;
    onStringRender?: Function;
    onCommentRender?: Function;
    onPrint?: Function;
    onBeforeRenderComplete?: Function;
    onButtonsOpened?: Function;
    onButtonsClosed?: Function;
};

export type BindingTabContentOptions = {
    title?: string;
    description?: string;
    events?: BindingTabContentOptionEvents;
};

export type BindingTabContentOptionEvents = {
    onOpen?: Function;
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
    onClick?: Function;
};