/* eslint-disable */
const webpack = require('webpack');
const AEM = require('./aem.config.js');
const path = require('path');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const NameAllModulesPlugin = require('name-all-modules-plugin');
const CleanWebpackPlugin = require('clean-webpack-plugin');
const UglifyJSPlugin = require('uglifyjs-webpack-plugin');

const NODE_MODULES = path.join(__dirname, './node_modules');

// Folders to inspect when resolving modules.
// Default is node_modules, however we also want anything in 'libs' to be resolvable.

module.exports = function (env) {
  const config = {
    entry: {
      components: path.resolve(__dirname, './_entries/components.js'),
      commons: path.resolve(__dirname, './_entries/commons.js'),
    },
    output: {
      path: AEM.clientLibsDir,
      publicPath: '',
      filename: 'generated-clientlib-[name]/js/[name].js',
      libraryTarget: 'umd',
    },
    module: {
      rules: [
        {
          // The "?" allows you use both file formats: .css and .scss
          test: /\.s?css$/,
          use: ExtractTextPlugin.extract({
            use: [
              {
                loader: 'css-loader',
                options: {
                  // If you are having trouble with urls not resolving add this setting.
                  // See https://github.com/webpack-contrib/css-loader#url
                  url: true,
                  minimize: true,
                  sourceMap: !!(env && env.dev),
                },
              },
              {
                loader: 'postcss-loader',
                options: {
                  sourceMap: true,
                  plugins: loader => {
                    const plugins = [];

                    if (env && !env.production) {
                      plugins.push(
                        require('stylelint')({
                          configFile: path.resolve(__dirname, './stylelint.config.js'),
                          fix: true,
                        }),
                      );

                      plugins.push(require('postcss-reporter'));
                    }

                    // Load Autoprefixer AFTER Stylelint to avoid failing on Stylelint's prefix rules
                    plugins.push(require('autoprefixer'));

                    return plugins;
                  },
                },
              },
              {
                loader: 'sass-loader',
                options: {
                  sourceMap: true,
                },
              },
            ],
          }),
        },
        {
          test: /\.js$/,
          exclude: [/node_modules/],
          use: [
            {
              loader: 'babel-loader',
              options: require('./babel.config.js'),
            },
            {
              loader: 'eslint-loader',
              options: {
                configFile: path.resolve(__dirname, './.eslintrc.js'),
                // This option makes ESLint automatically fix minor issues
                fix: env && !env.production,
              },
            },
          ],
        },
        {
          test: /\.(eot|ttf|woff|woff2|png|jpe?g|gif)$/,
          loader: 'file-loader',
          options: {
            name: function (file) {
              if (/(node_modules)/.test(file) && !/(bootstrap)/.test(file)) {
                return 'generated-clientlib-vendor/resources/[name].[ext]';
              } else {
                // Hack to inject entry name inferred from file path (/src/frontend/[entryName]/[componentName]/...)
                return 'generated-clientlib-[custom-delim][path][custom-delim]/resources/[name].[ext]';
              }
            },
            publicPath: function (filePath) {
              // Fix URL resolving for fonts
              return `/etc/designs/aemwebpack/${filePath}`;
            },
          },
        },
        {
          test: /\.svg$/,
          loader: 'svg-inline-loader',
        },
        {
          test: /\.hbs/,
          loader: 'handlebars-template-loader',
        },
      ],
    },
    node: {
      fs: 'empty', // avoids error messages
    },
    resolve: {
      extensions: ['.js', '.scss'],
      modules: [
        NODE_MODULES,
      ],
      alias: {
        Commons: path.resolve(__dirname, './commons/'),
      },
    },
    plugins: getPlugins(env),
    devServer: {
      contentBase: AEM.clientLibsDir,
      compress: false,
      clientLogLevel: 'none',
      historyApiFallback: true,
      watchContentBase: true,
    },
  };
  return config;
};

