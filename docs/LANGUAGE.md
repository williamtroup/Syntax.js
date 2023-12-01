# Calendar.js - Language:

Below is the format that is expected for a language object when calling "addLanguage()".

| Type: | Name: | Description: |
| --- | --- | --- |
| *string[]* | keywords | The keywords of the language. |
| *string* | comment | The start character(s) use for a single line comment. |
| *string[]* | multiLineComment | The start/end characters used to define multi-line comments (optional). |
| *bool* | caseSensitive | States if the lookups for keywords are case sensitive (defaults to true). |