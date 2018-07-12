const path = require('path');

module.exports = {
    entry: './src/browser.js',
    output: {
        path: path.join(__dirname, 'build'),
        filename: 'mosyrejs2.min.js'
    },
    module: {
        loaders: [{
            test: /\.js$/,
            exclude: /(node_modules|bower_components)/,
            loader: 'babel-loader',
            query: {
                presets: ['babel-preset-env']
            }
        }]
    }
}