# Syntax.js - Binding Language:

Below are all the options that can be used for the "data-syntax-language" binding attribute for a DOM element.
<br/>
<br/>

| Language: | Description: |
| --- | --- |
| unknown | States if the language is unknown (causes the main display to render, but no highlighting is applied). |
| tabbed | States that the display language is a tabbed display, showing child languages as tabs (children need to have the attribute "data-syntax-tab-contents"). |
| *language* | Any language that is supported (see the "dist/languages" for all available). |
<br/>


## Binding Example: *language*:
<br/>

```markdown
<code data-syntax-language="javascript">
    <pre>
        var something = true;
    </pre>
</code>
```
<br/>


## Binding Example: Unknown
<br/>

```markdown
<code data-syntax-language="unknown">
    <pre>
        var something = true;
    </pre>
</code>
```
<br/>


## Binding Example: Tabbed
<br/>

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