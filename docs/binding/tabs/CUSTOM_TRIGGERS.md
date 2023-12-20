# Syntax.js - Binding Tab Content Options - Custom Triggers:

Below is a list of all the custom triggers supported in the "data-syntax-tab-contents" binding attribute for DOM elements.
<br>
<br>


### options.onOpen( *language* ):
Fires when a tab is opened.
<br>
***Parameter:*** language: '*string*' - The language tab that was opened.

<br/>


## Binding Example:
<br/>

```markdown
<code data-syntax-language="tabbed">
    <div data-syntax-language="javascript" data-syntax-tab-contents="{ 'onOpen': yourCustomJsFunction }">
        <pre>
            var something = true;
        </pre>
    </div>

    <div data-syntax-language="html" data-syntax-tab-contents="{ 'title': 'HTML Language' }">
        <pre>
            <div class="header"></div>
        </pre>
    </div>
</code>
```