# Syntax.js - Change Log:

## Version 1.2.0:
- The copy button is now hidden in mobile mode.
- Added new BootStrap testing files.
- 

<br>


## Version 1.1.0:

#### **General Improvements:**
- The render() method now only scans for "div" and "code" DOM element types (faster).
- When a specific language is not supported, a new error log is shown in the console.

#### **Custom Triggers:**
- Added new custom trigger "onKeywordRender", which is called when a keyword is rendered (before main render completion).
- Added new custom trigger "onStringRender", which is called when a string is rendered (before main render completion).
- Added new custom trigger "onCommentRender", which is called when a comment is rendered (before main render completion).

#### **Documentation:**
- Fixed documentation missing references that prevented the library from working properly.
- Improved the README.md and README_NUGET.md documentation.

<br>


## Version 1.0.0:

#### **Languages:**
- Case Sensitive: Added a new language property "caseSensitive" (defaults to true) which states if the keyword matching is case sensitive.
- Added support for the TypeScript programming language (importable file).

#### **Settings:**
- Added a new setting called "highlightComments", which states if comments should be highlighted (defaults to true).
- Added a new setting called "highlightStrings", which states if strings should be highlighted (defaults to true).
- Added a new setting called "highlightKeywords", which states if keywords should be highlighted (defaults to true).

#### **Public Functions:**
- Renamed the public function "findAndBuildNewElements()" to "highlightAll()".
- Renamed the public function "getRenderedElements()" to "getAllElementsHighlighted()".
- Added new public function "removeLanguage()", which will remove a specific language that can be rendered by name.
- Added new public function "getAllLanguages()", which will return the object that contains all the language details.
- Added new public function "highlightElement()", which will render a specific DOM element (accepts either the element or the ID of the element).
- Added new public function "getLanguage()", which will return the details for a specific language (by name).
- Renamed the public function "destroy()" to "destroyAll()".
- Added a new version of the public function "destroy()", which will revert a specific element to its original HTML (minus the syntax attributes).

#### **Custom Triggers:**
- Renamed the custom trigger "onRender" to "onRenderComplete".

#### **UI Improvements:**
- The numbers column is now hidden by default on smaller screens (and the code line will now wrap).

#### **Fixes:**
- Fixed links to missing documentation in the main README.md and README_NUGET.md files.
- Fixed some grammar mistakes.
- Fixed a fault that prevented the original destroy() public function (now destroyAll()) from clearing down the elements list.

<br>


## Version 0.8.0:
- Added a new setting called "showLineNumbers", which states if the line numbers should be shown (defaults to true).
- Renamed the public function "buildNewSyntaxElements" to "findAndBuildNewElements()".
- Added new public function "destroy()", which will revert all rendered elements to their original HTML (minus the syntax attributes).

<br>


## Version 0.7.0:
- Added NuGet.org Nuget package support via a new nuspec file.
- The default language "JavaScript" is no longer built-in, and must be imported like all other languages.
- Updated the project description.
- Added support for the C, JavaScript, and MS-SQL programming languages (importable files).

<br>


## Version 0.6.0:
- Added support for the Swift and Visual Basic programming languages (importable files).
- Added new public function "getRenderedElements()", which returns all the elements that have been rendered.
- Added indentation support!
- Minor code correction for handling empty strings.
- Added a new setting called "removeBlankLines", which states if all the blank lines should be removed (defaults to false).
- Added some very light borders around the Numbers and Syntax DOM containers.
- Added a default font and font size via the SCSS/CSS.

<br>


## Version 0.5.0:
- Added support for the C++ and Java programming languages (importable files).
- Fixed a fault that caused parameters to be parsed for custom triggers when they were not actually set.
- Fixed the default language containing the "*" symbol in the keywords.
- Renamed the root variable "--color-variable" to "--color-keyword".
- Added a new custom trigger "onKeywordClicked", which is fired when a keyword is clicked.

<br>


## Version 0.4.0:
- Removed public function "setOptions()", as it's not needed due to the options attribute.
- Removed the custom trigger "onOptionsUpdated", as it's not needed anymore.
- Added support to set the custom triggers via the "data-syntax-options" attribute options.
- The language property "multiLineComment" is now optional, as some languages don't require special characters for multi-line comments.
- Added support for the Python, Go, and Ruby programming languages (importable files).

<br>


## Version 0.3.0:
- Added Code/Pre element rendering support.
- Added options attribute "data-syntax-options" support, which will override the default options per code element rendered.
- Fixed a class name setting issue that caused a random space to appear.
- Added a new custom trigger "onCopy", which is fired when the "Copy" button for a syntax element is pressed.

<br>


## Version 0.2.0:
- Added a border around the code container (uses root variables for easy changing).
- Increased the padding slightly for the "Copy" button.
- Added a background color to the code syntax container (next to the numbers) and added a border-radius.
- Added new public function "addLanguage()", which will add a new language to the library and will auto-render DOM elements found for that language.
- Added all missing keywords for the built-in language "JavaScript".
- Added C# language support via an importable file.

<br>


## Version 0.1.0:
- Everything :)