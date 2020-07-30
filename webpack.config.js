"use strict";

const path = require("path");
const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');

module.exports = {
    entry: path.resolve(__dirname, "inc/webpack/dev-js/main.js"),
    output: {
        filename: "bundle.js",
        path: path.resolve(__dirname, "inc/webpack/out"),
    },
    devtool: 'inline-source-map',
    devServer: {
        contentBase: path.resolve(__dirname, 'inc/webpack/out'),
        compress: true,
        open: true,
        port: 9000,
        writeToDisk: true,
    },
    plugins: [
        new HtmlWebpackPlugin({
            template: "./inc/webpack/dev-js/index.hbs"
        }),
        new MiniCssExtractPlugin({
            filename: '[hash].css',
            chunkFilename: '[id].css',
        }),
    ],
    module: {
        rules: [
            {
                test: /\.(hbs|handlebars)$/,
                loader: "handlebars-loader"
            },
            {
                test: /\.scss$/,
                use: [
                    MiniCssExtractPlugin.loader,
                    "css-loader",
                    "sass-loader"
                ]
            }
        ],

    }
};