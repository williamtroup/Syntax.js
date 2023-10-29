# Syntax.js - Functions:

Below is a list of all the public functions that can be called from the Syntax.js instance.
<br>
<br>


<h1>Building:</h1>

### **buildNewSyntaxElements()**:
Finds all new code elements and renders them.
<br>
***Fires***:  onRender
<br>
***Returns***: '*Object*' - The Syntax.js class instance.


<br>
<h1>Language:</h1>

### **addLanguage( *name*, *languageDetails*, *[triggerRender]* )**:
Adds a new language that can be rendered.
<br>
***Fires***:  onRender
<br>
***Parameter: name***: '*string*' - The name of the language.
<br>
***Parameter: languageDetails***: '*Object*' - The language details (refer to ["Language"](LANGUAGE.md) documentation for properties).
<br>
***Parameter: [triggerRender]***: '*boolean*' - States if new language DOM elements available should be rendered.
<br>
***Returns***: '*boolean*' - States if the language has been added.


<br>
<h1>Setting Options:</h1>

### **setOptions( *newOptions*, *[triggerEvent]* )**:
Sets the specific options that should be used.
<br>
***Fires***:  onOptionsUpdated
<br>
***Parameter: newOptions***: '*Object*' - All the options that should be set (refer to ["Options"](OPTIONS.md) documentation for properties).
<br>
***Parameter: [triggerEvent]***: '*boolean*' - States if the "onOptionsUpdated" event should be triggered (defaults to true).
<br>
***Returns***: '*Object*' - The Syntax.js class instance.


<br>
<h1>Additional Data:</h1>

### **getVersion()**:
Returns the version of Syntax.js.
<br>
***Returns***: '*string*' - The version number.