const { merge } = require('webpack-merge');
const common = require('./common.config');

const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;
module.exports = merge(common, {
    mode: 'production',
    output: { filename: '[name].[contenthash].js' },
    plugins: [new BundleAnalyzerPlugin({ generateStatsFile: true, analyzerMode: 'disabled' })],
});
