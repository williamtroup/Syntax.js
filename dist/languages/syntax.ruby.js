/*! Syntax.js v1.7.0 | (c) Bunoon | MIT License */
$syntax.addLanguage( "ruby", {
    friendlyName: "Ruby",
    keywords: [
        "BEGIN",
        "END",
        "alias",
        "and",
        "begin",
        "break",
        "case",
        "class",
        "def",
        "module",
        "next",
        "nil",
        "not",
        "or",
        "redo",
        "rescue",
        "retry",
        "return",
        "elsif",
        "end",
        "ensure",
        "for",
        "if",
        "undef",
        "unless",
        "do",
        "else",
        "super",
        "then",
        "until",
        "when",
        "while",
        "defined?",
        "self"   
    ],
    values: [
        "false",
        "true"
    ],
    comment: "#",
    multiLineComment: [ "=begin", "=end" ],
    caseSensitive: true,
    keywordsCasing: "initial"
}, false );