/**
 * Syntax.js
 * 
 * A lightweight, and easy-to-use, JavaScript library for code syntax highlighting!
 * 
 * @file        binding.ts
 * @version     v3.0.2
 * @author      Bunoon
 * @license     MIT License
 * @copyright   Bunoon 2024
 */


import { type BindingOptionEvents, type BindingOptions } from "../type";
import { Default } from "../data/default";
import { TextCasing } from "../data/enum";


export namespace Binding {
    export namespace Options {
        export function get( newOptions: any ) : BindingOptions {
            let options: BindingOptions = Default.getObject( newOptions, {} as BindingOptions );
    
            options = getOptions( options );
            options = getCustomTriggers( options );
    
            return options;
        }
    
        function getOptions( options: BindingOptions ) : BindingOptions {
            options.showCopyButton = Default.getBoolean( options.showCopyButton, true );
            options.removeBlankLines = Default.getBoolean( options.removeBlankLines, false );
            options.showLineNumbers = Default.getBoolean( options.showLineNumbers, true );
            options.highlightKeywords = Default.getBoolean( options.highlightKeywords, true );
            options.highlightValues = Default.getBoolean( options.highlightValues, true );
            options.highlightAttributes = Default.getBoolean( options.highlightAttributes, true );
            options.highlightStrings = Default.getBoolean( options.highlightStrings, true );
            options.highlightComments = Default.getBoolean( options.highlightComments, true );
            options.showLanguageLabel = Default.getBoolean( options.showLanguageLabel, true );
            options.showPrintButton = Default.getBoolean( options.showPrintButton, true );
            options.padLineNumbers = Default.getBoolean( options.padLineNumbers, false );
            options.removeDuplicateBlankLines = Default.getBoolean( options.removeDuplicateBlankLines, true );
            options.doubleClickToSelectAll = Default.getBoolean( options.doubleClickToSelectAll, true );
            options.languageLabelCasing = Default.getString( options.languageLabelCasing, TextCasing.uppercase );
            options.buttonsVisible = Default.getBoolean( options.buttonsVisible, true );
            options.maximumButtons = Default.getNumber( options.maximumButtons, 2 );
            
            return options;
        }
    
        function getCustomTriggers( options: BindingOptions ) : BindingOptions {
            options.events = Default.getObject( options.events, {} as BindingOptionEvents );
            options.events!.onCopy = Default.getFunction( options.events!.onCopy, null! );
            options.events!.onRenderComplete = Default.getFunction( options.events!.onRenderComplete, null! );
            options.events!.onKeywordClicked = Default.getFunction( options.events!.onKeywordClicked, null! );
            options.events!.onValueClicked = Default.getFunction( options.events!.onValueClicked, null! );
            options.events!.onAttributeClicked = Default.getFunction( options.events!.onAttributeClicked, null! );
            options.events!.onKeywordRender = Default.getFunction( options.events!.onKeywordRender, null! );
            options.events!.onValueRender = Default.getFunction( options.events!.onValueRender, null! );
            options.events!.onAttributeRender = Default.getFunction( options.events!.onAttributeRender, null! );
            options.events!.onStringRender = Default.getFunction( options.events!.onStringRender, null! );
            options.events!.onCommentRender = Default.getFunction( options.events!.onCommentRender, null! );
            options.events!.onPrint = Default.getFunction( options.events!.onPrint, null! );
            options.events!.onBeforeRenderComplete = Default.getFunction( options.events!.onBeforeRenderComplete, null! );
            options.events!.onButtonsOpened = Default.getFunction( options.events!.onButtonsOpened, null! );
            options.events!.onButtonsClosed = Default.getFunction( options.events!.onButtonsClosed, null! );
    
            return options;
        }
    }
}