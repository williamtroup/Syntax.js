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
    function i(e) {
        return t(e) && typeof e === "boolean";
    }
    e.definedBoolean = i;
    function o(e) {
        return t(e) && typeof e === "string";
    }
    e.definedString = o;
    function r(e) {
        return t(e) && typeof e === "function";
    }
    e.definedFunction = r;
    function a(e) {
        return t(e) && typeof e === "number";
    }
    e.definedNumber = a;
    function l(e) {
        return n(e) && e instanceof Array;
    }
    e.definedArray = l;
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
                n = `0${n}`;
            }
            return n;
        }
        e.padNumber = n;
        function i(e) {
            e = e.replace(/</g, "&lt;");
            e = e.replace(/>/g, "&gt;");
            return e;
        }
        e.encodeMarkUpCharacters = i;
        function o(e) {
            e.sort((function(e, t) {
                return t.length - e.length;
            }));
        }
        e.sortArrayOfStringByLength = o;
    })(t = e.String || (e.String = {}));
    function n(e, t) {
        return typeof e === "string" ? e : t;
    }
    e.getDefaultAnyString = n;
    function i(e, t) {
        return Is.definedString(e) ? e : t;
    }
    e.getDefaultString = i;
    function o(e, t) {
        return Is.definedBoolean(e) ? e : t;
    }
    e.getDefaultBoolean = o;
    function r(e, t) {
        return Is.definedNumber(e) ? e : t;
    }
    e.getDefaultNumber = r;
    function a(e, t) {
        return Is.definedFunction(e) ? e : t;
    }
    e.getDefaultFunction = a;
    function l(e, t) {
        return Is.definedArray(e) ? e : t;
    }
    e.getDefaultArray = l;
    function s(e, t) {
        return Is.definedObject(e) ? e : t;
    }
    e.getDefaultObject = s;
    function u(e, t) {
        let n = t;
        if (Is.definedString(e)) {
            const i = e.toString().split(" ");
            if (i.length === 0) {
                e = t;
            } else {
                n = i;
            }
        } else {
            n = l(e, t);
        }
        return n;
    }
    e.getDefaultStringOrArray = u;
    function c(e) {
        const t = JSON.stringify(e);
        const n = JSON.parse(t);
        return n;
    }
    e.getClonedObject = c;
})(Data || (Data = {}));

var DomElement;

