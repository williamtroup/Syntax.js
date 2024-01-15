# Syntax.js - Change Log:

## Version 2.4.0:
-

<br>


## Version 2.3.1:
- Comments are now italic by default.
- Added a new binding custom trigger called "onButtonsClosed", which states an event that should be triggered when the buttons are closed.
- Added a new binding custom trigger called "onButtonsOpened", which states an event that should be triggered when the buttons are closed.
- Minor documentation improvements.

<br>


## Version 2.3.0:

#### **Languages:**
- Added a new JSON property called "wordRegEx", which states the Regular Expression that is used for looking up keywords, values, attributes, and tags (optional, use %word% to state the lookup).

#### **Binding Options - Custom Triggers:**
- Added a new binding custom trigger called "onBeforeRenderComplete", which states an event that should be triggered before an element is rendered.

#### **Configuration Options:**
- Added new configuration option "allowHtmlInTextDisplay" (defaults to true), which states if HTML can be used in the text displays (buttons, tabs, descriptions, etc).

#### **General Improvements:**
- Double-clicking in the description container (when tabs are used) will now select all the code (if the setting is turned on).

### **CSS:**
- Renamed some of the ":root" variables so they are easier to read.
- Improved browser support for the no-text selection CSS.

#### **Fixes:**
- Fixed a fault that prevented non-highlighted keywords and values from being rendered correctly when "highlightKeywords" and "highlightValues" were set to false.
- Fixed a fault that caused the custom scroll bars to now show the right border color.

<br>


## Version 2.2.0:

#### **New Features:**
- Added "description" support for the binding attribute "data-syntax-tab-contents" options.  When set, this will show a description panel next to the code.

#### **Languages:**
- Added support for the CSS styling language (importable file).
- The JSON property "comment" is now optional.
- The RegEx used for searching for keywords, values, attributes, and tags, is now much more accurate.

#### **Configuration Options - Custom Triggers:**
- Added a new configuration custom trigger called "onBeforeRender", which states an event that should be triggered before any DOM elements are rendered (when found).
- Added a new configuration custom trigger called "onAfterRender", which states an event that should be triggered after any DOM elements are rendered (when found).

### **CSS:**
- Added new ":root" variable "--container-background-color-description", which states the background color to use for the description panel (for tabs).
- Added new ":root" variable "--container-border-color-description", which states the border color to use for the description panel (for tabs).

#### **Documentation:**
- Some more of the documentation has been renamed and moved into category folders (the filenames were getting confusing).

<br>


## Version 2.1.1:
- Added an extra check when processing the attribute "data-syntax-tab-contents" options.

<br>


## Version 2.1.0:

#### **New Features:**
- Added full binding support for "data-syntax-tab-contents", which allows some configuration to be set per tab.

#### **Binding Options Tab Contents:**
- Added a new binding option called "title", which states the title to use for a Tab (defaults to null, which forces the language name to be used).

#### **Binding Options Tab Contents - Custom Triggers:**
- Added a new binding custom trigger called "onOpen", which states an event that should be triggered when a tab is opened (passes to the language to the event).

### **CSS:**
- Renamed the CSS class "label" to "language-label" (much clearer).

#### **Documentation:**
- Minor documentation improvements.
- Added new binding documentation file "binding/tabs/TAB_CONTENTS.md".
- Added new binding documentation file "binding/tabs/CUSTOM_TRIGGERS.md".
- Some of the documentation has been renamed and moved into category folders (the filenames were getting confusing).

#### **General Improvements:**
- Code cleanups and refactoring to make things clearer.

<br>


## Version 2.0.1:
- Minor documentation improvements.

<br>


## Version 2.0.0:

#### **New Features:**
- Added tabbing support! This feature allows you to render languages under one tabbed container (which is great for showing code examples).

#### **Languages:**
- Added support for the Powershell programming language (importable file).
- Added support for the Dart programming language (importable file).
- Added support for the Delphi programming language (importable file).
- Added support for the Lua programming language (importable file).

