# Syntax.js - Binging Options - Custom Triggers:

Below is a list of all the custom triggers supported in the "data-syntax-options" binding attribute for DOM elements.
<br>
<br>


<h1>For Rendering:</h1>

### options.onRenderComplete( *element* ):
Fires when the rendering of the syntax for an element is complete.
<br>
***Parameter:*** syntax: '*object*' - The DOM element that was rendered.

### options.onKeywordRender( *keyword* ):
Fires when a keyword is rendered.
<br>
***Parameter:*** keyword: '*string*' - The keyword that was rendered.

### options.onValueRender( *keyword* ):
Fires when a value is rendered.
<br>
***Parameter:*** value: '*string*' - The value that was rendered.

### options.onStringRender( *string* ):
Fires when a string is rendered.
<br>
***Parameter:*** string: '*string*' - The string that was rendered.

### options.onCommentRender( *comment* ):
Fires when a comment is rendered.
<br>
***Parameter:*** comment: '*string*' - The comment that was rendered.


<br>
<h1>For Code:</h1>

### options.onCopy( *code* ):
Fires when the "Copy" button is pressed.
<br>
***Parameter:*** code: '*string*' - The string that was copied to the clipboard.

### options.onKeywordClicked( *keyword* ):
Fires when a keyword is clicked in the code syntax.
<br>
***Parameter:*** code: '*keyword*' - The keyword that was clicked.

### options.onValueClicked( *keyword* ):
Fires when a value is clicked in the code syntax.
<br>
***Parameter:*** code: '*value*' - The value that was clicked.

### options.onPrint( *code* ):
Fires when the "Print" button is pressed.
<br>
***Parameter:*** code: '*string*' - The string that was sent to the printer.