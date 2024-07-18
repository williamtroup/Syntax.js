var __getOwnPropNames = Object.getOwnPropertyNames;

var __esm = (e, t) => function n() {
    return e && (t = (0, e[__getOwnPropNames(e)[0]])(e = 0)), t;
};

var __commonJS = (e, t) => function n() {
    return t || (0, e[__getOwnPropNames(e)[0]])((t = {
        exports: {}
    }).exports, t), t.exports;
};

var Constant;

var init_constant = __esm({
    "src/ts/constant.ts"() {
        "use strict";
        (e => {
            e.SYNTAX_JS_ATTRIBUTE_NAME_LANGUAGE = "data-syntax-language";
            e.SYNTAX_JS_ATTRIBUTE_NAME_OPTIONS = "data-syntax-options";
            e.SYNTAX_JS_ATTRIBUTE_NAME_BUTTONS = "data-syntax-buttons";
            e.SYNTAX_JS_ATTRIBUTE_NAME_TAB_CONTENTS = "data-syntax-tab-contents";
        })(Constant || (Constant = {}));
    }
});

var init_enum = __esm({
    "src/ts/data/enum.ts"() {
        "use strict";
    }
});

var Is;

var init_is = __esm({
    "src/ts/data/is.ts"() {
        "use strict";
        init_enum();
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
            function r(e) {
                return t(e) && typeof e === "string";
            }
            e.definedString = r;
            function o(e) {
                return t(e) && typeof e === "function";
            }
            e.definedFunction = o;
            function s(e) {
                return t(e) && typeof e === "number";
            }
            e.definedNumber = s;
            function l(e) {
                return n(e) && e instanceof Array;
            }
            e.definedArray = l;
        })(Is || (Is = {}));
    }
});

var Default;

var init_default = __esm({
    "src/ts/data/default.ts"() {
        "use strict";
        init_enum();
        init_is();
        (e => {
            function t(e, t) {
                return typeof e === "string" ? e : t;
            }
            e.getAnyString = t;
            function n(e, t) {
                return Is.definedString(e) ? e : t;
            }
            e.getString = n;
            function i(e, t) {
                return Is.definedBoolean(e) ? e : t;
            }
            e.getBoolean = i;
            function r(e, t) {
                return Is.definedNumber(e) ? e : t;
            }
            e.getNumber = r;
            function o(e, t) {
                return Is.definedFunction(e) ? e : t;
            }
            e.getFunction = o;
            function s(e, t) {
                return Is.definedArray(e) ? e : t;
            }
            e.getArray = s;
            function l(e, t) {
                return Is.definedObject(e) ? e : t;
            }
            e.getObject = l;
            function a(e, t) {
                let n = t;
                if (Is.definedString(e)) {
                    const i = e.toString().split(" ");
                    if (i.length === 0) {
                        e = t;
                    } else {
                        n = i;
                    }
                } else {
                    n = s(e, t);
                }
                return n;
            }
            e.getStringOrArray = a;
            function u(e) {
                const t = JSON.stringify(e);
                const n = JSON.parse(t);
                return n;
            }
            e.getClonedObject = u;
        })(Default || (Default = {}));
    }
});

var DomElement;

var init_dom = __esm({
    "src/ts/dom/dom.ts"() {
        "use strict";
        init_enum();
        init_is();
        (e => {
            function t(e, t = "") {
                const n = e.toLowerCase();
                const i = n === "text";
                let r = i ? document.createTextNode("") : document.createElement(n);
                if (Is.defined(t)) {
                    r.className = t;
                }
                return r;
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
                const t = document.createRange();
                t.selectNode(e);
                window.getSelection().removeAllRanges();
                window.getSelection().addRange(t);
            }
            e.selectTextInElement = i;
        })(DomElement || (DomElement = {}));
    }
});

var Str;

var init_str = __esm({
    "src/ts/data/str.ts"() {
        "use strict";
        init_enum();
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
            function r(e) {
                e.sort((function(e, t) {
                    return t.length - e.length;
                }));
            }
            e.sortArrayOfStringByLength = r;
        })(Str || (Str = {}));
    }
});

var Trigger;