(e => {
    function t(e, t = "") {
        const n = e.toLowerCase();
        const i = n === "text";
        let o = i ? document.createTextNode("") : document.createElement(n);
        if (Is.defined(t)) {
            o.className = t;
        }
        return o;
    }
    e.create = t;
    function n(e, n, i) {
        if (!i.allowHtmlInTextDisplay) {
            const i = t("div");
            i.innerHTML = n;
            e.innerText = i.innerText;
        } else {
            e.innerHTML = n;
        }
    }
    e.setNodeText = n;
    function i(e) {
        var t = document.createRange();
        t.selectNode(e);
        window.getSelection().removeAllRanges();
        window.getSelection().addRange(t);
    }
    e.selectTextInElement = i;
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
            const i = [].slice.call(t);
            const o = i.length;
            if (o > 0) {
                fireCustomTriggerEvent(_configuration.events.onBeforeRender);
            }
            for (let e = 0; e < o; e++) {
                const t = i[e];
                let n = false;
                if (t.hasAttribute(Constants.SYNTAX_JS_ATTRIBUTE_NAME_LANGUAGE) && t.getAttribute(Constants.SYNTAX_JS_ATTRIBUTE_NAME_LANGUAGE).toLowerCase() === "tabbed") {
                    const e = [].slice.call(t.children);
                    const i = e.length;
                    const o = [];
                    const r = [];
                    t.removeAttribute(Constants.SYNTAX_JS_ATTRIBUTE_NAME_LANGUAGE);
                    t.className = t.className === "" ? "syntax-highlight" : `${t.className} syntax-highlight`;
                    t.innerHTML = "";
                    const a = DomElement.create("div", "code custom-scroll-bars");
                    t.appendChild(a);
                    const l = DomElement.create("div", "tabs");
                    a.appendChild(l);
                    for (let t = 0; t < i; t++) {
                        const i = renderElement(e[t], a);
                        if (!i.rendered) {
                            n = true;
                        } else {
                            renderTab(l, o, r, i, t, i.tabBindingOptions, i.syntaxLanguage);
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
            if (o > 0) {
                fireCustomTriggerEvent(_configuration.events.onAfterRender);
            }
        }
    }
    function renderTab(e, t, n, i, o, r, a) {
        const l = DomElement.create("button", "tab");
        e.appendChild(l);
        DomElement.setNodeText(l, i.tabTitle, _configuration);
        t.push(l);
        n.push(i.tabContents);
        l.onclick = function() {
            if (l.className !== "tab-active") {
                const e = t.length;
                const o = n.length;
                for (let n = 0; n < e; n++) {
                    t[n].className = "tab";
                }
                for (let e = 0; e < o; e++) {
                    n[e].style.display = "none";
                }
                l.className = "tab-active";
                i.tabContents.style.display = "flex";
                if (Is.definedObject(r)) {
                    fireCustomTriggerEvent(r.events.onOpen, a);
                }
            }
        };
        if (o > 0) {
            i.tabContents.style.display = "none";
        } else {
            l.className = "tab-active";
        }
    }
    function renderElement(e, t = null) {
        const n = {};
        n.rendered = true;
        if (Is.defined(e) && e.hasAttribute(Constants.SYNTAX_JS_ATTRIBUTE_NAME_LANGUAGE) && (!e.hasAttribute(Constants.SYNTAX_JS_ATTRIBUTE_NAME_TAB_CONTENTS) || Is.defined(t))) {
            n.syntaxLanguage = e.getAttribute(Constants.SYNTAX_JS_ATTRIBUTE_NAME_LANGUAGE);
            if (Is.definedString(n.syntaxLanguage)) {
                const i = getLanguage(n.syntaxLanguage);
                if (Is.defined(i) || n.syntaxLanguage.toLowerCase() === "unknown") {
                    const o = getObjectFromString(e.getAttribute(Constants.SYNTAX_JS_ATTRIBUTE_NAME_OPTIONS));
                    const r = getObjectFromString(e.getAttribute(Constants.SYNTAX_JS_ATTRIBUTE_NAME_BUTTONS));
                    if (o.parsed) {
                        if (e.innerHTML.trim() !== "") {
                            let a = e.innerHTML;
                            const l = getBindingOptions(o.object);
                            let s = false;
                            let u = null;
                            fireCustomTriggerEvent(l.events.onBeforeRenderComplete, e);
                            if (e.children.length > 0 && e.children[0].nodeName.toLowerCase() === "pre") {
                                a = e.children[0].innerHTML;
                                s = true;
                            }
                            const c = a.trim();
                            let g = null;
                            let d = null;
                            let f = e.id;
                            if (!Is.definedString(f)) {
                                f = Data.String.newGuid();
                            }
                            _elements_Original[f] = e.innerHTML;
                            e.removeAttribute(Constants.SYNTAX_JS_ATTRIBUTE_NAME_LANGUAGE);
                            e.removeAttribute(Constants.SYNTAX_JS_ATTRIBUTE_NAME_OPTIONS);
                            e.id = f;
                            if (!Is.defined(t)) {
                                e.className = e.className === "" ? "syntax-highlight" : `${e.className} syntax-highlight`;
                                e.innerHTML = "";
                                t = DomElement.create("div", "code custom-scroll-bars");
                                e.appendChild(t);
                            } else {
                                if (e.hasAttribute(Constants.SYNTAX_JS_ATTRIBUTE_NAME_TAB_CONTENTS) && e.getAttribute(Constants.SYNTAX_JS_ATTRIBUTE_NAME_TAB_CONTENTS).toLowerCase() !== "true") {
                                    const t = getObjectFromString(e.getAttribute(Constants.SYNTAX_JS_ATTRIBUTE_NAME_TAB_CONTENTS));
                                    if (t.parsed && Is.definedObject(t.object)) {
                                        n.tabBindingOptions = getBindingTabContentOptions(t.object);
                                        u = n.tabBindingOptions.description;
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
                            if (Is.definedString(u)) {
                                d = DomElement.create("div", "description");
                                n.tabContents.appendChild(d);
                                DomElement.setNodeText(d, u, _configuration);
                            }
                            if (l.showLineNumbers) {
                                g = DomElement.create("div", "numbers");
                                n.tabContents.appendChild(g);
                            }
                            const m = DomElement.create("div", "syntax");
                            n.tabContents.appendChild(m);
                            renderElementButtons(m, l, n.syntaxLanguage, r, c);
                            if (n.syntaxLanguage.toLowerCase() !== "unknown") {
                                a = renderHTML(a, i, l);
                            } else {
                                a = Data.String.encodeMarkUpCharacters(a);
                            }
                            renderElementCompletedHTML(d, g, m, a, l, s);
                            fireCustomTriggerEvent(l.events.onRenderComplete, e);
                            if (!Is.defined(n.tabContents)) {
                                renderSyntaxCustomTriggers(e, l);
                            } else {
                                renderSyntaxCustomTriggers(n.tabContents, l);
                            }
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
    function renderSyntaxCustomTriggers(e, t) {
        renderElementClickEvents(e, t.events.onKeywordClicked, "keyword-clickable");
        renderElementClickEvents(e, t.events.onKeywordClicked, "no-highlight-keyword-clickable");
        renderElementClickEvents(e, t.events.onValueClicked, "value-clickable");
        renderElementClickEvents(e, t.events.onValueClicked, "no-highlight-value-clickable");
        renderElementClickEvents(e, t.events.onAttributeClicked, "attribute-clickable");
        renderElementClickEvents(e, t.events.onAttributeClicked, "no-highlight-attribute-clickable");
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
    function renderElementButtons(e, t, n, i, o) {
        if (t.showLanguageLabel || t.showCopyButton || t.showPrintButton || i.parsed) {
            const r = DomElement.create("div", "buttons");
            const a = [];
            e.appendChild(r);
            if (i.parsed && Is.definedArray(i.object)) {
                const e = i.object;
                const n = e.length;
                for (let i = 0; i < n; i++) {
                    const n = e[i];
                    if (Is.defined(n.text) && Is.definedFunction(n.events.onClick)) {
                        renderElementButton(n, a, r, o, t);
                    }
                }
            }
            if (t.showCopyButton) {
                const e = DomElement.create("button", "button");
                e.style.display = t.buttonsVisible ? "inline-block" : "none";
                r.appendChild(e);
                DomElement.setNodeText(e, _configuration.text.copyButtonText, _configuration);
                e.onclick = function() {
                    navigator.clipboard.writeText(o);
                    fireCustomTriggerEvent(t.events.onCopy, o);
                };
                a.push(e);
            }
            if (t.showPrintButton) {
                const i = DomElement.create("button", "button");
                i.style.display = t.buttonsVisible ? "inline-block" : "none";
                r.appendChild(i);
                DomElement.setNodeText(i, _configuration.text.printButtonText, _configuration);
                i.onclick = function() {
                    const i = window.open("", "PRINT", "height=400,width=600");
                    const o = e.cloneNode(true);
                    const r = DomElement.create("div");
                    o.removeChild(o.children[0]);
                    r.innerHTML = getFriendlyLanguageName(n);
                    i.document.write("<html>");
                    i.document.write("<head>");
                    i.document.write("<title>");
                    i.document.write(r.innerHTML);
                    i.document.write("</title>");
                    i.document.write("</head>");
                    i.document.write("<body>");
                    i.document.write("<code>");
                    i.document.write("<pre>");
                    i.document.write(o.innerHTML);
                    i.document.write("</pre>");
                    i.document.write("</code>");
                    i.document.write("</body>");
                    i.document.write("</html>");
                    i.document.close();
                    i.focus();
                    i.print();
                    i.close();
                    fireCustomTriggerEvent(t.events.onPrint, o.innerHTML);
                };
                a.push(i);
            }
            if (t.showLanguageLabel) {
                const e = DomElement.create("div", "language-label");
                r.appendChild(e);
                DomElement.setNodeText(e, getFriendlyLanguageName(n, t.languageLabelCasing), _configuration);
            }
            const l = a.length;
            if (l > t.maximumButtons) {
                const e = DomElement.create("button", "button button-opener");
                e.innerText = t.buttonsVisible ? _configuration.text.buttonsCloserText : _configuration.text.buttonsOpenerText;
                r.insertBefore(e, r.children[0]);
                e.onclick = function() {
                    const n = e.innerText === _configuration.text.buttonsCloserText;
                    for (let e = 0; e < l; e++) {
                        a[e].style.display = n ? "none" : "inline-block";
                    }
                    e.innerText = n ? _configuration.text.buttonsOpenerText : _configuration.text.buttonsCloserText;
                    if (n) {
                        fireCustomTriggerEvent(t.events.onButtonsClosed);
                    } else {
                        fireCustomTriggerEvent(t.events.onButtonsOpened);
                    }
                };
            } else if (!t.buttonsVisible && l <= t.maximumButtons) {
                for (let e = 0; e < l; e++) {
                    a[e].style.display = "inline-block";
                }
            }
        }
    }
    function renderElementButton(e, t, n, i, o) {
        const r = DomElement.create("button", "button");
        r.style.display = o.buttonsVisible ? "inline-block" : "none";
        n.appendChild(r);
        DomElement.setNodeText(r, e.text, _configuration);
        r.onclick = function() {
            e.events.onClick(i);
        };
        if (Is.defined(e.className)) {
            r.className += " " + e.className;
        }
        t.push(r);
    }
    function renderElementCommentVariables(e, t, n) {
        const i = t.comment;
        if (Is.definedString(i)) {
            const t = e.match(new RegExp(`${i}.*`, "g"));
            if (t !== null) {
                const i = t.length;
                for (let o = 0; o < i; o++) {
                    const i = t[o];
                    const r = `$C{${_cached_Comments_Count.toString()}}`;
                    _cached_Comments[r] = `<span class="comment">${i}</span>`;
                    _cached_Comments_Count++;
                    e = e.replace(i, r);
                    fireCustomTriggerEvent(n.events.onCommentRender, i);
                }
            }
        }
        return e;
    }
    function renderElementMultiLineCommentVariables(e, t, n) {
        const i = t.multiLineComment;
        if (Is.definedArray(i) && i.length === 2) {
            let t = 0;
            let o = 0;
            while (t >= 0 && o >= 0) {
                t = e.indexOf(i[0], o);
                if (t > -1) {
                    o = e.indexOf(i[1], t + i[0].length);
                    if (o > -1) {
                        const r = e.substring(t, o + i[1].length);
                        const a = r.split("\n");
                        const l = a.length;
                        const s = l === 1 ? "comment" : "multi-line-comment";
                        for (let t = 0; t < l; t++) {
                            const n = `$C{${_cached_Comments_Count.toString()}}`;
                            const i = a[t];
                            _cached_Comments[n] = `<span class="${s}">${i}</span>`;
                            _cached_Comments_Count++;
                            e = e.replace(i, n);
                        }
                        fireCustomTriggerEvent(n.events.onCommentRender, r);
                    }
                }
            }
        }
        return e;
    }
    function renderElementStringPatternVariables(e, t, n) {
        if (t !== null) {
            const i = t.length;
            for (let o = 0; o < i; o++) {
                const i = t[o];
                const r = i.split("\n");
                const a = r.length;
                const l = a === 1 ? "string" : "multi-line-string";
                for (let t = 0; t < a; t++) {
                    const n = r[t];
                    const i = `$S{${_cached_Strings_Count.toString()}}`;
                    _cached_Strings[i] = `<span class="${l}">${n}</span>`;
                    _cached_Strings_Count++;
                    e = e.replace(n, i);
                }
                fireCustomTriggerEvent(n.events.onStringRender, i);
            }
        }
        return e;
    }
    function renderElementKeywords(e, t, n) {
        const i = Data.getDefaultStringOrArray(t.keywords, []);
        const o = i.length;
        const r = t.caseSensitive;
        const a = getKeywordCasing(t.keywordsCasing);
        Data.String.sortArrayOfStringByLength(i);
        for (let l = 0; l < o; l++) {
            const o = i[l];
            const s = getDisplayTextTestCasing(o, a);
            const u = `KW${_cached_Keywords_Count.toString()};`;
            let c = null;
            const g = r ? "g" : "gi";
            const d = new RegExp(getWordRegEx(o, t), g);
            if (n.highlightKeywords) {
                if (Is.definedFunction(n.events.onKeywordClicked)) {
                    c = `<span class="keyword-clickable">${s}</span>`;
                    e = e.replace(d, u);
                } else {
                    c = `<span class="keyword">${s}</span>`;
                    e = e.replace(d, u);
                }
            } else {
                if (Is.definedFunction(n.events.onKeywordClicked)) {
                    c = `<span class="no-highlight-keyword-clickable">${s}</span>`;
                    e = e.replace(d, u);
                }
            }
            _cached_Keywords[u] = c;
            _cached_Keywords_Count++;
            fireCustomTriggerEvent(n.events.onKeywordRender, o);
        }
        return e;
    }
    function replaceMarkUpKeywords(e, t, n) {
        const i = Data.getDefaultStringOrArray(t.keywords, []);
        const o = t.caseSensitive;
        const r = getKeywordCasing(t.keywordsCasing);
        const a = /(<([^>]+)>)/gi;
        const l = o ? "g" : "gi";
        let s = a.exec(e);
        while (s) {
            if (s.index === a.lastIndex) {
                a.lastIndex++;
            }
            let o = s[0];
            o = o.replace("</", "").replace("<", "").replace(">", "");
            o = o.split(" ")[0];
            if (i.indexOf(o) > -1) {
                const i = `KW${_cached_Keywords_Count.toString()};`;
                const a = new RegExp(getWordRegEx(o, t), l);
                let s = null;
                let u = getDisplayTextTestCasing(o, r);
                if (n.highlightKeywords) {
                    if (Is.definedFunction(n.events.onKeywordClicked)) {
                        s = `<span class="keyword-clickable">${u}</span>`;
                    } else {
                        s = `<span class="keyword">${u}</span>`;
                    }
                } else {
                    if (Is.definedFunction(n.events.onKeywordClicked)) {
                        s = `<span class="no-highlight-keyword-clickable">${u}</span>`;
                    }
                }
                e = e.replace(a, i);
                _cached_Keywords[i] = s;
                _cached_Keywords_Count++;
            }
            s = a.exec(e);
        }
        return e;
    }
    function renderElementValues(e, t, n) {
        const i = Data.getDefaultStringOrArray(t.values, []);
        const o = i.length;
        const r = t.caseSensitive;
        Data.String.sortArrayOfStringByLength(i);
        for (let a = 0; a < o; a++) {
            const o = i[a];
            const l = `VAL${_cached_Values_Count.toString()};`;
            let s = null;
            const u = r ? "g" : "gi";
            const c = new RegExp(getWordRegEx(o, t), u);
            if (n.highlightValues) {
                if (Is.definedFunction(n.events.onValueClicked)) {
                    s = `<span class="value-clickable">${o}</span>`;
                    e = e.replace(c, l);
                } else {
                    s = `<span class="value">${o}</span>`;
                    e = e.replace(c, l);
                }
            } else {
                if (Is.definedFunction(n.events.onValueClicked)) {
                    s = `<span class="no-highlight-value-clickable">${o}</span>`;
                    e = e.replace(c, l);
                }
            }
            _cached_Values[l] = s;
            _cached_Values_Count++;
            fireCustomTriggerEvent(n.events.onValueRender, o);
        }
        return e;
    }
    function renderElementAttributes(e, t, n) {
        const i = Data.getDefaultStringOrArray(t.attributes, []);
        const o = i.length;
        const r = t.caseSensitive;
        Data.String.sortArrayOfStringByLength(i);
        for (let a = 0; a < o; a++) {
            const o = i[a];
            const l = `ATTR${_cached_Attributes_Count.toString()};`;
            let s = null;
            let u = r ? "g" : "gi";
            const c = new RegExp(getWordRegEx(o, t), u);
            if (n.highlightAttributes) {
                if (Is.definedFunction(n.events.onAttributeClicked)) {
                    s = `<span class="attribute-clickable">${o}</span>`;
                    e = e.replace(c, l);
                } else {
                    s = `<span class="attribute">${o}</span>`;
                    e = e.replace(c, l);
                }
            } else {
                if (Is.definedFunction(n.events.onAttributeClicked)) {
                    s = `<span class="no-highlight-attribute-clickable">${o}</span>`;
                    e = e.replace(c, l);
                }
            }
            _cached_Attributes[l] = s;
            _cached_Attributes_Count++;
            fireCustomTriggerEvent(n.events.onAttributeRender, o);
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
        let i = null;
        let o = null;
        if (Is.definedArray(n) && n.length === 2) {
            i = Data.String.encodeMarkUpCharacters(n[0]);
            o = Data.String.encodeMarkUpCharacters(n[1]);
        }
        for (let r in _cached_Comments) {
            if (_cached_Comments.hasOwnProperty(r)) {
                let a = _cached_Comments[r];
                if (t.isMarkUp && Is.definedString(i) && Is.definedString(o)) {
                    a = a.replace(n[0], i);
                    a = a.replace(n[1], o);
                }
                e = e.replace(r, a);
            }
        }
        return e;
    }
    function renderElementVariables(e, t) {
        for (let n in t) {
            if (t.hasOwnProperty(n)) {
                const i = new RegExp(n, "g");
                e = e.replace(i, t[n]);
            }
        }
        return e;
    }
    function renderElementCompletedHTML(e, t, n, i, o, r) {
        const a = i.split("\n");
        const l = a.length;
        const s = l.toString().length;
        let u = t;
        let c = n;
        let g = null;
        let d = 1;
        let f = false;
        if (r) {
            c = DomElement.create("pre");
            n.appendChild(c);
            if (Is.defined(t)) {
                u = DomElement.create("pre");
                t.appendChild(u);
            }
        }
        if (o.doubleClickToSelectAll) {
            if (Is.defined(e)) {
                e.ondblclick = function() {
                    DomElement.selectTextInElement(c);
                };
            }
            if (Is.defined(t)) {
                t.ondblclick = function() {
                    DomElement.selectTextInElement(c);
                };
            }
            n.ondblclick = function() {
                DomElement.selectTextInElement(c);
            };
        }
        for (let e = 0; e < l; e++) {
            let t = a[e];
            if (t.trim() !== "" && g === null) {
                g = t.substring(0, t.match(/^\s*/)[0].length);
            }
            if (e !== 0 && e !== l - 1 || t.trim() !== "") {
                if (t.trim() !== "" || !o.removeBlankLines) {
                    const e = t.trim() === "";
                    if (e && !f || !o.removeDuplicateBlankLines || !e) {
                        f = e;
                        if (Is.defined(u)) {
                            const e = DomElement.create("p");
                            if (o.padLineNumbers) {
                                e.innerText = Data.String.padNumber(d.toString(), s);
                            } else {
                                e.innerText = d.toString();
                            }
                            u.appendChild(e);
                            d++;
                        }
                        if (g !== null) {
                            t = t.replace(g, "");
                            if (!r) {
                                const e = t.match(/^\s*/)[0].length;
                                const n = t.substring(0, e);
                                const i = Array(e).join("&nbsp;");
                                t = t.replace(n, i);
                            }
                        }
                        const n = DomElement.create("p");
                        n.innerHTML = t.trim() === "" ? "<br>" : t;
                        c.appendChild(n);
                    }
                }
            }
        }
    }
    function renderElementClickEvents(e, t, n) {
        if (Is.definedFunction(t)) {
            const i = e.getElementsByClassName(n);
            const o = [].slice.call(i);
            const r = o.length;
            for (let e = 0; e < r; e++) {
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
        const i = getLanguage(e);
        if (Is.defined(i) && Is.definedString(i.friendlyName)) {
            n = i.friendlyName;
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
        let n = `(?<=^|[^-])\\b${e}\\b(?=[^-]|$)`;
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
        e.events = Data.getDefaultObject(e.events, {});
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
    function buildDefaultConfiguration(e = null) {
        _configuration = Data.getDefaultObject(e, {});
        _configuration.safeMode = Data.getDefaultBoolean(_configuration.safeMode, true);
        _configuration.highlightAllDomElementTypes = Data.getDefaultStringOrArray(_configuration.highlightAllDomElementTypes, [ "div", "code" ]);
        _configuration.allowHtmlInTextDisplay = Data.getDefaultBoolean(_configuration.allowHtmlInTextDisplay, true);
        buildDefaultConfigurationStrings();
        buildDefaultConfigurationCustomTriggers();
    }
    function buildDefaultConfigurationStrings() {
        _configuration.text = Data.getDefaultObject(_configuration.text, {});
        _configuration.text.buttonsOpenerText = Data.getDefaultAnyString(_configuration.text.buttonsOpenerText, "←");
        _configuration.text.buttonsCloserText = Data.getDefaultAnyString(_configuration.text.buttonsCloserText, "→");
        _configuration.text.objectErrorText = Data.getDefaultAnyString(_configuration.text.objectErrorText, "Errors in object: {{error_1}}, {{error_2}}");
        _configuration.text.attributeNotSetErrorText = Data.getDefaultAnyString(_configuration.text.attributeNotSetErrorText, "The attribute '{{attribute_name}}' has not been set correctly.");
        _configuration.text.languageNotSupportedErrorText = Data.getDefaultAnyString(_configuration.text.languageNotSupportedErrorText, "Language '{{language}}' is not supported.");
        _configuration.text.noCodeAvailableToRenderErrorText = Data.getDefaultAnyString(_configuration.text.noCodeAvailableToRenderErrorText, "No code is available to render.");
        _configuration.text.copyButtonText = Data.getDefaultAnyString(_configuration.text.copyButtonText, "Copy");
        _configuration.text.printButtonText = Data.getDefaultAnyString(_configuration.text.printButtonText, "Print");
    }
    function buildDefaultConfigurationCustomTriggers() {
        _configuration.events = Data.getDefaultObject(_configuration.events, {});
        _configuration.events.onBeforeRender = Data.getDefaultFunction(_configuration.events.onBeforeRender, null);
        _configuration.events.onAfterRender = Data.getDefaultFunction(_configuration.events.onAfterRender, null);
    }
    const _public = {
        highlightAll: function() {
            render();
            return _public;
        },
        highlightElement: function(e) {
            let t = e;
            if (Is.definedString(t)) {
                t = document.getElementById(t);
            }
            if (Is.defined(t)) {
                renderElement(t);
            }
            return _public;
        },
        getElementsHighlighted: function() {
            return [].slice.call(_elements);
        },
        getCode: function(e) {
            let t = null;
            if (_elements_Original.hasOwnProperty(e)) {
                t = _elements_Original[e];
            }
            return t;
        },
        destroyAll: function() {
            for (let e in _elements_Original) {
                if (_elements_Original.hasOwnProperty(e)) {
                    const t = document.getElementById(e);
                    if (Is.defined(t)) {
                        t.innerHTML = _elements_Original[e];
                    }
                }
            }
            _elements_Original = {};
            _elements = [];
            return _public;
        },
        destroy: function(e) {
            if (_elements_Original.hasOwnProperty(e.toLowerCase())) {
                const t = document.getElementById(e);
                if (Is.defined(t)) {
                    t.innerHTML = _elements_Original[e.toLowerCase()];
                    delete _elements_Original[e.toLowerCase()];
                    const n = _elements.length;
                    for (let t = 0; t < n; t++) {
                        if (_elements[t].id === e) {
                            delete _elements[t];
                            break;
                        }
                    }
                }
            }
            return _public;
        },
        addLanguage: function(e, t, n = true) {
            let i = false;
            const o = e.toLowerCase();
            if (!_languages.hasOwnProperty(o)) {
                _languages[o] = t;
                i = true;
                if (n) {
                    render();
                }
            }
            return i;
        },
        removeLanguage: function(e) {
            let t = false;
            const n = e.toLowerCase();
            if (_languages.hasOwnProperty(n)) {
                delete _languages[n];
                for (let e in _aliases_Rules) {
                    if (_aliases_Rules.hasOwnProperty(e) && _aliases_Rules[e] === n) {
                        delete _aliases_Rules[e];
                    }
                }
                t = true;
            }
            return t;
        },
        getLanguage: function(e) {
            let t = null;
            const n = e.toLowerCase();
            if (_languages.hasOwnProperty(n)) {
                t = Data.getClonedObject(n);
            }
            return t;
        },
        getLanguages: function() {
            return Data.getClonedObject(_languages);
        },
        addAlias: function(e, t, n = true) {
            let i = false;
            if (_languages.hasOwnProperty(t.toLowerCase()) && !_aliases_Rules.hasOwnProperty(e.toLowerCase())) {
                _aliases_Rules[e.toLowerCase()] = t.toLowerCase();
                i = true;
                if (n) {
                    render();
                }
            }
            return i;
        },
        removeAlias: function(e) {
            let t = false;
            if (_aliases_Rules.hasOwnProperty(e.toLowerCase())) {
                delete _aliases_Rules[e.toLowerCase()];
                t = true;
            }
            return t;
        },
        getAlias: function(e) {
            let t = null;
            if (_aliases_Rules.hasOwnProperty(e.toLowerCase())) {
                t = _aliases_Rules[e.toLowerCase()];
            }
            return t;
        },
        getAliases: function() {
            return Data.getClonedObject(_aliases_Rules);
        },
        setConfiguration: function(e) {
            if (Is.definedObject(e)) {
                let t = false;
                const n = _configuration;
                for (let i in e) {
                    if (e.hasOwnProperty(i) && _configuration.hasOwnProperty(i) && n[i] !== e[i]) {
                        n[i] = e[i];
                        t = true;
                    }
                }
                if (t) {
                    buildDefaultConfiguration(n);
                }
            }
            return _public;
        },
        getVersion: function() {
            return "3.0.1";
        }
    };
    (() => {
        buildDefaultConfiguration();
        document.addEventListener("DOMContentLoaded", (function() {
            render();
        }));
        if (!Is.defined(window.$syntax)) {
            window.$syntax = _public;
        }
    })();
})();//# sourceMappingURL=syntax.js.map