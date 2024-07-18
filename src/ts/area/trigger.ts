/**
 * Syntax.js
 * 
 * A lightweight, and easy-to-use, JavaScript library for code syntax highlighting!
 * 
 * @file        trigger.ts
 * @version     v3.0.1
 * @author      Bunoon
 * @license     MIT License
 * @copyright   Bunoon 2024
 */


import { Is } from "../data/is";


export namespace Trigger {
    export function customEvent<Type>( triggerFunction: Function, ...args : any[] ) : Type {
        let result: any = null;

        if ( Is.definedFunction( triggerFunction ) ) {
            result = triggerFunction.apply( null, [].slice.call( args, 0 ) );
        }

        return result;
    }
}