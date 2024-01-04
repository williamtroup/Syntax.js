# Syntax.js - Binding Tab Content Options:

Below are all the JSON properties that can be passed in the "data-syntax-tab-contents" binding attribute for a DOM element.


## String Options:
<br/>

| Type: | Name: | Description: |
| --- | --- | --- |
| *string* | title | The title that should be used for the tab (defaults to null, which will use the default language name). |
| *string* | description | The description that should be displayed under the tabs, and above the code (defaults to null). |
<br/>


## Binding Example: Without Options:

```markdown
<code data-syntax-language="tabbed">
    <div data-syntax-language="javascript" data-syntax-tab-contents="true">
        <pre>
            var something = true;
        </pre>
    </div>

    <div data-syntax-language="html" data-syntax-tab-contents="true">
        <pre>
            <div class="header"></div>
        </pre>
    </div>
</code>
```
<br/>


## Binding Example: With Options

```markdown
<code data-syntax-language="tabbed">
    <div data-syntax-language="javascript" data-syntax-tab-contents="{ 'title': 'JavaScript Language' }">
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