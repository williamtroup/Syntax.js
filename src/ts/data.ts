/**
 * Syntax.js
 * 
 * A lightweight, and easy-to-use, JavaScript library for code syntax highlighting!
 * 
 * @file        data.ts
 * @version     v3.0.1
 * @author      Bunoon
 * @license     MIT License
 * @copyright   Bunoon 2024
 */


import { Char } from "./enum";
import { Is } from "./is";


export namespace Data {
    export namespace String {
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

    export function getDefaultAnyString( value: any, defaultValue: string ) : string {
        return typeof value === "string" ? value : defaultValue;
    }

    export function getDefaultString( value: any, defaultValue: string ) : string {
        return Is.definedString( value ) ? value : defaultValue;
    }

    export function getDefaultBoolean( value: any, defaultValue: boolean ) : boolean {
        return Is.definedBoolean( value ) ? value : defaultValue;
    }

    export function getDefaultNumber( value: any, defaultValue: number ) : number {
        return Is.definedNumber( value ) ? value : defaultValue;
    }

    export function getDefaultFunction( value: any, defaultValue: object ) : any {
        return Is.definedFunction( value ) ? value : defaultValue;
    }

    export function getDefaultArray( value: any, defaultValue: any[] ) : any[] {
        return Is.definedArray( value ) ? value : defaultValue;
    }

    export function getDefaultObject( value: any, defaultValue: object ) : any {
        return Is.definedObject( value ) ? value : defaultValue;
    }

    export function getDefaultStringOrArray( value: any, defaultValue: string[] ) : string[] {
        let result: string[] = defaultValue;

        if ( Is.definedString( value ) ) {
            const values: string[] = value.toString().split( Char.space );

            if ( values.length === 0 ) {
                value = defaultValue;
            } else {
                result = values;
            }

        } else {
            result = getDefaultArray( value, defaultValue );
        }

        return result;
    }

    export function getClonedObject( object: any ): any {
        const json: string = JSON.stringify( object );
        const result: any = JSON.parse( json );

        return result;
    }
}