const path = require('path');

/**
 * BABEL
 *
 * You can override or extend the default BABEL configuration using options from
 * https://babeljs.io/docs/usage/api/#options
 */
const BABEL = {
    extends: path.resolve(__dirname, '.babelrc'),
    plugins: ['transform-react-jsx', 'transform-object-rest-spread'],
};

module.exports = BABEL;