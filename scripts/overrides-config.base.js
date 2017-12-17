const path = require('path');
const webpack = require('webpack');
const poststylus = require('poststylus');
const autoprefixer = require('autoprefixer');

function resolve (dir) {
  return path.join(__dirname, '..', dir)
}

module.exports = function(config) {
  // Define the root path alias
  let alias = config.resolve.alias;
  alias["@"] = resolve('src');

  // Use your ESLint 
  /*let eslintLoader = config.module.rules[0];
  eslintLoader.use[0].options.useEslintrc = true;*/

  // Add the stylus loader second-to-last
  // (last one must remain as the "file-loader")
  let loaderList = config.module.rules[1].oneOf;
  loaderList.splice(loaderList.length - 1, 0, {
    test: /\.styl$/,
    use: ["style-loader", "css-loader", "stylus-loader"]
  });
  // Use Poststylus Plugin to handle stylus
  config.plugins.splice(config.plugins.length, 0, new webpack.LoaderOptionsPlugin({
    options: {
      stylus: {
        use: [
          poststylus([ 
            require('postcss-flexbugs-fixes'),
            autoprefixer({
              browsers: [
                '>1%',
                'last 4 versions',
                'Firefox ESR',
                'not ie < 9', // React doesn't support IE8 anyway
              ],
              flexbox: 'no-2009',
            })
          ])
        ]
      }
    }
  }));
}