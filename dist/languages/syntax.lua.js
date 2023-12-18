/*! Syntax.js v2.0.0 | (c) Bunoon | MIT License */
$syntax.addLanguage( "lua", {
    friendlyName: "Lua",
    keywords: [
        "and",
        "break",
        "do",
        "else",
        "elseif",
        "end",
        "for",
        "function",
        "if",
        "in",
        "local",
        "not",
        "or",
        "repeat",
        "return",
        "then",
        "until",
        "while"       
    ],
    values: [
        "false",
        "true",
        "nil"
    ],
    comment: "--",
    multiLineComment: [ "--[[", "--]]" ],
    caseSensitive: true,
    keywordsCasing: "initial"
}, false );