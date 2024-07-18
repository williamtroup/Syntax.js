"use strict";

var Constant;

(e => {
    e.SYNTAX_JS_ATTRIBUTE_NAME_LANGUAGE = "data-syntax-language";
    e.SYNTAX_JS_ATTRIBUTE_NAME_OPTIONS = "data-syntax-options";
    e.SYNTAX_JS_ATTRIBUTE_NAME_BUTTONS = "data-syntax-buttons";
    e.SYNTAX_JS_ATTRIBUTE_NAME_TAB_CONTENTS = "data-syntax-tab-contents";
})(Constant || (Constant = {}));

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
    function r(e) {
        return t(e) && typeof e === "boolean";
    }
    e.definedBoolean = r;
    function o(e) {
        return t(e) && typeof e === "string";
    }
    e.definedString = o;
    function i(e) {
        return t(e) && typeof e === "function";
    }
    e.definedFunction = i;
    function l(e) {
        return t(e) && typeof e === "number";
    }
    e.definedNumber = l;
    function s(e) {
        return n(e) && e instanceof Array;
    }
    e.definedArray = s;
})(Is || (Is = {}));

var Default;

(e => {
    function t(e, t) {
        return typeof e === "string" ? e : t;
    }
    e.getAnyString = t;
    function n(e, t) {
        return Is.definedString(e) ? e : t;
    }
    e.getString = n;
    function r(e, t) {
        return Is.definedBoolean(e) ? e : t;
    }
    e.getBoolean = r;
    function o(e, t) {
        return Is.definedNumber(e) ? e : t;
    }
    e.getNumber = o;
    function i(e, t) {
        return Is.definedFunction(e) ? e : t;
    }
    e.getFunction = i;
    function l(e, t) {
        return Is.definedArray(e) ? e : t;
    }
    e.getArray = l;
    function s(e, t) {
        return Is.definedObject(e) ? e : t;
    }
    e.getObject = s;
    function a(e, t) {
        let n = t;
        if (Is.definedString(e)) {
            const r = e.toString().split(" ");
            if (r.length === 0) {
                e = t;
            } else {
                n = r;
            }
        } else {
            n = l(e, t);
        }
        return n;
    }
    e.getStringOrArray = a;
    function c(e) {
        const t = JSON.stringify(e);
        const n = JSON.parse(t);
        return n;
    }
    e.getClonedObject = c;
})(Default || (Default = {}));

var DomElement;

(e => {
    function t(e, t = "") {
        const n = e.toLowerCase();
        const r = n === "text";
        let o = r ? document.createTextNode("") : document.createElement(n);
        if (Is.defined(t)) {
            o.className = t;
        }
        return o;
    }
    e.create = t;
    function n(e, n, r) {
        if (!r.allowHtmlInTextDisplay) {
            const r = t("div");
            r.innerHTML = n;
            e.innerText = r.innerText;
        } else {
            e.innerHTML = n;
        }
    }
    e.setNodeText = n;
    function r(e) {
        const t = document.createRange();
        t.selectNode(e);
        window.getSelection().removeAllRanges();
        window.getSelection().addRange(t);
    }
    e.selectTextInElement = r;
})(DomElement || (DomElement = {}));

var Str;

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
    function r(e) {
        e = e.replace(/</g, "&lt;");
        e = e.replace(/>/g, "&gt;");
        return e;
    }
    e.encodeMarkUpCharacters = r;
    function o(e) {
        e.sort((function(e, t) {
            return t.length - e.length;
        }));
    }
    e.sortArrayOfStringByLength = o;
})(Str || (Str = {}));

var Trigger;

(e => {
    function t(e, ...t) {
        let n = null;
        if (Is.definedFunction(e)) {
            n = e.apply(null, [].slice.call(t, 0));
        }
        return n;
    }
    e.customEvent = t;
})(Trigger || (Trigger = {}));

var Config;

