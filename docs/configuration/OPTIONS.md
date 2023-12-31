# Syntax.js - Configuration - Options:

Below are all the configuration options that can be passed to the "setConfiguration()" public function.


### Options:
<br/>

| Type: | Name: | Description: |
| --- | --- | --- |
| *boolean* | safeMode | States if safe-mode is enabled (errors will be ignored and logged only, defaults to true). |
| *Object* | highlightAllDomElementTypes | The DOM element types to lookup (can be either an array of strings, or a space separated string, and defaults to "div" and "code"). |
| *boolean* | allowHtmlInTextDisplay | States if HTML can be used for text displays, i.e. Tabs, Descriptions, etc (defaults to true). |
<br/>


### Options - Strings:
<br/>

| Type: | Name: | Description: |
| --- | --- | --- |
| *string* | buttonsOpenerText | States the text that should be used for the open buttons button (defaults to "<"). |
| *string* | buttonsCloserText | States the text that should be used for the close buttons button (defaults to ">"). |
<br/>


## Example:
<br/>

```markdown
<script> 
  $syntax.setConfiguration( {
      safeMode: false
  } );
</script>
```