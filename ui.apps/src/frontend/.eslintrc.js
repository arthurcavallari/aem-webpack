/**
 * ESLINT
 *
 * The linting rules defined here are pretty loose, allowing you to integrate the Webpack setup
 * more easily into your existing project. However, we recommend to make the rules more strict –
 * as strict as possible.
 */

const ESLINT = {
    "parser": "babel-eslint",

    extends: [
        "eslint:recommended",
       // "airbnb"
    ],

    env: {
        "browser": true,
        "es6": true,
        "node": true,
        "jquery": true,
        "jest/globals": true
    },

    // If you want to define variables that are available across various processed JavaScript
    // files, define them here. More details: http://eslint.org/docs/user-guide/configuring#specifying-globals
    globals: {
        $: true,
        Granite: true,
        Session: true,
        PRODUCTION: true,
        DEV: true,
    },

    parserOptions: {
        ecmaVersion: 8,
        sourceType: 'module',
    },

    rules: {
        "no-console": 0,
        "import/prefer-default-export": 0,
        "no-unused-vars": 0,
        "linebreak-style": 0,
        "class-methods-use-this": 0,
        "jest/no-disabled-tests": "warn",
        "jest/no-focused-tests": "error",
        "jest/no-identical-title": "error",
        "jest/prefer-to-have-length": "warn",
        "jest/valid-expect": "error"
    },

    settings: {

    },

    "plugins": ["jest"]
};

module.exports = ESLINT;