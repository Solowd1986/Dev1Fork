"use strict";

const path = require("path");
const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const {CleanWebpackPlugin} = require('clean-webpack-plugin');

const OptimizeCssAssetsPlugin = require('optimize-css-assets-webpack-plugin');
const UglifyJsPlugin = require('uglifyjs-webpack-plugin');

const CopyWebpackPlugin = require('copy-webpack-plugin');

const ImageminPlugin = require("imagemin-webpack");

const imageminGifsicle = require("imagemin-gifsicle");
const imageminPngquant = require("imagemin-pngquant");
const imageminSvgo = require("imagemin-svgo");
const imageminMozjpeg = require('imagemin-mozjpeg');

module.exports = {
    entry: path.resolve(__dirname, "src/assets/js/main.js"),
    output: {
        filename: "bundle.js",
        path: path.resolve(__dirname, "dist")
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
        minimizer: [
            new UglifyJsPlugin(),
            new OptimizeCssAssetsPlugin({
                cssProcessor: require('cssnano'),
                cssProcessorPluginOptions: {
                    preset: ['default', { discardComments: { removeAll: true } }],
                },
                canPrint: true
            })],
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
        // new CopyWebpackPlugin({
        //     patterns: [
        //         {
        //             from: path.resolve(__dirname, "src/assets/img/"),
        //             to: './img'
        //         },
        //     ],
        // }),

        // Данный плагин очищает директорию output при каждой сборке проекта, нюанс в том, что он очищает папку, и те
        // файлы, которые не пересоздаются (так как их не меняли), такие как шаблоны, удаляются и не появлются, но,
        // если внести изменения в файл шаблона, то все удалится, а новый шаблон будет создан.
        //new CleanWebpackPlugin({}),
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
            {
                test: /\.css$/,
                use: [
                    MiniCssExtractPlugin.loader,
                    "css-loader",
                ]
            },
            /*
            * Тут мы подключаем babel, закомментируй при обычной разработке. Также помни, что должен быть
            * файл .bablerc в корне проекта, иначе ничего траспилироваться не будет
            * */
            // {
            //     test: /\.js$/, exclude: /node_modules/,
            //     loader: "babel-loader"
            // },

            /*
            *   Правила обработки изображений такие:
            *   1. Изображения вставляемые инлайн прописываются относительно dist папки, например, просто "./img/pic.jpeg"
            *   2. Изображения background прописываются от входного js-файла, например, "../img/pic.jpeg"
            *   3. Опция outputPath указывает, куда будут помещены картинки, тут это будет внутри dist: img/pic.jpeg
            *   4. Сначала файлы будут пропущены через минифицирующий лоадер img-loader, а потом file-loader их переместит
            *   5. Чтобы картинки были обработаны, они должны быть импортированы в базовый js-файл: require.context('../img/', true, /\.jpe?g$|.png$|.svg$|.gif$/);
            *   6. Все минификаторы, такие как imageminGifsicle/imageminMozjpeg/etc должны быть установлены через npm
            *
            *   Вопрос: почему изображения инлайн работают от dist папки, а background - нет?
            *   Потому, что background содержится в scss-файле, а тот импортирован в основной js-файл, и при обработке поиск
            *   идет по пути от этого файла, а вот инлайн вставляется в файл-шаблон, а ото не импортируется в основной js-файл,
            *   и его пути не вызывают проблем
            * */
            {
                test: /\.(jpg|png|gif|svg)$/i,
                use: [
                    {
                        loader: 'file-loader',
                        options: {
                            outputPath: 'img',
                            name: '[name].[ext]'
                        }
                    },
                    {
                        loader: 'img-loader',
                        options: {
                            plugins: [
                                imageminGifsicle({
                                    interlaced: false
                                }),
                                imageminMozjpeg({
                                    progressive: true,
                                    arithmetic: false
                                }),
                                imageminPngquant({
                                    floyd: 0.5,
                                    speed: 2
                                }),
                                imageminSvgo({
                                    plugins: [
                                        { removeTitle: true },
                                        { convertPathData: false }
                                    ]
                                })
                            ]
                        }
                    }
                ]
            }
        ],
    }
};