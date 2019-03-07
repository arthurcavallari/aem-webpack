const webpackConfig = require('./webpack.config.js');

// Folders to inspect when resolving modules.
// Default is node_modules, however we also want anything in 'libs' to be resolvable.

module.exports = webpackConfig('dev');
