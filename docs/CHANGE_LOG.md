# Syntax.js - Change Log:

## Version 0.6.0:
- Added support for the Swift programming language (importable file).
- 

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