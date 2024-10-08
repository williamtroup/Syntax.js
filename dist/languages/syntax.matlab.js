/*! Syntax.js v3.1.0 | (c) Bunoon 2024 | MIT License */
$syntax.addLanguage( "matlab", {
    friendlyName: "Matlab",
    keywords: [
        "break",
        "case",
        "catch",
        "classdef",
        "continue",
        "else",
        "elseif",
        "end",
        "for",
        "function",
        "global",
        "if",
        "otherwise",
        "parfor",
        "persistent",
        "return",
        "spmd",
        "switch",
        "try",
        "while"
    ],
    comment: "%",
    multiLineComment: [ "%{", "%}" ],
    caseSensitive: true,
    keywordsCasing: "initial"
}, false );