### **CSS:**
- All buttons (and tabs) are now rendered as buttons instead of divs (this includes minor CSS changes).
- Added new ":root" variable "--button-hover-background-color", which states the background color to use for the buttons when hovered (including custom ones, unless overridden).
- Added new ":root" variable "--button-hover-text-color", which states the text color to use for the buttons when hovered (including custom ones, unless overridden).

#### **Documentation:**
- Added a new documentation file "BINDING_LANGUAGE.md", which states how the "data-syntax-language" binding attribute is used.
- Examples are now shown on all documentation pages to make things easier when starting with Syntax.js.

<br>


## Version 1.9.0:

#### **New Features:**
- Added "Attributes" support for languages, which allows attributes (for markup languages only) to be rendered using a different CSS class.

#### **Binding Options:**
- Added a new binding option called "highlightAttributes", which states if attributes should be highlighted (defaults to true).

#### **Binding Options - Custom Triggers:**
- Added a new binding custom trigger called "onAttributeClicked", which states an event that should be triggered when a attribute is clicked.
- Added a new binding custom trigger called "onAttributeRender", which states an event that should be triggered when a attribute is rendered.

#### **Documentation:**
- Fixed documentation errors in the "BINDING_OPTIONS_CUSTOM_TRIGGERS.md" file.

<br>


## Version 1.8.2:
- Added support for the PHP programming language (importable file).
- Minor improvement to the dark-mode theme to make sure the language label stands out a little more.
- Grammar and spelling corrections across the project.
- More internal renaming to make things a bit clearer.
- Unknown language types, and non-markup-based languages, are now encoded before the main render is done (so special characters show up correctly).
- Moved the configuration option "buttonsVisible" to the binding options (so it can be set per DOM element).
- Moved the configuration option "maximumButtons" to the binding options (so it can be set per DOM element).
- Fixed a fault that caused the buttons to be hidden (and could not be shown) when the total buttons are smaller (or equal) to "maximumButtons" and "buttonsVisible" is false.

<br>


## Version 1.8.1:
- Minor error logging improvements (uses less code and can be re-used as needed).
- Internal refactoring to make some of the code match up to the names of the sections.

<br>


## Version 1.8.0:

#### **Public Functions:**
- Added new public function "getCode()", which is used to return all of the code inside an element (without rendering colors).

#### **Languages:**
- Added support for the Perl programming language (importable file).
- Added support for the Bash scripting language (importable file).
- Added support for the Kotlin programming language (importable file).\
- Added support for the R programming language (importable file).
- Added support for the Matlab programming language (importable file).
- Added support for the Scala programming language (importable file).
- Moved some of the keywords for the supported languages into "values".
- Multi-line comments are now processed before single-line comments.

#### **Binding Options:**
- Added a new binding option called "doubleClickToSelectAll", which states that double-clicking in one of the containers (numbers, code) will select all the code (defaults to true).
- Added a new binding option called "languageLabelCasing", which states the casing to use for the language label (defaults to "uppercase").

### **CSS:**
- Added new ":root" variable "--button-background-color", which will allow you to set the background color of the buttons.
- Added new ":root" variable "--button-text-color", which will allow you to set the text color of the buttons.
- Massively improved the theme "dark-mode" (much cleaner and modern).
- Shared colors now reference the original base ":root" variable.

#### **General Improvements:**
- Double-clicking in the code container will now select all the code (if the new setting is turned on).
- Removed a lot of duplicated code.
- Lots of clean-ups across the HTML testing files.

<br>


## Version 1.7.3:
- The custom button "onClick" event now accepts the code as a parameter (see documentation).
- Fixed a fault that caused the wrong events to be assigned to the custom buttons when there is more than one.
- Added a new binding option called "removeDuplicateBlankLines" (defaults to true), which will remove all duplicate blank lines.
- Fixed some bad documentation.
- Added a new CSS class "multi-line-comment", which is used for multi-line comments.
- Added a new CSS class "multi-line-string", which is used for multi-line strings.

