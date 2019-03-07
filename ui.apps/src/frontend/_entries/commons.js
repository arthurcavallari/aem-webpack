/**
 * Uncomment the following line to include Babel's polyfill.
 * Note that this increases the size of the bundled JavaScript file.
 * So be smart about when and where to include the polyfill.
 */
// import 'babel-polyfill';

// https://webpack.js.org/guides/dependency-management/#require-context
const cache = {};

function importAll(r) {
    // r.keys().forEach((key) => {  // ES6
    r.keys().forEach(function (key) {
        cache[key] = r(key);
        return cache;
    });
}

// Include all non-test files in the "../globals/" folder.
importAll(require.context('../commons/', true, /\.\/(?!(.*\/)?(__mocks__|__tests__))(?!.*\.test).*\.js$/));