# Syntax.js - Binding Options - Custom Triggers:

Below is a list of all the custom triggers supported in the "data-syntax-options" binding attribute for DOM elements.
<br>
<br>


## For Rendering:

### options.onBeforeRenderComplete( *element* ):
Fires before the rendering of the syntax of an element.
<br>
***Parameter:*** element: '*object*' - The DOM element that is going to be rendered.

### options.onRenderComplete( *element* ):
Fires when the rendering of the syntax for an element is complete.
<br>
***Parameter:*** element: '*object*' - The DOM element that was rendered.

### options.onKeywordRender( *keyword* ):
Fires when a keyword is rendered.
<br>
***Parameter:*** keyword: '*string*' - The keyword that was rendered.

### options.onValueRender( *value* ):
Fires when a value is rendered.
<br>
***Parameter:*** value: '*string*' - The value that was rendered.

### options.onAttributeRender( *attribute* ):
Fires when a attribute is rendered.
<br>
***Parameter:*** attribute: '*string*' - The attribute that was rendered.

### options.onStringRender( *string* ):
Fires when a string is rendered.
<br>
***Parameter:*** string: '*string*' - The string that was rendered.

### options.onCommentRender( *comment* ):
Fires when a comment is rendered.
<br>
***Parameter:*** comment: '*string*' - The comment that was rendered.


<br>

## For Code:

### options.onCopy( *code* ):
Fires when the "Copy" button is pressed.
<br>
***Parameter:*** code: '*string*' - The string that was copied to the clipboard.

### options.onKeywordClicked( *keyword* ):
Fires when a keyword is clicked in the code syntax.
<br>
***Parameter:*** keyword: '*string*' - The keyword that was clicked.

### options.onValueClicked( *value* ):
Fires when a value is clicked in the code syntax.
<br>
***Parameter:*** value: '*string*' - The value that was clicked.

### options.onAttributeClicked( *attribute* ):
Fires when a attribute is clicked in the code syntax.
<br>
***Parameter:*** attribute: '*string*' - The attribute that was clicked.

### options.onPrint( *code* ):
Fires when the "Print" button is pressed.
<br>
***Parameter:*** code: '*string*' - The string that was sent to the printer.


<br>

## For Buttons:

### options.onButtonsClosed():
Fires when the buttons are closed.

### options.onButtonsOpened():
Fires when the buttons are opened.

<br/>


## Binding Example:

```markdown
<code data-syntax-language="javascript" data-syntax-options="{ 'onPrint': yourCustomJsFunction }">
    <pre>
        var something = true;
    </pre>
</code>
```