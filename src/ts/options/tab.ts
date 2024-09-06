/**
 * Syntax.js
 * 
 * A lightweight, and easy-to-use, JavaScript library for code syntax highlighting!
 * 
 * @file        tag.ts
 * @version     v3.1.0
 * @author      Bunoon
 * @license     MIT License
 * @copyright   Bunoon 2024
 */


import { type BindingTabContentOptionEvents, type BindingTabContentOptions } from "../type";
import { Default } from "../data/default";


export namespace Tab {
    export namespace Options {
        export function get( newOptions: any ) : BindingTabContentOptions {
            let options: BindingTabContentOptions = Default.getObject( newOptions, {} as BindingTabContentOptions );
    
            options = getText( options );
            options = getCustomTriggers( options );
    
            return options;
        }
    
        function getText( options: BindingTabContentOptions ) : BindingTabContentOptions {
            options.title = Default.getString( options.title, null! );
            options.description = Default.getString( options.description, null! );
    
            return options;
        }
    
        function getCustomTriggers( options: BindingTabContentOptions ) : BindingTabContentOptions {
            options.events = Default.getFunction( options.events, {} as BindingTabContentOptionEvents );
            options.events!.onOpen = Default.getFunction( options.events!.onOpen, null! );
    
            return options;
        }
    }
}