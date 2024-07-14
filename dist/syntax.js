"use strict";

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
    function r(e) {
        return t(e) && typeof e === "string";
    }
    e.definedString = r;
    function i(e) {
        return t(e) && typeof e === "function";
    }
    e.definedFunction = i;
    function l(e) {
        return t(e) && typeof e === "number";
    }
    e.definedNumber = l;
    function a(e) {
        return n(e) && e instanceof Array;
    }
    e.definedArray = a;
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
        function r(e) {
            e.sort((function(e, t) {
                return t.length - e.length;
            }));
        }
        e.sortArrayOfStringByLength = r;
    })(t = e.String || (e.String = {}));
    function n(e, t) {
        return typeof e === "string" ? e : t;
    }
    e.getDefaultAnyString = n;
    function o(e, t) {
        return Is.definedString(e) ? e : t;
    }
    e.getDefaultString = o;
    function r(e, t) {
        return Is.definedBoolean(e) ? e : t;
    }
    e.getDefaultBoolean = r;
    function i(e, t) {
        return Is.definedNumber(e) ? e : t;
    }
    e.getDefaultNumber = i;
    function l(e, t) {
        return Is.definedFunction(e) ? e : t;
    }
    e.getDefaultFunction = l;
    function a(e, t) {
        return Is.definedArray(e) ? e : t;
    }
    e.getDefaultArray = a;
    function s(e, t) {
        return Is.definedObject(e) ? e : t;
    }
    e.getDefaultObject = s;
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
            n = a(e, t);
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
        let r = o ? document.createTextNode("") : document.createElement(n);
        if (Is.defined(t)) {
            r.className = t;
        }
        return r;
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
    function renderElementButton(e, t, n, o, r) {
        const i = DomElement.create("button", "button");
        i.style.display = r.buttonsVisible ? "inline-block" : "none";
        n.appendChild(i);
        DomElement.setNodeText(i, e.text, _configuration);
        i.onclick = function() {
            e.onClick(o);
        };
        if (Is.defined(e.className)) {
            i.className += " " + e.className;
        }
        t.push(i);
    }
    function renderElementCommentVariables(e, t, n) {
        const o = t.comment;
        if (Is.definedString(o)) {
            const t = e.match(new RegExp(o + ".*", "g"));
            if (t !== null) {
                const o = t.length;
                for (let r = 0; r < o; r++) {
                    const o = t[r];
                    const i = "$C{" + _cached_Comments_Count.toString() + "}";
                    _cached_Comments[i] = '<span class="comment">' + o + "</span>";
                    _cached_Comments_Count++;
                    e = e.replace(o, i);
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
            let i = 0;
            while (t >= 0 && i >= 0) {
                t = e.indexOf(o[0], i);
                if (t > -1) {
                    i = e.indexOf(o[1], t + o[0].length);
                    if (i > -1) {
                        const l = e.substring(t, i + o[1].length);
                        const a = l.split("\n");
                        const s = a.length;
                        const c = s === 1 ? "comment" : "multi-line-comment";
                        for (var r = 0; r < s; r++) {
                            const t = "$C{" + _cached_Comments_Count.toString() + "}";
                            const n = a[r];
                            _cached_Comments[t] = '<span class="' + c + '">' + n + "</span>";
                            _cached_Comments_Count++;
                            e = e.replace(n, t);
                        }
                        fireCustomTriggerEvent(n.events.onCommentRender, l);
                    }
                }
            }
        }
        return e;
    }
    function renderElementStringPatternVariables(e, t, n) {
        if (t !== null) {
            const o = t.length;
            for (let r = 0; r < o; r++) {
                const o = t[r];
                const i = o.split("\n");
                const l = i.length;
                const a = l === 1 ? "string" : "multi-line-string";
                for (let t = 0; t < l; t++) {
                    const n = i[t];
                    const o = "$S{" + _cached_Strings_Count.toString() + "}";
                    _cached_Strings[o] = '<span class="' + a + '">' + n + "</span>";
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
        const r = o.length;
        const i = t.caseSensitive;
        const l = getKeywordCasing(t.keywordsCasing);
        Data.String.sortArrayOfStringByLength(o);
        for (let a = 0; a < r; a++) {
            const r = o[a];
            const s = getDisplayTextTestCasing(r, l);
            const c = "KW" + _cached_Keywords_Count.toString() + ";";
            let u = null;
            const g = i ? "g" : "gi";
            const d = new RegExp(getWordRegEx(r, t), g);
            if (n.highlightKeywords) {
                if (Is.definedFunction(n.events.onKeywordClicked)) {
                    u = '<span class="keyword-clickable">' + s + "</span>";
                    e = e.replace(d, c);
                } else {
                    u = '<span class="keyword">' + s + "</span>";
                    e = e.replace(d, c);
                }
            } else {
                if (Is.definedFunction(n.events.onKeywordClicked)) {
                    u = '<span class="no-highlight-keyword-clickable">' + s + "</span>";
                    e = e.replace(d, c);
                }
            }
            _cached_Keywords[c] = u;
            _cached_Keywords_Count++;
            fireCustomTriggerEvent(n.events.onKeywordRender, r);
        }
        return e;
    }
    function replaceMarkUpKeywords(e, t, n) {
        const o = Data.getDefaultStringOrArray(t.keywords, []);
        const r = t.caseSensitive;
        const i = getKeywordCasing(t.keywordsCasing);
        const l = /(<([^>]+)>)/gi;
        const a = r ? "g" : "gi";
        let s = l.exec(e);
        while (s) {
            if (s.index === l.lastIndex) {
                l.lastIndex++;
            }
            let r = s[0];
            r = r.replace("</", "").replace("<", "").replace(">", "");
            r = r.split(" ")[0];
            if (o.indexOf(r) > -1) {
                const o = "KW" + _cached_Keywords_Count.toString() + ";";
                const l = new RegExp(getWordRegEx(r, t), a);
                let s = null;
                let c = getDisplayTextTestCasing(r, i);
                if (n.highlightKeywords) {
                    if (Is.definedFunction(n.events.onKeywordClicked)) {
                        s = '<span class="keyword-clickable">' + c + "</span>";
                    } else {
                        s = '<span class="keyword">' + c + "</span>";
                    }
                } else {
                    if (Is.definedFunction(n.events.onKeywordClicked)) {
                        s = '<span class="no-highlight-keyword-clickable">' + c + "</span>";
                    }
                }
                e = e.replace(l, o);
                _cached_Keywords[o] = s;
                _cached_Keywords_Count++;
            }
            s = l.exec(e);
        }
        return e;
    }
    function renderElementValues(e, t, n) {
        const o = Data.getDefaultStringOrArray(t.values, []);
        const r = o.length;
        const i = t.caseSensitive;
        Data.String.sortArrayOfStringByLength(o);
        for (let l = 0; l < r; l++) {
            const r = o[l];
            const a = "VAL" + _cached_Values_Count.toString() + ";";
            let s = null;
            const c = i ? "g" : "gi";
            const u = new RegExp(getWordRegEx(r, t), c);
            if (n.highlightValues) {
                if (Is.definedFunction(n.events.onValueClicked)) {
                    s = '<span class="value-clickable">' + r + "</span>";
                    e = e.replace(u, a);
                } else {
                    s = '<span class="value">' + r + "</span>";
                    e = e.replace(u, a);
                }
            } else {
                if (Is.definedFunction(n.events.onValueClicked)) {
                    s = '<span class="no-highlight-value-clickable">' + r + "</span>";
                    e = e.replace(u, a);
                }
            }
            _cached_Values[a] = s;
            _cached_Values_Count++;
            fireCustomTriggerEvent(n.events.onValueRender, r);
        }
        return e;
    }
    function renderElementAttributes(e, t, n) {
        const o = Data.getDefaultStringOrArray(t.attributes, []);
        const r = o.length;
        const i = t.caseSensitive;
        Data.String.sortArrayOfStringByLength(o);
        for (let l = 0; l < r; l++) {
            const r = o[l];
            const a = "ATTR" + _cached_Attributes_Count.toString() + ";";
            let s = null;
            let c = i ? "g" : "gi";
            const u = new RegExp(getWordRegEx(r, t), c);
            if (n.highlightAttributes) {
                if (Is.definedFunction(n.events.onAttributeClicked)) {
                    s = '<span class="attribute-clickable">' + r + "</span>";
                    e = e.replace(u, a);
                } else {
                    s = '<span class="attribute">' + r + "</span>";
                    e = e.replace(u, a);
                }
            } else {
                if (Is.definedFunction(n.events.onAttributeClicked)) {
                    s = '<span class="no-highlight-attribute-clickable">' + r + "</span>";
                    e = e.replace(u, a);
                }
            }
            _cached_Attributes[a] = s;
            _cached_Attributes_Count++;
            fireCustomTriggerEvent(n.events.onAttributeRender, r);
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
        let r = null;
        if (Is.definedArray(n) && n.length === 2) {
            o = Data.String.encodeMarkUpCharacters(n[0]);
            r = Data.String.encodeMarkUpCharacters(n[1]);
        }
        for (let i in _cached_Comments) {
            if (_cached_Comments.hasOwnProperty(i)) {
                let l = _cached_Comments[i];
                if (t.isMarkUp && Is.definedString(o) && Is.definedString(r)) {
                    l = l.replace(n[0], o);
                    l = l.replace(n[1], r);
                }
                e = e.replace(i, l);
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
    function renderElementCompletedHTML(e, t, n, o, r, i, l) {
        const a = r.split("\n");
        const s = a.length;
        const c = s.toString().length;
        let u = n;
        let g = o;
        let d = null;
        let f = 1;
        let m = false;
        if (l) {
            g = DomElement.create("pre");
            o.appendChild(g);
            if (Is.defined(n)) {
                u = DomElement.create("pre");
                n.appendChild(u);
            }
        }
        if (i.doubleClickToSelectAll) {
            if (Is.defined(t)) {
                t.ondblclick = function() {
                    DomElement.selectTextInElement(g);
                };
            }
            if (Is.defined(n)) {
                n.ondblclick = function() {
                    DomElement.selectTextInElement(g);
                };
            }
            o.ondblclick = function() {
                DomElement.selectTextInElement(g);
            };
        }
        for (let e = 0; e < s; e++) {
            let t = a[e];
            if (t.trim() !== "" && d === null) {
                d = t.substring(0, t.match(/^\s*/)[0].length);
            }
            if (e !== 0 && e !== s - 1 || t.trim() !== "") {
                if (t.trim() !== "" || !i.removeBlankLines) {
                    const e = t.trim() === "";
                    if (e && !m || !i.removeDuplicateBlankLines || !e) {
                        m = e;
                        if (Is.defined(u)) {
                            const e = DomElement.create("p");
                            if (i.padLineNumbers) {
                                e.innerText = Data.String.padNumber(f.toString(), c);
                            } else {
                                e.innerText = f.toString();
                            }
                            u.appendChild(e);
                            f++;
                        }
                        if (d !== null) {
                            t = t.replace(d, "");
                            if (!l) {
                                const e = t.match(/^\s*/)[0].length;
                                const n = t.substring(0, e);
                                const o = Array(e).join("&nbsp;");
                                t = t.replace(n, o);
                            }
                        }
                        const n = DomElement.create("p");
                        n.innerHTML = t.trim() === "" ? "<br>" : t;
                        g.appendChild(n);
                    }
                }
            }
        }
        renderElementClickEvents(e, i.events.onKeywordClicked, "keyword-clickable");
        renderElementClickEvents(e, i.events.onValueClicked, "value-clickable");
    }
    function renderElementClickEvents(e, t, n) {
        if (Is.definedFunction(t)) {
            const e = document.getElementsByTagName(n);
            const o = [].slice.call(e);
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
    function getFriendlyLanguageName(e, t) {
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