const path = require('path');
const createStyledComponentsTransformer = require('typescript-plugin-styled-components').default;

const styledComponentsTransformer = createStyledComponentsTransformer();
const MonacoWebpackPlugin = require('monaco-editor-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const CryptoBrowserify  = require.resolve('crypto-browserify');
const StreamBrowserify = require.resolve("stream-browserify");
const BufferBrowserify = require.resolve("buffer/");
const Webpack = require('webpack');


module.exports = {
    entry: {
        main: path.resolve(__dirname, '../src/index.tsx'),
    },
    output: {
        filename: '[name].js',
        path: path.resolve(__dirname, '../public'),
    },
    ignoreWarnings: [
        /Invalid dependencies have been reported by plugins or loaders for this module. All reported dependencies need to be absolute paths/,
        // TODO - Allan - delete this item as soon as update class-transform to latest version
        /Failed to parse source map from/
    ],
    stats: {
        entrypoints: false, // we have 90+ entrypoints now, don't wanna see every time
        modules: false, // useless noise
    },
    performance: {
        maxAssetSize: 3072000, // because of monaco which is 2.77mi
        maxEntrypointSize: 512000,
    },
    optimization: {
        moduleIds: 'deterministic',
        runtimeChunk: 'single',
        splitChunks: {
            name: false,
            chunks: 'all',
            maxInitialRequests: Infinity,
            minSize: 0,
            cacheGroups: {
                react: {
                    test: /[\\/]node_modules[\\/](react|react-dom)[\\/]/,
                    name: 'react',
                },
                'monaco-editor': {
                    test: /[\\/]node_modules[\\/](monaco-editor)[\\/]/,
                    name: 'monaco-editor',
                },
                'api-core': {
                    test: /[\\/]src[\\/]lib[\\/]/,
                    name: 'api-core',
                },
                'styled-components': {
                    test: /[\\/]src[\\/]lib[\\/](styled-components)[\\/]/,
                    name: 'styled-components',
                },
                vendor: {
                    test: /[\\/]node_modules[\\/]/,
                    name(module) {
                        // get the name. E.g. node_modules/packageName/not/this/part.js
                        // or node_modules/packageName
                        const packageName = module.context.match(/[\\/]node_modules[\\/](.*?)([\\/]|$)/)[1];

                        // npm package names are URL-safe, but some servers don't like @ symbols
                        return `lib.${packageName.replace('@', '')}`;
                    },
                },
            },
        },
    },
    module: {
        rules: [
            {
                test: /\.tsx?$/,
                loader: 'ts-loader',
                exclude: /node_modules/,
                options: {
                    getCustomTransformers: () => ({ before: [styledComponentsTransformer] }),
                },
            },
            {
                enforce: 'pre',
                test: /\.js$/,
                loader: 'source-map-loader',
            },
            {
                test: /\.css$/,
                use: ['style-loader', 'css-loader'],
            },
            {
                test: /.svg$/,
                use: ['@svgr/webpack']
            },
            {
                test: /\.(jpe?g|png|gif|svg|ttf|woff|eot)$/i,
                use: ['file-loader'],
            },
        ],
    },
    resolve: {
        extensions: ['.ts', '.tsx', '.js', '.jsx', '.scss'],
        fallback: {
            crypto: CryptoBrowserify,
            stream: StreamBrowserify,
            buffer: BufferBrowserify
        }
    },
    plugins: [
        new MonacoWebpackPlugin({
            // available options are documented at https://github.com/Microsoft/monaco-editor-webpack-plugin#options
            languages: ['xml'],
        }),
        new HtmlWebpackPlugin({ template:  path.resolve(__dirname, '../src/index.html')  }),
        new CleanWebpackPlugin(),
        new CopyWebpackPlugin({
            patterns: [{ from: 'assets' }],
        }),
        new Webpack.ProvidePlugin({
            process: 'process/browser',
        }),
    ],
};
