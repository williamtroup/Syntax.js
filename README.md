<h1 align="center">
Syntax.js

[![Tweet](https://img.shields.io/twitter/url/http/shields.io.svg?style=social)](https://twitter.com/intent/tweet?text=Syntax.js%2C%20a%20free%20JavaScript%20syntax%20highlighter&url=https://github.com/williamtroup/Syntax.js&hashtags=javascript,syntax,highlighter)
</h1>
<p align="center">An easy to use JavaScript syntax highlighter!</p>
<p align="center">v0.3.0</p>
<br />

![Syntax.js](docs/images/main.png)
<br>
<br>

<h1>What features does Syntax.js have?</h1>

- Zero-dependencies!
- Full API available via public functions.
- Fully styled in CSS/SASS (including the buttons) and compatible with the Bootstrap library.
- Full CSS theme support (using :root variables).
- Custom triggers for actions (when elements are rendered, options are updated, etc, etc.).
- Fully configurable.
<br />
<br />

<h1>What browsers are supported?</h1>

All modern browsers (such as Google Chrome, FireFox, and Opera) are fully supported.
<br>
<br>

<h1>What are the most recent changes?</h1>

To see a list of all the most recent changes, click [here](docs/CHANGE_LOG.md).
<br>
<br>

<h1>How do I get started?</h1>

To get started using Syntax.js, do the following steps:
<br>
<br>

### 1. Prerequisites:

Make sure you include the "DOCTYPE html" tag at the top of your email, as follows:

```markdown
<!DOCTYPE html>
```
<br>

### 2. Include Files:

```markdown
<link rel="stylesheet" href="dist/syntax.js.css" />
<script src="dist/syntax.js"></script>
```
<br>

### 3. Create DOM Container:

```markdown
<div data-syntax-language="javascript">
    var something = true;

    if ( something ) {
        console.log( "Output is written." ); // Comment
        
        /* Multi-line
        comment */
    }
</div>

<code data-syntax-language="javascript">
    <pre>
        var something = true;

        if ( something ) {
            console.log( "Output is written." ); // Comment
            
            /* Multi-line
            comment */
        }
    </pre>
</code>
```
<br>

### 4. Finishing Up:

That's it! Nice and simple. Please refer to the code if you need more help (fully documented).
<br>
<br>

<h1>How do I go about customizing Syntax.js?</h1>

To customize, and get more out of Syntax.js, please read through the following documentation.
<br>
<br>

### 1. Options:

Options (which can be set when initializing, or afterwards) allow you to customize how Syntax.js will look and function.  The options are also used to set the custom triggers you want to fire when specific actions occur.  You can set them manually as follows:

```markdown
<script> 
  $syntax.setOptions( {
      showCopyButton: false
  } );
</script>
```

To see a list of all the available options you can use, click [here](docs/OPTIONS.md).

To see a list of all the available custom triggers you can use, click [here](docs/CUSTOM_TRIGGERS.md).
<br>
<br>

### 2. Public Functions:

To see a list of all the public functions available, click [here](docs/FUNCTIONS.md).
<br>
<br>