# Syntax.js - Change Log:

## Version 1.0.0:

#### **New Features:**
- 

#### **Settings:**
- Added a new setting called "highlightComments", which states if comments should be highlighted (defaults to true).
- Added a new setting called "highlightStrings", which states if strings should be highlighted (defaults to true).
- Added a new setting called "highlightKeywords", which states if keywords should be highlighted (defaults to true).

#### **General Improvements:**
- 

#### **Code Improvements:**
- 

#### **Fixes:**
- 

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