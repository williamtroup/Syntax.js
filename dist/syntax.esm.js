var __getOwnPropNames = Object.getOwnPropertyNames;

var __esm = (e, t) => function n() {
    return e && (t = (0, e[__getOwnPropNames(e)[0]])(e = 0)), t;
};

var __commonJS = (e, t) => function n() {
    return t || (0, e[__getOwnPropNames(e)[0]])((t = {
        exports: {}
    }).exports, t), t.exports;
};

var init_enum = __esm({
    "src/ts/enum.ts"() {
        "use strict";
    }
});

var Is;

var init_is = __esm({
    "src/ts/is.ts"() {
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
            function u(e) {
                return t(e) && typeof e === "number";
            }
            e.definedNumber = u;
            function a(e) {
                return n(e) && e instanceof Array;
            }
            e.definedArray = a;
        })(Is || (Is = {}));
    }
});

var Data;

var init_data = __esm({
    "src/ts/data.ts"() {
        "use strict";
        init_enum();
        init_is();
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
            function u(e, t) {
                return Is.definedFunction(e) ? e : t;
            }
            e.getDefaultFunction = u;
            function a(e, t) {
                return Is.definedArray(e) ? e : t;
            }
            e.getDefaultArray = a;
            function l(e, t) {
                return Is.definedObject(e) ? e : t;
            }
            e.getDefaultObject = l;
            function s(e, t) {
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
            e.getDefaultStringOrArray = s;
            function g(e) {
                const t = JSON.stringify(e);
                const n = JSON.parse(t);
                return n;
            }
            e.getClonedObject = g;
        })(Data || (Data = {}));
    }
});

var require_syntax = __commonJS({
    "src/syntax.ts"(exports, module) {
        init_data();
        init_is();
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
        })();
    }
});

export default require_syntax();//# sourceMappingURL=syntax.esm.js.map