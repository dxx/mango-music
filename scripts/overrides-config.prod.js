const paths = require('react-scripts/config/paths');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const baseConfig = require('./overrides-config.base');

// Webpack uses `publicPath` to determine where the app is being served from.
// It requires a trailing slash, or the file assets will get an incorrect path.
const publicPath = paths.servedPath;
// Some apps do not use client-side routing with pushState.
// For these, "homepage" can be set to "." to enable relative asset paths.
const shouldUseRelativeAssetPaths = publicPath === './';
const cssFilename = 'static/css/[name].[contenthash:8].css';
const extractTextPluginOptions = shouldUseRelativeAssetPaths
    ? // Making sure that the publicPath goes back to to build folder.
    { publicPath: Array(cssFilename.split('/').length).join('../') }
    : {};

module.exports = function(config) {
    // Define the root path alias
    let alias = config.resolve.alias;
    alias["@"] = baseConfig.rootPath;

    // Use your ESLint
    /*let eslintLoader = config.module.rules[0];
    eslintLoader.use[0].options.useEslintrc = true;*/

    // Add the stylus loader second-to-last
    // (last one must remain as the "file-loader")
    let loaderList = config.module.rules[1].oneOf;
    loaderList.splice(loaderList.length - 1, 0, {
        test: /\.styl$/,
        loader: ExtractTextPlugin.extract(
            Object.assign(
                {
                    fallback: {
                        loader: require.resolve('style-loader'),
                        options: {
                            hmr: false
                        }
                    },
                    use: [
                        {
                            loader: require.resolve('css-loader'),
                            options: {
                                importLoaders: 1,
                                minimize: true,
                                sourceMap: true
                            }
                        },
                        {
                            loader: require.resolve('stylus-loader')
                        }
                    ]
                }
            ), extractTextPluginOptions)
    });
    // Use Poststylus Plugin to handle stylus
    config.plugins.push(baseConfig.stylusLoaderOptionsPlugin);
};