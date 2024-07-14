/**
 * Syntax.js
 * 
 * A lightweight, and easy-to-use, JavaScript library for code syntax highlighting!
 * 
 * @file        syntax.js
 * @version     v3.0.0
 * @author      Bunoon
 * @license     MIT License
 * @copyright   Bunoon 2024
 */


import { PublicApi } from "./ts/api";
import { Constants } from "./ts/constant";
import { SyntaxLanguage } from "./ts/type";


( () => {


	/*
	 * ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------
	 * Public API Functions:
	 * ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------
	 */

    const _public: PublicApi = {
        /*
         * ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------
         * Public API Functions:  Highlighting
         * ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------
         */

        highlightAll: function () : PublicApi {
            throw new Error("Function not implemented.");
        },

        highlightElement: function ( elementOrId: any ) : PublicApi {
            throw new Error("Function not implemented.");
        },

        getElementsHighlighted: function () : HTMLElement[] {
            throw new Error("Function not implemented.");
        },

        getCode: function ( elementId: string ) : string | null {
            throw new Error("Function not implemented.");
        },


        /*
         * ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------
         * Public API Functions:  Destroying
         * ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------
         */

        destroyAll: function () : PublicApi {
            throw new Error("Function not implemented.");
        },
    
        destroy: function ( elementId: string ) : PublicApi {
            throw new Error("Function not implemented.");
        },


        /*
         * ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------
         * Public API Functions:  Languages
         * ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------
         */

        addLanguage: function ( name: string, languageDetails: SyntaxLanguage, triggerRender: boolean = true ) : boolean {
            throw new Error("Function not implemented.");
        },

        removeLanguage: function ( name: string ) : boolean {
            throw new Error("Function not implemented.");
        },

        getLanguage: function ( name: string ) : SyntaxLanguage {
            throw new Error("Function not implemented.");
        },

        getLanguages: function () : Record<string, SyntaxLanguage> {
            throw new Error("Function not implemented.");
        },


        /*
         * ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------
         * Public API Functions:  Language Aliases
         * ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------
         */

        addAlias: function ( alias: string, language: string, triggerRender: boolean = true ) : boolean {
            throw new Error("Function not implemented.");
        },
        
        removeAlias: function ( alias: string ) : boolean {
            throw new Error("Function not implemented.");
        },

        getAlias: function ( alias: string ) : string {
            throw new Error("Function not implemented.");
        },

        getAliases: function () : Record<string, string> {
            throw new Error("Function not implemented.");
        },


        /*
         * ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------
         * Public API Functions:  Configuration
         * ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------
         */

        setConfiguration: function ( newConfiguration: any ) : PublicApi {
            throw new Error("Function not implemented.");
        },


        /*
         * ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------
         * Public API Functions:  Additional Data
         * ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------
         */

        getVersion: function () : string {
            throw new Error("Function not implemented.");
        }
    };


    /*
     * ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------
     * Initialize Syntax.js
     * ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------
     */
    ( () => {

    } )();
} )();