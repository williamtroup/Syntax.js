# Syntax.js - Functions:

Below is a list of all the public functions that can be called from the Syntax.js instance.
<br>
<br>


<h1>Building:</h1>

### **highlightAll()**:
Finds all new code elements and renders them.
<br>
***Fires***:  onRenderComplete
<br>
***Returns***: '*Object*' - The Syntax.js class instance.

### **getAllElementsHighlighted()**:
Returns all the elements that have been detected and rendered.
<br>
***Returns***: '*Object[]*' - An array containing the rendered DOM elements.


<br>
<h1>Language:</h1>

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
Removes new language that can be rendered.
<br>
***Parameter: name***: '*string*' - The name of the language.
<br>
***Returns***: '*boolean*' - States if the language has been removed.


<br>
<h1>Additional Data:</h1>

### **getVersion()**:
Returns the version of Syntax.js.
<br>
***Returns***: '*string*' - The version number.


<br>
<h1>Controls:</h1>

### **destroy()**:
Reverts all rendered Syntax elements back to their original state (without render attributes).
<br>
***Returns***: '*Object*' - The Syntax.js class instance.