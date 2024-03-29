/*! Syntax.js v2.4.3 | (c) Bunoon 2024 | MIT License */
(function() {
  function render() {
    var tagTypes = _configuration.highlightAllDomElementTypes;
    var tagTypesLength = tagTypes.length;
    var tagTypeIndex = 0;
    for (; tagTypeIndex < tagTypesLength; tagTypeIndex++) {
      var domElements = _parameter_Document.getElementsByTagName(tagTypes[tagTypeIndex]);
      var elements = [].slice.call(domElements);
      var elementsLength = elements.length;
      if (elementsLength > 0) {
        fireCustomTrigger(_configuration.onBeforeRender);
      }
      var elementIndex = 0;
      for (; elementIndex < elementsLength; elementIndex++) {
        var element = elements[elementIndex];
        var elementBreak = false;
        if (element.hasAttribute(_attribute_Name_Language) && element.getAttribute(_attribute_Name_Language).toLowerCase() === _languages_Tabbed) {
          var divElements = [].slice.call(element.children);
          var divElementsLength = divElements.length;
          var tabElements = [];
          var tabContentElements = [];
          element.removeAttribute(_attribute_Name_Language);
          element.className = element.className === _string.empty ? "syntax-highlight" : element.className + " syntax-highlight";
          element.innerHTML = _string.empty;
          var codeContainer = createElement("div", "code custom-scroll-bars");
          element.appendChild(codeContainer);
          var tabs = createElement("div", "tabs");
          codeContainer.appendChild(tabs);
          var divElementIndex = 0;
          for (; divElementIndex < divElementsLength; divElementIndex++) {
            var renderResult = renderElement(divElements[divElementIndex], codeContainer);
            if (!renderResult.rendered) {
              elementBreak = true;
            } else {
              renderTab(tabs, tabElements, tabContentElements, renderResult, divElementIndex, renderResult.tabBindingOptions, renderResult.syntaxLanguage);
            }
          }
        } else {
          if (!renderElement(element).rendered) {
            elementBreak = true;
          }
        }
        if (elementBreak) {
          break;
        }
      }
      if (elementsLength > 0) {
        fireCustomTrigger(_configuration.onAfterRender);
      }
    }
  }
  function renderTab(tabs, tabElements, tabContentElements, renderResult, divElementIndex, tabBindingOptions, syntaxLanguage) {
    var tab = createElement("button", "tab");
    tabs.appendChild(tab);
    setNodeText(tab, renderResult.tabTitle);
    tabElements.push(tab);
    tabContentElements.push(renderResult.tabContents);
    tab.onclick = function() {
      if (tab.className !== "tab-active") {
        var tabElementsLength = tabElements.length;
        var tabContentElementsLength = tabContentElements.length;
        var tabElementsIndex = 0;
        for (; tabElementsIndex < tabElementsLength; tabElementsIndex++) {
          tabElements[tabElementsIndex].className = "tab";
        }
        var tabContentElementsIndex = 0;
        for (; tabContentElementsIndex < tabContentElementsLength; tabContentElementsIndex++) {
          tabContentElements[tabContentElementsIndex].style.display = "none";
        }
        tab.className = "tab-active";
        renderResult.tabContents.style.display = "flex";
        if (isDefinedObject(tabBindingOptions)) {
          fireCustomTrigger(tabBindingOptions.onOpen, syntaxLanguage);
        }
      }
    };
    if (divElementIndex > 0) {
      renderResult.tabContents.style.display = "none";
    } else {
      tab.className = "tab-active";
    }
  }
  function renderElement(element, codeContainer) {
    var result = true;
    var tabTitle = null;
    var tabContents = null;
    var tabBindingOptions = null;
    var syntaxLanguage = null;
    if (isDefined(element) && element.hasAttribute(_attribute_Name_Language) && (!element.hasAttribute(_attribute_Name_TabContents) || isDefined(codeContainer))) {
      syntaxLanguage = element.getAttribute(_attribute_Name_Language);
      if (isDefinedString(syntaxLanguage)) {
        var language = getLanguage(syntaxLanguage);
        if (isDefined(language) || syntaxLanguage.toLowerCase() === _languages_Unknown) {
          var syntaxOptionsParsed = getObjectFromString(element.getAttribute(_attribute_Name_Options));
          var syntaxButtonsParsed = getObjectFromString(element.getAttribute(_attribute_Name_Buttons));
          if (syntaxOptionsParsed.parsed) {
            if (element.innerHTML.trim() !== _string.empty) {
              var innerHTML = element.innerHTML;
              var syntaxOptions = getBindingOptions(syntaxOptionsParsed.result);
              var isPreFormatted = false;
              var descriptionText = null;
              fireCustomTrigger(syntaxOptions.onBeforeRenderComplete, element);
              if (element.children.length > 0 && element.children[0].nodeName.toLowerCase() === "pre") {
                innerHTML = element.children[0].innerHTML;
                isPreFormatted = true;
              }
              var innerHTMLCopy = innerHTML.trim();
              var numbers = null;
              var description = null;
              var elementId = element.id;
              if (!isDefinedString(elementId)) {
                elementId = newGuid();
              }
              _elements_Original[elementId] = element.innerHTML;
              element.removeAttribute(_attribute_Name_Language);
              element.removeAttribute(_attribute_Name_Options);
              element.id = elementId;
              if (!isDefined(codeContainer)) {
                element.className = element.className === _string.empty ? "syntax-highlight" : element.className + " syntax-highlight";
                element.innerHTML = _string.empty;
                codeContainer = createElement("div", "code custom-scroll-bars");
                element.appendChild(codeContainer);
              } else {
                if (element.hasAttribute(_attribute_Name_TabContents) && element.getAttribute(_attribute_Name_TabContents).toLowerCase() !== "true") {
                  var syntaxTabOptions = getObjectFromString(element.getAttribute(_attribute_Name_TabContents));
                  if (syntaxTabOptions.parsed && isDefinedObject(syntaxTabOptions.result)) {
                    tabBindingOptions = getBindingTabContentOptions(syntaxTabOptions.result);
                    descriptionText = tabBindingOptions.description;
                    if (isDefinedString(tabBindingOptions.title)) {
                      tabTitle = tabBindingOptions.title;
                    }
                  }
                } else {
                  tabTitle = getFriendlyLanguageName(syntaxLanguage);
                }
              }
              tabContents = createElement("div", "tab-contents");
              codeContainer.appendChild(tabContents);
              if (isDefinedString(descriptionText)) {
                description = createElement("div", "description");
                tabContents.appendChild(description);
                setNodeText(description, descriptionText);
              }
              if (syntaxOptions.showLineNumbers) {
                numbers = createElement("div", "numbers");
                tabContents.appendChild(numbers);
              }
              var syntax = createElement("div", "syntax");
              tabContents.appendChild(syntax);
              renderElementButtons(syntax, syntaxOptions, syntaxLanguage, syntaxButtonsParsed, innerHTMLCopy);
              if (syntaxLanguage.toLowerCase() !== _languages_Unknown) {
                innerHTML = renderHTML(innerHTML, language, syntaxOptions);
              } else {
                innerHTML = encodeMarkUpCharacters(innerHTML);
              }
              renderElementCompletedHTML(element, description, numbers, syntax, innerHTML, syntaxOptions, isPreFormatted);
              fireCustomTrigger(syntaxOptions.onRenderComplete, element);
              _elements.push(element);
              _cached_Keywords = {};
              _cached_Keywords_Count = 0;
              _cached_Values = {};
              _cached_Values_Count = 0;
              _cached_Attributes = {};
              _cached_Attributes_Count = 0;
              _cached_Strings = {};
              _cached_Strings_Count = 0;
              _cached_Comments = {};
              _cached_Comments_Count = 0;
            } else {
              result = logError("No code is available available to render, skipping.");
            }
          } else {
            result = !_configuration.safeMode;
          }
        } else {
          result = logError("Language '" + syntaxLanguage + "' is not supported.");
        }
      } else {
        result = logError("The attribute '" + _attribute_Name_Language + "' has not been set correctly.");
      }
    }
    return {rendered:result, tabContents:tabContents, tabTitle:tabTitle, tabBindingOptions:tabBindingOptions, syntaxLanguage:syntaxLanguage};
  }
  function renderHTML(innerHTML, language, syntaxOptions) {
    if (!language.isMarkUp) {
      innerHTML = encodeMarkUpCharacters(innerHTML);
    }
    if (syntaxOptions.highlightComments) {
      innerHTML = renderElementMultiLineCommentVariables(innerHTML, language, syntaxOptions);
      innerHTML = renderElementCommentVariables(innerHTML, language, syntaxOptions);
    }
    if (syntaxOptions.highlightStrings) {
      innerHTML = renderElementStringPatternVariables(innerHTML, innerHTML.match(/"((?:\\.|[^"\\])*)"/g), syntaxOptions);
      if (language.comment !== "'") {
        innerHTML = renderElementStringPatternVariables(innerHTML, innerHTML.match(/'((?:\\.|[^"\\])*)'/g), syntaxOptions);
      }
    }
    if (!language.isMarkUp) {
      innerHTML = renderElementKeywords(innerHTML, language, syntaxOptions);
    } else {
      innerHTML = replaceMarkUpKeywords(innerHTML, language, syntaxOptions);
    }
    innerHTML = renderElementValues(innerHTML, language, syntaxOptions);
    if (language.isMarkUp) {
      innerHTML = renderElementAttributes(innerHTML, language, syntaxOptions);
    }
    innerHTML = encodeMarkUpCharacters(innerHTML);
    if (syntaxOptions.highlightComments) {
      innerHTML = renderElementCommentsFromVariables(innerHTML, language);
    }
    if (syntaxOptions.highlightStrings) {
      innerHTML = renderElementStringQuotesFromVariables(innerHTML);
    }
    innerHTML = renderElementVariables(innerHTML, _cached_Keywords);
    innerHTML = renderElementVariables(innerHTML, _cached_Values);
    if (language.isMarkUp) {
      innerHTML = renderElementVariables(innerHTML, _cached_Attributes);
    }
    return innerHTML;
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
            renderElementButton(customButton, buttonsElements, buttons, innerHTMLCopy, syntaxOptions);
          }
        }
      }
      if (syntaxOptions.showCopyButton) {
        var copyButton = createElement("button", "button");
        copyButton.style.display = syntaxOptions.buttonsVisible ? "inline-block" : "none";
        buttons.appendChild(copyButton);
        setNodeText(copyButton, syntaxOptions.copyButtonText);
        copyButton.onclick = function() {
          _parameter_Navigator.clipboard.writeText(innerHTMLCopy);
          fireCustomTrigger(syntaxOptions.onCopy, innerHTMLCopy);
        };
        buttonsElements.push(copyButton);
      }
      if (syntaxOptions.showPrintButton) {
        var printButton = createElement("button", "button");
        printButton.style.display = syntaxOptions.buttonsVisible ? "inline-block" : "none";
        buttons.appendChild(printButton);
        setNodeText(printButton, syntaxOptions.printButtonText);
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
        var languageLabel = createElement("div", "language-label");
        buttons.appendChild(languageLabel);
        setNodeText(languageLabel, getFriendlyLanguageName(syntaxLanguage, syntaxOptions.languageLabelCasing));
      }
      var buttonsElementsLength = buttonsElements.length;
      if (buttonsElementsLength > syntaxOptions.maximumButtons) {
        var openButton = createElement("button", "button button-opener");
        openButton.innerText = syntaxOptions.buttonsVisible ? _configuration.buttonsCloserText : _configuration.buttonsOpenerText;
        buttons.insertBefore(openButton, buttons.children[0]);
        openButton.onclick = function() {
          var areButtonsVisible = openButton.innerText === _configuration.buttonsCloserText;
          var buttonsElementIndex = 0;
          for (; buttonsElementIndex < buttonsElementsLength; buttonsElementIndex++) {
            buttonsElements[buttonsElementIndex].style.display = areButtonsVisible ? "none" : "inline-block";
          }
          openButton.innerText = areButtonsVisible ? _configuration.buttonsOpenerText : _configuration.buttonsCloserText;
          if (areButtonsVisible) {
            fireCustomTrigger(syntaxOptions.onButtonsClosed);
          } else {
            fireCustomTrigger(syntaxOptions.onButtonsOpened);
          }
        };
      } else if (!syntaxOptions.buttonsVisible && buttonsElementsLength <= syntaxOptions.maximumButtons) {
        var buttonsElementIndex = 0;
        for (; buttonsElementIndex < buttonsElementsLength; buttonsElementIndex++) {
          buttonsElements[buttonsElementIndex].style.display = "inline-block";
        }
      }
    }
  }
  function renderElementButton(customButton, buttonsElements, buttons, innerHTMLCopy, syntaxOptions) {
    var newCustomButton = createElement("button", "button");
    newCustomButton.style.display = syntaxOptions.buttonsVisible ? "inline-block" : "none";
    buttons.appendChild(newCustomButton);
    setNodeText(newCustomButton, customButton.text);
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
    if (isDefinedString(lookup)) {
      var patternItems = innerHTML.match(new RegExp(lookup + ".*", "g"));
      if (patternItems !== null) {
        var patternItemsLength = patternItems.length;
        var patternItemsIndex = 0;
        for (; patternItemsIndex < patternItemsLength; patternItemsIndex++) {
          var comment = patternItems[patternItemsIndex];
          var commentVariable = "$C{" + _cached_Comments_Count.toString() + "}";
          _cached_Comments[commentVariable] = '<span class="comment">' + comment + "</span>";
          _cached_Comments_Count++;
          innerHTML = innerHTML.replace(comment, commentVariable);
          fireCustomTrigger(syntaxOptions.onCommentRender, comment);
        }
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
              var commentVariable = "$C{" + _cached_Comments_Count.toString() + "}";
              var commentLine = commentLines[commentLineIndex];
              _cached_Comments[commentVariable] = '<span class="' + commentCssClass + '">' + commentLine + "</span>";
              _cached_Comments_Count++;
              innerHTML = innerHTML.replace(commentLine, commentVariable);
            }
            fireCustomTrigger(syntaxOptions.onCommentRender, comment);
          }
        }
      }
    }
    return innerHTML;
  }
  function renderElementStringPatternVariables(innerHTML, patternItems, syntaxOptions) {
    if (patternItems !== null) {
      var patternItemsLength = patternItems.length;
      var patternItemsIndex = 0;
      for (; patternItemsIndex < patternItemsLength; patternItemsIndex++) {
        var string = patternItems[patternItemsIndex];
        var stringLines = string.split(_string.newLine);
        var stringLinesLength = stringLines.length;
        var stringCssClass = stringLinesLength === 1 ? "string" : "multi-line-string";
        var stringLineIndex = 0;
        for (; stringLineIndex < stringLinesLength; stringLineIndex++) {
          var stringLine = stringLines[stringLineIndex];
          var stringVariable = "$S{" + _cached_Strings_Count.toString() + "}";
          _cached_Strings[stringVariable] = '<span class="' + stringCssClass + '">' + stringLine + "</span>";
          _cached_Strings_Count++;
          innerHTML = innerHTML.replace(stringLine, stringVariable);
        }
        fireCustomTrigger(syntaxOptions.onStringRender, string);
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
      var keywordVariable = "KW" + _cached_Keywords_Count.toString() + ";";
      var keywordReplacement = null;
      var regExFlags = caseSensitive ? "g" : "gi";
      var regEx = new RegExp(getWordRegEx(keyword, language), regExFlags);
      if (syntaxOptions.highlightKeywords) {
        if (isDefinedFunction(syntaxOptions.onKeywordClicked)) {
          keywordReplacement = '<span class="keyword-clickable">' + keywordDisplay + "</span>";
          innerHTML = innerHTML.replace(regEx, keywordVariable);
        } else {
          keywordReplacement = '<span class="keyword">' + keywordDisplay + "</span>";
          innerHTML = innerHTML.replace(regEx, keywordVariable);
        }
      } else {
        if (isDefinedFunction(syntaxOptions.onKeywordClicked)) {
          keywordReplacement = '<span class="no-highlight-keyword-clickable">' + keywordDisplay + "</span>";
          innerHTML = innerHTML.replace(regEx, keywordVariable);
        }
      }
      _cached_Keywords[keywordVariable] = keywordReplacement;
      _cached_Keywords_Count++;
      fireCustomTrigger(syntaxOptions.onKeywordRender, keyword);
    }
    return innerHTML;
  }
  function replaceMarkUpKeywords(innerHTML, language, syntaxOptions) {
    var keywords = getDefaultStringOrArray(language.keywords, []);
    var caseSensitive = language.caseSensitive;
    var keywordsCasing = getKeywordCasing(language.keywordsCasing);
    var regEx = /(<([^>]+)>)/ig;
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
        var keywordVariable = "KW" + _cached_Keywords_Count.toString() + ";";
        var regExReplace = new RegExp(getWordRegEx(tag, language), regExFlags);
        var keywordReplacement = null;
        var replacementTagDisplay = getDisplayTextTestCasing(tag, keywordsCasing);
        if (syntaxOptions.highlightKeywords) {
          if (isDefinedFunction(syntaxOptions.onKeywordClicked)) {
            keywordReplacement = '<span class="keyword-clickable">' + replacementTagDisplay + "</span>";
          } else {
            keywordReplacement = '<span class="keyword">' + replacementTagDisplay + "</span>";
          }
        } else {
          if (isDefinedFunction(syntaxOptions.onKeywordClicked)) {
            keywordReplacement = '<span class="no-highlight-keyword-clickable">' + replacementTagDisplay + "</span>";
          }
        }
        innerHTML = innerHTML.replace(regExReplace, keywordVariable);
        _cached_Keywords[keywordVariable] = keywordReplacement;
        _cached_Keywords_Count++;
      }
      regExResult = regEx.exec(innerHTML);
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
      var valueVariable = "VAL" + _cached_Values_Count.toString() + ";";
      var valueReplacement = null;
      var regExFlags = caseSensitive ? "g" : "gi";
      var regEx = new RegExp(getWordRegEx(value, language), regExFlags);
      if (syntaxOptions.highlightValues) {
        if (isDefinedFunction(syntaxOptions.onValueClicked)) {
          valueReplacement = '<span class="value-clickable">' + value + "</span>";
          innerHTML = innerHTML.replace(regEx, valueVariable);
        } else {
          valueReplacement = '<span class="value">' + value + "</span>";
          innerHTML = innerHTML.replace(regEx, valueVariable);
        }
      } else {
        if (isDefinedFunction(syntaxOptions.onValueClicked)) {
          valueReplacement = '<span class="no-highlight-value-clickable">' + value + "</span>";
          innerHTML = innerHTML.replace(regEx, valueVariable);
        }
      }
      _cached_Values[valueVariable] = valueReplacement;
      _cached_Values_Count++;
      fireCustomTrigger(syntaxOptions.onValueRender, value);
    }
    return innerHTML;
  }
  function renderElementAttributes(innerHTML, language, syntaxOptions) {
    var attributes = getDefaultStringOrArray(language.attributes, []);
    var attributesLength = attributes.length;
    var caseSensitive = language.caseSensitive;
    sortArrayOfStringByLength(attributes);
    var attributeIndex = 0;
    for (; attributeIndex < attributesLength; attributeIndex++) {
      var attribute = attributes[attributeIndex];
      var attributeVariable = "ATTR" + _cached_Attributes_Count.toString() + ";";
      var attributeReplacement = null;
      var regExFlags = caseSensitive ? "g" : "gi";
      var regEx = new RegExp(getWordRegEx(attribute, language), regExFlags);
      if (syntaxOptions.highlightAttributes) {
        if (isDefinedFunction(syntaxOptions.onAttributeClicked)) {
          attributeReplacement = '<span class="attribute-clickable">' + attribute + "</span>";
          innerHTML = innerHTML.replace(regEx, attributeVariable);
        } else {
          attributeReplacement = '<span class="attribute">' + attribute + "</span>";
          innerHTML = innerHTML.replace(regEx, attributeVariable);
        }
      } else {
        if (isDefinedFunction(syntaxOptions.onAttributeClicked)) {
          attributeReplacement = '<span class="no-highlight-attribute-clickable">' + attribute + "</span>";
          innerHTML = innerHTML.replace(regEx, attributeVariable);
        }
      }
      _cached_Attributes[attributeVariable] = attributeReplacement;
      _cached_Attributes_Count++;
      fireCustomTrigger(syntaxOptions.onAttributeRender, attribute);
    }
    return innerHTML;
  }
  function renderElementStringQuotesFromVariables(innerHTML) {
    var quoteVariable;
    for (quoteVariable in _cached_Strings) {
      if (_cached_Strings.hasOwnProperty(quoteVariable)) {
        innerHTML = innerHTML.replace(quoteVariable, _cached_Strings[quoteVariable]);
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
    for (commentVariable in _cached_Comments) {
      if (_cached_Comments.hasOwnProperty(commentVariable)) {
        var replacement = _cached_Comments[commentVariable];
        if (language.isMarkUp && isDefinedString(start) && isDefinedString(end)) {
          replacement = replacement.replace(multiLineComment[0], start);
          replacement = replacement.replace(multiLineComment[1], end);
        }
        innerHTML = innerHTML.replace(commentVariable, replacement);
      }
    }
    return innerHTML;
  }
  function renderElementVariables(innerHTML, variables) {
    var variable;
    for (variable in variables) {
      if (variables.hasOwnProperty(variable)) {
        var regExHtmlReplace = new RegExp(variable, "g");
        innerHTML = innerHTML.replace(regExHtmlReplace, variables[variable]);
      }
    }
    return innerHTML;
  }
  function renderElementCompletedHTML(element, description, numbers, syntax, innerHTML, syntaxOptions, isPreFormatted) {
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
      if (isDefined(description)) {
        description.ondblclick = function() {
          selectTextInElement(codeContainer);
        };
      }
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
                numberCode.innerText = padNumber(lineNumber.toString(), linesLengthStringLength);
              } else {
                numberCode.innerText = lineNumber.toString();
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
  function getWordRegEx(word, language) {
    var result = "(?<=^|[^-])\\b" + word + "\\b(?=[^-]|$)";
    if (isDefinedString(language.wordRegEx)) {
      result = language.wordRegEx.replace("%word%", word);
    }
    return result;
  }
  function getBindingOptions(newOptions) {
    var options = !isDefinedObject(newOptions) ? {} : newOptions;
    options = buildBindingAttributeOptions(options);
    options = buildBindingAttributeOptionStrings(options);
    options = buildBindingAttributeOptionCustomTriggers(options);
    return options;
  }
  function buildBindingAttributeOptions(options) {
    options.showCopyButton = getDefaultBoolean(options.showCopyButton, true);
    options.removeBlankLines = getDefaultBoolean(options.removeBlankLines, false);
    options.showLineNumbers = getDefaultBoolean(options.showLineNumbers, true);
    options.highlightKeywords = getDefaultBoolean(options.highlightKeywords, true);
    options.highlightValues = getDefaultBoolean(options.highlightValues, true);
    options.highlightAttributes = getDefaultBoolean(options.highlightAttributes, true);
    options.highlightStrings = getDefaultBoolean(options.highlightStrings, true);
    options.highlightComments = getDefaultBoolean(options.highlightComments, true);
    options.showLanguageLabel = getDefaultBoolean(options.showLanguageLabel, true);
    options.showPrintButton = getDefaultBoolean(options.showPrintButton, true);
    options.padLineNumbers = getDefaultBoolean(options.padLineNumbers, false);
    options.removeDuplicateBlankLines = getDefaultBoolean(options.removeDuplicateBlankLines, true);
    options.doubleClickToSelectAll = getDefaultBoolean(options.doubleClickToSelectAll, true);
    options.languageLabelCasing = getDefaultString(options.languageLabelCasing, "uppercase");
    options.buttonsVisible = getDefaultBoolean(options.buttonsVisible, true);
    options.maximumButtons = getDefaultNumber(options.maximumButtons, 2);
    return options;
  }
  function buildBindingAttributeOptionStrings(options) {
    options.copyButtonText = getDefaultString(options.copyButtonText, "Copy");
    options.printButtonText = getDefaultString(options.printButtonText, "Print");
    return options;
  }
  function buildBindingAttributeOptionCustomTriggers(options) {
    options.onCopy = getDefaultFunction(options.onCopy, null);
    options.onRenderComplete = getDefaultFunction(options.onRenderComplete, null);
    options.onKeywordClicked = getDefaultFunction(options.onKeywordClicked, null);
    options.onValueClicked = getDefaultFunction(options.onValueClicked, null);
    options.onAttributeClicked = getDefaultFunction(options.onAttributeClicked, null);
    options.onKeywordRender = getDefaultFunction(options.onKeywordRender, null);
    options.onValueRender = getDefaultFunction(options.onValueRender, null);
    options.onAttributeRender = getDefaultFunction(options.onAttributeRender, null);
    options.onStringRender = getDefaultFunction(options.onStringRender, null);
    options.onCommentRender = getDefaultFunction(options.onCommentRender, null);
    options.onPrint = getDefaultFunction(options.onPrint, null);
    options.onBeforeRenderComplete = getDefaultFunction(options.onBeforeRenderComplete, null);
    options.onButtonsOpened = getDefaultFunction(options.onButtonsOpened, null);
    options.onButtonsClosed = getDefaultFunction(options.onButtonsClosed, null);
    return options;
  }
  function getBindingTabContentOptions(newOptions) {
    var options = !isDefinedObject(newOptions) ? {} : newOptions;
    options = buildBindingTabContentAttributeOptionStrings(options);
    options = buildBindingTabContentAttributeOptionCustomTriggers(options);
    return options;
  }
  function buildBindingTabContentAttributeOptionStrings(options) {
    options.title = getDefaultString(options.title, null);
    options.description = getDefaultString(options.description, null);
    return options;
  }
  function buildBindingTabContentAttributeOptionCustomTriggers(options) {
    options.onOpen = getDefaultFunction(options.onOpen, null);
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
  function setNodeText(element, text) {
    if (!_configuration.allowHtmlInTextDisplay) {
      var div = createElement("div");
      div.innerHTML = text;
      element.innerText = div.innerText;
    } else {
      element.innerHTML = text;
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
        result = _parameter_Json.parse(objectString);
      }
    } catch (e1) {
      try {
        result = eval("(" + objectString + ")");
        if (isDefinedFunction(result)) {
          result = result();
        }
      } catch (e2) {
        parsed = logError("Errors in object: " + e1.message + ", " + e2.message);
        result = null;
      }
    }
    return {parsed:parsed, result:result};
  }
  function getClonedObject(object) {
    var json = _parameter_Json.stringify(object);
    var result = _parameter_Json.parse(json);
    return result;
  }
  function logError(error) {
    var result = true;
    if (!_configuration.safeMode) {
      console.error(error);
      result = false;
    }
    return result;
  }
  function newGuid() {
    var result = [];
    var charIndex = 0;
    for (; charIndex < 32; charIndex++) {
      if (charIndex === 8 || charIndex === 12 || charIndex === 16 || charIndex === 20) {
        result.push("-");
      }
      var character = _parameter_Math.floor(_parameter_Math.random() * 16).toString(16);
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
    _configuration.allowHtmlInTextDisplay = getDefaultBoolean(_configuration.allowHtmlInTextDisplay, true);
    buildDefaultConfigurationStrings();
    buildDefaultConfigurationCustomTriggers();
  }
  function buildDefaultConfigurationStrings() {
    _configuration.buttonsOpenerText = getDefaultString(_configuration.buttonsOpenerText, "<");
    _configuration.buttonsCloserText = getDefaultString(_configuration.buttonsCloserText, ">");
  }
  function buildDefaultConfigurationCustomTriggers() {
    _configuration.onBeforeRender = getDefaultFunction(_configuration.onBeforeRender, null);
    _configuration.onAfterRender = getDefaultFunction(_configuration.onAfterRender, null);
  }
  var _parameter_Document = null;
  var _parameter_Navigator = null;
  var _parameter_Window = null;
  var _parameter_Math = null;
  var _parameter_Json = null;
  var _configuration = {};
  var _string = {empty:"", space:" ", newLine:"\n"};
  var _aliases_Rules = {};
  var _elements_Type = {};
  var _elements = [];
  var _elements_Original = {};
  var _cached_Keywords = {};
  var _cached_Keywords_Count = 0;
  var _cached_Values = {};
  var _cached_Values_Count = 0;
  var _cached_Attributes = {};
  var _cached_Attributes_Count = 0;
  var _cached_Strings = {};
  var _cached_Strings_Count = 0;
  var _cached_Comments = {};
  var _cached_Comments_Count = 0;
  var _languages = {};
  var _languages_Unknown = "unknown";
  var _languages_Tabbed = "tabbed";
  var _attribute_Name_Language = "data-syntax-language";
  var _attribute_Name_Options = "data-syntax-options";
  var _attribute_Name_Buttons = "data-syntax-buttons";
  var _attribute_Name_TabContents = "data-syntax-tab-contents";
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
    return "2.4.3";
  };
  (function(documentObject, navigatorObject, windowObject, mathObject, jsonObject) {
    _parameter_Document = documentObject;
    _parameter_Navigator = navigatorObject;
    _parameter_Window = windowObject;
    _parameter_Math = mathObject;
    _parameter_Json = jsonObject;
    buildDefaultConfiguration();
    _parameter_Document.addEventListener("DOMContentLoaded", function() {
      render();
    });
    if (!isDefined(_parameter_Window.$syntax)) {
      _parameter_Window.$syntax = this;
    }
  })(document, navigator, window, Math, JSON);
})();