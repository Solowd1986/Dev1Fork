"use strict";

const path = require("path");
const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const {CleanWebpackPlugin} = require('clean-webpack-plugin');

const OptimizeCssAssetsPlugin = require('optimize-css-assets-webpack-plugin');
const UglifyJsPlugin = require('uglifyjs-webpack-plugin');

module.exports = {
    entry: path.resolve(__dirname, "src/assets/js/main.js"),
    output: {
        filename: "bundle.js",
        path: path.resolve(__dirname, "dist"),
    },
    devtool: 'inline-source-map',
    devServer: {
        contentBase: path.resolve(__dirname, 'dist'), // Точка для поиска файлов под запуск, html/etc
        compress: true,
        //open: true, // Открывает сайт в браузере автоматически, это же работает как --open в блоке scripts для package.json
        port: 9000,
        writeToDisk: true, // По-умолчанию, файлы существауют виртульно, данная опция будет их создавать/перезаписывать
    },
    // Данный блок это минимизация css средствами OptimizeCssAssetsPlugin, запускай через npm run prod
    // Также, так как мы переопределяем блок оптимизации, для продакшена мы добавляем минификатор js-файла -UglifyJs
    // Помни, что UglifyJsPlugin нативно работает лишь с ES5 синтаксисом, поэтому для использования классов и прочего,
    // нужно сразу же использовать babel
    optimization: {
        minimizer: [new UglifyJsPlugin(), new OptimizeCssAssetsPlugin({})],
    },
    plugins: [
        //new CleanWebpackPlugin(), // Данный плагин очищает директорию output при каждой сборке проекта
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
            },
            /*
            * Тут мы подключаем babel, закомментируй при обычной разработке. Также помни, что должен быть
            * файд .bablerc в корне проекта, иначе ничего траспилироваться не будет
            * */
            // {
            //     test: /\.js$/, exclude: /node_modules/,
            //     loader: "babel-loader"
            // }
        ],
    }
};