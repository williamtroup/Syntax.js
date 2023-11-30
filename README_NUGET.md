# Syntax.js v0.8.0

[![Tweet](https://img.shields.io/twitter/url/http/shields.io.svg?style=social)](https://twitter.com/intent/tweet?text=Syntax.js%2C%20a%20free%20JavaScript%20syntax%20highlighter&url=https://github.com/williamtroup/Syntax.js&hashtags=javascript,syntax,highlighter)
[![npm](https://img.shields.io/badge/npmjs-v0.8.0-blue)](https://www.npmjs.com/package/jsyntax.js)
[![nuget](https://img.shields.io/badge/nuget-v0.8.0-purple)](https://www.nuget.org/packages/jSyntax.js/)
[![license](https://img.shields.io/badge/license-MIT-green)](https://github.com/williamtroup/Syntax.js/blob/main/LICENSE.txt)
[![discussions Welcome](https://img.shields.io/badge/discussions-Welcome-red)](https://github.com/williamtroup/Syntax.js/discussions)
[![coded by William Troup](https://img.shields.io/badge/coded_by-William_Troup-yellow)](https://github.com/williamtroup)

> A lightweight, and easy-to-use, JavaScript library for code syntax highlighting!


## What features does Syntax.js have?

- Zero-dependencies and extremely lightweight!
- Full API available via public functions.
- Fully styled in CSS/SASS (including the buttons) and compatible with the Bootstrap library.
- Full CSS theme support (using :root variables).
- Custom triggers for actions (when elements are rendered, options are updated, etc, etc.).
- Fully configurable.


## What browsers are supported?

All modern browsers (such as Google Chrome, FireFox, and Opera) are fully supported.


## What are the most recent changes?

To see a list of all the most recent changes, click [here](https://github.com/williamtroup/Syntax.js/blob/main/docs/CHANGE_LOG.md).


## How do I get started?

To get started using Syntax.js, do the following steps:

### 1. Prerequisites:

Make sure you include the "DOCTYPE html" tag at the top of your email, as follows:

```markdown
<!DOCTYPE html>
```

### 2. Include Files:

```markdown
<link rel="stylesheet" href="dist/syntax.js.css" />
<script src="dist/syntax.js"></script>
```

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

<code data-syntax-language="javascript" data-syntax-options="{ 'showCopyButton': false }">
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

To see a list of all the available options you can use for "data-syntax-options", click [here](https://github.com/williamtroup/Syntax.js/blob/main/docs/OPTIONS.md).


### 4. Finishing Up:

That's it! Nice and simple. Please refer to the code if you need more help (fully documented).


## How do I go about customizing Syntax.js?

To customize, and get more out of Syntax.js, please read through the following documentation.


### 1. Public Functions:

To see a list of all the public functions available, click [here](https://github.com/williamtroup/Syntax.js/blob/main/docs/FUNCTIONS.md).