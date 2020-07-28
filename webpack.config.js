"use strict";

const path = require("path");
const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
    entry: path.resolve(__dirname, "inc/webpack/dev-js/main.js"),
    output: {
        filename: "bundle.js",
        path: path.resolve(__dirname, "inc/webpack/out")
    },
    devtool: 'inline-source-map',
    devServer: {
        contentBase: path.resolve(__dirname, 'inc/webpack/out'),
        compress: true,
        port: 9000
    },
    plugins: [
        new HtmlWebpackPlugin({
            template: "./inc/webpack/dev-js/page.njk"
        })
    ],
    module: {
        rules: [
            {
                test: /\.(njk|nunjucks)$/,
                loader: 'nunjucks-loader'
            },
            {
                test: /\.(hbs|handlebars)$/,
                loader: "handlebars-loader"
            }
        ],

    }
};