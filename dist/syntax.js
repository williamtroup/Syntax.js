(function(documentElement, navigatorElement) {
    function render() {
      var domElements = documentElement.getElementsByClassName("syntax-highlight");
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
        if (isDefined(syntaxLanguage) && _language_Keywords.hasOwnProperty(syntaxLanguage)) {
          var innerHTML = element.innerHTML.trim();
          var innerHTMLCopy = element.innerHTML.trim();
          element.innerHTML = _string.empty;
          var code = createElement("div", "code custom-scroll-bars");
          element.appendChild(code);
          var number = createElement("div", "number");
          code.appendChild(number);
          var syntax = createElement("div", "syntax");
          code.appendChild(syntax);
          var copyButton = createElement("div", "copy-button");
          copyButton.innerHTML = "Copy";
          syntax.appendChild(copyButton);
          copyButton.onclick = function() {
            navigatorElement.clipboard.writeText(innerHTMLCopy);
          };
          innerHTML = renderElementCommentPatternVariables(innerHTML, innerHTML.match(new RegExp("//.*", "g")));
          innerHTML = renderElementStringQuotesPatternVariables(innerHTML, innerHTML.match(/".*?"/g));
          innerHTML = renderElementStringQuotesPatternVariables(innerHTML, innerHTML.match(/'.*?'/g));
          innerHTML = renderElementKeywords(innerHTML, syntaxLanguage);
          innerHTML = renderElementCommentsFromVariables(innerHTML);
          innerHTML = renderElementStringQuotesFromVariables(innerHTML);
          renderElementCompletedHTML(number, syntax, innerHTML);
        }
      }
    }
    function renderElementCommentPatternVariables(innerHTML, patternItems) {
      if (patternItems !== null) {
        var patternItemsLength = patternItems.length;
        var patternItemsIndex = 0;
        for (; patternItemsIndex < patternItemsLength; patternItemsIndex++) {
          var comment = patternItems[patternItemsIndex];
          var commentReplacement = comment.replaceAll('"', _string.empty).replaceAll("'", _string.empty);
          var commentVariable = "$C{" + _comments_Cached_Count.toString() + "}";
          _comments_Cached[commentVariable] = '<span class="comment">' + commentReplacement + "</span>";
          _comments_Cached_Count++;
          innerHTML = innerHTML.replace(comment, commentVariable);
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
      var keywords = _language_Keywords[syntaxLanguage];
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
        var line = lines[lineIndex].trim();
        var numberCode = createElement("p");
        numberCode.innerHTML = (lineIndex + 1).toString();
        number.appendChild(numberCode);
        var syntaxCode = createElement("p");
        syntaxCode.innerHTML = line === _string.empty ? "<br>" : line;
        syntax.appendChild(syntaxCode);
      }
    }
    function isDefined(value) {
      return value !== undefined && value !== _string.empty;
    }
    function createElement(type, className) {
      var result = null;
      var nodeType = type.toLowerCase();
      var isText = nodeType === "text";
      if (!_elements_Type.hasOwnProperty(nodeType)) {
        _elements_Type[nodeType] = isText ? documentElement.createTextNode(_string.empty) : documentElement.createElement(nodeType);
      }
      result = _elements_Type[nodeType].cloneNode(false);
      if (isDefined(className)) {
        result.className = className;
      }
      return result;
    }
    var _string = {empty:"", space:" ", newLine:"\n"};
    var _elements_Type = {};
    var _strings_Cached = {};
    var _strings_Cached_Count = 0;
    var _comments_Cached = {};
    var _comments_Cached_Count = 0;
    var _language_Keywords = {javascript:["function", "var", "new", "if", "while", "do", "switch", "case", "else", "null", "eval", "for", "in", "break", "debugger", "delete", "true", "false", "catch", "continue", "this", "yield", "default", "typeof", "try"]};
    documentElement.addEventListener("DOMContentLoaded", function() {
      render();
    });
  })(document, navigator);