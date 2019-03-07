/* eslint-disable */
const webpack = require("webpack");
const path = require('path');

const NODE_MODULES = path.join(__dirname, "../node_modules");

module.exports = {
  module: {
    rules: [
      {
        // The "?" allows you use both file formats: .css and .scss
        test: /\.s?css$/,
        use: [
          "style-loader",
          {
            loader: "css-loader",
            options: {
              // If you are having trouble with urls not resolving add this setting.
              // See https://github.com/webpack-contrib/css-loader#url
              url: true,
              minimize: true,
              sourceMap: true
            }
          },
          {
            loader: "postcss-loader",
            options: {
              sourceMap: true,
              plugins: loader => {
                const plugins = [];

                // Load Autoprefixer AFTER Stylelint to avoid failing on Stylelint's prefix rules
                plugins.push(require("autoprefixer"));

                return plugins;
              }
            }
          },
          {
            loader: "sass-loader",
            options: {
              sourceMap: true
            }
          }
        ]
      },
      {
        test: /\.js$/,
        exclude: [/node_modules/],
        use: [
          {
            loader: "babel-loader",
            options: require("../babel.config.js")
          },
          {
            loader: "eslint-loader",
            options: {
              configFile: path.resolve(__dirname, "../.eslintrc.js"),
              // This option makes ESLint automatically fix minor issues
              fix: true
            }
          }
        ]
      },
      {
        test: /\.(eot|ttf|woff|woff2|png|jpe?g|gif)$/,
        loader: "file-loader",
      },
      {
        test: /\.svg$/,
        loader: "svg-inline-loader"
      },
    ]
  },
  resolve: {
    extensions: [".js", ".scss"],
    modules: [
      NODE_MODULES,
    ],
    alias: {
      Globals: path.resolve(__dirname, '../commons/'),
    }
  },
  plugins: [
    new webpack.DefinePlugin({
      PRODUCTION: JSON.stringify(false),
      DEV: JSON.stringify(true),
      STORYBOOK: JSON.stringify(true),
    }),
    new webpack.SourceMapDevToolPlugin({
      exclude: /(vendor|manifest)/
    })
  ]
};
/* eslint-enable */