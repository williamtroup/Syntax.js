# Syntax.js - Change Log:

## Version 0.4.0:
- Removed public function "setOptions()", as its not needed due to the options attribute.
- Removed the custom trigger "onOptionsUpdated", as it's not needed anymore.
- Added support to set the custom triggers via the "data-syntax-options" attribute options.
- Added support to leave out the language property "multiLineComment", as some languages don't require special characters outside the standard comment.
- Added support for the Python, Go, and Ruby programming languages (importable files).
- 

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