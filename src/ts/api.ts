/**
 * Syntax.js
 * 
 * A lightweight, and easy-to-use, JavaScript library for code syntax highlighting!
 * 
 * @file        api.js
 * @version     v3.0.1
 * @author      Bunoon
 * @license     MIT License
 * @copyright   Bunoon 2024
 */


import { type SyntaxLanguage } from "./type";


export type PublicApi = {
    /*
     * ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------
     * Public API Functions:  Highlighting
     * ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------
     */

    /**
     * highlightAll().
     * 
     * Finds all new code elements and renders them.
     * 
     * @public
     * @fires       onRenderComplete
     * 
     * @returns     {Object}                                                The Syntax.js class instance.
     */
    highlightAll: () => PublicApi;

    /**
     * highlightElement().
     * 
     * Renders a specific DOM element.
     * 
     * @public
     * @fires       onRenderComplete
     * 
     * @param       {Object}    elementOrId                                 The element ID, or the element itself.
     * 
     * @returns     {Object}                                                The Syntax.js class instance.
     */
    highlightElement: ( elementOrId: any ) => PublicApi;

    /**
     * getElementsHighlighted().
     * 
     * Returns the elements that have been detected and rendered.
     * 
     * @public
     * 
     * @returns     {Object[]}                                              An array containing the rendered DOM elements.
     */
    getElementsHighlighted: () => HTMLElement[];

    /**
     * getCode().
     * 
     * Returns the code inside a specific element (without rendering colors).
     * 
     * @public
     * 
     * @param       {string}    elementId                                   The element ID.
     * 
     * @returns     {string}                                                The code in the element.
     */
    getCode: ( elementId: string ) => string | null;


    /*
     * ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------
     * Public API Functions:  Destroying
     * ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------
     */

    /**
     * destroyAll().
     * 
     * Reverts all rendered Syntax elements back to their original state (without render attributes).
     * 
     * @public
     * 
     * @returns     {Object}                                                The Syntax.js class instance.
     */
    destroyAll: () => PublicApi;

    /**
     * destroy().
     * 
     * Reverts a Syntax element back to its original state (without render attributes).
     * 
     * @public
     * 
     * @param       {string}    elementId                                   The ID of the DOM element to destroy.
     * 
     * @returns     {Object}                                                The Syntax.js class instance.
     */
    destroy: ( elementId: string ) => PublicApi;


    /*
     * ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------
     * Public API Functions:  Languages
     * ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------
     */

    /**
     * addLanguage().
     * 
     * Adds a new language that can be rendered.
     * 
     * @public
     * @fires       onRenderComplete
     * 
     * @param       {string}    name                                        The name of the language.
     * @param       {boolean}   languageDetails                             The language details (refer to "Language" documentation for properties).
     * @param       {boolean}   [triggerRender]                             States if new language DOM elements available should be rendered.
     * 
     * @returns     {boolean}                                               States if the language has been added.
     */
    addLanguage: ( name: string, languageDetails: SyntaxLanguage, triggerRender?: boolean ) => boolean;

    /**
     * removeLanguage().
     * 
     * Removes a language that can be rendered.
     * 
     * @public
     * 
     * @param       {string}    name                                        The name of the language.
     * 
     * @returns     {boolean}                                               States if the language has been removed.
     */
    removeLanguage: ( name: string ) => boolean;

    /**
     * getLanguage().
     * 
     * Returns the language details (by name) that can be rendered.
     * 
     * @public
     * 
     * @param       {string}    name                                        The name of the language.
     * 
     * @returns     {Object}                                                The language details.
     */
    getLanguage: ( name: string ) => SyntaxLanguage | null;

    /**
     * getLanguages().
     * 
     * Returns all the languages that can be rendered.
     * 
     * @public
     * 
     * @returns     {Object}                                                The object that contains the languages.
     */
    getLanguages: () => Record<string, SyntaxLanguage>;


    /*
     * ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------
     * Public API Functions:  Language Aliases
     * ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------
     */

    /**
     * addAlias().
     * 
     * Adds a new language alias.
     * 
     * @public
     * @fires       onRenderComplete
     * 
     * @param       {string}    alias                                       The name of the alias.
     * @param       {string}    language                                    The name of the language.
     * @param       {boolean}   [triggerRender]                             States if new language alias DOM elements available should be rendered.
     * 
     * @returns     {boolean}                                               States if the alias has been added.
     */
    addAlias: ( alias: string, language: string, triggerRender?: boolean ) => boolean;

    /**
     * removeAlias().
     * 
     * Removes a language alias.
     * 
     * @public
     * 
     * @param       {string}    alias                                       The name of the alias.
     * 
     * @returns     {boolean}                                               States if the alias has been removed.
     */
    removeAlias: ( alias: string ) => boolean;

    /**
     * getAlias().
     * 
     * Returns a language alias.
     * 
     * @public
     * 
     * @param       {string}    alias                                       The name of the alias.
     * 
     * @returns     {string}                                                The name of the language.
     */
    getAlias: ( alias: string ) => string | null;

    /**
     * getAliases().
     * 
     * Returns all the language aliases.
     * 
     * @public
     * 
     * @returns     {Object}                                                The object that contains the aliases.
     */
    getAliases: () => Record<string, string>


    /*
     * ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------
     * Public API Functions:  Configuration
     * ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------
     */

    /**
     * setConfiguration().
     * 
     * Sets the specific configuration options that should be used.
     * 
     * @public
     * 
     * @param       {Object}    newConfiguration                            All the configuration options that should be set (refer to "Configuration Options" documentation for properties).
     * 
     * @returns     {Object}                                                The Syntax.js class instance.
     */
    setConfiguration: ( newConfiguration: any ) => PublicApi;


    /*
     * ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------
     * Public API Functions:  Additional Data
     * ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------
     */

    /**
     * getVersion().
     * 
     * Returns the version of Syntax.js.
     * 
     * @public
     * 
     * @returns     {string}                                                The version number.
     */
    getVersion: () => string;
};

declare global {
	interface Window {
		$syntax: PublicApi;
	}
}