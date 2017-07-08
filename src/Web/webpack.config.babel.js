const path = require('path');

module.exports = {
    entry: './wwwroot/Scripts/src/entry.js',
    output: {
        path: path.join(__dirname, '/wwwroot/Scripts'),
        filename: 'bundle.js'
};