<br>


## Version 1.7.2:
- Added "multiLineComment" support for Markup languages (HTML, for example).
- Minor code cleanups to make things a bit more readable.

<br>


## Version 1.7.1:
- More documentation improvements.
- Added shortcut files for quickly packing/publishing the project.

<br>


## Version 1.7.0:

#### **New Features:**
- Markup language support!

### **Highlighting:**
- If there is no code available for highlighting, the element is skipped and left as is (an error log is thrown when safeMode is off).

#### **Languages:**
- Added support for the HTML markup language (importable file).
- Added a new JSON property called "isMarkUp", which states if the language is a markup language (processed slightly differently).

#### **Documentation:**
- More documentation fixes and improvements.

#### **Fixes:**
- Fixed a fault that caused comments and strings from other elements to be added to others.

<br>


## Version 1.6.2:
- Internal code cleanup to make object parsing a little clearer.
- More documentation fixes.
- Minor CSS comment updates.

<br>


## Version 1.6.1:
- Fixed some of the documentation files that were pointing at the wrong files.

<br>


## Version 1.6.0:

#### **New Features:**
- Added "Values" support for languages, which allows values (such as "true" and "false") to be rendered using a different CSS class.
- Added opening/closing support for the buttons shown in the top right corner (along with configurable options).

#### **Binding Options:**
- Added a new binding option called "highlightValues", which states if values should be highlighted (defaults to true).

#### **Binding Options - Custom Triggers:**
- Added a new binding custom trigger called "onValueClicked", which states an event that should be triggered when a value is clicked.
- Added a new binding custom trigger called "onValueRender", which states an event that should be triggered when a value is rendered.

### **Themes:**
- All CSS colors are now root variables, allowing full themes to be generated without referring CSS class names.
- Added a new folder under "dist" called "themes", which contains a new dark-mode (works based on the browser configuration).

#### **Configuration Options:**
- Added new configuration option "maximumButtons" (defaults to 2), which states the maximum number of buttons that can be shown before the opening/closing button is shown.
- Added new configuration option "buttonsVisible" (defaults to true), which states if the buttons are open (visible).
- Added new configuration option "buttonsOpenerText" (defaults to "<"), which states the text that should be used for the open buttons button.
- Added new configuration option "buttonsCloserText" (defaults to ">"), which states the text that should be used for the close buttons button.

### **CSS:**
- Renamed the CSS class "number" to "numbers".
- By default, the buttons are no longer bold.
- By default, the language label is now bold and uses a grey font color.

#### **Documentation:**
- Documentation renames and cleanups to make things clearer.

#### **Fixes:**
- Fixed the buttons wrapping down to the next line and looking strange on smaller screens.

<br>


## Version 1.5.1:
- Removed some unneeded CSS from the testing CSS file (used in the testing HTML files).
- Fixed a security risk when injecting titles into a new window (for printing).

<br>


## Version 1.5.0:

#### **New Features:**
- Added full language alias support (allows alias names to be added that point to a specific language name).
- Added full custom buttons support via a new attribute called "data-syntax-buttons".

#### **Languages:**
- Added support for the F# programming language (importable file).
- Added support for the Rust programming language (importable file).

#### **Public Functions:**
- Added new public function "addAlias()", which is used to add a new language alias.
- Added new public function "removeAlias()", which is used to remove a language alias.
- Added new public function "getAlias()", which is used to get a language alias.
- Added new public function "getAliases()", which is used to get all language aliases.
- Renamed the public function "getAllLanguages" to "getLanguages()".
- Renamed the public function "getAllElementsHighlighted()" to "getElementsHighlighted()".

#### **Documentation:**
- More documentation improvements to show how some of the new features are used.

#### **General Improvements:**
- NUSPEC file improvements for NuGet.org submissions.

#### **Fixes:**
- Fixed a fault that prevented the public function "removeLanguage()" from returning a valid flag when a language has been removed.
- Fixed package description and keywords being inconsistent with the main repository.

