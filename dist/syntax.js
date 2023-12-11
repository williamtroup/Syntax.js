/*! Syntax.js v1.8.1 | (c) Bunoon | MIT License */
(function() {
  function render() {
    var tagTypes = _configuration.highlightAllDomElementTypes;
    var tagTypesLength = tagTypes.length;
    var tagTypeIndex = 0;
    for (; tagTypeIndex < tagTypesLength; tagTypeIndex++) {
      var domElements = _parameter_Document.getElementsByTagName(tagTypes[tagTypeIndex]);
      var elements = [].slice.call(domElements);
      var elementsLength = elements.length;
      var elementIndex = 0;
      for (; elementIndex < elementsLength; elementIndex++) {
        if (!renderElement(elements[elementIndex])) {
          break;
        }
      }
    }
  }
  function renderElement(element) {
    var result = true;
    if (isDefined(element) && element.hasAttribute(_attribute_Name_Language)) {
      var syntaxLanguage = element.getAttribute(_attribute_Name_Language);
      if (isDefinedString(syntaxLanguage)) {
        var language = getLanguage(syntaxLanguage);
        if (isDefined(language) || syntaxLanguage.toLowerCase() === _languages_Unknown) {
          var syntaxOptionsParsed = getObjectFromString(element.getAttribute(_attribute_Name_Options));
          var syntaxButtonsParsed = getObjectFromString(element.getAttribute(_attribute_Name_Buttons));
          if (syntaxOptionsParsed.parsed) {
            if (element.innerHTML.trim() !== _string.empty) {
              var innerHTML = element.innerHTML;
              var syntaxOptions = buildAttributeOptions(syntaxOptionsParsed.result);
              var isPreFormatted = false;
              if (element.children.length > 0 && element.children[0].nodeName.toLowerCase() === "pre") {
                innerHTML = element.children[0].innerHTML;
                isPreFormatted = true;
              }
              var innerHTMLCopy = innerHTML.trim();
              var numbers = null;
              var elementId = element.id;
              if (!isDefinedString(elementId)) {
                elementId = newGuid();
              }
              _elements_Original[elementId] = element.innerHTML;
              element.removeAttribute(_attribute_Name_Language);
              element.removeAttribute(_attribute_Name_Options);
              element.id = elementId;
              element.className = element.className === _string.empty ? "syntax-highlight" : element.className + " syntax-highlight";
              element.innerHTML = _string.empty;
              var code = createElement("div", "code custom-scroll-bars");
              element.appendChild(code);
              if (syntaxOptions.showLineNumbers) {
                numbers = createElement("div", "numbers");
                code.appendChild(numbers);
              }
              var syntax = createElement("div", "syntax");
              code.appendChild(syntax);
              renderElementButtons(syntax, syntaxOptions, syntaxLanguage, syntaxButtonsParsed, innerHTMLCopy);
              if (syntaxLanguage.toLowerCase() !== _languages_Unknown) {
                if (syntaxOptions.highlightComments) {
                  innerHTML = renderElementMultiLineCommentVariables(innerHTML, language, syntaxOptions);
                  innerHTML = renderElementCommentVariables(innerHTML, language, syntaxOptions);
                }
                if (syntaxOptions.highlightStrings) {
                  innerHTML = renderElementStringQuotesPatternVariables(innerHTML, innerHTML.match(/"((?:\\.|[^"\\])*)"/g), syntaxOptions);
                  if (language.comment !== "'") {
                    innerHTML = renderElementStringQuotesPatternVariables(innerHTML, innerHTML.match(/'((?:\\.|[^"\\])*)'/g), syntaxOptions);
                  }
                }
                if (!language.isMarkUp) {
                  innerHTML = renderElementKeywords(innerHTML, language, syntaxOptions);
                } else {
                  innerHTML = replaceMarkUpKeywords(innerHTML, language, syntaxOptions);
                }
                innerHTML = renderElementValues(innerHTML, language, syntaxOptions);
                if (syntaxOptions.highlightComments) {
                  innerHTML = renderElementCommentsFromVariables(innerHTML, language);
                }
                if (syntaxOptions.highlightStrings) {
                  innerHTML = renderElementStringQuotesFromVariables(innerHTML);
                }
              }
              renderElementCompletedHTML(element, numbers, syntax, innerHTML, syntaxOptions, isPreFormatted);
              fireCustomTrigger(syntaxOptions.onRenderComplete, element);
              _elements.push(element);
              _strings_Cached = {};
              _strings_Cached_Count = 0;
              _comments_Cached = {};
              _comments_Cached_Count = 0;
            } else {
              if (!_configuration.safeMode) {
                console.error("No code is available available to render, skipping.");
                result = false;
              }
            }
          } else {
            if (!_configuration.safeMode) {
              result = false;
            }
          }
        } else {
          if (!_configuration.safeMode) {
            console.error("Language '" + syntaxLanguage + "' is not supported.");
            result = false;
          }
        }
      } else {
        if (!_configuration.safeMode) {
          console.error("The attribute '" + _attribute_Name_Language + "' has not been set correctly.");
          result = false;
        }
      }
    }
    return result;
  }
  function renderElementButtons(syntax, syntaxOptions, syntaxLanguage, syntaxButtonsParsed, innerHTMLCopy) {
    if (syntaxOptions.showLanguageLabel || syntaxOptions.showCopyButton || syntaxOptions.showPrintButton || syntaxButtonsParsed.parsed) {
      var buttons = createElement("div", "buttons");
      var buttonsElements = [];
      syntax.appendChild(buttons);
      if (syntaxButtonsParsed.parsed && isDefinedArray(syntaxButtonsParsed.result)) {
        var customButtons = syntaxButtonsParsed.result;
        var customButtonsLength = customButtons.length;
        var customButtonsIndex = 0;
        for (; customButtonsIndex < customButtonsLength; customButtonsIndex++) {
          var customButton = customButtons[customButtonsIndex];
          if (isDefined(customButton.text) && isDefinedFunction(customButton.onClick)) {
            renderElementButton(customButton, buttonsElements, buttons, innerHTMLCopy);
          }
        }
      }
      if (syntaxOptions.showCopyButton) {
        var copyButton = createElement("div", "button");
        copyButton.innerHTML = syntaxOptions.copyButtonText;
        copyButton.style.display = _configuration.buttonsVisible ? "inline-block" : "none";
        buttons.appendChild(copyButton);
        copyButton.onclick = function() {
          _parameter_Navigator.clipboard.writeText(innerHTMLCopy);
          fireCustomTrigger(syntaxOptions.onCopy, innerHTMLCopy);
        };
        buttonsElements.push(copyButton);
      }
      if (syntaxOptions.showPrintButton) {
        var printButton = createElement("div", "button");
        printButton.innerHTML = syntaxOptions.printButtonText;
        printButton.style.display = _configuration.buttonsVisible ? "inline-block" : "none";
        buttons.appendChild(printButton);
        printButton.onclick = function() {
          var newWindow = window.open(_string.empty, "PRINT", "height=400,width=600");
          var newElementForPrint = syntax.cloneNode(true);
          var newTitleElement = createElement("div");
          newElementForPrint.removeChild(newElementForPrint.children[0]);
          newTitleElement.innerHTML = getFriendlyLanguageName(syntaxLanguage);
          newWindow.document.write("<html>");
          newWindow.document.write("<head>");
          newWindow.document.write("<title>");
          newWindow.document.write(newTitleElement.innerHTML);
          newWindow.document.write("</title>");
          newWindow.document.write("</head>");
          newWindow.document.write("<body>");
          newWindow.document.write("<code>");
          newWindow.document.write("<pre>");
          newWindow.document.write(newElementForPrint.innerHTML);
          newWindow.document.write("</pre>");
          newWindow.document.write("</code>");
          newWindow.document.write("</body>");
          newWindow.document.write("</html>");
          newWindow.document.close();
          newWindow.focus();
          newWindow.print();
          newWindow.close();
          fireCustomTrigger(syntaxOptions.onPrint, newElementForPrint.innerHTML);
        };
        buttonsElements.push(printButton);
      }
      if (syntaxOptions.showLanguageLabel) {
        var languageLabel = createElement("div", "label");
        languageLabel.innerHTML = getFriendlyLanguageName(syntaxLanguage, syntaxOptions.languageLabelCasing);
        buttons.appendChild(languageLabel);
      }
      var buttonsElementsLength = buttonsElements.length;
      if (buttonsElementsLength > _configuration.maximumButtons) {
        var openButton = createElement("div", "button button-opener");
        openButton.innerText = _configuration.buttonsVisible ? _configuration.buttonsCloserText : _configuration.buttonsOpenerText;
        buttons.insertBefore(openButton, buttons.children[0]);
        openButton.onclick = function() {
          var areButtonsVisible = openButton.innerText === _configuration.buttonsCloserText;
          var buttonsElementIndex = 0;
          for (; buttonsElementIndex < buttonsElementsLength; buttonsElementIndex++) {
            buttonsElements[buttonsElementIndex].style.display = areButtonsVisible ? "none" : "inline-block";
          }
          openButton.innerText = areButtonsVisible ? _configuration.buttonsOpenerText : _configuration.buttonsCloserText;
        };
      }
    }
  }
  function renderElementButton(customButton, buttonsElements, buttons, innerHTMLCopy) {
    var newCustomButton = createElement("div", "button");
    newCustomButton.innerHTML = customButton.text;
    newCustomButton.style.display = _configuration.buttonsVisible ? "inline-block" : "none";
    buttons.appendChild(newCustomButton);
    newCustomButton.onclick = function() {
      customButton.onClick(innerHTMLCopy);
    };
    if (isDefined(customButton.className)) {
      newCustomButton.className += _string.space + customButton.className;
    }
    buttonsElements.push(newCustomButton);
  }
  function renderElementCommentVariables(innerHTML, language, syntaxOptions) {
    var lookup = language.comment;
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
        fireCustomTrigger(syntaxOptions.onCommentRender, comment);
      }
    }
    return innerHTML;
  }
  function renderElementMultiLineCommentVariables(innerHTML, language, syntaxOptions) {
    var multiLineComment = language.multiLineComment;
    if (isDefinedArray(multiLineComment) && multiLineComment.length === 2) {
      var startIndex = 0;
      var endIndex = 0;
      for (; startIndex >= 0 && endIndex >= 0;) {
        startIndex = innerHTML.indexOf(multiLineComment[0], endIndex);
        if (startIndex > -1) {
          endIndex = innerHTML.indexOf(multiLineComment[1], startIndex + multiLineComment[0].length);
          if (endIndex > -1) {
            var comment = innerHTML.substring(startIndex, endIndex + multiLineComment[1].length);
            var commentLines = comment.split(_string.newLine);
            var commentLinesLength = commentLines.length;
            var commentCssClass = commentLinesLength === 1 ? "comment" : "multi-line-comment";
            var commentLineIndex = 0;
            for (; commentLineIndex < commentLinesLength; commentLineIndex++) {
              var commentVariable = "$C{" + _comments_Cached_Count.toString() + "}";
              var commentLine = commentLines[commentLineIndex];
              _comments_Cached[commentVariable] = '<span class="' + commentCssClass + '">' + commentLine + "</span>";
              _comments_Cached_Count++;
              innerHTML = innerHTML.replace(commentLine, commentVariable);
            }
            fireCustomTrigger(syntaxOptions.onCommentRender, comment);
          }
        }
      }
    }
    return innerHTML;
  }
  function renderElementStringQuotesPatternVariables(innerHTML, patternItems, syntaxOptions) {
    if (patternItems !== null) {
      var patternItemsLength = patternItems.length;
      var patternItemsIndex = 0;
      for (; patternItemsIndex < patternItemsLength; patternItemsIndex++) {
        var quote = patternItems[patternItemsIndex];
        var quoteLines = quote.split(_string.newLine);
        var quoteLinesLength = quoteLines.length;
        var quoteCssClass = quoteLinesLength === 1 ? "string" : "multi-line-string";
        var quoteLineIndex = 0;
        for (; quoteLineIndex < quoteLinesLength; quoteLineIndex++) {
          var quoteLine = quoteLines[quoteLineIndex];
          var quoteVariable = "$S{" + _strings_Cached_Count.toString() + "}";
          _strings_Cached[quoteVariable] = '<span class="' + quoteCssClass + '">' + quoteLine + "</span>";
          _strings_Cached_Count++;
          innerHTML = innerHTML.replace(quoteLine, quoteVariable);
        }
        fireCustomTrigger(syntaxOptions.onStringRender, quote);
      }
    }
    return innerHTML;
  }
  function renderElementKeywords(innerHTML, language, syntaxOptions) {
    var keywords = getDefaultStringOrArray(language.keywords, []);
    var keywordsLength = keywords.length;
    var caseSensitive = language.caseSensitive;
    var keywordsCasing = getKeywordCasing(language.keywordsCasing);
    sortArrayOfStringByLength(keywords);
    var keywordIndex = 0;
    for (; keywordIndex < keywordsLength; keywordIndex++) {
      var keyword = keywords[keywordIndex];
      var keywordDisplay = getDisplayTextTestCasing(keyword, keywordsCasing);
      var regExFlags = caseSensitive ? "g" : "gi";
      var regEx = new RegExp("\\b" + keyword + "\\b", regExFlags);
      if (syntaxOptions.highlightKeywords) {
        if (isDefinedFunction(syntaxOptions.onKeywordClicked)) {
          innerHTML = innerHTML.replace(regEx, '<span class="keyword-clickable">' + keywordDisplay + "</span>");
        } else {
          innerHTML = innerHTML.replace(regEx, '<span class="keyword">' + keywordDisplay + "</span>");
        }
      } else {
        if (isDefinedFunction(syntaxOptions.onKeywordClicked)) {
          innerHTML = innerHTML.replace(regEx, '<span class="no-highlight-keyword-clickable">' + keywordDisplay + "</span>");
        }
      }
      fireCustomTrigger(syntaxOptions.onKeywordRender, keyword);
    }
    return innerHTML;
  }
  function replaceMarkUpKeywords(innerHTML, language, syntaxOptions) {
    var keywords = getDefaultStringOrArray(language.keywords, []);
    var caseSensitive = language.caseSensitive;
    var keywordsCasing = getKeywordCasing(language.keywordsCasing);
    var regEx = /(<([^>]+)>)/ig;
    var replacements = {};
    var replacementsNumber = 1;
    var regExFlags = caseSensitive ? "g" : "gi";
    var regExResult = regEx.exec(innerHTML);
    for (; regExResult;) {
      if (regExResult.index === regEx.lastIndex) {
        regEx.lastIndex++;
      }
      var tag = regExResult[0];
      tag = tag.replace("</", _string.empty).replace("<", _string.empty).replace(">", _string.empty);
      tag = tag.split(_string.space)[0];
      if (keywords.indexOf(tag) > -1) {
        var replacementVariable = "KW" + replacementsNumber.toString() + ";";
        var regExReplace = new RegExp("\\b" + tag + "\\b", regExFlags);
        var replacement = null;
        var replacementTagDisplay = getDisplayTextTestCasing(tag, keywordsCasing);
        if (syntaxOptions.highlightKeywords) {
          if (isDefinedFunction(syntaxOptions.onKeywordClicked)) {
            replacement = '<span class="keyword-clickable">' + replacementTagDisplay + "</span>";
          } else {
            replacement = '<span class="keyword">' + replacementTagDisplay + "</span>";
          }
        } else {
          if (isDefinedFunction(syntaxOptions.onKeywordClicked)) {
            replacement = '<span class="no-highlight-keyword-clickable">' + replacementTagDisplay + "</span>";
          }
        }
        innerHTML = innerHTML.replace(regExReplace, replacementVariable);
        replacements[replacementVariable] = replacement;
        replacementsNumber++;
      }
      regExResult = regEx.exec(innerHTML);
    }
    innerHTML = encodeMarkUpCharacters(innerHTML);
    var variable;
    for (variable in replacements) {
      if (replacements.hasOwnProperty(variable)) {
        var regExHtmlReplace = new RegExp(variable, "g");
        innerHTML = innerHTML.replace(regExHtmlReplace, replacements[variable]);
      }
    }
    return innerHTML;
  }
  function renderElementValues(innerHTML, language, syntaxOptions) {
    var values = getDefaultStringOrArray(language.values, []);
    var valuesLength = values.length;
    var caseSensitive = language.caseSensitive;
    sortArrayOfStringByLength(values);
    var valueIndex = 0;
    for (; valueIndex < valuesLength; valueIndex++) {
      var value = values[valueIndex];
      var regExFlags = caseSensitive ? "g" : "gi";
      var regEx = new RegExp("\\b" + value + "\\b", regExFlags);
      if (syntaxOptions.highlightValues) {
        if (isDefinedFunction(syntaxOptions.onValueClicked)) {
          innerHTML = innerHTML.replace(regEx, '<span class="value-clickable">' + value + "</span>");
        } else {
          innerHTML = innerHTML.replace(regEx, '<span class="value">' + value + "</span>");
        }
      } else {
        if (isDefinedFunction(syntaxOptions.onValueClicked)) {
          innerHTML = innerHTML.replace(regEx, '<span class="no-highlight-value-clickable">' + value + "</span>");
        }
      }
      fireCustomTrigger(syntaxOptions.onValueRender, value);
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
  function renderElementCommentsFromVariables(innerHTML, language) {
    var multiLineComment = language.multiLineComment;
    var start = null;
    var end = null;
    if (isDefinedArray(multiLineComment) && multiLineComment.length === 2) {
      start = encodeMarkUpCharacters(multiLineComment[0]);
      end = encodeMarkUpCharacters(multiLineComment[1]);
    }
    var commentVariable;
    for (commentVariable in _comments_Cached) {
      if (_comments_Cached.hasOwnProperty(commentVariable)) {
        var replacement = _comments_Cached[commentVariable];
        if (language.isMarkUp && isDefinedString(start) && isDefinedString(end)) {
          replacement = replacement.replace(multiLineComment[0], start);
          replacement = replacement.replace(multiLineComment[1], end);
        }
        innerHTML = innerHTML.replace(commentVariable, replacement);
      }
    }
    return innerHTML;
  }
  function renderElementCompletedHTML(element, numbers, syntax, innerHTML, syntaxOptions, isPreFormatted) {
    var lines = innerHTML.split(_string.newLine);
    var linesLength = lines.length;
    var linesLengthStringLength = linesLength.toString().length;
    var numberContainer = numbers;
    var codeContainer = syntax;
    var replaceWhitespace = null;
    var lineNumber = 1;
    var lastLineWasBlank = false;
    if (isPreFormatted) {
      codeContainer = createElement("pre");
      syntax.appendChild(codeContainer);
      if (isDefined(numbers)) {
        numberContainer = createElement("pre");
        numbers.appendChild(numberContainer);
      }
    }
    if (syntaxOptions.doubleClickToSelectAll) {
      if (isDefined(numbers)) {
        numbers.ondblclick = function() {
          selectTextInElement(codeContainer);
        };
      }
      syntax.ondblclick = function() {
        selectTextInElement(codeContainer);
      };
    }
    var lineIndex = 0;
    for (; lineIndex < linesLength; lineIndex++) {
      var line = lines[lineIndex];
      if (line.trim() !== _string.empty && replaceWhitespace === null) {
        replaceWhitespace = line.substring(0, line.match(/^\s*/)[0].length);
      }
      if (lineIndex !== 0 && lineIndex !== linesLength - 1 || line.trim() !== _string.empty) {
        if (line.trim() !== _string.empty || !syntaxOptions.removeBlankLines) {
          var isBlank = line.trim() === _string.empty;
          if (isBlank && !lastLineWasBlank || !syntaxOptions.removeDuplicateBlankLines || !isBlank) {
            lastLineWasBlank = isBlank;
            if (isDefined(numberContainer)) {
              var numberCode = createElement("p");
              if (syntaxOptions.padLineNumbers) {
                numberCode.innerHTML = padNumber(lineNumber.toString(), linesLengthStringLength);
              } else {
                numberCode.innerHTML = lineNumber.toString();
              }
              numberContainer.appendChild(numberCode);
              lineNumber++;
            }
            if (replaceWhitespace !== null) {
              line = line.replace(replaceWhitespace, _string.empty);
              if (!isPreFormatted) {
                var remainingStartWhitespaceCount = line.match(/^\s*/)[0].length;
                var remainingStartWhitespace = line.substring(0, remainingStartWhitespaceCount);
                var whitespaceReplacement = Array(remainingStartWhitespaceCount).join("&nbsp;");
                line = line.replace(remainingStartWhitespace, whitespaceReplacement);
              }
            }
            var syntaxCode = createElement("p");
            syntaxCode.innerHTML = line.trim() === _string.empty ? "<br>" : line;
            codeContainer.appendChild(syntaxCode);
          }
        }
      }
    }
    renderElementClickEvents(element, syntaxOptions.onKeywordClicked, "keyword-clickable");
    renderElementClickEvents(element, syntaxOptions.onValueClicked, "value-clickable");
  }
  function renderElementClickEvents(element, customTrigger, className) {
    if (isDefinedFunction(customTrigger)) {
      var elements = element.getElementsByClassName(className);
      var elementsLength = elements.length;
      var elementIndex = 0;
      for (; elementIndex < elementsLength; elementIndex++) {
        renderElementClickEvent(elements[elementIndex], customTrigger);
      }
    }
  }
  function renderElementClickEvent(element, customTrigger) {
    var text = element.innerText;
    element.onclick = function() {
      customTrigger(text);
    };
  }
  function getFriendlyLanguageName(syntaxLanguage, languageLabelCasing) {
    var result = null;
    var language = getLanguage(syntaxLanguage);
    if (isDefined(language) && isDefinedString(language.friendlyName)) {
      result = language.friendlyName;
    } else {
      result = syntaxLanguage;
    }
    result = getDisplayTextTestCasing(result, languageLabelCasing);
    return result;
  }
  function getLanguage(syntaxLanguage) {
    var result = null;
    var language = syntaxLanguage.toLowerCase();
    if (_languages.hasOwnProperty(language)) {
      result = _languages[language];
    } else {
      if (_aliases_Rules.hasOwnProperty(language)) {
        language = _aliases_Rules[language];
        if (_languages.hasOwnProperty(language)) {
          result = _languages[language];
        }
      }
    }
    return result;
  }
  function getKeywordCasing(keywordsCasing) {
    if (isDefinedString(keywordsCasing)) {
      keywordsCasing = keywordsCasing.toLowerCase().trim();
    }
    return keywordsCasing;
  }
  function getDisplayTextTestCasing(keyword, keywordsCasing) {
    if (keywordsCasing === "uppercase") {
      keyword = keyword.toUpperCase();
    } else if (keywordsCasing === "lowercase") {
      keyword = keyword.toLowerCase();
    }
    return keyword;
  }
  function buildAttributeOptions(newOptions) {
    var options = !isDefinedObject(newOptions) ? {} : newOptions;
    options.showCopyButton = getDefaultBoolean(options.showCopyButton, true);
    options.removeBlankLines = getDefaultBoolean(options.removeBlankLines, false);
    options.showLineNumbers = getDefaultBoolean(options.showLineNumbers, true);
    options.highlightKeywords = getDefaultBoolean(options.highlightKeywords, true);
    options.highlightValues = getDefaultBoolean(options.highlightValues, true);
    options.highlightStrings = getDefaultBoolean(options.highlightStrings, true);
    options.highlightComments = getDefaultBoolean(options.highlightComments, true);
    options.showLanguageLabel = getDefaultBoolean(options.showLanguageLabel, true);
    options.showPrintButton = getDefaultBoolean(options.showPrintButton, true);
    options.padLineNumbers = getDefaultBoolean(options.padLineNumbers, false);
    options.removeDuplicateBlankLines = getDefaultBoolean(options.removeDuplicateBlankLines, true);
    options.doubleClickToSelectAll = getDefaultBoolean(options.doubleClickToSelectAll, true);
    options.languageLabelCasing = getDefaultString(options.languageLabelCasing, "uppercase");
    options = buildAttributeOptionStrings(options);
    return buildAttributeOptionCustomTriggers(options);
  }
  function buildAttributeOptionStrings(options) {
    options.copyButtonText = getDefaultString(options.copyButtonText, "Copy");
    options.printButtonText = getDefaultString(options.printButtonText, "Print");
    return options;
  }
  function buildAttributeOptionCustomTriggers(options) {
    options.onCopy = getDefaultFunction(options.onCopy, null);
    options.onRenderComplete = getDefaultFunction(options.onRenderComplete, null);
    options.onKeywordClicked = getDefaultFunction(options.onKeywordClicked, null);
    options.onValueClicked = getDefaultFunction(options.onValueClicked, null);
    options.onKeywordRender = getDefaultFunction(options.onKeywordRender, null);
    options.onValueRender = getDefaultFunction(options.onValueRender, null);
    options.onStringRender = getDefaultFunction(options.onStringRender, null);
    options.onCommentRender = getDefaultFunction(options.onCommentRender, null);
    options.onPrint = getDefaultFunction(options.onPrint, null);
    return options;
  }
  function isDefined(value) {
    return value !== null && value !== undefined && value !== _string.empty;
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
    return isDefined(object) && typeof object === "function";
  }
  function isDefinedNumber(object) {
    return isDefined(object) && typeof object === "number";
  }
  function isDefinedArray(object) {
    return isDefinedObject(object) && object instanceof Array;
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
  function selectTextInElement(element) {
    if (_parameter_Document.selection) {
      var textRange = _parameter_Document.body.createTextRange();
      textRange.moveToElementText(element);
      textRange.select();
    } else if (_parameter_Window.getSelection) {
      var range = _parameter_Document.createRange();
      range.selectNode(element);
      _parameter_Window.getSelection().removeAllRanges();
      _parameter_Window.getSelection().addRange(range);
    }
  }
  function fireCustomTrigger(triggerFunction) {
    if (isDefinedFunction(triggerFunction)) {
      triggerFunction.apply(null, [].slice.call(arguments, 1));
    }
  }
  function getDefaultString(value, defaultValue) {
    return isDefinedString(value) ? value : defaultValue;
  }
  function getDefaultBoolean(value, defaultValue) {
    return isDefinedBoolean(value) ? value : defaultValue;
  }
  function getDefaultFunction(value, defaultValue) {
    return isDefinedFunction(value) ? value : defaultValue;
  }
  function getDefaultArray(value, defaultValue) {
    return isDefinedArray(value) ? value : defaultValue;
  }
  function getDefaultNumber(value, defaultValue) {
    return isDefinedNumber(value) ? value : defaultValue;
  }
  function getDefaultStringOrArray(value, defaultValue) {
    if (isDefinedString(value)) {
      value = value.split(_string.space);
      if (value.length === 0) {
        value = defaultValue;
      }
    } else {
      value = getDefaultArray(value, defaultValue);
    }
    return value;
  }
  function getObjectFromString(objectString) {
    var parsed = true;
    var result = null;
    try {
      if (isDefinedString(objectString)) {
        result = JSON.parse(objectString);
      }
    } catch (e1) {
      try {
        result = eval("(" + objectString + ")");
        if (isDefinedFunction(result)) {
          result = result();
        }
      } catch (e2) {
        if (!_configuration.safeMode) {
          console.error("Errors in object: " + e1.message + ", " + e2.message);
          parsed = false;
        }
        result = null;
      }
    }
    return {parsed:parsed, result:result};
  }
  function getClonedObject(object) {
    var json = JSON.stringify(object);
    var result = JSON.parse(json);
    return result;
  }
  function newGuid() {
    var result = [];
    var charIndex = 0;
    for (; charIndex < 32; charIndex++) {
      if (charIndex === 8 || charIndex === 12 || charIndex === 16 || charIndex === 20) {
        result.push("-");
      }
      var character = Math.floor(Math.random() * 16).toString(16);
      result.push(character);
    }
    return result.join(_string.empty);
  }
  function padNumber(number, length) {
    var result = number;
    for (; result.length < length;) {
      result = "0" + result;
    }
    return result;
  }
  function encodeMarkUpCharacters(data) {
    data = data.replace(/</g, "&lt;");
    data = data.replace(/>/g, "&gt;");
    return data;
  }
  function sortArrayOfStringByLength(array) {
    array.sort(function(a, b) {
      return b.length - a.length;
    });
  }
  function buildDefaultConfiguration() {
    _configuration.safeMode = getDefaultBoolean(_configuration.safeMode, true);
    _configuration.highlightAllDomElementTypes = getDefaultStringOrArray(_configuration.highlightAllDomElementTypes, ["div", "code"]);
    _configuration.maximumButtons = getDefaultNumber(_configuration.maximumButtons, 2);
    _configuration.buttonsVisible = getDefaultBoolean(_configuration.buttonsVisible, true);
    _configuration.buttonsOpenerText = getDefaultString(_configuration.buttonsOpenerText, "<");
    _configuration.buttonsCloserText = getDefaultString(_configuration.buttonsCloserText, ">");
  }
  var _parameter_Document = null;
  var _parameter_Navigator = null;
  var _parameter_Window = null;
  var _configuration = {};
  var _string = {empty:"", space:" ", newLine:"\n"};
  var _aliases_Rules = {};
  var _elements_Type = {};
  var _elements = [];
  var _elements_Original = {};
  var _strings_Cached = {};
  var _strings_Cached_Count = 0;
  var _comments_Cached = {};
  var _comments_Cached_Count = 0;
  var _languages = {};
  var _languages_Unknown = "unknown";
  var _attribute_Name_Language = "data-syntax-language";
  var _attribute_Name_Options = "data-syntax-options";
  var _attribute_Name_Buttons = "data-syntax-buttons";
  this.highlightAll = function() {
    render();
    return this;
  };
  this.highlightElement = function(elementOrId) {
    var element = elementOrId;
    if (isDefinedString(element)) {
      element = _parameter_Document.getElementById(element);
    }
    if (isDefined(element)) {
      renderElement(element);
    }
    return this;
  };
  this.getElementsHighlighted = function() {
    return [].slice.call(_elements);
  };
  this.getCode = function(elementId) {
    var result = null;
    if (_elements_Original.hasOwnProperty(elementId)) {
      result = _elements_Original[elementId];
    }
    return result;
  };
  this.destroyAll = function() {
    var elementId;
    for (elementId in _elements_Original) {
      if (_elements_Original.hasOwnProperty(elementId)) {
        var renderedElement = _parameter_Document.getElementById(elementId);
        if (isDefined(renderedElement)) {
          renderedElement.innerHTML = _elements_Original[elementId];
        }
      }
    }
    _elements_Original = {};
    _elements = [];
    return this;
  };
  this.destroy = function(elementId) {
    if (_elements_Original.hasOwnProperty(elementId.toLowerCase())) {
      var renderedElement = _parameter_Document.getElementById(elementId);
      if (isDefined(renderedElement)) {
        renderedElement.innerHTML = _elements_Original[elementId.toLowerCase()];
        delete _elements_Original[elementId.toLowerCase()];
        var elementsLength = _elements.length;
        var elementIndex = 0;
        for (; elementIndex < elementsLength; elementIndex++) {
          if (_elements[elementIndex].id === elementId) {
            delete _elements[elementIndex];
            break;
          }
        }
      }
    }
    return this;
  };
  this.addLanguage = function(name, languageDetails, triggerRender) {
    var added = false;
    var lookup = name.toLowerCase();
    if (!_languages.hasOwnProperty(lookup)) {
      triggerRender = !isDefinedBoolean(triggerRender) ? true : triggerRender;
      _languages[lookup] = languageDetails;
      added = true;
      if (triggerRender) {
        render();
      }
    }
    return added;
  };
  this.removeLanguage = function(name) {
    var removed = false;
    var lookup = name.toLowerCase();
    if (_languages.hasOwnProperty(lookup)) {
      delete _languages[lookup];
      var alias;
      for (alias in _aliases_Rules) {
        if (_aliases_Rules.hasOwnProperty(alias) && _aliases_Rules[alias] === lookup) {
          delete _aliases_Rules[alias];
        }
      }
      removed = true;
    }
    return removed;
  };
  this.getLanguage = function(name) {
    var details = null;
    var lookup = name.toLowerCase();
    if (_languages.hasOwnProperty(lookup)) {
      details = getClonedObject(lookup);
    }
    return details;
  };
  this.getLanguages = function() {
    return getClonedObject(_languages);
  };
  this.addAlias = function(alias, language, triggerRender) {
    var added = false;
    if (_languages.hasOwnProperty(language.toLowerCase()) && !_aliases_Rules.hasOwnProperty(alias.toLowerCase())) {
      triggerRender = !isDefinedBoolean(triggerRender) ? true : triggerRender;
      _aliases_Rules[alias.toLowerCase()] = language.toLowerCase();
      added = true;
      if (triggerRender) {
        render();
      }
    }
    return added;
  };
  this.removeAlias = function(alias) {
    var removed = false;
    if (_aliases_Rules.hasOwnProperty(alias.toLowerCase())) {
      delete _aliases_Rules[alias.toLowerCase()];
      removed = true;
    }
    return removed;
  };
  this.getAlias = function(alias) {
    var result = null;
    if (_aliases_Rules.hasOwnProperty(alias.toLowerCase())) {
      result = _aliases_Rules[alias.toLowerCase()];
    }
    return result;
  };
  this.getAliases = function() {
    return getClonedObject(_aliases_Rules);
  };
  this.setConfiguration = function(newOptions) {
    _configuration = !isDefinedObject(newOptions) ? {} : newOptions;
    buildDefaultConfiguration();
    return this;
  };
  this.getVersion = function() {
    return "1.8.1";
  };
  (function(documentObject, navigatorObject, windowObject) {
    _parameter_Document = documentObject;
    _parameter_Navigator = navigatorObject;
    _parameter_Window = windowObject;
    buildDefaultConfiguration();
    _parameter_Document.addEventListener("DOMContentLoaded", function() {
      render();
    });
    if (!isDefined(_parameter_Window.$syntax)) {
      _parameter_Window.$syntax = this;
    }
  })(document, navigator, window);
})();