var __getOwnPropNames = Object.getOwnPropertyNames;

var __esm = (t, e) => function n() {
    return t && (e = (0, t[__getOwnPropNames(t)[0]])(t = 0)), e;
};

var __commonJS = (t, e) => function n() {
    return e || (0, t[__getOwnPropNames(t)[0]])((e = {
        exports: {}
    }).exports, e), e.exports;
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
        (t => {
            function e(t) {
                return t !== null && t !== void 0 && t.toString() !== "";
            }
            t.defined = e;
            function n(t) {
                return e(t) && typeof t === "object";
            }
            t.definedObject = n;
            function o(t) {
                return e(t) && typeof t === "boolean";
            }
            t.definedBoolean = o;
            function r(t) {
                return e(t) && typeof t === "string";
            }
            t.definedString = r;
            function i(t) {
                return e(t) && typeof t === "function";
            }
            t.definedFunction = i;
            function u(t) {
                return e(t) && typeof t === "number";
            }
            t.definedNumber = u;
            function a(t) {
                return n(t) && t instanceof Array;
            }
            t.definedArray = a;
        })(Is || (Is = {}));
    }
});

var Data;

var init_data = __esm({
    "src/ts/data.ts"() {
        "use strict";
        init_enum();
        init_is();
        (t => {
            let e;
            (t => {
                function e() {
                    const t = [];
                    for (let e = 0; e < 32; e++) {
                        if (e === 8 || e === 12 || e === 16 || e === 20) {
                            t.push("-");
                        }
                        const n = Math.floor(Math.random() * 16).toString(16);
                        t.push(n);
                    }
                    return t.join("");
                }
                t.newGuid = e;
                function n(t, e) {
                    let n = t;
                    while (n.length < e) {
                        n = "0" + n;
                    }
                    return n;
                }
                t.padNumber = n;
                function o(t) {
                    t = t.replace(/</g, "&lt;");
                    t = t.replace(/>/g, "&gt;");
                    return t;
                }
                t.encodeMarkUpCharacters = o;
                function r(t) {
                    t.sort((function(t, e) {
                        return e.length - t.length;
                    }));
                }
                t.sortArrayOfStringByLength = r;
            })(e = t.String || (t.String = {}));
            function n(t, e) {
                return typeof t === "string" ? t : e;
            }
            t.getDefaultAnyString = n;
            function o(t, e) {
                return Is.definedString(t) ? t : e;
            }
            t.getDefaultString = o;
            function r(t, e) {
                return Is.definedBoolean(t) ? t : e;
            }
            t.getDefaultBoolean = r;
            function i(t, e) {
                return Is.definedNumber(t) ? t : e;
            }
            t.getDefaultNumber = i;
            function u(t, e) {
                return Is.definedFunction(t) ? t : e;
            }
            t.getDefaultFunction = u;
            function a(t, e) {
                return Is.definedArray(t) ? t : e;
            }
            t.getDefaultArray = a;
            function l(t, e) {
                return Is.definedObject(t) ? t : e;
            }
            t.getDefaultObject = l;
            function s(t, e) {
                let n = e;
                if (Is.definedString(t)) {
                    const o = t.toString().split(" ");
                    if (o.length === 0) {
                        t = e;
                    } else {
                        n = o;
                    }
                } else {
                    n = a(t, e);
                }
                return n;
            }
            t.getDefaultStringOrArray = s;
            function c(t) {
                const e = JSON.stringify(t);
                const n = JSON.parse(e);
                return n;
            }
            t.getClonedObject = c;
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
            function getBindingOptions(t) {
                let e = Data.getDefaultObject(t, {});
                e = buildBindingAttributeOptions(e);
                e = buildBindingAttributeOptionCustomTriggers(e);
                return e;
            }
            function buildBindingAttributeOptions(t) {
                t.showCopyButton = Data.getDefaultBoolean(t.showCopyButton, true);
                t.removeBlankLines = Data.getDefaultBoolean(t.removeBlankLines, false);
                t.showLineNumbers = Data.getDefaultBoolean(t.showLineNumbers, true);
                t.highlightKeywords = Data.getDefaultBoolean(t.highlightKeywords, true);
                t.highlightValues = Data.getDefaultBoolean(t.highlightValues, true);
                t.highlightAttributes = Data.getDefaultBoolean(t.highlightAttributes, true);
                t.highlightStrings = Data.getDefaultBoolean(t.highlightStrings, true);
                t.highlightComments = Data.getDefaultBoolean(t.highlightComments, true);
                t.showLanguageLabel = Data.getDefaultBoolean(t.showLanguageLabel, true);
                t.showPrintButton = Data.getDefaultBoolean(t.showPrintButton, true);
                t.padLineNumbers = Data.getDefaultBoolean(t.padLineNumbers, false);
                t.removeDuplicateBlankLines = Data.getDefaultBoolean(t.removeDuplicateBlankLines, true);
                t.doubleClickToSelectAll = Data.getDefaultBoolean(t.doubleClickToSelectAll, true);
                t.languageLabelCasing = Data.getDefaultString(t.languageLabelCasing, "uppercase");
                t.buttonsVisible = Data.getDefaultBoolean(t.buttonsVisible, true);
                t.maximumButtons = Data.getDefaultNumber(t.maximumButtons, 2);
                return t;
            }
            function buildBindingAttributeOptionCustomTriggers(t) {
                t.events.onCopy = Data.getDefaultFunction(t.events.onCopy, null);
                t.events.onRenderComplete = Data.getDefaultFunction(t.events.onRenderComplete, null);
                t.events.onKeywordClicked = Data.getDefaultFunction(t.events.onKeywordClicked, null);
                t.events.onValueClicked = Data.getDefaultFunction(t.events.onValueClicked, null);
                t.events.onAttributeClicked = Data.getDefaultFunction(t.events.onAttributeClicked, null);
                t.events.onKeywordRender = Data.getDefaultFunction(t.events.onKeywordRender, null);
                t.events.onValueRender = Data.getDefaultFunction(t.events.onValueRender, null);
                t.events.onAttributeRender = Data.getDefaultFunction(t.events.onAttributeRender, null);
                t.events.onStringRender = Data.getDefaultFunction(t.events.onStringRender, null);
                t.events.onCommentRender = Data.getDefaultFunction(t.events.onCommentRender, null);
                t.events.onPrint = Data.getDefaultFunction(t.events.onPrint, null);
                t.events.onBeforeRenderComplete = Data.getDefaultFunction(t.events.onBeforeRenderComplete, null);
                t.events.onButtonsOpened = Data.getDefaultFunction(t.events.onButtonsOpened, null);
                t.events.onButtonsClosed = Data.getDefaultFunction(t.events.onButtonsClosed, null);
                return t;
            }
            function getBindingTabContentOptions(t) {
                let e = Data.getDefaultObject(t, {});
                e = buildBindingTabContentAttributeOptionStrings(e);
                e = buildBindingTabContentAttributeOptionCustomTriggers(e);
                return e;
            }
            function buildBindingTabContentAttributeOptionStrings(t) {
                t.title = Data.getDefaultString(t.title, null);
                t.description = Data.getDefaultString(t.description, null);
                return t;
            }
            function buildBindingTabContentAttributeOptionCustomTriggers(t) {
                t.events = Data.getDefaultFunction(t.events, {});
                t.events.onOpen = Data.getDefaultFunction(t.events.onOpen, null);
                return t;
            }
            function fireCustomTriggerEvent(t, ...e) {
                if (Is.definedFunction(t)) {
                    t.apply(null, [].slice.call(e, 0));
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
                    } catch (t) {
                        if (!_configuration.safeMode) {
                            logError(_configuration.text.objectErrorText.replace("{{error_1}}", e1.message).replace("{{error_2}}", t.message));
                            result.parsed = false;
                        }
                        result.object = null;
                    }
                }
                return result;
            }
            function logError(t) {
                let e = true;
                if (!_configuration.safeMode) {
                    console.error(t);
                    e = false;
                }
                return e;
            }
            const _public = {
                highlightAll: function() {
                    throw new Error("Function not implemented.");
                },
                highlightElement: function(t) {
                    throw new Error("Function not implemented.");
                },
                getElementsHighlighted: function() {
                    throw new Error("Function not implemented.");
                },
                getCode: function(t) {
                    throw new Error("Function not implemented.");
                },
                destroyAll: function() {
                    throw new Error("Function not implemented.");
                },
                destroy: function(t) {
                    throw new Error("Function not implemented.");
                },
                addLanguage: function(t, e, n = true) {
                    throw new Error("Function not implemented.");
                },
                removeLanguage: function(t) {
                    throw new Error("Function not implemented.");
                },
                getLanguage: function(t) {
                    throw new Error("Function not implemented.");
                },
                getLanguages: function() {
                    throw new Error("Function not implemented.");
                },
                addAlias: function(t, e, n = true) {
                    throw new Error("Function not implemented.");
                },
                removeAlias: function(t) {
                    throw new Error("Function not implemented.");
                },
                getAlias: function(t) {
                    throw new Error("Function not implemented.");
                },
                getAliases: function() {
                    throw new Error("Function not implemented.");
                },
                setConfiguration: function(t) {
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