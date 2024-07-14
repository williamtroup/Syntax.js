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
    text?: ConfigurationText;
    events?: ConfigurationEvents;
}

export type ConfigurationEvents = {
    onBeforeRender?: Function;
    onAfterRender?: Function;
}

export type ConfigurationText = {
    buttonsOpenerText?: string;
    buttonsCloserText?: string;
    objectErrorText?: string;
    attributeNotSetErrorText?: string;
    languageNotSupportedErrorText?: string;
    noCodeAvailableToRenderErrorText?: string;
    copyButtonText?: string;
    printButtonText?:string;
}