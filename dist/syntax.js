/*! Syntax.js v0.3.0 | (c) Bunoon | MIT License */
(function() {
  function render() {
    var domElements = _parameter_Document.getElementsByTagName("*");
    var elements = [].slice.call(domElements);
    var elementsLength = elements.length;
    var elementIndex = 0;
    for (; elementIndex < elementsLength; elementIndex++) {
      renderElement(elements[elementIndex]);
    }
  }
  function renderElement(element) {
    if (isDefined(element)) {
      var syntaxLanguage = element.getAttribute("data-syntax-language");
      if (isDefined(syntaxLanguage) && _languages.hasOwnProperty(syntaxLanguage)) {
        var innerHTML = element.innerHTML;
        if (element.children.length > 0) {
          innerHTML = element.children[0].innerHTML;
        }
        innerHTML = innerHTML.trim();
        var innerHTMLCopy = innerHTML.trim();
        element.removeAttribute("data-syntax-language");
        element.className += " syntax-highlight";
        element.innerHTML = _string.empty;
        var code = createElement("div", "code custom-scroll-bars");
        element.appendChild(code);
        var number = createElement("div", "number");
        code.appendChild(number);
        var syntax = createElement("div", "syntax");
        code.appendChild(syntax);
        if (_options.showCopyButton) {
          var copyButton = createElement("div", "copy-button");
          copyButton.innerHTML = _options.copyButtonText;
          syntax.appendChild(copyButton);
          copyButton.onclick = function() {
            _parameter_Navigator.clipboard.writeText(innerHTMLCopy);
          };
        }
        innerHTML = renderElementCommentVariables(innerHTML, syntaxLanguage);
        innerHTML = renderElementMultiLineCommentVariables(innerHTML, syntaxLanguage);
        innerHTML = renderElementStringQuotesPatternVariables(innerHTML, innerHTML.match(/".*?"/g));
        innerHTML = renderElementStringQuotesPatternVariables(innerHTML, innerHTML.match(/'.*?'/g));
        innerHTML = renderElementKeywords(innerHTML, syntaxLanguage);
        innerHTML = renderElementCommentsFromVariables(innerHTML);
        innerHTML = renderElementStringQuotesFromVariables(innerHTML);
        renderElementCompletedHTML(number, syntax, innerHTML);
        fireCustomTrigger("onRender", element);
      }
    }
  }
  function renderElementCommentVariables(innerHTML, syntaxLanguage) {
    var lookup = _languages[syntaxLanguage].comment;
    var patternItems = innerHTML.match(new RegExp(lookup + ".*", "g"));
    if (patternItems !== null) {
      var patternItemsLength = patternItems.length;
      var patternItemsIndex = 0;
      for (; patternItemsIndex < patternItemsLength; patternItemsIndex++) {
        var comment = patternItems[patternItemsIndex];
        var commentVariable = "$C{" + _comments_Cached_Count.toString() + "}";
        _comments_Cached[commentVariable] = '<span class="comment">' + comment + "</span>";
        _comments_Cached_Count++;
        innerHTML = innerHTML.replace(comment, commentVariable);
      }
    }
    return innerHTML;
  }
  function renderElementMultiLineCommentVariables(innerHTML, syntaxLanguage) {
    var lookup = _languages[syntaxLanguage].multiLineComment;
    var startIndex = 0;
    var endIndex = 0;
    for (; startIndex >= 0 && endIndex >= 0;) {
      startIndex = innerHTML.indexOf(lookup[0], endIndex);
      if (startIndex > -1) {
        endIndex = innerHTML.indexOf(lookup[1], startIndex + lookup[0].length);
        if (endIndex > -1) {
          var comment = innerHTML.substring(startIndex, endIndex + lookup[1].length);
          var commentLines = comment.split(_string.newLine);
          var commentLinesLength = commentLines.length;
          var commentLineIndex = 0;
          for (; commentLineIndex < commentLinesLength; commentLineIndex++) {
            var commentVariable = "$C{" + _comments_Cached_Count.toString() + "}";
            var commentLine = commentLines[commentLineIndex];
            _comments_Cached[commentVariable] = '<span class="comment">' + commentLine + "</span>";
            _comments_Cached_Count++;
            innerHTML = innerHTML.replace(commentLine, commentVariable);
          }
        }
      }
    }
    return innerHTML;
  }
  function renderElementStringQuotesPatternVariables(innerHTML, patternItems) {
    if (patternItems !== null) {
      var patternItemsLength = patternItems.length;
      var patternItemsIndex = 0;
      for (; patternItemsIndex < patternItemsLength; patternItemsIndex++) {
        var quote = patternItems[patternItemsIndex];
        var quoteReplacement = quote.replaceAll('"', _string.empty).replaceAll("'", _string.empty);
        var quoteVariable = "$S{" + _strings_Cached_Count.toString() + "}";
        _strings_Cached[quoteVariable] = '<q class="string">' + quoteReplacement + "</q>";
        _strings_Cached_Count++;
        innerHTML = innerHTML.replace(quote, quoteVariable);
      }
    }
    return innerHTML;
  }
  function renderElementKeywords(innerHTML, syntaxLanguage) {
    var keywords = _languages[syntaxLanguage].keywords;
    var keywordsLength = keywords.length;
    var keywordIndex = 0;
    for (; keywordIndex < keywordsLength; keywordIndex++) {
      var keyword = keywords[keywordIndex];
      var regEx = new RegExp("\\b" + keyword + "\\b", "g");
      innerHTML = innerHTML.replace(regEx, '<span class="keyword">' + keyword + "</span>");
    }
    return innerHTML;
  }
  function renderElementStringQuotesFromVariables(innerHTML) {
    var quoteVariable;
    for (quoteVariable in _strings_Cached) {
      if (_strings_Cached.hasOwnProperty(quoteVariable)) {
        innerHTML = innerHTML.replace(quoteVariable, _strings_Cached[quoteVariable]);
      }
    }
    return innerHTML;
  }
  function renderElementCommentsFromVariables(innerHTML) {
    var commentVariable;
    for (commentVariable in _comments_Cached) {
      if (_comments_Cached.hasOwnProperty(commentVariable)) {
        innerHTML = innerHTML.replace(commentVariable, _comments_Cached[commentVariable]);
      }
    }
    return innerHTML;
  }
  function renderElementCompletedHTML(number, syntax, innerHTML) {
    var lines = innerHTML.split(_string.newLine);
    var linesLength = lines.length;
    var lineIndex = 0;
    for (; lineIndex < linesLength; lineIndex++) {
      var line = lines[lineIndex];
      var numberCode = createElement("p");
      numberCode.innerHTML = (lineIndex + 1).toString();
      number.appendChild(numberCode);
      var syntaxCode = createElement("p");
      syntaxCode.innerHTML = line.trim() === _string.empty ? "<br>" : line;
      syntax.appendChild(syntaxCode);
    }
  }
  function isDefined(value) {
    return value !== undefined && value !== _string.empty;
  }
  function isDefinedObject(object) {
    return isDefined(object) && typeof object === "object";
  }
  function isDefinedBoolean(object) {
    return isDefined(object) && typeof object === "boolean";
  }
  function isDefinedString(object) {
    return isDefined(object) && typeof object === "string";
  }
  function isDefinedFunction(object) {
    return isDefined(object) && isFunction(object);
  }
  function isFunction(object) {
    return typeof object === "function";
  }
  function createElement(type, className) {
    var result = null;
    var nodeType = type.toLowerCase();
    var isText = nodeType === "text";
    if (!_elements_Type.hasOwnProperty(nodeType)) {
      _elements_Type[nodeType] = isText ? _parameter_Document.createTextNode(_string.empty) : _parameter_Document.createElement(nodeType);
    }
    result = _elements_Type[nodeType].cloneNode(false);
    if (isDefined(className)) {
      result.className = className;
    }
    return result;
  }
  function isCustomTriggerSet(name) {
    return isDefinedFunction(_options[name]);
  }
  function fireCustomTrigger(name) {
    var result = null;
    var newArguments = [].slice.call(arguments, 1);
    if (newArguments.length > 0) {
      result = false;
    }
    if (_options !== null && isCustomTriggerSet(name)) {
      result = _options[name].apply(null, newArguments);
    }
    return result;
  }
  function getDefaultString(value, defaultValue) {
    return isDefinedString(value) ? value : defaultValue;
  }
  function getDefaultBoolean(value, defaultValue) {
    return isDefinedBoolean(value) ? value : defaultValue;
  }
  function buildDefaultOptions(newOptions) {
    _options = !isDefinedObject(newOptions) ? {} : newOptions;
    _options.showCopyButton = getDefaultBoolean(_options.showCopyButton, true);
    setTranslationStringOptions();
  }
  function setTranslationStringOptions() {
    _options.copyButtonText = getDefaultString(_options.copyButtonText, "Copy");
  }
  var _parameter_Document = null;
  var _parameter_Navigator = null;
  var _string = {empty:"", space:" ", newLine:"\n"};
  var _options = {};
  var _elements_Type = {};
  var _strings_Cached = {};
  var _strings_Cached_Count = 0;
  var _comments_Cached = {};
  var _comments_Cached_Count = 0;
  var _languages = {javascript:{keywords:["abstract", "arguments", "await*", "boolean", "break", "byte", "case", "catch", "char", "class*", "const", "continue", "debugger", "default", "delete", "do", "double", "else", "enum*", "eval", "export*", "extends*", "false", "final", "finally", "float", "for", "function", "goto", "if", "implements", "import*", "in", "instanceof", "int", "interface", "let*", "long", "native", "new", "null", "package", "private", "protected", "public", "return", "short", "static", 
  "super*", "switch", "synchronized", "this", "throw", "throws", "transient", "true", "try", "typeof", "var", "void", "volatile", "while", "with", "yield"], comment:"//", multiLineComment:["/*", "*/"]}};
  this.buildNewSyntaxElements = function() {
    render();
    return this;
  };
  this.addLanguage = function(name, languageDetails, triggerRender) {
    var added = false;
    if (!_languages.hasOwnProperty(name.toLowerCase())) {
      triggerRender = !isDefinedBoolean(triggerRender) ? true : triggerRender;
      _languages[name.toLowerCase()] = languageDetails;
      added = true;
      if (triggerRender) {
        render();
      }
    }
    return added;
  };
  this.setOptions = function(newOptions, triggerEvent) {
    _options = !isDefinedObject(newOptions) ? {} : newOptions;
    triggerEvent = !isDefinedBoolean(triggerEvent) ? true : triggerEvent;
    var propertyName;
    for (propertyName in newOptions) {
      if (newOptions.hasOwnProperty(propertyName)) {
        _options[propertyName] = newOptions[propertyName];
      }
    }
    if (triggerEvent) {
      fireCustomTrigger("onOptionsUpdated", _options);
    }
    return this;
  };
  this.getVersion = function() {
    return "0.3.0";
  };
  (function(documentObject, navigatorObject, windowObject) {
    _parameter_Document = documentObject;
    _parameter_Navigator = navigatorObject;
    buildDefaultOptions();
    _parameter_Document.addEventListener("DOMContentLoaded", function() {
      render();
    });
    if (!isDefined(windowObject.$syntax)) {
      windowObject.$syntax = this;
    }
  })(document, navigator, window);
})();