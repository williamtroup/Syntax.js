# Syntax.js - Binding Options:

Below are all the JSON properties that can be passed in the "data-syntax-options" binding attribute for a DOM element.


### Standard Options:
<br/>

| Type: | Name: | Description: |
| --- | --- | --- |
| *boolean* | showCopyButton | States if the copy button should be added (defaults to true). |
| *boolean* | removeBlankLines | States if all blank lines should be removed (defaults to false). |
| *boolean* | showLineNumbers | States if the line numbers are shown (defaults to true). |
| *boolean* | highlightKeywords | States if the keywords should be highlighted (defaults to true). |
| *boolean* | highlightValues | States if the values should be highlighted (defaults to true). |
| *boolean* | highlightStrings | States if the strings should be highlighted (defaults to true). |
| *boolean* | highlightComments | States if the comments should be highlighted (defaults to true). |
| *boolean* | showLanguageLabel | States if the language label should be shown or not (defaults to true). |
| *boolean* | showPrintButton | States if the print button should be added (defaults to true). |
| *boolean* | padLineNumbers | States if the line numbers should be shown as "01" instead of "1" (defaults to false). |
| *boolean* | removeDuplicateBlankLines | States if duplicate blank lines should be removed (defaults to true). |
| *boolean* | doubleClickToSelectAll | States if double-clicking in the containers selects all of the code (defaults to true). |
| *string* | languageLabelCasing | States what casing should be used for the language label (optional, defaults to "lowercase", accepts "initial" and "lowercase"). |
<br/>


### Translatable String Options:
<br/>

| Type: | Name: | Description: |
| --- | --- | --- |
| *string* | copyButtonText | The text that should be displayed for the "Copy" button. |
| *string* | printButtonText | The text that should be displayed for the "Print" button. |