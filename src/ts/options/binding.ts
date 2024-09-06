/**
 * Syntax.js
 * 
 * A lightweight, and easy-to-use, JavaScript library for code syntax highlighting!
 * 
 * @file        binding.ts
 * @version     v3.1.0
 * @author      Bunoon
 * @license     MIT License
 * @copyright   Bunoon 2024
 */


import { type BindingOptionsHighlight, type BindingOptionEvents, type BindingOptions, BindingOptionsButtons } from "../type";
import { Default } from "../data/default";
import { TextCasing } from "../data/enum";


export namespace Binding {
    export namespace Options {
        export function get( newOptions: any ) : BindingOptions {
            let options: BindingOptions = Default.getObject( newOptions, {} as BindingOptions );
    
            options = getOptions( options );
            options = getButtons( options );
            options = getHighlight( options );
            options = getCustomTriggers( options );
    
            return options;
        }
    
        function getOptions( options: BindingOptions ) : BindingOptions {
            options.removeBlankLines = Default.getBoolean( options.removeBlankLines, false );
            options.showLineNumbers = Default.getBoolean( options.showLineNumbers, true );
            options.showLanguageLabel = Default.getBoolean( options.showLanguageLabel, true );
            options.padLineNumbers = Default.getBoolean( options.padLineNumbers, false );
            options.removeDuplicateBlankLines = Default.getBoolean( options.removeDuplicateBlankLines, true );
            options.doubleClickToSelectAll = Default.getBoolean( options.doubleClickToSelectAll, true );
            options.languageLabelCasing = Default.getString( options.languageLabelCasing, TextCasing.uppercase );
            
            return options;
        }

        function getButtons( options: BindingOptions ) : BindingOptions {
            options.buttons = Default.getObject( options.buttons, {} as BindingOptionsButtons );
            options.buttons!.showCopy = Default.getBoolean( options.buttons!.showCopy, true );
            options.buttons!.showPrint = Default.getBoolean( options.buttons!.showPrint, true );
            options.buttons!.visible = Default.getBoolean( options.buttons!.visible, true );
            options.buttons!.maximum = Default.getNumber( options.buttons!.maximum, 2 );

            return options;
        }

        function getHighlight( options: BindingOptions ) : BindingOptions {
            options.highlight = Default.getObject( options.highlight, {} as BindingOptionsHighlight );
            options.highlight!.keywords = Default.getBoolean( options.highlight!.keywords, true );
            options.highlight!.values = Default.getBoolean( options.highlight!.values, true );
            options.highlight!.attributes = Default.getBoolean( options.highlight!.attributes, true );
            options.highlight!.strings = Default.getBoolean( options.highlight!.strings, true );
            options.highlight!.comments = Default.getBoolean( options.highlight!.comments, true );
    
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