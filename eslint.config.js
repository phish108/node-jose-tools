// new flat file configuration for eslint
// https://eslint.org/docs/latest/use/configure/configuration-files-new

import js from "@eslint/js";
import globals from "globals";

export default [
    js.configs.recommended,
    {
        languageOptions: {
            globals: {
                ...globals.node
            }
        },
        "rules": {
            "indent": [
                "error",
                4,
                {
                    "SwitchCase": 2,
                    "VariableDeclarator": {
                        "var": 2,
                        "let": 2,
                        "const": 3
                    },
                    "MemberExpression": 1,
                    "FunctionDeclaration": {"parameters": "first"},
                    "CallExpression": {"arguments": "first"},
                    "ObjectExpression": 1
                }
            ],
            "quotes": [
                "error",
                "double"
            ],
            "semi": [
                "error",
                "always"
            ],
            "no-extra-parens": "error",
            "default-case": "error",
            "curly": "error",
            "eqeqeq": "warn",
            "no-loop-func": "error",
            "no-sequences": "error",
            "key-spacing": "error",
            "yoda": [
                "error",
                "never"
            ],
            "array-bracket-spacing": [
                "error",
                "never"
            ],
            "block-spacing": [
                "error",
                "always"
            ],
            "brace-style": [
                "error",
                "stroustrup",
                {
                    "allowSingleLine": true
                }
            ],
            "eol-last": [
                "error",
                "always"
            ],
            "func-call-spacing": [
                "error",
                "never"
            ],
            "newline-after-var": [
                "error",
                "always"
            ],
            "no-lonely-if": "error",
            "no-trailing-spaces": "error",
            "no-whitespace-before-property": "error",
            "space-infix-ops": "error",
            "no-mixed-spaces-and-tabs": "error",
            "no-plusplus": [
                "error",
                {
                    "allowForLoopAfterthoughts": true
                }
            ]
        }
    }
];
