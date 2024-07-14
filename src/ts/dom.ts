/**
 * Syntax.js
 * 
 * A lightweight, and easy-to-use, JavaScript library for code syntax highlighting!
 * 
 * @file        dom.js
 * @version     v3.0.0
 * @author      Bunoon
 * @license     MIT License
 * @copyright   Bunoon 2024
 */


import { Char } from "./enum";
import { Is } from "./is";


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
}