(e => {
    let t;
    (e => {
        function t(e = null) {
            let t = Default.getObject(e, {});
            t.safeMode = Default.getBoolean(t.safeMode, true);
            t.highlightAllDomElementTypes = Default.getStringOrArray(t.highlightAllDomElementTypes, [ "div", "code" ]);
            t.allowHtmlInTextDisplay = Default.getBoolean(t.allowHtmlInTextDisplay, true);
            t = n(t);
            t = r(t);
            return t;
        }
        e.get = t;
        function n(e) {
            e.text = Default.getObject(e.text, {});
            e.text.buttonsOpenerText = Default.getAnyString(e.text.buttonsOpenerText, "←");
            e.text.buttonsCloserText = Default.getAnyString(e.text.buttonsCloserText, "→");
            e.text.objectErrorText = Default.getAnyString(e.text.objectErrorText, "Errors in object: {{error_1}}, {{error_2}}");
            e.text.attributeNotSetErrorText = Default.getAnyString(e.text.attributeNotSetErrorText, "The attribute '{{attribute_name}}' has not been set correctly.");
            e.text.languageNotSupportedErrorText = Default.getAnyString(e.text.languageNotSupportedErrorText, "Language '{{language}}' is not supported.");
            e.text.noCodeAvailableToRenderErrorText = Default.getAnyString(e.text.noCodeAvailableToRenderErrorText, "No code is available to render.");
            e.text.copyButtonText = Default.getAnyString(e.text.copyButtonText, "Copy");
            e.text.printButtonText = Default.getAnyString(e.text.printButtonText, "Print");
            return e;
        }
        function r(e) {
            e.events = Default.getObject(e.events, {});
            e.events.onBeforeRender = Default.getFunction(e.events.onBeforeRender, null);
            e.events.onAfterRender = Default.getFunction(e.events.onAfterRender, null);
            return e;
        }
    })(t = e.Options || (e.Options = {}));
})(Config || (Config = {}));

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
            const r = [].slice.call(t);
            const o = r.length;
            if (o > 0) {
                Trigger.customEvent(_configuration.events.onBeforeRender);
            }
            for (let e = 0; e < o; e++) {
                const t = r[e];
                let n = false;
                if (t.hasAttribute(Constant.SYNTAX_JS_ATTRIBUTE_NAME_LANGUAGE) && t.getAttribute(Constant.SYNTAX_JS_ATTRIBUTE_NAME_LANGUAGE).toLowerCase() === "tabbed") {
                    const e = [].slice.call(t.children);
                    const r = e.length;
                    const o = [];
                    const i = [];
                    t.removeAttribute(Constant.SYNTAX_JS_ATTRIBUTE_NAME_LANGUAGE);
                    t.className = t.className === "" ? "syntax-highlight" : `${t.className} syntax-highlight`;
                    t.innerHTML = "";
                    const l = DomElement.create("div", "code custom-scroll-bars");
                    t.appendChild(l);
                    const s = DomElement.create("div", "tabs");
                    l.appendChild(s);
                    for (let t = 0; t < r; t++) {
                        const r = renderElement(e[t], l);
                        if (!r.rendered) {
                            n = true;
                        } else {
                            renderTab(s, o, i, r, t, r.tabBindingOptions, r.syntaxLanguage);
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
                Trigger.customEvent(_configuration.events.onAfterRender);
            }
        }
    }
    function renderTab(e, t, n, r, o, i, l) {
        const s = DomElement.create("button", "tab");
        e.appendChild(s);
        DomElement.setNodeText(s, r.tabTitle, _configuration);
        t.push(s);
        n.push(r.tabContents);
        s.onclick = () => {
            if (s.className !== "tab-active") {
                const e = t.length;
                const o = n.length;
                for (let n = 0; n < e; n++) {
                    t[n].className = "tab";
                }
                for (let e = 0; e < o; e++) {
                    n[e].style.display = "none";
                }
                s.className = "tab-active";
                r.tabContents.style.display = "flex";
                if (Is.definedObject(i)) {
                    Trigger.customEvent(i.events.onOpen, l);
                }
            }
        };
        if (o > 0) {
            r.tabContents.style.display = "none";
        } else {
            s.className = "tab-active";
        }
    }
    function renderElement(e, t = null) {
        const n = {};
        n.rendered = true;
        if (Is.defined(e) && e.hasAttribute(Constant.SYNTAX_JS_ATTRIBUTE_NAME_LANGUAGE) && (!e.hasAttribute(Constant.SYNTAX_JS_ATTRIBUTE_NAME_TAB_CONTENTS) || Is.defined(t))) {
            n.syntaxLanguage = e.getAttribute(Constant.SYNTAX_JS_ATTRIBUTE_NAME_LANGUAGE);
            if (Is.definedString(n.syntaxLanguage)) {
                const r = getLanguage(n.syntaxLanguage);
                if (Is.defined(r) || n.syntaxLanguage.toLowerCase() === "unknown") {
                    const o = getObjectFromString(e.getAttribute(Constant.SYNTAX_JS_ATTRIBUTE_NAME_OPTIONS));
                    const i = getObjectFromString(e.getAttribute(Constant.SYNTAX_JS_ATTRIBUTE_NAME_BUTTONS));
                    if (o.parsed) {
                        if (e.innerHTML.trim() !== "") {
                            let l = e.innerHTML;
                            const s = getBindingOptions(o.object);
                            let a = false;
                            let c = null;
                            Trigger.customEvent(s.events.onBeforeRenderComplete, e);
                            if (e.children.length > 0 && e.children[0].nodeName.toLowerCase() === "pre") {
                                l = e.children[0].innerHTML;
                                a = true;
                            }
                            const u = l.trim();
                            let d = null;
                            let g = null;
                            let f = e.id;
                            if (!Is.definedString(f)) {
                                f = Str.newGuid();
                            }
                            _elements_Original[f] = e.innerHTML;
                            e.removeAttribute(Constant.SYNTAX_JS_ATTRIBUTE_NAME_LANGUAGE);
                            e.removeAttribute(Constant.SYNTAX_JS_ATTRIBUTE_NAME_OPTIONS);
                            e.id = f;
                            if (!Is.defined(t)) {
                                e.className = e.className === "" ? "syntax-highlight" : `${e.className} syntax-highlight`;
                                e.innerHTML = "";
                                t = DomElement.create("div", "code custom-scroll-bars");
                                e.appendChild(t);
                            } else {
                                if (e.hasAttribute(Constant.SYNTAX_JS_ATTRIBUTE_NAME_TAB_CONTENTS) && e.getAttribute(Constant.SYNTAX_JS_ATTRIBUTE_NAME_TAB_CONTENTS).toLowerCase() !== "true") {
                                    const t = getObjectFromString(e.getAttribute(Constant.SYNTAX_JS_ATTRIBUTE_NAME_TAB_CONTENTS));
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
                            renderElementButtons(m, s, n.syntaxLanguage, i, u);
                            if (n.syntaxLanguage.toLowerCase() !== "unknown") {
                                l = renderHTML(l, r, s);
                            } else {
                                l = Str.encodeMarkUpCharacters(l);
                            }
                            renderElementCompletedHTML(g, d, m, l, s, a);
                            Trigger.customEvent(s.events.onRenderComplete, e);
                            if (!Is.defined(n.tabContents)) {
                                renderSyntaxCustomTriggers(e, s);
                            } else {
                                renderSyntaxCustomTriggers(n.tabContents, s);
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
                n.rendered = logError(_configuration.text.attributeNotSetErrorText.replace("{{attribute_name}}", Constant.SYNTAX_JS_ATTRIBUTE_NAME_LANGUAGE));
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
            e = Str.encodeMarkUpCharacters(e);
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
        e = Str.encodeMarkUpCharacters(e);
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
    function renderElementButtons(e, t, n, r, o) {
        if (t.showLanguageLabel || t.showCopyButton || t.showPrintButton || r.parsed) {
            const i = DomElement.create("div", "buttons");
            const l = [];
            e.appendChild(i);
            if (r.parsed && Is.definedArray(r.object)) {
                const e = r.object;
                const n = e.length;
                for (let r = 0; r < n; r++) {
                    const n = e[r];
                    if (Is.defined(n.text) && Is.definedFunction(n.events.onClick)) {
                        renderElementButton(n, l, i, o, t);
                    }
                }
            }
            if (t.showCopyButton) {
                const e = DomElement.create("button", "button");
                e.style.display = t.buttonsVisible ? "inline-block" : "none";
                i.appendChild(e);
                DomElement.setNodeText(e, _configuration.text.copyButtonText, _configuration);
                e.onclick = () => {
                    navigator.clipboard.writeText(o);
                    Trigger.customEvent(t.events.onCopy, o);
                };
                l.push(e);
            }
            if (t.showPrintButton) {
                const r = DomElement.create("button", "button");
                r.style.display = t.buttonsVisible ? "inline-block" : "none";
                i.appendChild(r);
                DomElement.setNodeText(r, _configuration.text.printButtonText, _configuration);
                r.onclick = () => {
                    const r = window.open("", "PRINT", "height=400,width=600");
                    const o = e.cloneNode(true);
                    const i = DomElement.create("div");
                    o.removeChild(o.children[0]);
                    i.innerHTML = getFriendlyLanguageName(n);
                    r.document.write("<html>");
                    r.document.write("<head>");
                    r.document.write("<title>");
                    r.document.write(i.innerHTML);
                    r.document.write("</title>");
                    r.document.write("</head>");
                    r.document.write("<body>");
                    r.document.write("<code>");
                    r.document.write("<pre>");
                    r.document.write(o.innerHTML);
                    r.document.write("</pre>");
                    r.document.write("</code>");
                    r.document.write("</body>");
                    r.document.write("</html>");
                    r.document.close();
                    r.focus();
                    r.print();
                    r.close();
                    Trigger.customEvent(t.events.onPrint, o.innerHTML);
                };
                l.push(r);
            }
            if (t.showLanguageLabel) {
                const e = DomElement.create("div", "language-label");
                i.appendChild(e);
                DomElement.setNodeText(e, getFriendlyLanguageName(n, t.languageLabelCasing), _configuration);
            }
            const s = l.length;
            if (s > t.maximumButtons) {
                const e = DomElement.create("button", "button button-opener");
                e.innerText = t.buttonsVisible ? _configuration.text.buttonsCloserText : _configuration.text.buttonsOpenerText;
                i.insertBefore(e, i.children[0]);
                e.onclick = () => {
                    const n = e.innerText === _configuration.text.buttonsCloserText;
                    for (let e = 0; e < s; e++) {
                        l[e].style.display = n ? "none" : "inline-block";
                    }
                    e.innerText = n ? _configuration.text.buttonsOpenerText : _configuration.text.buttonsCloserText;
                    if (n) {
                        Trigger.customEvent(t.events.onButtonsClosed);
                    } else {
                        Trigger.customEvent(t.events.onButtonsOpened);
                    }
                };
            } else if (!t.buttonsVisible && s <= t.maximumButtons) {
                for (let e = 0; e < s; e++) {
                    l[e].style.display = "inline-block";
                }
            }
        }
    }
    function renderElementButton(e, t, n, r, o) {
        const i = DomElement.create("button", "button");
        i.style.display = o.buttonsVisible ? "inline-block" : "none";
        n.appendChild(i);
        DomElement.setNodeText(i, e.text, _configuration);
        i.onclick = () => {
            e.events.onClick(r);
        };
        if (Is.defined(e.className)) {
            i.className += " " + e.className;
        }
        t.push(i);
    }
    function renderElementCommentVariables(e, t, n) {
        const r = t.comment;
        if (Is.definedString(r)) {
            const t = e.match(new RegExp(`${r}.*`, "g"));
            if (t !== null) {
                const r = t.length;
                for (let o = 0; o < r; o++) {
                    const r = t[o];
                    const i = `$C{${_cached_Comments_Count.toString()}}`;
                    _cached_Comments[i] = `<span class="comment">${r}</span>`;
                    _cached_Comments_Count++;
                    e = e.replace(r, i);
                    Trigger.customEvent(n.events.onCommentRender, r);
                }
            }
        }
        return e;
    }
    function renderElementMultiLineCommentVariables(e, t, n) {
        const r = t.multiLineComment;
        if (Is.definedArray(r) && r.length === 2) {
            let t = 0;
            let o = 0;
            while (t >= 0 && o >= 0) {
                t = e.indexOf(r[0], o);
                if (t > -1) {
                    o = e.indexOf(r[1], t + r[0].length);
                    if (o > -1) {
                        const i = e.substring(t, o + r[1].length);
                        const l = i.split("\n");
                        const s = l.length;
                        const a = s === 1 ? "comment" : "multi-line-comment";
                        for (let t = 0; t < s; t++) {
                            const n = `$C{${_cached_Comments_Count.toString()}}`;
                            const r = l[t];
                            _cached_Comments[n] = `<span class="${a}">${r}</span>`;
                            _cached_Comments_Count++;
                            e = e.replace(r, n);
                        }
                        Trigger.customEvent(n.events.onCommentRender, i);
                    }
                }
            }
        }
        return e;
    }
    function renderElementStringPatternVariables(e, t, n) {
        if (t !== null) {
            const r = t.length;
            for (let o = 0; o < r; o++) {
                const r = t[o];
                const i = r.split("\n");
                const l = i.length;
                const s = l === 1 ? "string" : "multi-line-string";
                for (let t = 0; t < l; t++) {
                    const n = i[t];
                    const r = `$S{${_cached_Strings_Count.toString()}}`;
                    _cached_Strings[r] = `<span class="${s}">${n}</span>`;
                    _cached_Strings_Count++;
                    e = e.replace(n, r);
                }
                Trigger.customEvent(n.events.onStringRender, r);
            }
        }
        return e;
    }
    function renderElementKeywords(e, t, n) {
        const r = Default.getStringOrArray(t.keywords, []);
        const o = r.length;
        const i = t.caseSensitive;
        const l = getKeywordCasing(t.keywordsCasing);
        Str.sortArrayOfStringByLength(r);
        for (let s = 0; s < o; s++) {
            const o = r[s];
            const a = getDisplayTextTestCasing(o, l);
            const c = `KW${_cached_Keywords_Count.toString()};`;
            let u = null;
            const d = i ? "g" : "gi";
            const g = new RegExp(getWordRegEx(o, t), d);
            if (n.highlightKeywords) {
                if (Is.definedFunction(n.events.onKeywordClicked)) {
                    u = `<span class="keyword-clickable">${a}</span>`;
                    e = e.replace(g, c);
                } else {
                    u = `<span class="keyword">${a}</span>`;
                    e = e.replace(g, c);
                }
            } else {
                if (Is.definedFunction(n.events.onKeywordClicked)) {
                    u = `<span class="no-highlight-keyword-clickable">${a}</span>`;
                    e = e.replace(g, c);
                }
            }
            _cached_Keywords[c] = u;
            _cached_Keywords_Count++;
            Trigger.customEvent(n.events.onKeywordRender, o);
        }
        return e;
    }
    function replaceMarkUpKeywords(e, t, n) {
        const r = Default.getStringOrArray(t.keywords, []);
        const o = t.caseSensitive;
        const i = getKeywordCasing(t.keywordsCasing);
        const l = /(<([^>]+)>)/gi;
        const s = o ? "g" : "gi";
        let a = l.exec(e);
        while (a) {
            if (a.index === l.lastIndex) {
                l.lastIndex++;
            }
            let o = a[0];
            o = o.replace("</", "").replace("<", "").replace(">", "");
            o = o.split(" ")[0];
            if (r.indexOf(o) > -1) {
                const r = `KW${_cached_Keywords_Count.toString()};`;
                const l = new RegExp(getWordRegEx(o, t), s);
                let a = null;
                let c = getDisplayTextTestCasing(o, i);
                if (n.highlightKeywords) {
                    if (Is.definedFunction(n.events.onKeywordClicked)) {
                        a = `<span class="keyword-clickable">${c}</span>`;
                    } else {
                        a = `<span class="keyword">${c}</span>`;
                    }
                } else {
                    if (Is.definedFunction(n.events.onKeywordClicked)) {
                        a = `<span class="no-highlight-keyword-clickable">${c}</span>`;
                    }
                }
                e = e.replace(l, r);
                _cached_Keywords[r] = a;
                _cached_Keywords_Count++;
            }
            a = l.exec(e);
        }
        return e;
    }
    function renderElementValues(e, t, n) {
        const r = Default.getStringOrArray(t.values, []);
        const o = r.length;
        const i = t.caseSensitive;
        Str.sortArrayOfStringByLength(r);
        for (let l = 0; l < o; l++) {
            const o = r[l];
            const s = `VAL${_cached_Values_Count.toString()};`;
            let a = null;
            const c = i ? "g" : "gi";
            const u = new RegExp(getWordRegEx(o, t), c);
            if (n.highlightValues) {
                if (Is.definedFunction(n.events.onValueClicked)) {
                    a = `<span class="value-clickable">${o}</span>`;
                    e = e.replace(u, s);
                } else {
                    a = `<span class="value">${o}</span>`;
                    e = e.replace(u, s);
                }
            } else {
                if (Is.definedFunction(n.events.onValueClicked)) {
                    a = `<span class="no-highlight-value-clickable">${o}</span>`;
                    e = e.replace(u, s);
                }
            }
            _cached_Values[s] = a;
            _cached_Values_Count++;
            Trigger.customEvent(n.events.onValueRender, o);
        }
        return e;
    }
    function renderElementAttributes(e, t, n) {
        const r = Default.getStringOrArray(t.attributes, []);
        const o = r.length;
        const i = t.caseSensitive;
        Str.sortArrayOfStringByLength(r);
        for (let l = 0; l < o; l++) {
            const o = r[l];
            const s = `ATTR${_cached_Attributes_Count.toString()};`;
            let a = null;
            let c = i ? "g" : "gi";
            const u = new RegExp(getWordRegEx(o, t), c);
            if (n.highlightAttributes) {
                if (Is.definedFunction(n.events.onAttributeClicked)) {
                    a = `<span class="attribute-clickable">${o}</span>`;
                    e = e.replace(u, s);
                } else {
                    a = `<span class="attribute">${o}</span>`;
                    e = e.replace(u, s);
                }
            } else {
                if (Is.definedFunction(n.events.onAttributeClicked)) {
                    a = `<span class="no-highlight-attribute-clickable">${o}</span>`;
                    e = e.replace(u, s);
                }
            }
            _cached_Attributes[s] = a;
            _cached_Attributes_Count++;
            Trigger.customEvent(n.events.onAttributeRender, o);
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
        let r = null;
        let o = null;
        if (Is.definedArray(n) && n.length === 2) {
            r = Str.encodeMarkUpCharacters(n[0]);
            o = Str.encodeMarkUpCharacters(n[1]);
        }
        for (let i in _cached_Comments) {
            if (_cached_Comments.hasOwnProperty(i)) {
                let l = _cached_Comments[i];
                if (t.isMarkUp && Is.definedString(r) && Is.definedString(o)) {
                    l = l.replace(n[0], r);
                    l = l.replace(n[1], o);
                }
                e = e.replace(i, l);
            }
        }
        return e;
    }
    function renderElementVariables(e, t) {
        for (let n in t) {
            if (t.hasOwnProperty(n)) {
                const r = new RegExp(n, "g");
                e = e.replace(r, t[n]);
            }
        }
        return e;
    }
    function renderElementCompletedHTML(e, t, n, r, o, i) {
        const l = r.split("\n");
        const s = l.length;
        const a = s.toString().length;
        let c = t;
        let u = n;
        let d = null;
        let g = 1;
        let f = false;
        if (i) {
            u = DomElement.create("pre");
            n.appendChild(u);
            if (Is.defined(t)) {
                c = DomElement.create("pre");
                t.appendChild(c);
            }
        }
        if (o.doubleClickToSelectAll) {
            if (Is.defined(e)) {
                e.ondblclick = () => {
                    DomElement.selectTextInElement(u);
                };
            }
            if (Is.defined(t)) {
                t.ondblclick = () => {
                    DomElement.selectTextInElement(u);
                };
            }
            n.ondblclick = () => {
                DomElement.selectTextInElement(u);
            };
        }
        for (let e = 0; e < s; e++) {
            let t = l[e];
            if (t.trim() !== "" && d === null) {
                d = t.substring(0, t.match(/^\s*/)[0].length);
            }
            if (e !== 0 && e !== s - 1 || t.trim() !== "") {
                if (t.trim() !== "" || !o.removeBlankLines) {
                    const e = t.trim() === "";
                    if (e && !f || !o.removeDuplicateBlankLines || !e) {
                        f = e;
                        if (Is.defined(c)) {
                            const e = DomElement.create("p");
                            if (o.padLineNumbers) {
                                e.innerText = Str.padNumber(g.toString(), a);
                            } else {
                                e.innerText = g.toString();
                            }
                            c.appendChild(e);
                            g++;
                        }
                        if (d !== null) {
                            t = t.replace(d, "");
                            if (!i) {
                                const e = t.match(/^\s*/)[0].length;
                                const n = t.substring(0, e);
                                const r = Array(e).join("&nbsp;");
                                t = t.replace(n, r);
                            }
                        }
                        const n = DomElement.create("p");
                        n.innerHTML = t.trim() === "" ? "<br>" : t;
                        u.appendChild(n);
                    }
                }
            }
        }
    }
    function renderElementClickEvents(e, t, n) {
        if (Is.definedFunction(t)) {
            const r = e.getElementsByClassName(n);
            const o = [].slice.call(r);
            const i = o.length;
            for (let e = 0; e < i; e++) {
                renderElementClickEvent(o[e], t);
            }
        }
    }
    function renderElementClickEvent(e, t) {
        const n = e.innerText;
        e.onclick = () => {
            t(n);
        };
    }
    function getFriendlyLanguageName(e, t = null) {
        let n = null;
        const r = getLanguage(e);
        if (Is.defined(r) && Is.definedString(r.friendlyName)) {
            n = r.friendlyName;
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
        let t = Default.getObject(e, {});
        t = buildBindingAttributeOptions(t);
        t = buildBindingAttributeOptionCustomTriggers(t);
        return t;
    }
    function buildBindingAttributeOptions(e) {
        e.showCopyButton = Default.getBoolean(e.showCopyButton, true);
        e.removeBlankLines = Default.getBoolean(e.removeBlankLines, false);
        e.showLineNumbers = Default.getBoolean(e.showLineNumbers, true);
        e.highlightKeywords = Default.getBoolean(e.highlightKeywords, true);
        e.highlightValues = Default.getBoolean(e.highlightValues, true);
        e.highlightAttributes = Default.getBoolean(e.highlightAttributes, true);
        e.highlightStrings = Default.getBoolean(e.highlightStrings, true);
        e.highlightComments = Default.getBoolean(e.highlightComments, true);
        e.showLanguageLabel = Default.getBoolean(e.showLanguageLabel, true);
        e.showPrintButton = Default.getBoolean(e.showPrintButton, true);
        e.padLineNumbers = Default.getBoolean(e.padLineNumbers, false);
        e.removeDuplicateBlankLines = Default.getBoolean(e.removeDuplicateBlankLines, true);
        e.doubleClickToSelectAll = Default.getBoolean(e.doubleClickToSelectAll, true);
        e.languageLabelCasing = Default.getString(e.languageLabelCasing, "uppercase");
        e.buttonsVisible = Default.getBoolean(e.buttonsVisible, true);
        e.maximumButtons = Default.getNumber(e.maximumButtons, 2);
        return e;
    }
    function buildBindingAttributeOptionCustomTriggers(e) {
        e.events = Default.getObject(e.events, {});
        e.events.onCopy = Default.getFunction(e.events.onCopy, null);
        e.events.onRenderComplete = Default.getFunction(e.events.onRenderComplete, null);
        e.events.onKeywordClicked = Default.getFunction(e.events.onKeywordClicked, null);
        e.events.onValueClicked = Default.getFunction(e.events.onValueClicked, null);
        e.events.onAttributeClicked = Default.getFunction(e.events.onAttributeClicked, null);
        e.events.onKeywordRender = Default.getFunction(e.events.onKeywordRender, null);
        e.events.onValueRender = Default.getFunction(e.events.onValueRender, null);
        e.events.onAttributeRender = Default.getFunction(e.events.onAttributeRender, null);
        e.events.onStringRender = Default.getFunction(e.events.onStringRender, null);
        e.events.onCommentRender = Default.getFunction(e.events.onCommentRender, null);
        e.events.onPrint = Default.getFunction(e.events.onPrint, null);
        e.events.onBeforeRenderComplete = Default.getFunction(e.events.onBeforeRenderComplete, null);
        e.events.onButtonsOpened = Default.getFunction(e.events.onButtonsOpened, null);
        e.events.onButtonsClosed = Default.getFunction(e.events.onButtonsClosed, null);
        return e;
    }
    function getBindingTabContentOptions(e) {
        let t = Default.getObject(e, {});
        t = buildBindingTabContentAttributeOptionStrings(t);
        t = buildBindingTabContentAttributeOptionCustomTriggers(t);
        return t;
    }
    function buildBindingTabContentAttributeOptionStrings(e) {
        e.title = Default.getString(e.title, null);
        e.description = Default.getString(e.description, null);
        return e;
    }
    function buildBindingTabContentAttributeOptionCustomTriggers(e) {
        e.events = Default.getFunction(e.events, {});
        e.events.onOpen = Default.getFunction(e.events.onOpen, null);
        return e;
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
            let r = false;
            const o = e.toLowerCase();
            if (!_languages.hasOwnProperty(o)) {
                _languages[o] = t;
                r = true;
                if (n) {
                    render();
                }
            }
            return r;
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
                t = Default.getClonedObject(n);
            }
            return t;
        },
        getLanguages: function() {
            return Default.getClonedObject(_languages);
        },
        addAlias: function(e, t, n = true) {
            let r = false;
            if (_languages.hasOwnProperty(t.toLowerCase()) && !_aliases_Rules.hasOwnProperty(e.toLowerCase())) {
                _aliases_Rules[e.toLowerCase()] = t.toLowerCase();
                r = true;
                if (n) {
                    render();
                }
            }
            return r;
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
            return Default.getClonedObject(_aliases_Rules);
        },
        setConfiguration: function(e) {
            if (Is.definedObject(e)) {
                let t = false;
                const n = _configuration;
                for (let r in e) {
                    if (e.hasOwnProperty(r) && _configuration.hasOwnProperty(r) && n[r] !== e[r]) {
                        n[r] = e[r];
                        t = true;
                    }
                }
                if (t) {
                    _configuration = Config.Options.get(n);
                }
            }
            return _public;
        },
        getVersion: function() {
            return "3.0.1";
        }
    };
    (() => {
        _configuration = Config.Options.get();
        document.addEventListener("DOMContentLoaded", (function() {
            render();
        }));
        if (!Is.defined(window.$syntax)) {
            window.$syntax = _public;
        }
    })();
})();//# sourceMappingURL=syntax.js.map