var init_trigger = __esm({
    "src/ts/area/trigger.ts"() {
        "use strict";
        init_is();
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
    }
});

var require_syntax = __commonJS({
    "src/syntax.ts"(exports, module) {
        init_constant();
        init_default();
        init_is();
        init_enum();
        init_dom();
        init_str();
        init_trigger();
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
                    const r = i.length;
                    if (r > 0) {
                        Trigger.customEvent(_configuration.events.onBeforeRender);
                    }
                    for (let e = 0; e < r; e++) {
                        const t = i[e];
                        let n = false;
                        if (t.hasAttribute(Constant.SYNTAX_JS_ATTRIBUTE_NAME_LANGUAGE) && t.getAttribute(Constant.SYNTAX_JS_ATTRIBUTE_NAME_LANGUAGE).toLowerCase() === "tabbed") {
                            const e = [].slice.call(t.children);
                            const i = e.length;
                            const r = [];
                            const o = [];
                            t.removeAttribute(Constant.SYNTAX_JS_ATTRIBUTE_NAME_LANGUAGE);
                            t.className = t.className === "" ? "syntax-highlight" : `${t.className} syntax-highlight`;
                            t.innerHTML = "";
                            const s = DomElement.create("div", "code custom-scroll-bars");
                            t.appendChild(s);
                            const l = DomElement.create("div", "tabs");
                            s.appendChild(l);
                            for (let t = 0; t < i; t++) {
                                const i = renderElement(e[t], s);
                                if (!i.rendered) {
                                    n = true;
                                } else {
                                    renderTab(l, r, o, i, t, i.tabBindingOptions, i.syntaxLanguage);
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
                    if (r > 0) {
                        Trigger.customEvent(_configuration.events.onAfterRender);
                    }
                }
            }
            function renderTab(e, t, n, i, r, o, s) {
                const l = DomElement.create("button", "tab");
                e.appendChild(l);
                DomElement.setNodeText(l, i.tabTitle, _configuration);
                t.push(l);
                n.push(i.tabContents);
                l.onclick = () => {
                    if (l.className !== "tab-active") {
                        const e = t.length;
                        const r = n.length;
                        for (let n = 0; n < e; n++) {
                            t[n].className = "tab";
                        }
                        for (let e = 0; e < r; e++) {
                            n[e].style.display = "none";
                        }
                        l.className = "tab-active";
                        i.tabContents.style.display = "flex";
                        if (Is.definedObject(o)) {
                            Trigger.customEvent(o.events.onOpen, s);
                        }
                    }
                };
                if (r > 0) {
                    i.tabContents.style.display = "none";
                } else {
                    l.className = "tab-active";
                }
            }
            function renderElement(e, t = null) {
                const n = {};
                n.rendered = true;
                if (Is.defined(e) && e.hasAttribute(Constant.SYNTAX_JS_ATTRIBUTE_NAME_LANGUAGE) && (!e.hasAttribute(Constant.SYNTAX_JS_ATTRIBUTE_NAME_TAB_CONTENTS) || Is.defined(t))) {
                    n.syntaxLanguage = e.getAttribute(Constant.SYNTAX_JS_ATTRIBUTE_NAME_LANGUAGE);
                    if (Is.definedString(n.syntaxLanguage)) {
                        const i = getLanguage(n.syntaxLanguage);
                        if (Is.defined(i) || n.syntaxLanguage.toLowerCase() === "unknown") {
                            const r = getObjectFromString(e.getAttribute(Constant.SYNTAX_JS_ATTRIBUTE_NAME_OPTIONS));
                            const o = getObjectFromString(e.getAttribute(Constant.SYNTAX_JS_ATTRIBUTE_NAME_BUTTONS));
                            if (r.parsed) {
                                if (e.innerHTML.trim() !== "") {
                                    let s = e.innerHTML;
                                    const l = getBindingOptions(r.object);
                                    let a = false;
                                    let u = null;
                                    Trigger.customEvent(l.events.onBeforeRenderComplete, e);
                                    if (e.children.length > 0 && e.children[0].nodeName.toLowerCase() === "pre") {
                                        s = e.children[0].innerHTML;
                                        a = true;
                                    }
                                    const c = s.trim();
                                    let g = null;
                                    let d = null;
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
                                    renderElementButtons(m, l, n.syntaxLanguage, o, c);
                                    if (n.syntaxLanguage.toLowerCase() !== "unknown") {
                                        s = renderHTML(s, i, l);
                                    } else {
                                        s = Str.encodeMarkUpCharacters(s);
                                    }
                                    renderElementCompletedHTML(d, g, m, s, l, a);
                                    Trigger.customEvent(l.events.onRenderComplete, e);
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
            function renderElementButtons(e, t, n, i, r) {
                if (t.showLanguageLabel || t.showCopyButton || t.showPrintButton || i.parsed) {
                    const o = DomElement.create("div", "buttons");
                    const s = [];
                    e.appendChild(o);
                    if (i.parsed && Is.definedArray(i.object)) {
                        const e = i.object;
                        const n = e.length;
                        for (let i = 0; i < n; i++) {
                            const n = e[i];
                            if (Is.defined(n.text) && Is.definedFunction(n.events.onClick)) {
                                renderElementButton(n, s, o, r, t);
                            }
                        }
                    }
                    if (t.showCopyButton) {
                        const e = DomElement.create("button", "button");
                        e.style.display = t.buttonsVisible ? "inline-block" : "none";
                        o.appendChild(e);
                        DomElement.setNodeText(e, _configuration.text.copyButtonText, _configuration);
                        e.onclick = () => {
                            navigator.clipboard.writeText(r);
                            Trigger.customEvent(t.events.onCopy, r);
                        };
                        s.push(e);
                    }
                    if (t.showPrintButton) {
                        const i = DomElement.create("button", "button");
                        i.style.display = t.buttonsVisible ? "inline-block" : "none";
                        o.appendChild(i);
                        DomElement.setNodeText(i, _configuration.text.printButtonText, _configuration);
                        i.onclick = () => {
                            const i = window.open("", "PRINT", "height=400,width=600");
                            const r = e.cloneNode(true);
                            const o = DomElement.create("div");
                            r.removeChild(r.children[0]);
                            o.innerHTML = getFriendlyLanguageName(n);
                            i.document.write("<html>");
                            i.document.write("<head>");
                            i.document.write("<title>");
                            i.document.write(o.innerHTML);
                            i.document.write("</title>");
                            i.document.write("</head>");
                            i.document.write("<body>");
                            i.document.write("<code>");
                            i.document.write("<pre>");
                            i.document.write(r.innerHTML);
                            i.document.write("</pre>");
                            i.document.write("</code>");
                            i.document.write("</body>");
                            i.document.write("</html>");
                            i.document.close();
                            i.focus();
                            i.print();
                            i.close();
                            Trigger.customEvent(t.events.onPrint, r.innerHTML);
                        };
                        s.push(i);
                    }
                    if (t.showLanguageLabel) {
                        const e = DomElement.create("div", "language-label");
                        o.appendChild(e);
                        DomElement.setNodeText(e, getFriendlyLanguageName(n, t.languageLabelCasing), _configuration);
                    }
                    const l = s.length;
                    if (l > t.maximumButtons) {
                        const e = DomElement.create("button", "button button-opener");
                        e.innerText = t.buttonsVisible ? _configuration.text.buttonsCloserText : _configuration.text.buttonsOpenerText;
                        o.insertBefore(e, o.children[0]);
                        e.onclick = () => {
                            const n = e.innerText === _configuration.text.buttonsCloserText;
                            for (let e = 0; e < l; e++) {
                                s[e].style.display = n ? "none" : "inline-block";
                            }
                            e.innerText = n ? _configuration.text.buttonsOpenerText : _configuration.text.buttonsCloserText;
                            if (n) {
                                Trigger.customEvent(t.events.onButtonsClosed);
                            } else {
                                Trigger.customEvent(t.events.onButtonsOpened);
                            }
                        };
                    } else if (!t.buttonsVisible && l <= t.maximumButtons) {
                        for (let e = 0; e < l; e++) {
                            s[e].style.display = "inline-block";
                        }
                    }
                }
            }
            function renderElementButton(e, t, n, i, r) {
                const o = DomElement.create("button", "button");
                o.style.display = r.buttonsVisible ? "inline-block" : "none";
                n.appendChild(o);
                DomElement.setNodeText(o, e.text, _configuration);
                o.onclick = () => {
                    e.events.onClick(i);
                };
                if (Is.defined(e.className)) {
                    o.className += " " + e.className;
                }
                t.push(o);
            }
            function renderElementCommentVariables(e, t, n) {
                const i = t.comment;
                if (Is.definedString(i)) {
                    const t = e.match(new RegExp(`${i}.*`, "g"));
                    if (t !== null) {
                        const i = t.length;
                        for (let r = 0; r < i; r++) {
                            const i = t[r];
                            const o = `$C{${_cached_Comments_Count.toString()}}`;
                            _cached_Comments[o] = `<span class="comment">${i}</span>`;
                            _cached_Comments_Count++;
                            e = e.replace(i, o);
                            Trigger.customEvent(n.events.onCommentRender, i);
                        }
                    }
                }
                return e;
            }
            function renderElementMultiLineCommentVariables(e, t, n) {
                const i = t.multiLineComment;
                if (Is.definedArray(i) && i.length === 2) {
                    let t = 0;
                    let r = 0;
                    while (t >= 0 && r >= 0) {
                        t = e.indexOf(i[0], r);
                        if (t > -1) {
                            r = e.indexOf(i[1], t + i[0].length);
                            if (r > -1) {
                                const o = e.substring(t, r + i[1].length);
                                const s = o.split("\n");
                                const l = s.length;
                                const a = l === 1 ? "comment" : "multi-line-comment";
                                for (let t = 0; t < l; t++) {
                                    const n = `$C{${_cached_Comments_Count.toString()}}`;
                                    const i = s[t];
                                    _cached_Comments[n] = `<span class="${a}">${i}</span>`;
                                    _cached_Comments_Count++;
                                    e = e.replace(i, n);
                                }
                                Trigger.customEvent(n.events.onCommentRender, o);
                            }
                        }
                    }
                }
                return e;
            }
            function renderElementStringPatternVariables(e, t, n) {
                if (t !== null) {
                    const i = t.length;
                    for (let r = 0; r < i; r++) {
                        const i = t[r];
                        const o = i.split("\n");
                        const s = o.length;
                        const l = s === 1 ? "string" : "multi-line-string";
                        for (let t = 0; t < s; t++) {
                            const n = o[t];
                            const i = `$S{${_cached_Strings_Count.toString()}}`;
                            _cached_Strings[i] = `<span class="${l}">${n}</span>`;
                            _cached_Strings_Count++;
                            e = e.replace(n, i);
                        }
                        Trigger.customEvent(n.events.onStringRender, i);
                    }
                }
                return e;
            }
            function renderElementKeywords(e, t, n) {
                const i = Default.getStringOrArray(t.keywords, []);
                const r = i.length;
                const o = t.caseSensitive;
                const s = getKeywordCasing(t.keywordsCasing);
                Str.sortArrayOfStringByLength(i);
                for (let l = 0; l < r; l++) {
                    const r = i[l];
                    const a = getDisplayTextTestCasing(r, s);
                    const u = `KW${_cached_Keywords_Count.toString()};`;
                    let c = null;
                    const g = o ? "g" : "gi";
                    const d = new RegExp(getWordRegEx(r, t), g);
                    if (n.highlightKeywords) {
                        if (Is.definedFunction(n.events.onKeywordClicked)) {
                            c = `<span class="keyword-clickable">${a}</span>`;
                            e = e.replace(d, u);
                        } else {
                            c = `<span class="keyword">${a}</span>`;
                            e = e.replace(d, u);
                        }
                    } else {
                        if (Is.definedFunction(n.events.onKeywordClicked)) {
                            c = `<span class="no-highlight-keyword-clickable">${a}</span>`;
                            e = e.replace(d, u);
                        }
                    }
                    _cached_Keywords[u] = c;
                    _cached_Keywords_Count++;
                    Trigger.customEvent(n.events.onKeywordRender, r);
                }
                return e;
            }
            function replaceMarkUpKeywords(e, t, n) {
                const i = Default.getStringOrArray(t.keywords, []);
                const r = t.caseSensitive;
                const o = getKeywordCasing(t.keywordsCasing);
                const s = /(<([^>]+)>)/gi;
                const l = r ? "g" : "gi";
                let a = s.exec(e);
                while (a) {
                    if (a.index === s.lastIndex) {
                        s.lastIndex++;
                    }
                    let r = a[0];
                    r = r.replace("</", "").replace("<", "").replace(">", "");
                    r = r.split(" ")[0];
                    if (i.indexOf(r) > -1) {
                        const i = `KW${_cached_Keywords_Count.toString()};`;
                        const s = new RegExp(getWordRegEx(r, t), l);
                        let a = null;
                        let u = getDisplayTextTestCasing(r, o);
                        if (n.highlightKeywords) {
                            if (Is.definedFunction(n.events.onKeywordClicked)) {
                                a = `<span class="keyword-clickable">${u}</span>`;
                            } else {
                                a = `<span class="keyword">${u}</span>`;
                            }
                        } else {
                            if (Is.definedFunction(n.events.onKeywordClicked)) {
                                a = `<span class="no-highlight-keyword-clickable">${u}</span>`;
                            }
                        }
                        e = e.replace(s, i);
                        _cached_Keywords[i] = a;
                        _cached_Keywords_Count++;
                    }
                    a = s.exec(e);
                }
                return e;
            }
            function renderElementValues(e, t, n) {
                const i = Default.getStringOrArray(t.values, []);
                const r = i.length;
                const o = t.caseSensitive;
                Str.sortArrayOfStringByLength(i);
                for (let s = 0; s < r; s++) {
                    const r = i[s];
                    const l = `VAL${_cached_Values_Count.toString()};`;
                    let a = null;
                    const u = o ? "g" : "gi";
                    const c = new RegExp(getWordRegEx(r, t), u);
                    if (n.highlightValues) {
                        if (Is.definedFunction(n.events.onValueClicked)) {
                            a = `<span class="value-clickable">${r}</span>`;
                            e = e.replace(c, l);
                        } else {
                            a = `<span class="value">${r}</span>`;
                            e = e.replace(c, l);
                        }
                    } else {
                        if (Is.definedFunction(n.events.onValueClicked)) {
                            a = `<span class="no-highlight-value-clickable">${r}</span>`;
                            e = e.replace(c, l);
                        }
                    }
                    _cached_Values[l] = a;
                    _cached_Values_Count++;
                    Trigger.customEvent(n.events.onValueRender, r);
                }
                return e;
            }
            function renderElementAttributes(e, t, n) {
                const i = Default.getStringOrArray(t.attributes, []);
                const r = i.length;
                const o = t.caseSensitive;
                Str.sortArrayOfStringByLength(i);
                for (let s = 0; s < r; s++) {
                    const r = i[s];
                    const l = `ATTR${_cached_Attributes_Count.toString()};`;
                    let a = null;
                    let u = o ? "g" : "gi";
                    const c = new RegExp(getWordRegEx(r, t), u);
                    if (n.highlightAttributes) {
                        if (Is.definedFunction(n.events.onAttributeClicked)) {
                            a = `<span class="attribute-clickable">${r}</span>`;
                            e = e.replace(c, l);
                        } else {
                            a = `<span class="attribute">${r}</span>`;
                            e = e.replace(c, l);
                        }
                    } else {
                        if (Is.definedFunction(n.events.onAttributeClicked)) {
                            a = `<span class="no-highlight-attribute-clickable">${r}</span>`;
                            e = e.replace(c, l);
                        }
                    }
                    _cached_Attributes[l] = a;
                    _cached_Attributes_Count++;
                    Trigger.customEvent(n.events.onAttributeRender, r);
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
                let r = null;
                if (Is.definedArray(n) && n.length === 2) {
                    i = Str.encodeMarkUpCharacters(n[0]);
                    r = Str.encodeMarkUpCharacters(n[1]);
                }
                for (let o in _cached_Comments) {
                    if (_cached_Comments.hasOwnProperty(o)) {
                        let s = _cached_Comments[o];
                        if (t.isMarkUp && Is.definedString(i) && Is.definedString(r)) {
                            s = s.replace(n[0], i);
                            s = s.replace(n[1], r);
                        }
                        e = e.replace(o, s);
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
            function renderElementCompletedHTML(e, t, n, i, r, o) {
                const s = i.split("\n");
                const l = s.length;
                const a = l.toString().length;
                let u = t;
                let c = n;
                let g = null;
                let d = 1;
                let f = false;
                if (o) {
                    c = DomElement.create("pre");
                    n.appendChild(c);
                    if (Is.defined(t)) {
                        u = DomElement.create("pre");
                        t.appendChild(u);
                    }
                }
                if (r.doubleClickToSelectAll) {
                    if (Is.defined(e)) {
                        e.ondblclick = () => {
                            DomElement.selectTextInElement(c);
                        };
                    }
                    if (Is.defined(t)) {
                        t.ondblclick = () => {
                            DomElement.selectTextInElement(c);
                        };
                    }
                    n.ondblclick = () => {
                        DomElement.selectTextInElement(c);
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
                            if (e && !f || !r.removeDuplicateBlankLines || !e) {
                                f = e;
                                if (Is.defined(u)) {
                                    const e = DomElement.create("p");
                                    if (r.padLineNumbers) {
                                        e.innerText = Str.padNumber(d.toString(), a);
                                    } else {
                                        e.innerText = d.toString();
                                    }
                                    u.appendChild(e);
                                    d++;
                                }
                                if (g !== null) {
                                    t = t.replace(g, "");
                                    if (!o) {
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
                    const r = [].slice.call(i);
                    const o = r.length;
                    for (let e = 0; e < o; e++) {
                        renderElementClickEvent(r[e], t);
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
            function buildDefaultConfiguration(e = null) {
                _configuration = Default.getObject(e, {});
                _configuration.safeMode = Default.getBoolean(_configuration.safeMode, true);
                _configuration.highlightAllDomElementTypes = Default.getStringOrArray(_configuration.highlightAllDomElementTypes, [ "div", "code" ]);
                _configuration.allowHtmlInTextDisplay = Default.getBoolean(_configuration.allowHtmlInTextDisplay, true);
                buildDefaultConfigurationStrings();
                buildDefaultConfigurationCustomTriggers();
            }
            function buildDefaultConfigurationStrings() {
                _configuration.text = Default.getObject(_configuration.text, {});
                _configuration.text.buttonsOpenerText = Default.getAnyString(_configuration.text.buttonsOpenerText, "←");
                _configuration.text.buttonsCloserText = Default.getAnyString(_configuration.text.buttonsCloserText, "→");
                _configuration.text.objectErrorText = Default.getAnyString(_configuration.text.objectErrorText, "Errors in object: {{error_1}}, {{error_2}}");
                _configuration.text.attributeNotSetErrorText = Default.getAnyString(_configuration.text.attributeNotSetErrorText, "The attribute '{{attribute_name}}' has not been set correctly.");
                _configuration.text.languageNotSupportedErrorText = Default.getAnyString(_configuration.text.languageNotSupportedErrorText, "Language '{{language}}' is not supported.");
                _configuration.text.noCodeAvailableToRenderErrorText = Default.getAnyString(_configuration.text.noCodeAvailableToRenderErrorText, "No code is available to render.");
                _configuration.text.copyButtonText = Default.getAnyString(_configuration.text.copyButtonText, "Copy");
                _configuration.text.printButtonText = Default.getAnyString(_configuration.text.printButtonText, "Print");
            }
            function buildDefaultConfigurationCustomTriggers() {
                _configuration.events = Default.getObject(_configuration.events, {});
                _configuration.events.onBeforeRender = Default.getFunction(_configuration.events.onBeforeRender, null);
                _configuration.events.onAfterRender = Default.getFunction(_configuration.events.onAfterRender, null);
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
                    const r = e.toLowerCase();
                    if (!_languages.hasOwnProperty(r)) {
                        _languages[r] = t;
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
                        t = Default.getClonedObject(n);
                    }
                    return t;
                },
                getLanguages: function() {
                    return Default.getClonedObject(_languages);
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
                    return Default.getClonedObject(_aliases_Rules);
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
        })();
    }
});

export default require_syntax();//# sourceMappingURL=syntax.esm.js.map