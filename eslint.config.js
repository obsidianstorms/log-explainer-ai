import { defineConfig } from "eslint/config";
import globals from "globals";
import js from "@eslint/js";
import prettier from "eslint-plugin-prettier/recommended";
import prettierConfig from "eslint-config-prettier";
import sonarjs from "eslint-plugin-sonarjs";
import jsdoc from "eslint-plugin-jsdoc";

export default defineConfig([
  js.configs.recommended,
  // sonarjs.configs.recommended, -- for use if not use plugins.sonarjs and specific rules
  prettier,
  prettierConfig,
  {
    files: ["**/*.js"],
    languageOptions: {
      ecmaVersion: 2021,
      sourceType: "module",
      globals: {
        ...globals.nodeBuiltin,
        node: true,
        es6: true,
      },
    },
    plugins: {
      jsdoc,
      // prettier: prettier,
      sonarjs,
    },

    rules: {
      "no-unused-vars": "warn",
      "no-console": "warn",
      "prettier/prettier": [
        "error",
        {
          endOfLine: "auto",
        },
      ],
      indent: ["error", 2],
      quotes: ["error", "double", { allowTemplateLiterals: true }],
      semi: ["error", "always"],
      "no-trailing-spaces": "error",
      "eol-last": ["error", "always"],
      "comma-dangle": ["error", "always-multiline"],
      "arrow-parens": ["error", "always"],
      "object-curly-spacing": ["error", "always"],
      "array-bracket-spacing": ["error", "never"],
      "block-spacing": ["error", "always"],
      "keyword-spacing": ["error", { before: true, after: true }],
      "space-before-function-paren": ["error", {
        "anonymous": "ignore",
        "named": "always",
        "asyncArrow": "always"
      }],
      "space-infix-ops": "error",

      // Complexity rules
      complexity: ["warn", { max: 15 }],
      "max-statements": ["warn", 20],
      "sonarjs/cognitive-complexity": ["warn", 15],

      // JSDoc rules
      "jsdoc/check-alignment": "error",
      "jsdoc/check-indentation": "error",
      "jsdoc/require-param": "error",
      "jsdoc/require-returns": "error",
      "jsdoc/require-param-type": "error",
      "jsdoc/require-returns-type": "error",
      "jsdoc/valid-types": "error",
      "jsdoc/require-description": "error",
    },
  },
]);
