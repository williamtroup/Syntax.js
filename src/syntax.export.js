/**
 * Syntax.js
 * 
 * A lightweight, and easy-to-use, JavaScript library for code syntax highlighting!
 * 
 * @file        syntax.js
 * @version     v2.6.0
 * @author      Bunoon
 * @license     MIT License
 * @copyright   Bunoon 2024
 */


var syntax = {
    js: function() {
        return window.$syntax;
    }
};

Object.assign( window, { syntax } );

export { syntax };