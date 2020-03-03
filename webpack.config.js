const HtmlWebpackPlugin = require('html-webpack-plugin'); //installed via npm
const webpack = require('webpack'); //to access built-in plugins
const path = require('path');



module.exports = env => ({
    entry: `./src/${env.proj}/index.js`,
    output: {
        path: path.resolve(__dirname, 'dist'),
        filename: '[name].[hash].js'
    },
    module: {
        rules: [
            { test: /\.txt$/, use: 'raw-loader' }
        ]
    },
    //devtool: 'none',
    plugins: [
        new HtmlWebpackPlugin({ template: `./src/${env.proj}/index.html` }),
    ]
});