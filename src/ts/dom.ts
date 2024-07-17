/**
 * Syntax.js
 * 
 * A lightweight, and easy-to-use, JavaScript library for code syntax highlighting!
 * 
 * @file        dom.ts
 * @version     v3.0.1
 * @author      Bunoon
 * @license     MIT License
 * @copyright   Bunoon 2024
 */


import { Char } from "./enum";
import { Is } from "./is";
import { type Configuration } from "./type";


export namespace DomElement {
    export function create( type: string, className: string = Char.empty ) : HTMLElement {
        const nodeType: string = type.toLowerCase();
        const isText: boolean = nodeType === "text";

        let result: any = isText ? document.createTextNode( Char.empty ) : document.createElement( nodeType );

        if ( Is.defined( className ) ) {
            result.className = className;
        }

        return result;
    }

    export function setNodeText( element: HTMLElement, text: string, configuration: Configuration ) : void {
        if ( !configuration.allowHtmlInTextDisplay ) {
            const div: HTMLElement = create( "div" );
            div.innerHTML = text;

            element.innerText = div.innerText;

        } else {
            element.innerHTML = text;
        }
    }

    export function selectTextInElement( element: HTMLElement ) : void {
        const range: Range = document.createRange();
        range.selectNode( element );

        window.getSelection()!.removeAllRanges();
        window.getSelection()!.addRange( range );
    }
}