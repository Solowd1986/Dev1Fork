"use strict";

const path = require("path");
const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const {CleanWebpackPlugin} = require('clean-webpack-plugin');

module.exports = {
    entry: path.resolve(__dirname, "src/assets/js/main.js"),
    output: {
        filename: "bundle.js",
        path: path.resolve(__dirname, "out"),
    },
    devtool: 'inline-source-map',
    devServer: {
        contentBase: path.resolve(__dirname, 'out'), // Точка для поиска файлов под запуск, html/etc
        compress: true,
        open: true, // Открывает сайт в браузере автоматически
        port: 9000,
        writeToDisk: true, // По-умолчанию, файлы существауют виртульно, данная опция будет их создавать/перезаписывать
    },
    plugins: [
        new HtmlWebpackPlugin({
            template: path.resolve(__dirname, 'src/tpl/index.hbs') // Плагин, для обработки файлов с расширением hbs
        }),
        new HtmlWebpackPlugin({  // Генерируем любын другие файлы html, первым выше, по-умолчанию, будет index.html
            filename: 'page.html',
            template: path.resolve(__dirname, 'src/tpl/page.hbs')
        }),
        new MiniCssExtractPlugin({
            filename: '[name].css',
            //filename: '[hash].css', //- вариант для формирования уникальных имен выходных файлов, нужно очищать диреткорию
        }),
        new CleanWebpackPlugin() // Данный плагин очищает директорию output при каждой сборке проекта
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