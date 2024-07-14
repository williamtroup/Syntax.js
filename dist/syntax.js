"use strict";

var Constants;

(e => {
    e.SYNTAX_JS_ATTRIBUTE_NAME_LANGUAGE = "data-syntax-language";
    e.SYNTAX_JS_ATTRIBUTE_NAME_OPTIONS = "data-syntax-options";
    e.SYNTAX_JS_ATTRIBUTE_NAME_BUTTONS = "data-syntax-buttons";
    e.SYNTAX_JS_ATTRIBUTE_NAME_TAB_CONTENTS = "data-syntax-tab-contents";
})(Constants || (Constants = {}));

var Is;

(e => {
    function t(e) {
        return e !== null && e !== void 0 && e.toString() !== "";
    }
    e.defined = t;
    function n(e) {
        return t(e) && typeof e === "object";
    }
    e.definedObject = n;
    function o(e) {
        return t(e) && typeof e === "boolean";
    }
    e.definedBoolean = o;
    function i(e) {
        return t(e) && typeof e === "string";
    }
    e.definedString = i;
    function r(e) {
        return t(e) && typeof e === "function";
    }
    e.definedFunction = r;
    function a(e) {
        return t(e) && typeof e === "number";
    }
    e.definedNumber = a;
    function s(e) {
        return n(e) && e instanceof Array;
    }
    e.definedArray = s;
})(Is || (Is = {}));

var Data;

(e => {
    let t;
    (e => {
        function t() {
            const e = [];
            for (let t = 0; t < 32; t++) {
                if (t === 8 || t === 12 || t === 16 || t === 20) {
                    e.push("-");
                }
                const n = Math.floor(Math.random() * 16).toString(16);
                e.push(n);
            }
            return e.join("");
        }
        e.newGuid = t;
        function n(e, t) {
            let n = e;
            while (n.length < t) {
                n = "0" + n;
            }
            return n;
        }
        e.padNumber = n;
        function o(e) {
            e = e.replace(/</g, "&lt;");
            e = e.replace(/>/g, "&gt;");
            return e;
        }
        e.encodeMarkUpCharacters = o;
        function i(e) {
            e.sort((function(e, t) {
                return t.length - e.length;
            }));
        }
        e.sortArrayOfStringByLength = i;
    })(t = e.String || (e.String = {}));
    function n(e, t) {
        return typeof e === "string" ? e : t;
    }
    e.getDefaultAnyString = n;
    function o(e, t) {
        return Is.definedString(e) ? e : t;
    }
    e.getDefaultString = o;
    function i(e, t) {
        return Is.definedBoolean(e) ? e : t;
    }
    e.getDefaultBoolean = i;
    function r(e, t) {
        return Is.definedNumber(e) ? e : t;
    }
    e.getDefaultNumber = r;
    function a(e, t) {
        return Is.definedFunction(e) ? e : t;
    }
    e.getDefaultFunction = a;
    function s(e, t) {
        return Is.definedArray(e) ? e : t;
    }
    e.getDefaultArray = s;
    function l(e, t) {
        return Is.definedObject(e) ? e : t;
    }
    e.getDefaultObject = l;
    function c(e, t) {
        let n = t;
        if (Is.definedString(e)) {
            const o = e.toString().split(" ");
            if (o.length === 0) {
                e = t;
            } else {
                n = o;
            }
        } else {
            n = s(e, t);
        }
        return n;
    }
    e.getDefaultStringOrArray = c;
    function u(e) {
        const t = JSON.stringify(e);
        const n = JSON.parse(t);
        return n;
    }
    e.getClonedObject = u;
})(Data || (Data = {}));

var DomElement;

(e => {
    function t(e, t = "") {
        const n = e.toLowerCase();
        const o = n === "text";
        let i = o ? document.createTextNode("") : document.createElement(n);
        if (Is.defined(t)) {
            i.className = t;
        }
        return i;
    }
    e.create = t;
    function n(e, n, o) {
        if (!o.allowHtmlInTextDisplay) {
            const o = t("div");
            o.innerHTML = n;
            e.innerText = o.innerText;
        } else {
            e.innerHTML = n;
        }
    }
    e.setNodeText = n;
    function o(e) {
        var t = document.createRange();
        t.selectNode(e);
        window.getSelection().removeAllRanges();
        window.getSelection().addRange(t);
    }
    e.selectTextInElement = o;
})(DomElement || (DomElement = {}));

