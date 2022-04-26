const { merge } = require('webpack-merge');
const common = require('./common.config');

module.exports = merge(common, {
    mode: 'development',
    devtool: 'source-map',
    output: {
        chunkFilename: '[name].js',
        publicPath: '/EquisoftDesign/react/',
    },
    devServer: {
        static: './public',
        historyApiFallback: { index: '/EquisoftDesign/react/' },
        open: 'EquisoftDesign/react/',
        port: 3333,
    },
});
