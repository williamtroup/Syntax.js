# Syntax.js - Custom Triggers:

Below is a list of all the custom triggers supported in Syntax.js, which are fired when specific actions occur.
<br>
<br>

<h1>For Rendering:</h1>

### options.onRender( *element* ):
Fires when the syntax for an element is rendered.
<br>
***Parameter:*** syntax: '*object*' - The DOM element that was rendered.


<br>
<h1>For Code:</h1>

### options.onCopy( *code* ):
Fires when the "Copy" button is pressed
<br>
***Parameter:*** code: '*string*' - The string that was copied to the clipboard.