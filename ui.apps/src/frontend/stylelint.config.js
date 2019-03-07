/**
 * STYLELINT
 */
const STYLELINT = {
    // Optional: Base you configuration on a different one such as `stylelint-config-infield`
    // and run `npm install --save-dev stylelint-config-infield`

    // extends: "stylelint-config-infield",
    rules: {
        "block-no-empty": null,
        "color-no-invalid-hex": true,
        "comment-empty-line-before": ["always", {
            "ignore": ["stylelint-command", "after-comment"]
        }],
        "declaration-colon-space-after": "always",
        indentation: ["tab", {
            except: ["value"]
        }],
        "max-empty-lines": 2,
        "rule-empty-line-before": ["always", {
            except: ["first-nested"],
            ignore: ["after-comment"]
        }],
        "unit-whitelist": ["deg", "em", "rem", "%", "s", "px"],
    },
};

module.exports = STYLELINT;