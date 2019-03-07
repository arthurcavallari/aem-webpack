const path = require('path');

/**
 * AEM
 *
 * This configuration is used by different tools, such as Webpack and Jest.
 */
const AEM = {
    clientLibsDir: path.join(__dirname, '../main/content/jcr_root/etc/designs/aemwebpack/')
};

module.exports = AEM;