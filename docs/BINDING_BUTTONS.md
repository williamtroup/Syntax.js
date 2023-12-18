# Syntax.js - Binding Buttons:

Below are all the JSON properties that can be passed in the "data-syntax-buttons" binding attribute for a DOM element (within an array).
<br>
<br>

| Type: | Name: | Description: |
| --- | --- | --- |
| *string* | text | States the text that should be shown on the button. |
| *Object* | onClick | States the custom event that should be triggered when the button is clicked (the code is passed to the event). |
| *string* | className | States a CSS class name to apply to the button (optional). |
<br/>


## Binding Example:
<br/>

```markdown
<code data-syntax-language="javascript" data-syntax-buttons="[ { 'text': 'Button 1', 'onClick': yourJsFunction } ]">
    <pre>
        var something = true;
    </pre>
</code>
```