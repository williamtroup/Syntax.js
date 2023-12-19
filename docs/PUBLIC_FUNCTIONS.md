# Syntax.js - Functions:

Below is a list of all the public functions that can be called from the Syntax.js instance.
<br>
<br>


## Highlighting:

### **highlightAll()**:
Finds all new code elements and renders them.
<br>
***Fires***:  onRenderComplete
<br>
***Returns***: '*Object*' - The Syntax.js class instance.

### **highlightElement( *elementOrId* )**:
Renders a specific DOM element.
<br>
***Fires***:  onRenderComplete
<br>
***Parameter: name***: '*Object*' - The element ID, or the element itself.
<br>
***Returns***: '*Object*' - The Syntax.js class instance.

### **getElementsHighlighted()**:
Returns the elements that have been detected and rendered.
<br>
***Returns***: '*Object[]*' - An array containing the rendered DOM elements.

### **getCode( *elementId* )**:
Returns the code inside a specific element (without rendering colors).
<br>
***Parameter: elementId***: '*string*' - The element ID.
<br>
***Returns***: '*string*' - The code in the element.
<br>


## Destroying:

### **destroy( *elementId* )**:
Reverts a Syntax element back to its original state (without render attributes).
<br>
***Parameter: elementId***: '*string*' - The ID of the DOM element to destroy.
<br>
***Returns***: '*Object*' - The Syntax.js class instance.

### **destroyAll()**:
Reverts all rendered Syntax elements back to their original state (without render attributes).
<br>
***Returns***: '*Object*' - The Syntax.js class instance.
<br>


## Languages:

### **addLanguage( *name*, *languageDetails*, *[triggerRender]* )**:
Adds a new language that can be rendered.
<br>
***Fires***:  onRenderComplete
<br>
***Parameter: name***: '*string*' - The name of the language.
<br>
***Parameter: languageDetails***: '*Object*' - The language details (refer to ["Language"](LANGUAGE.md) documentation for properties).
<br>
***Parameter: [triggerRender]***: '*boolean*' - States if new language DOM elements available should be rendered.
<br>
***Returns***: '*boolean*' - States if the language has been added.

### **removeLanguage( *name* )**:
Removes a language that can be rendered.
<br>
***Parameter: name***: '*string*' - The name of the language.
<br>
***Returns***: '*boolean*' - States if the language has been removed.

### **getLanguage( *name* )**:
Returns the language details (by name) that can be rendered.
<br>
***Parameter: name***: '*string*' - The name of the language.
<br>
***Returns***: '*Object*' - The language details.

### **getLanguages()**:
Returns all the languages that can be rendered.
<br>
***Returns***: '*Object*' - The object that contains the languages.
<br>


## Language Aliases:

### **addAlias( *alias*, *language*, *[triggerRender]* )**:
Adds a new language alias.
<br>
***Fires***:  onRenderComplete
<br>
***Parameter: alias***: '*string*' - The name of the alias.
<br>
***Parameter: language***: '*string*' - The name of the language.
<br>
***Parameter: [triggerRender]***: '*boolean*' - States if new language alias DOM elements available should be rendered.
<br>
***Returns***: '*boolean*' - States if the alias has been added.

### **removeAlias( *alias* )**:
Removes a language alias.
<br>
***Parameter: alias***: '*string*' - The name of the alias.
<br>
***Returns***: '*boolean*' - States if the alias has been removed.

### **getAlias( *alias* )**:
Returns a language alias.
<br>
***Parameter: alias***: '*string*' - The name of the alias.
<br>
***Returns***: '*Object*' - The name of the language.

### **getAliases()**:
Returns all the language aliases.
<br>
***Returns***: '*Object*' - The object that contains the aliases.
<br>


## Configuration:

### **setConfiguration( *newOptions* )**:
Sets the specific configuration options that should be used.
<br>
***Parameter: newOptions***: '*Options*' - All the configuration options that should be set (refer to ["Configuration Options"](CONFIGURATION_OPTIONS.md) documentation for properties).
<br>
***Returns***: '*Object*' - The Syntax.js class instance.
<br>


## Additional Data:

### **getVersion()**:
Returns the version of Syntax.js.
<br>
***Returns***: '*string*' - The version number.
<br>


## Example:
<br/>

```markdown
<script> 
    var version = $syntax.getVersion();
</script>
```