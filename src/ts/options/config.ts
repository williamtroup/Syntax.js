/**
 * Syntax.js
 * 
 * A lightweight, and easy-to-use, JavaScript library for code syntax highlighting!
 * 
 * @file        config.ts
 * @version     v3.1.0
 * @author      Bunoon
 * @license     MIT License
 * @copyright   Bunoon 2024
 */


import {
    type ConfigurationEvents,
    type Configuration,
    type ConfigurationText } from "../type";
    
import { Default } from "../data/default";


export namespace Config {
    export namespace Options {
        export function get( newConfiguration: Configuration = null! ) : Configuration {
            let configuration = Default.getObject( newConfiguration, {} as Configuration );
            configuration.safeMode = Default.getBoolean( configuration.safeMode, true );
            configuration.highlightAllDomElementTypes = Default.getStringOrArray( configuration.highlightAllDomElementTypes, [ "div", "code" ] );
            configuration.allowHtmlInTextDisplay = Default.getBoolean( configuration.allowHtmlInTextDisplay, true );
    
            configuration = getText( configuration );
            configuration = getCustomTriggers( configuration );

            return configuration;
        }
    
        function getText( configuration: Configuration ) : Configuration {
            configuration.text = Default.getObject( configuration.text, {} as ConfigurationText )
            configuration.text!.buttonsOpenerText = Default.getAnyString( configuration.text!.buttonsOpenerText, "←" );
            configuration.text!.buttonsCloserText = Default.getAnyString( configuration.text!.buttonsCloserText, "→" );
            configuration.text!.objectErrorText = Default.getAnyString( configuration.text!.objectErrorText, "Errors in object: {{error_1}}, {{error_2}}" );
            configuration.text!.attributeNotSetErrorText = Default.getAnyString( configuration.text!.attributeNotSetErrorText, "The attribute '{{attribute_name}}' has not been set correctly." );
            configuration.text!.languageNotSupportedErrorText = Default.getAnyString( configuration.text!.languageNotSupportedErrorText, "Language '{{language}}' is not supported." );
            configuration.text!.noCodeAvailableToRenderErrorText = Default.getAnyString( configuration.text!.noCodeAvailableToRenderErrorText, "No code is available to render." );
            configuration.text!.copyButtonText = Default.getAnyString( configuration.text!.copyButtonText, "Copy" );
            configuration.text!.printButtonText = Default.getAnyString( configuration.text!.printButtonText, "Print" );

            return configuration;
        }
    
        function getCustomTriggers( configuration: Configuration ) : Configuration {
            configuration.events = Default.getObject( configuration.events, {} as ConfigurationEvents )
            configuration.events!.onBeforeRender = Default.getFunction( configuration.events!.onBeforeRender, null! );
            configuration.events!.onAfterRender = Default.getFunction( configuration.events!.onAfterRender, null! );

            return configuration;
        }
    }
}