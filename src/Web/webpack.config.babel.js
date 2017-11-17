﻿const path = require('path');
const WebpackNotifierPlugin = require('webpack-notifier');

module.exports = {
    entry: './wwwroot/Scripts/src/entry.js',
    output: {
        path: path.join(__dirname, '/wwwroot/Scripts'),
        filename: 'bundle.js'
    },
    plugins: [
        new WebpackNotifierPlugin({
            title: 'Webpack'
        }),
    ],
    module: {
        rules: [
            {
                test: /\.jsx?$/,
                enforce: 'pre',
                exclude: /(node_modules)/,
                loader: 'eslint-loader'
            },
            {
                test: /\.jsx?$/,
                exclude: /(node_modules)/,
                loader: 'babel-loader'
            },
            {
                test: /\.scss$/,
                use: [
                    'style-loader',
                    { loader: 'css-loader', options: { importLoaders: 1 } },
                    'sass-loader'
                ]
            },
            {
                test: /\.css$/,
                use: [
                    'style-loader',
                    'css-loader'
                ]
            },            
        ]
    }
};