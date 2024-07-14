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
    function r(e) {
        return t(e) && typeof e === "boolean";
    }
    e.definedBoolean = r;
    function i(e) {
        return t(e) && typeof e === "string";
    }
    e.definedString = i;
    function o(e) {
        return t(e) && typeof e === "function";
    }
    e.definedFunction = o;
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
        function r(e) {
            e = e.replace(/</g, "&lt;");
            e = e.replace(/>/g, "&gt;");
            return e;
        }
        e.encodeMarkUpCharacters = r;
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
    function r(e, t) {
        return Is.definedString(e) ? e : t;
    }
    e.getDefaultString = r;
    function i(e, t) {
        return Is.definedBoolean(e) ? e : t;
    }
    e.getDefaultBoolean = i;
    function o(e, t) {
        return Is.definedNumber(e) ? e : t;
    }
    e.getDefaultNumber = o;
    function l(e, t) {
        return Is.definedFunction(e) ? e : t;
    }
    e.getDefaultFunction = l;
    function a(e, t) {
        return Is.definedArray(e) ? e : t;
    }
    e.getDefaultArray = a;
    function u(e, t) {
        return Is.definedObject(e) ? e : t;
    }
    e.getDefaultObject = u;
    function s(e, t) {
        let n = t;
        if (Is.definedString(e)) {
            const r = e.toString().split(" ");
            if (r.length === 0) {
                e = t;
            } else {
                n = r;
            }
        } else {
            n = a(e, t);
        }
        return n;
    }
    e.getDefaultStringOrArray = s;
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
        const r = n === "text";
        let i = r ? document.createTextNode("") : document.createElement(n);
        if (Is.defined(t)) {
            i.className = t;
        }
        return i;
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
        var t = document.createRange();
        t.selectNode(e);
        window.getSelection().removeAllRanges();
        window.getSelection().addRange(t);
    }
    e.selectTextInElement = r;
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
    function renderElementValues(e, t, n) {
        const r = Data.getDefaultStringOrArray(t.values, []);
        const i = r.length;
        const o = t.caseSensitive;
        Data.String.sortArrayOfStringByLength(r);
        for (let l = 0; l < i; l++) {
            const i = r[l];
            const a = "VAL" + _cached_Values_Count.toString() + ";";
            let u = null;
            const s = o ? "g" : "gi";
            const c = new RegExp(getWordRegEx(i, t), s);
            if (n.highlightValues) {
                if (Is.definedFunction(n.events.onValueClicked)) {
                    u = '<span class="value-clickable">' + i + "</span>";
                    e = e.replace(c, a);
                } else {
                    u = '<span class="value">' + i + "</span>";
                    e = e.replace(c, a);
                }
            } else {
                if (Is.definedFunction(n.events.onValueClicked)) {
                    u = '<span class="no-highlight-value-clickable">' + i + "</span>";
                    e = e.replace(c, a);
                }
            }
            _cached_Values[a] = u;
            _cached_Values_Count++;
            fireCustomTriggerEvent(n.events.onValueRender, i);
        }
        return e;
    }
    function renderElementAttributes(e, t, n) {
        const r = Data.getDefaultStringOrArray(t.attributes, []);
        const i = r.length;
        const o = t.caseSensitive;
        Data.String.sortArrayOfStringByLength(r);
        for (let l = 0; l < i; l++) {
            const i = r[l];
            const a = "ATTR" + _cached_Attributes_Count.toString() + ";";
            let u = null;
            let s = o ? "g" : "gi";
            const c = new RegExp(getWordRegEx(i, t), s);
            if (n.highlightAttributes) {
                if (Is.definedFunction(n.events.onAttributeClicked)) {
                    u = '<span class="attribute-clickable">' + i + "</span>";
                    e = e.replace(c, a);
                } else {
                    u = '<span class="attribute">' + i + "</span>";
                    e = e.replace(c, a);
                }
            } else {
                if (Is.definedFunction(n.events.onAttributeClicked)) {
                    u = '<span class="no-highlight-attribute-clickable">' + i + "</span>";
                    e = e.replace(c, a);
                }
            }
            _cached_Attributes[a] = u;
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
        let r = null;
        let i = null;
        if (Is.definedArray(n) && n.length === 2) {
            r = Data.String.encodeMarkUpCharacters(n[0]);
            i = Data.String.encodeMarkUpCharacters(n[1]);
        }
        for (let o in _cached_Comments) {
            if (_cached_Comments.hasOwnProperty(o)) {
                let l = _cached_Comments[o];
                if (t.isMarkUp && Is.definedString(r) && Is.definedString(i)) {
                    l = l.replace(n[0], r);
                    l = l.replace(n[1], i);
                }
                e = e.replace(o, l);
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
    function renderElementCompletedHTML(e, t, n, r, i, o, l) {
        const a = i.split("\n");
        const u = a.length;
        const s = u.toString().length;
        let c = n;
        let g = r;
        let d = null;
        let f = 1;
        let m = false;
        if (l) {
            g = DomElement.create("pre");
            r.appendChild(g);
            if (Is.defined(n)) {
                c = DomElement.create("pre");
                n.appendChild(c);
            }
        }
        if (o.doubleClickToSelectAll) {
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
            r.ondblclick = function() {
                DomElement.selectTextInElement(g);
            };
        }
        for (let e = 0; e < u; e++) {
            let t = a[e];
            if (t.trim() !== "" && d === null) {
                d = t.substring(0, t.match(/^\s*/)[0].length);
            }
            if (e !== 0 && e !== u - 1 || t.trim() !== "") {
                if (t.trim() !== "" || !o.removeBlankLines) {
                    const e = t.trim() === "";
                    if (e && !m || !o.removeDuplicateBlankLines || !e) {
                        m = e;
                        if (Is.defined(c)) {
                            const e = DomElement.create("p");
                            if (o.padLineNumbers) {
                                e.innerText = Data.String.padNumber(f.toString(), s);
                            } else {
                                e.innerText = f.toString();
                            }
                            c.appendChild(e);
                            f++;
                        }
                        if (d !== null) {
                            t = t.replace(d, "");
                            if (!l) {
                                const e = t.match(/^\s*/)[0].length;
                                const n = t.substring(0, e);
                                const r = Array(e).join("&nbsp;");
                                t = t.replace(n, r);
                            }
                        }
                        const n = DomElement.create("p");
                        n.innerHTML = t.trim() === "" ? "<br>" : t;
                        g.appendChild(n);
                    }
                }
            }
        }
        renderElementClickEvents(e, o.events.onKeywordClicked, "keyword-clickable");
        renderElementClickEvents(e, o.events.onValueClicked, "value-clickable");
    }
    function renderElementClickEvents(e, t, n) {
        if (Is.definedFunction(t)) {
            const e = document.getElementsByTagName(n);
            const r = [].slice.call(e);
            const i = r.length;
            for (let e = 0; e < i; e++) {
                renderElementClickEvent(r[e], t);
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