"use strict";

var Is;

(t => {
    function e(t) {
        return t !== null && t !== void 0 && t.toString() !== "";
    }
    t.defined = e;
    function n(t) {
        return e(t) && typeof t === "object";
    }
    t.definedObject = n;
    function r(t) {
        return e(t) && typeof t === "boolean";
    }
    t.definedBoolean = r;
    function o(t) {
        return e(t) && typeof t === "string";
    }
    t.definedString = o;
    function i(t) {
        return e(t) && typeof t === "function";
    }
    t.definedFunction = i;
    function u(t) {
        return e(t) && typeof t === "number";
    }
    t.definedNumber = u;
    function c(t) {
        return n(t) && t instanceof Array;
    }
    t.definedArray = c;
})(Is || (Is = {}));

var Data;

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
        function r(t) {
            t = t.replace(/</g, "&lt;");
            t = t.replace(/>/g, "&gt;");
            return t;
        }
        t.encodeMarkUpCharacters = r;
        function o(t) {
            t.sort((function(t, e) {
                return e.length - t.length;
            }));
        }
        t.sortArrayOfStringByLength = o;
    })(e = t.String || (t.String = {}));
    function n(t, e) {
        return typeof t === "string" ? t : e;
    }
    t.getDefaultAnyString = n;
    function r(t, e) {
        return Is.definedString(t) ? t : e;
    }
    t.getDefaultString = r;
    function o(t, e) {
        return Is.definedBoolean(t) ? t : e;
    }
    t.getDefaultBoolean = o;
    function i(t, e) {
        return Is.definedNumber(t) ? t : e;
    }
    t.getDefaultNumber = i;
    function u(t, e) {
        return Is.definedFunction(t) ? t : e;
    }
    t.getDefaultFunction = u;
    function c(t, e) {
        return Is.definedArray(t) ? t : e;
    }
    t.getDefaultArray = c;
    function l(t, e) {
        return Is.definedObject(t) ? t : e;
    }
    t.getDefaultObject = l;
    function a(t, e) {
        let n = e;
        if (Is.definedString(t)) {
            const r = t.toString().split(" ");
            if (r.length === 0) {
                t = e;
            } else {
                n = r;
            }
        } else {
            n = c(t, e);
        }
        return n;
    }
    t.getDefaultStringOrArray = a;
    function f(t) {
        const e = JSON.stringify(t);
        const n = JSON.parse(e);
        return n;
    }
    t.getClonedObject = f;
})(Data || (Data = {}));

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
})();//# sourceMappingURL=syntax.js.map