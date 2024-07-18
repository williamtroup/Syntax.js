/**
 * Syntax.js
 * 
 * A lightweight, and easy-to-use, JavaScript library for code syntax highlighting!
 * 
 * @file        default.ts
 * @version     v3.0.1
 * @author      Bunoon
 * @license     MIT License
 * @copyright   Bunoon 2024
 */


import { Char } from "./enum";


export namespace Str {
    export function newGuid() : string {
        const result: string[] = [];

        for ( let charIndex: number = 0; charIndex < 32; charIndex++ ) {
            if ( charIndex === 8 || charIndex === 12 || charIndex === 16 || charIndex === 20 ) {
                result.push( Char.dash );
            }

            const character: string = Math.floor( Math.random() * 16 ).toString( 16 );
            result.push( character );
        }

        return result.join( Char.empty );
    }

    export function padNumber( number: string, length: number ) : string {
        let result: string = number;

        while ( result.length < length ) {
            result = `0${result}`;
        }
            
        return result;
    }

    export function encodeMarkUpCharacters( data: string ) : string {
        data = data.replace( /</g, "&lt;" );
        data = data.replace( />/g, "&gt;" );

        return data;
    }

    export function sortArrayOfStringByLength( array: string[] ) : void {
        array.sort( function( a, b ){
            return b.length - a.length;
        } );
    }
}