(() => {
    let _configuration = {};
    let _aliases_Rules = {};
    let _elements = [];
    let _elements_Original = {};
    let _cached_Keywords = {};
    let _cached_Keywords_Count = 0;
    let _cached_Values = {};
    let _cached_Values_Count = 0;
    let _cached_Attributes = {};
    let _cached_Attributes_Count = 0;
    let _cached_Strings = {};
    let _cached_Strings_Count = 0;
    let _cached_Comments = {};
    let _cached_Comments_Count = 0;
    let _languages = {};
    function render() {
        const e = _configuration.highlightAllDomElementTypes;
        const t = e.length;
        for (let n = 0; n < t; n++) {
            const t = document.getElementsByTagName(e[n]);
            const o = [].slice.call(t);
            const i = o.length;
            if (i > 0) {
                fireCustomTriggerEvent(_configuration.events.onBeforeRender);
            }
            for (let e = 0; e < i; e++) {
                const t = o[e];
                let n = false;
                if (t.hasAttribute(Constants.SYNTAX_JS_ATTRIBUTE_NAME_LANGUAGE) && t.getAttribute(Constants.SYNTAX_JS_ATTRIBUTE_NAME_LANGUAGE).toLowerCase() === "tabbed") {
                    const e = [].slice.call(t.children);
                    const o = e.length;
                    const i = [];
                    const r = [];
                    t.removeAttribute(Constants.SYNTAX_JS_ATTRIBUTE_NAME_LANGUAGE);
                    t.className = t.className === "" ? "syntax-highlight" : t.className + " syntax-highlight";
                    t.innerHTML = "";
                    const a = DomElement.create("div", "code custom-scroll-bars");
                    t.appendChild(a);
                    const s = DomElement.create("div", "tabs");
                    a.appendChild(s);
                    for (let t = 0; t < o; t++) {
                        const o = renderElement(e[t], a);
                        if (!o.rendered) {
                            n = true;
                        } else {
                            renderTab(s, i, r, o, t, o.tabBindingOptions, o.syntaxLanguage);
                        }
                    }
                } else {
                    if (!renderElement(t).rendered) {
                        n = true;
                    }
                }
                if (n) {
                    break;
                }
            }
            if (i > 0) {
                fireCustomTriggerEvent(_configuration.events.onAfterRender);
            }
        }
    }
    function renderTab(e, t, n, o, i, r, a) {
        const s = DomElement.create("button", "tab");
        e.appendChild(s);
        DomElement.setNodeText(s, o.tabTitle, _configuration);
        t.push(s);
        n.push(o.tabContents);
        s.onclick = function() {
            if (s.className !== "tab-active") {
                const e = t.length;
                const i = n.length;
                for (let n = 0; n < e; n++) {
                    t[n].className = "tab";
                }
                for (let e = 0; e < i; e++) {
                    n[e].style.display = "none";
                }
                s.className = "tab-active";
                o.tabContents.style.display = "flex";
                if (Is.definedObject(r)) {
                    fireCustomTriggerEvent(r.events.onOpen, a);
                }
            }
        };
        if (i > 0) {
            o.tabContents.style.display = "none";
        } else {
            s.className = "tab-active";
        }
    }
    function renderElement(e, t = null) {
        const n = {};
        n.rendered = true;
        if (Is.defined(e) && e.hasAttribute(Constants.SYNTAX_JS_ATTRIBUTE_NAME_LANGUAGE) && (!e.hasAttribute(Constants.SYNTAX_JS_ATTRIBUTE_NAME_TAB_CONTENTS) || Is.defined(t))) {
            n.syntaxLanguage = e.getAttribute(Constants.SYNTAX_JS_ATTRIBUTE_NAME_LANGUAGE);
            if (Is.definedString(n.syntaxLanguage)) {
                const o = getLanguage(n.syntaxLanguage);
                if (Is.defined(o) || n.syntaxLanguage.toLowerCase() === "unknown") {
                    const i = getObjectFromString(e.getAttribute(Constants.SYNTAX_JS_ATTRIBUTE_NAME_OPTIONS));
                    const r = getObjectFromString(e.getAttribute(Constants.SYNTAX_JS_ATTRIBUTE_NAME_BUTTONS));
                    if (i.parsed) {
                        if (e.innerHTML.trim() !== "") {
                            let a = e.innerHTML;
                            const s = getBindingOptions(i.object);
                            let l = false;
                            let c = null;
                            fireCustomTriggerEvent(s.events.onBeforeRenderComplete, e);
                            if (e.children.length > 0 && e.children[0].nodeName.toLowerCase() === "pre") {
                                a = e.children[0].innerHTML;
                                l = true;
                            }
                            const u = a.trim();
                            let d = null;
                            let g = null;
                            let f = e.id;
                            if (!Is.definedString(f)) {
                                f = Data.String.newGuid();
                            }
                            _elements_Original[f] = e.innerHTML;
                            e.removeAttribute(Constants.SYNTAX_JS_ATTRIBUTE_NAME_LANGUAGE);
                            e.removeAttribute(Constants.SYNTAX_JS_ATTRIBUTE_NAME_OPTIONS);
                            e.id = f;
                            if (!Is.defined(t)) {
                                e.className = e.className === "" ? "syntax-highlight" : e.className + " syntax-highlight";
                                e.innerHTML = "";
                                t = DomElement.create("div", "code custom-scroll-bars");
                                e.appendChild(t);
                            } else {
                                if (e.hasAttribute(Constants.SYNTAX_JS_ATTRIBUTE_NAME_TAB_CONTENTS) && e.getAttribute(Constants.SYNTAX_JS_ATTRIBUTE_NAME_TAB_CONTENTS).toLowerCase() !== "true") {
                                    const t = getObjectFromString(e.getAttribute(Constants.SYNTAX_JS_ATTRIBUTE_NAME_TAB_CONTENTS));
                                    if (t.parsed && Is.definedObject(t.object)) {
                                        n.tabBindingOptions = getBindingTabContentOptions(t.object);
                                        c = n.tabBindingOptions.description;
                                        if (Is.definedString(n.tabBindingOptions.title)) {
                                            n.tabTitle = n.tabBindingOptions.title;
                                        }
                                    }
                                } else {
                                    n.tabTitle = getFriendlyLanguageName(n.syntaxLanguage);
                                }
                            }
                            n.tabContents = DomElement.create("div", "tab-contents");
                            t.appendChild(n.tabContents);
                            if (Is.definedString(c)) {
                                g = DomElement.create("div", "description");
                                n.tabContents.appendChild(g);
                                DomElement.setNodeText(g, c, _configuration);
                            }
                            if (s.showLineNumbers) {
                                d = DomElement.create("div", "numbers");
                                n.tabContents.appendChild(d);
                            }
                            const m = DomElement.create("div", "syntax");
                            n.tabContents.appendChild(m);
                            renderElementButtons(m, s, n.syntaxLanguage, r, u);
                            if (n.syntaxLanguage.toLowerCase() !== "unknown") {
                                a = renderHTML(a, o, s);
                            } else {
                                a = Data.String.encodeMarkUpCharacters(a);
                            }
                            renderElementCompletedHTML(e, g, d, m, a, s, l);
                            fireCustomTriggerEvent(s.events.onRenderComplete, e);
                            _elements.push(e);
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
                            n.rendered = logError(_configuration.text.noCodeAvailableToRenderErrorText);
                        }
                    } else {
                        n.rendered = !_configuration.safeMode;
                    }
                } else {
                    n.rendered = logError(_configuration.text.languageNotSupportedErrorText.replace("{{language}}", n.syntaxLanguage));
                }
            } else {
                n.rendered = logError(_configuration.text.attributeNotSetErrorText.replace("{{attribute_name}}", Constants.SYNTAX_JS_ATTRIBUTE_NAME_LANGUAGE));
            }
        }
        return n;
    }
    function renderHTML(e, t, n) {
        if (!t.isMarkUp) {
            e = Data.String.encodeMarkUpCharacters(e);
        }
        if (n.highlightComments) {
            e = renderElementMultiLineCommentVariables(e, t, n);
            e = renderElementCommentVariables(e, t, n);
        }
        if (n.highlightStrings) {
            e = renderElementStringPatternVariables(e, e.match(/"((?:\\.|[^"\\])*)"/g), n);
            if (t.comment !== "'") {
                e = renderElementStringPatternVariables(e, e.match(/'((?:\\.|[^"\\])*)'/g), n);
            }
        }
        if (!t.isMarkUp) {
            e = renderElementKeywords(e, t, n);
        } else {
            e = replaceMarkUpKeywords(e, t, n);
        }
        e = renderElementValues(e, t, n);
        if (t.isMarkUp) {
            e = renderElementAttributes(e, t, n);
        }
        e = Data.String.encodeMarkUpCharacters(e);
        if (n.highlightComments) {
            e = renderElementCommentsFromVariables(e, t);
        }
        if (n.highlightStrings) {
            e = renderElementStringQuotesFromVariables(e);
        }
        e = renderElementVariables(e, _cached_Keywords);
        e = renderElementVariables(e, _cached_Values);
        if (t.isMarkUp) {
            e = renderElementVariables(e, _cached_Attributes);
        }
        return e;
    }
    function renderElementButtons(e, t, n, o, i) {
        if (t.showLanguageLabel || t.showCopyButton || t.showPrintButton || o.parsed) {
            const r = DomElement.create("div", "buttons");
            const a = [];
            e.appendChild(r);
            if (o.parsed && Is.definedArray(o.object)) {
                const e = o.object;
                const n = e.length;
                for (let o = 0; o < n; o++) {
                    const n = e[o];
                    if (Is.defined(n.text) && Is.definedFunction(n.onClick)) {
                        renderElementButton(n, a, r, i, t);
                    }
                }
            }
            if (t.showCopyButton) {
                const e = DomElement.create("button", "button");
                e.style.display = t.buttonsVisible ? "inline-block" : "none";
                r.appendChild(e);
                DomElement.setNodeText(e, _configuration.text.copyButtonText, _configuration);
                e.onclick = function() {
                    navigator.clipboard.writeText(i);
                    fireCustomTriggerEvent(t.events.onCopy, i);
                };
                a.push(e);
            }
            if (t.showPrintButton) {
                const o = DomElement.create("button", "button");
                o.style.display = t.buttonsVisible ? "inline-block" : "none";
                r.appendChild(o);
                DomElement.setNodeText(o, _configuration.text.printButtonText, _configuration);
                o.onclick = function() {
                    const o = window.open("", "PRINT", "height=400,width=600");
                    const i = e.cloneNode(true);
                    const r = DomElement.create("div");
                    i.removeChild(i.children[0]);
                    r.innerHTML = getFriendlyLanguageName(n);
                    o.document.write("<html>");
                    o.document.write("<head>");
                    o.document.write("<title>");
                    o.document.write(r.innerHTML);
                    o.document.write("</title>");
                    o.document.write("</head>");
                    o.document.write("<body>");
                    o.document.write("<code>");
                    o.document.write("<pre>");
                    o.document.write(i.innerHTML);
                    o.document.write("</pre>");
                    o.document.write("</code>");
                    o.document.write("</body>");
                    o.document.write("</html>");
                    o.document.close();
                    o.focus();
                    o.print();
                    o.close();
                    fireCustomTriggerEvent(t.events.onPrint, i.innerHTML);
                };
                a.push(o);
            }
            if (t.showLanguageLabel) {
                const e = DomElement.create("div", "language-label");
                r.appendChild(e);
                DomElement.setNodeText(e, getFriendlyLanguageName(n, t.languageLabelCasing), _configuration);
            }
            const s = a.length;
            if (s > t.maximumButtons) {
                const e = DomElement.create("button", "button button-opener");
                e.innerText = t.buttonsVisible ? _configuration.text.buttonsCloserText : _configuration.text.buttonsOpenerText;
                r.insertBefore(e, r.children[0]);
                e.onclick = function() {
                    const n = e.innerText === _configuration.text.buttonsCloserText;
                    for (let e = 0; e < s; e++) {
                        a[e].style.display = n ? "none" : "inline-block";
                    }
                    e.innerText = n ? _configuration.text.buttonsOpenerText : _configuration.text.buttonsCloserText;
                    if (n) {
                        fireCustomTriggerEvent(t.events.onButtonsClosed);
                    } else {
                        fireCustomTriggerEvent(t.events.onButtonsOpened);
                    }
                };
            } else if (!t.buttonsVisible && s <= t.maximumButtons) {
                for (let e = 0; e < s; e++) {
                    a[e].style.display = "inline-block";
                }
            }
        }
    }
    function renderElementButton(e, t, n, o, i) {
        const r = DomElement.create("button", "button");
        r.style.display = i.buttonsVisible ? "inline-block" : "none";
        n.appendChild(r);
        DomElement.setNodeText(r, e.text, _configuration);
        r.onclick = function() {
            e.onClick(o);
        };
        if (Is.defined(e.className)) {
            r.className += " " + e.className;
        }
        t.push(r);
    }
    function renderElementCommentVariables(e, t, n) {
        const o = t.comment;
        if (Is.definedString(o)) {
            const t = e.match(new RegExp(o + ".*", "g"));
            if (t !== null) {
                const o = t.length;
                for (let i = 0; i < o; i++) {
                    const o = t[i];
                    const r = "$C{" + _cached_Comments_Count.toString() + "}";
                    _cached_Comments[r] = '<span class="comment">' + o + "</span>";
                    _cached_Comments_Count++;
                    e = e.replace(o, r);
                    fireCustomTriggerEvent(n.events.onCommentRender, o);
                }
            }
        }
        return e;
    }
    function renderElementMultiLineCommentVariables(e, t, n) {
        const o = t.multiLineComment;
        if (Is.definedArray(o) && o.length === 2) {
            let t = 0;
            let r = 0;
            while (t >= 0 && r >= 0) {
                t = e.indexOf(o[0], r);
                if (t > -1) {
                    r = e.indexOf(o[1], t + o[0].length);
                    if (r > -1) {
                        const a = e.substring(t, r + o[1].length);
                        const s = a.split("\n");
                        const l = s.length;
                        const c = l === 1 ? "comment" : "multi-line-comment";
                        for (var i = 0; i < l; i++) {
                            const t = "$C{" + _cached_Comments_Count.toString() + "}";
                            const n = s[i];
                            _cached_Comments[t] = '<span class="' + c + '">' + n + "</span>";
                            _cached_Comments_Count++;
                            e = e.replace(n, t);
                        }
                        fireCustomTriggerEvent(n.events.onCommentRender, a);
                    }
                }
            }
        }
        return e;
    }
    function renderElementStringPatternVariables(e, t, n) {
        if (t !== null) {
            const o = t.length;
            for (let i = 0; i < o; i++) {
                const o = t[i];
                const r = o.split("\n");
                const a = r.length;
                const s = a === 1 ? "string" : "multi-line-string";
                for (let t = 0; t < a; t++) {
                    const n = r[t];
                    const o = "$S{" + _cached_Strings_Count.toString() + "}";
                    _cached_Strings[o] = '<span class="' + s + '">' + n + "</span>";
                    _cached_Strings_Count++;
                    e = e.replace(n, o);
                }
                fireCustomTriggerEvent(n.events.onStringRender, o);
            }
        }
        return e;
    }
    function renderElementKeywords(e, t, n) {
        const o = Data.getDefaultStringOrArray(t.keywords, []);
        const i = o.length;
        const r = t.caseSensitive;
        const a = getKeywordCasing(t.keywordsCasing);
        Data.String.sortArrayOfStringByLength(o);
        for (let s = 0; s < i; s++) {
            const i = o[s];
            const l = getDisplayTextTestCasing(i, a);
            const c = "KW" + _cached_Keywords_Count.toString() + ";";
            let u = null;
            const d = r ? "g" : "gi";
            const g = new RegExp(getWordRegEx(i, t), d);
            if (n.highlightKeywords) {
                if (Is.definedFunction(n.events.onKeywordClicked)) {
                    u = '<span class="keyword-clickable">' + l + "</span>";
                    e = e.replace(g, c);
                } else {
                    u = '<span class="keyword">' + l + "</span>";
                    e = e.replace(g, c);
                }
            } else {
                if (Is.definedFunction(n.events.onKeywordClicked)) {
                    u = '<span class="no-highlight-keyword-clickable">' + l + "</span>";
                    e = e.replace(g, c);
                }
            }
            _cached_Keywords[c] = u;
            _cached_Keywords_Count++;
            fireCustomTriggerEvent(n.events.onKeywordRender, i);
        }
        return e;
    }
    function replaceMarkUpKeywords(e, t, n) {
        const o = Data.getDefaultStringOrArray(t.keywords, []);
        const i = t.caseSensitive;
        const r = getKeywordCasing(t.keywordsCasing);
        const a = /(<([^>]+)>)/gi;
        const s = i ? "g" : "gi";
        let l = a.exec(e);
        while (l) {
            if (l.index === a.lastIndex) {
                a.lastIndex++;
            }
            let i = l[0];
            i = i.replace("</", "").replace("<", "").replace(">", "");
            i = i.split(" ")[0];
            if (o.indexOf(i) > -1) {
                const o = "KW" + _cached_Keywords_Count.toString() + ";";
                const a = new RegExp(getWordRegEx(i, t), s);
                let l = null;
                let c = getDisplayTextTestCasing(i, r);
                if (n.highlightKeywords) {
                    if (Is.definedFunction(n.events.onKeywordClicked)) {
                        l = '<span class="keyword-clickable">' + c + "</span>";
                    } else {
                        l = '<span class="keyword">' + c + "</span>";
                    }
                } else {
                    if (Is.definedFunction(n.events.onKeywordClicked)) {
                        l = '<span class="no-highlight-keyword-clickable">' + c + "</span>";
                    }
                }
                e = e.replace(a, o);
                _cached_Keywords[o] = l;
                _cached_Keywords_Count++;
            }
            l = a.exec(e);
        }
        return e;
    }
    function renderElementValues(e, t, n) {
        const o = Data.getDefaultStringOrArray(t.values, []);
        const i = o.length;
        const r = t.caseSensitive;
        Data.String.sortArrayOfStringByLength(o);
        for (let a = 0; a < i; a++) {
            const i = o[a];
            const s = "VAL" + _cached_Values_Count.toString() + ";";
            let l = null;
            const c = r ? "g" : "gi";
            const u = new RegExp(getWordRegEx(i, t), c);
            if (n.highlightValues) {
                if (Is.definedFunction(n.events.onValueClicked)) {
                    l = '<span class="value-clickable">' + i + "</span>";
                    e = e.replace(u, s);
                } else {
                    l = '<span class="value">' + i + "</span>";
                    e = e.replace(u, s);
                }
            } else {
                if (Is.definedFunction(n.events.onValueClicked)) {
                    l = '<span class="no-highlight-value-clickable">' + i + "</span>";
                    e = e.replace(u, s);
                }
            }
            _cached_Values[s] = l;
            _cached_Values_Count++;
            fireCustomTriggerEvent(n.events.onValueRender, i);
        }
        return e;
    }
    function renderElementAttributes(e, t, n) {
        const o = Data.getDefaultStringOrArray(t.attributes, []);
        const i = o.length;
        const r = t.caseSensitive;
        Data.String.sortArrayOfStringByLength(o);
        for (let a = 0; a < i; a++) {
            const i = o[a];
            const s = "ATTR" + _cached_Attributes_Count.toString() + ";";
            let l = null;
            let c = r ? "g" : "gi";
            const u = new RegExp(getWordRegEx(i, t), c);
            if (n.highlightAttributes) {
                if (Is.definedFunction(n.events.onAttributeClicked)) {
                    l = '<span class="attribute-clickable">' + i + "</span>";
                    e = e.replace(u, s);
                } else {
                    l = '<span class="attribute">' + i + "</span>";
                    e = e.replace(u, s);
                }
            } else {
                if (Is.definedFunction(n.events.onAttributeClicked)) {
                    l = '<span class="no-highlight-attribute-clickable">' + i + "</span>";
                    e = e.replace(u, s);
                }
            }
            _cached_Attributes[s] = l;
            _cached_Attributes_Count++;
            fireCustomTriggerEvent(n.events.onAttributeRender, i);
        }
        return e;
    }
    function renderElementStringQuotesFromVariables(e) {
        for (let t in _cached_Strings) {
            if (_cached_Strings.hasOwnProperty(t)) {
                e = e.replace(t, _cached_Strings[t]);
            }
        }
        return e;
    }
    function renderElementCommentsFromVariables(e, t) {
        const n = t.multiLineComment;
        let o = null;
        let i = null;
        if (Is.definedArray(n) && n.length === 2) {
            o = Data.String.encodeMarkUpCharacters(n[0]);
            i = Data.String.encodeMarkUpCharacters(n[1]);
        }
        for (let r in _cached_Comments) {
            if (_cached_Comments.hasOwnProperty(r)) {
                let a = _cached_Comments[r];
                if (t.isMarkUp && Is.definedString(o) && Is.definedString(i)) {
                    a = a.replace(n[0], o);
                    a = a.replace(n[1], i);
                }
                e = e.replace(r, a);
            }
        }
        return e;
    }
    function renderElementVariables(e, t) {
        for (let n in t) {
            if (t.hasOwnProperty(n)) {
                const o = new RegExp(n, "g");
                e = e.replace(o, t[n]);
            }
        }
        return e;
    }
    function renderElementCompletedHTML(e, t, n, o, i, r, a) {
        const s = i.split("\n");
        const l = s.length;
        const c = l.toString().length;
        let u = n;
        let d = o;
        let g = null;
        let f = 1;
        let m = false;
        if (a) {
            d = DomElement.create("pre");
            o.appendChild(d);
            if (Is.defined(n)) {
                u = DomElement.create("pre");
                n.appendChild(u);
            }
        }
        if (r.doubleClickToSelectAll) {
            if (Is.defined(t)) {
                t.ondblclick = function() {
                    DomElement.selectTextInElement(d);
                };
            }
            if (Is.defined(n)) {
                n.ondblclick = function() {
                    DomElement.selectTextInElement(d);
                };
            }
            o.ondblclick = function() {
                DomElement.selectTextInElement(d);
            };
        }
        for (let e = 0; e < l; e++) {
            let t = s[e];
            if (t.trim() !== "" && g === null) {
                g = t.substring(0, t.match(/^\s*/)[0].length);
            }
            if (e !== 0 && e !== l - 1 || t.trim() !== "") {
                if (t.trim() !== "" || !r.removeBlankLines) {
                    const e = t.trim() === "";
                    if (e && !m || !r.removeDuplicateBlankLines || !e) {
                        m = e;
                        if (Is.defined(u)) {
                            const e = DomElement.create("p");
                            if (r.padLineNumbers) {
                                e.innerText = Data.String.padNumber(f.toString(), c);
                            } else {
                                e.innerText = f.toString();
                            }
                            u.appendChild(e);
                            f++;
                        }
                        if (g !== null) {
                            t = t.replace(g, "");
                            if (!a) {
                                const e = t.match(/^\s*/)[0].length;
                                const n = t.substring(0, e);
                                const o = Array(e).join("&nbsp;");
                                t = t.replace(n, o);
                            }
                        }
                        const n = DomElement.create("p");
                        n.innerHTML = t.trim() === "" ? "<br>" : t;
                        d.appendChild(n);
                    }
                }
            }
        }
        renderElementClickEvents(e, r.events.onKeywordClicked, "keyword-clickable");
        renderElementClickEvents(e, r.events.onValueClicked, "value-clickable");
    }
    function renderElementClickEvents(e, t, n) {
        if (Is.definedFunction(t)) {
            const e = document.getElementsByTagName(n);
            const o = [].slice.call(e);
            const i = o.length;
            for (let e = 0; e < i; e++) {
                renderElementClickEvent(o[e], t);
            }
        }
    }
    function renderElementClickEvent(e, t) {
        const n = e.innerText;
        e.onclick = function() {
            t(n);
        };
    }
    function getFriendlyLanguageName(e, t = null) {
        let n = null;
        const o = getLanguage(e);
        if (Is.defined(o) && Is.definedString(o.friendlyName)) {
            n = o.friendlyName;
        } else {
            n = e;
        }
        n = getDisplayTextTestCasing(n, t);
        return n;
    }
    function getLanguage(e) {
        let t = null;
        let n = e.toLowerCase();
        if (_languages.hasOwnProperty(n)) {
            t = _languages[n];
        } else {
            if (_aliases_Rules.hasOwnProperty(n)) {
                n = _aliases_Rules[n];
                if (_languages.hasOwnProperty(n)) {
                    t = _languages[n];
                }
            }
        }
        return t;
    }
    function getKeywordCasing(e) {
        if (Is.definedString(e)) {
            e = e.toLowerCase().trim();
        }
        return e;
    }
    function getDisplayTextTestCasing(e, t) {
        if (t === "uppercase") {
            e = e.toUpperCase();
        } else if (t === "lowercase") {
            e = e.toLowerCase();
        }
        return e;
    }
    function getWordRegEx(e, t) {
        let n = "(?<=^|[^-])\\b" + e + "\\b(?=[^-]|$)";
        if (Is.definedString(t.wordRegEx)) {
            n = t.wordRegEx.replace("%word%", e);
        }
        return n;
    }
    function getBindingOptions(e) {
        let t = Data.getDefaultObject(e, {});
        t = buildBindingAttributeOptions(t);
        t = buildBindingAttributeOptionCustomTriggers(t);
        return t;
    }
    function buildBindingAttributeOptions(e) {
        e.showCopyButton = Data.getDefaultBoolean(e.showCopyButton, true);
        e.removeBlankLines = Data.getDefaultBoolean(e.removeBlankLines, false);
        e.showLineNumbers = Data.getDefaultBoolean(e.showLineNumbers, true);
        e.highlightKeywords = Data.getDefaultBoolean(e.highlightKeywords, true);
        e.highlightValues = Data.getDefaultBoolean(e.highlightValues, true);
        e.highlightAttributes = Data.getDefaultBoolean(e.highlightAttributes, true);
        e.highlightStrings = Data.getDefaultBoolean(e.highlightStrings, true);
        e.highlightComments = Data.getDefaultBoolean(e.highlightComments, true);
        e.showLanguageLabel = Data.getDefaultBoolean(e.showLanguageLabel, true);
        e.showPrintButton = Data.getDefaultBoolean(e.showPrintButton, true);
        e.padLineNumbers = Data.getDefaultBoolean(e.padLineNumbers, false);
        e.removeDuplicateBlankLines = Data.getDefaultBoolean(e.removeDuplicateBlankLines, true);
        e.doubleClickToSelectAll = Data.getDefaultBoolean(e.doubleClickToSelectAll, true);
        e.languageLabelCasing = Data.getDefaultString(e.languageLabelCasing, "uppercase");
        e.buttonsVisible = Data.getDefaultBoolean(e.buttonsVisible, true);
        e.maximumButtons = Data.getDefaultNumber(e.maximumButtons, 2);
        return e;
    }
    function buildBindingAttributeOptionCustomTriggers(e) {
        e.events.onCopy = Data.getDefaultFunction(e.events.onCopy, null);
        e.events.onRenderComplete = Data.getDefaultFunction(e.events.onRenderComplete, null);
        e.events.onKeywordClicked = Data.getDefaultFunction(e.events.onKeywordClicked, null);
        e.events.onValueClicked = Data.getDefaultFunction(e.events.onValueClicked, null);
        e.events.onAttributeClicked = Data.getDefaultFunction(e.events.onAttributeClicked, null);
        e.events.onKeywordRender = Data.getDefaultFunction(e.events.onKeywordRender, null);
        e.events.onValueRender = Data.getDefaultFunction(e.events.onValueRender, null);
        e.events.onAttributeRender = Data.getDefaultFunction(e.events.onAttributeRender, null);
        e.events.onStringRender = Data.getDefaultFunction(e.events.onStringRender, null);
        e.events.onCommentRender = Data.getDefaultFunction(e.events.onCommentRender, null);
        e.events.onPrint = Data.getDefaultFunction(e.events.onPrint, null);
        e.events.onBeforeRenderComplete = Data.getDefaultFunction(e.events.onBeforeRenderComplete, null);
        e.events.onButtonsOpened = Data.getDefaultFunction(e.events.onButtonsOpened, null);
        e.events.onButtonsClosed = Data.getDefaultFunction(e.events.onButtonsClosed, null);
        return e;
    }
    function getBindingTabContentOptions(e) {
        let t = Data.getDefaultObject(e, {});
        t = buildBindingTabContentAttributeOptionStrings(t);
        t = buildBindingTabContentAttributeOptionCustomTriggers(t);
        return t;
    }
    function buildBindingTabContentAttributeOptionStrings(e) {
        e.title = Data.getDefaultString(e.title, null);
        e.description = Data.getDefaultString(e.description, null);
        return e;
    }
    function buildBindingTabContentAttributeOptionCustomTriggers(e) {
        e.events = Data.getDefaultFunction(e.events, {});
        e.events.onOpen = Data.getDefaultFunction(e.events.onOpen, null);
        return e;
    }
    function fireCustomTriggerEvent(e, ...t) {
        if (Is.definedFunction(e)) {
            e.apply(null, [].slice.call(t, 0));
        }
    }
    function getObjectFromString(objectString) {
        const result = {
            parsed: true,
            object: null
        };
        try {
            if (Is.definedString(objectString)) {
                result.object = JSON.parse(objectString);
            }
        } catch (e1) {
            try {
                result.object = eval(`(${objectString})`);
                if (Is.definedFunction(result.object)) {
                    result.object = result.object();
                }
            } catch (e) {
                if (!_configuration.safeMode) {
                    logError(_configuration.text.objectErrorText.replace("{{error_1}}", e1.message).replace("{{error_2}}", e.message));
                    result.parsed = false;
                }
                result.object = null;
            }
        }
        return result;
    }
    function logError(e) {
        let t = true;
        if (!_configuration.safeMode) {
            console.error(e);
            t = false;
        }
        return t;
    }
    const _public = {
        highlightAll: function() {
            throw new Error("Function not implemented.");
        },
        highlightElement: function(e) {
            throw new Error("Function not implemented.");
        },
        getElementsHighlighted: function() {
            throw new Error("Function not implemented.");
        },
        getCode: function(e) {
            throw new Error("Function not implemented.");
        },
        destroyAll: function() {
            throw new Error("Function not implemented.");
        },
        destroy: function(e) {
            throw new Error("Function not implemented.");
        },
        addLanguage: function(e, t, n = true) {
            throw new Error("Function not implemented.");
        },
        removeLanguage: function(e) {
            throw new Error("Function not implemented.");
        },
        getLanguage: function(e) {
            throw new Error("Function not implemented.");
        },
        getLanguages: function() {
            throw new Error("Function not implemented.");
        },
        addAlias: function(e, t, n = true) {
            throw new Error("Function not implemented.");
        },
        removeAlias: function(e) {
            throw new Error("Function not implemented.");
        },
        getAlias: function(e) {
            throw new Error("Function not implemented.");
        },
        getAliases: function() {
            throw new Error("Function not implemented.");
        },
        setConfiguration: function(e) {
            throw new Error("Function not implemented.");
        },
        getVersion: function() {
            throw new Error("Function not implemented.");
        }
    };
    (() => {})();
})();//# sourceMappingURL=syntax.js.map