<br>


## Version 1.4.0:

#### **Languages:**
- The binding attribute "data-syntax-language" can now be set to "unknown", which will force the layout to still be drawn, but no highlighting will be applied.
- Added a new JSON property called "keywordsCasing", which states what casing should be used for the keywords when rendered (optional, defaults to "initial", accepts "uppercase" and "lowercase").

#### **Binding Settings:**
- Added a new setting called "padLineNumbers", which states if the line numbers should be padded (defaults to false).

#### **Configuration Options:**
- Added new configuration option "highlightAllDomElementTypes" (defaults to "div" and "code"), which states the element types that should be looked up when rendering.

#### **General Improvements:**
- Double-clicking the numbers column (when enabled) will now highlight all the code in the right panel.
- The "data-syntax-options" attribute now can accept a function name to get the required configuration.

#### **Fixes:**
- Fixed a fault that prevented the "onKeywordClicked" custom trigger from being assigned to keywords when "highlightKeywords" is set to false.

<br>


## Version 1.3.0:

#### **New Features:**
- Added multi-line string support for languages that support them (such as C#).
- String searching now uses an improved RegEx for more accurate searches.
- SafeMode support and new global library configuration options.

#### **Public Functions:**
- Added new public function "setConfiguration()", which will set up global configuration options for the whole library.
- The public function "getAllElementsHighlighted()" now returns a cloned version of "_elements" instead of a referenced version.
- The public functions "getLanguage()" and "getAllLanguages()" now return a cloned version of the language objects.

#### **Configuration Option:**
- Added new configuration option "safeMode" (defaults to true), which allows all errors to be ignored (all valid renders will still be displayed.

#### **Languages:**
- All language files (under "dist/languages") now pass false for the "triggerRender" parameter, as the library will render automatically once the DOM is loaded.

#### **General Improvements:**
- Removed some code that was no longer needed.
- The numbers column can no longer have its numbers selected (CSS controlled).
- The buttons (top right) can no longer have their text selected (CSS controlled).
- The error log shown when a language is not available is now only shown when "safeMode" is disabled.

#### **Documentation:**
- Renamed "OPTIONS.md" to "BINDING_OPTIONS.md" (which states all the options that can be used for the "data-syntax-options" binding attribute).
- Added a new version of "OPTIONS.md", which is now used to show all the configurations that can be used for the public function "setConfiguration()".
- Minor documentation updates to make things a bit clearer.

#### **Fixes:**
- Fixed the public function "destroyAll()" reset the "_elements" variable to the wrong type.

<br>


## Version 1.2.0:

#### **New Features:**
- Printing support is now available as a configurable button (on by default).
- A new language label is now shown in the UI to state what language is being shown.

#### **General Improvements:**
- Redesigned the layout for the button(s) shown in the top left of the display (minor CSS class name changes), along with the new language label.
- Added new BootStrap testing files.

#### **Languages:**
- Added a new JSON property called "friendlyName", which states the friendly name to be shown in the language label.
- The JSON property "keywords" now accepts either an array of strings or a space-separated string.

#### **Settings:**
- Added a new setting called "showLanguageLabel", which states if the language label should be shown (defaults to true).
- Added a new setting called "showPrintButton", which states if the Print button should be shown (defaults to true).
- Added a new setting called "printButtonText", which states the text that should be shown for the new Print button (defaults to "Print").

#### **Custom Triggers:**
- Added a new custom trigger "onPrint", which is called when the "Print" button is clicked.

#### **Fixes:**
- Fixed the default color for "code" DOM elements reverting to the color set in Bootstrap.

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
- Fixed a fault that caused parameters to be parsed for custom triggers when they were not set.
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
- Added background color to the code syntax container (next to the numbers) and added a border-radius.
- Added new public function "addLanguage()", which will add a new language to the library and will auto-render DOM elements found for that language.
- Added all missing keywords for the built-in language "JavaScript".
- Added C# language support via an importable file.

<br>


## Version 0.1.0:
- Everything :)