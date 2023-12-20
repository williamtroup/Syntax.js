# Syntax.js - Language:

Below is the format that is expected for a language object when calling "addLanguage()".

| Type: | Name: | Description: |
| --- | --- | --- |
| *Object* | keywords | The keywords of the language (can be either an array of strings, or a space separated string). |
| *Object* | values | The values (assigning or conditions) of the language (can be either an array of strings, or a space separated string). |
| *Object* | attributes | The values of the language (can be either an array of strings, or a space separated string) and are only set when "isMarkUp" is true. |
| *string* | comment | The start character(s) use for a single line comment. |
| *string[]* | multiLineComment | The start/end characters used to define multi-line comments (optional). |
| *boolean* | caseSensitive | States if the lookups for keywords are case sensitive (defaults to true). |
| *string* | friendlyName | The friendly name to show for the language (optional). |
| *string* | keywordsCasing | States what casing should be shown for the keywords when rendered (optional, defaults to "initial", accepts "uppercase" and "lowercase"). |
| *boolean* | isMarkUp | States if the language is a markup based language (defaults to false). |


## Example:
<br/>

```markdown
<script> 
    var language = {
        keywords: "if var bool int string",
        values: [ "true" ],
        attributes: [],
        comment: "//",
        multiLineComment: [ "/*", "*/" ],
        friendlyName: "Language Name",
        keywordsCasing: "initial",
        isMarkUp: false
    };
</script>
```