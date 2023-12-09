# Calendar.js - Language:

Below is the format that is expected for a language object when calling "addLanguage()".

| Type: | Name: | Description: |
| --- | --- | --- |
| *Object* | keywords | The keywords of the language (can be either an array of strings, or a space separated string). |
| *Object* | keywords | The values (assigning or conditions) of the language (can be either an array of strings, or a space separated string). |
| *string* | comment | The start character(s) use for a single line comment. |
| *string[]* | multiLineComment | The start/end characters used to define multi-line comments (optional). |
| *boolean* | caseSensitive | States if the lookups for keywords are case sensitive (defaults to true). |
| *string* | friendlyName | The friendly name to show for the language (optional). |
| *string* | keywordsCasing | States what casing should be shown for the keywords when rendered (optional, defaults to "initial", accepts "uppercase" and "lowercase"). |
| *boolean* | isMarkUp | States if the language is a markup based language (defaults to false). |