function getPlugins(env) {
  const plugins = [];

  plugins.push(new webpack.DefinePlugin({
    'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV || 'development'),
    PRODUCTION: JSON.stringify(env && env.production),
    DEV: JSON.stringify(env && env.dev),
  }));

  plugins.push(new webpack.NamedModulesPlugin());
  plugins.push(
    new webpack.NamedChunksPlugin(chunk => {
      if (chunk.name) {
        return chunk.name;
      }
      return chunk.mapModules(({ context, request }) => path.relative(context, request)).join('_');
    }),
  );

  // We'll use CommonChunkPlugin to separate our common dependencies
  // The order of entry names is important - all our common dependencies and explicitly defined global(see _entries/commons.js) dependencies will be placed in 'globals',
  // All our explicitly defined vendors(see _entries/vendor.js) dependencies will be bundled in 'vendors'
  // The Webpack runtime will be placed in manifest

  /* ########################################################### */
  /* The order of invocation of CommonsChunkPlugin is important! */
  /* ########################################################### */

  // First we extract all node_module dependencies into the 'vendor' chunk
  plugins.push(
    new webpack.optimize.CommonsChunkPlugin({
      name: 'vendor',
      minChunks: function (module, count) {
        return module.context && module.context.includes('node_modules');
      },
    }),
  );

  // (Optional) Then we move our styleguide to a separate 'styleguide' chunk
  plugins.push(
    new webpack.optimize.CommonsChunkPlugin({
      name: 'styleguide',
      chunks: ['components', 'commons', 'vendor'],
      minChunks: function (module, count) {
        return module.context && module.context.includes('node_modules') && module.context.includes('bootstrap');
      },
    }),
  );

  // Then we set our commons chunk to only include code from 'commons'
  plugins.push(
    new webpack.optimize.CommonsChunkPlugin({
      name: 'commons',
      chunks: ['components', 'vendor'],
      minChunks: function (module, count) {
        return module.context && module.context.includes('/commons/');
      },
    }),
  );

  // Then we extract the webpack bootstrap code into the 'manifest' chunk
  plugins.push(
    new webpack.optimize.CommonsChunkPlugin({
      name: 'manifest',
      minChunks: Infinity,
    }),
  );

  // Moves all the required *.css modules in entry chunks into a separate CSS file.
  // Your styles are no longer inlined into the JS bundle, but in a separate CSS file ([entryName].css).
  plugins.push(
    new ExtractTextPlugin({
      // `allChunks` must be true because we're using `.extract()` and otherwise
      // `extract-text-webpack-plugin` would run twice.
      allChunks: true,
      filename: 'generated-clientlib-[name]/css/[name].css',
    }),
  );

  plugins.push(
    new webpack.LoaderOptionsPlugin({
      options: {
        customInterpolateName: (url) => {
          let customDelimPath = url.split('[custom-delim]')[1];
          if (customDelimPath) {
            // Hack to infer the entry name from the file path
            let entryNameMatcher = customDelimPath.match(/\/src\/frontend\/([^\/]+)\/.*/);
            let entryName = entryNameMatcher && entryNameMatcher.length > 1 ? entryNameMatcher[1] : '';
            if (customDelimPath.includes('bootstrap')) {
              entryName = 'styleguide';
            }
            return url.replace(/\[custom-delim\].+\[custom-delim\]/, entryName);
          } else {
            return url;
          }
        },
      },
    }),
  );

  if (env && env.production) {
    plugins.push(
      new UglifyJSPlugin({
        sourceMap: false,
      }),
    );
  }

  if (env && env.dev) {
    plugins.push(
      new webpack.SourceMapDevToolPlugin({
        exclude: /(vendor|manifest|styleguide)/,
      }),
    );
  }

  plugins.push(new NameAllModulesPlugin());

  // the path(s) that should be cleaned
  let pathsToClean = [
    'generated-clientlib-*/js/*.*',
    'generated-clientlib-*/css/*.*',
    'generated-clientlib-*/resources/*.*',
  ];
  // the clean options to use
  let cleanOptions = {
    root: AEM.clientLibsDir,
    verbose: false,
    dry: false,
  };
  plugins.push(new CleanWebpackPlugin(pathsToClean, cleanOptions));

  return plugins;
}

/* eslint-enable */