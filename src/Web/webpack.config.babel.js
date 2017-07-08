const path = require('path');

module.exports = {
    entry: './wwwroot/Scripts/src/entry.js',
    output: {
        path: path.join(__dirname, '/wwwroot/Scripts'),
        filename: 'bundle.js'
    },
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
            }
        ]
    }
};