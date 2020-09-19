

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

const autoprefixer = require("autoprefixer");
const cssnano = require("cssnano");


module.exports = {
    entry: path.resolve(__dirname, "src/js/main.js"),
    output: {
        filename: "bundle.js",
        path: path.resolve(__dirname, "dist")
    },
    devtool: 'eval-cheap-module-source-map',
    devServer: {
        // contentBase: path.resolve(__dirname, 'dist'), // Точка для поиска файлов под запуск, html/etc
        overlay: {
            warnings: true,
            errors: true
        },
        proxy: {
           "/data.php": "http://dev1.test/src/js/data.php"
        },
        compress: true, // Enable gzip compression for everything served
        //open: true, // Открывает сайт в браузере автоматически, это же работает как --open в блоке scripts для package.json
        port: 9000,
        //writeToDisk: true, // По-умолчанию, файлы существауют виртульно, данная опция будет их создавать/перезаписывать
    },


    // Данный блок это минимизация css средствами OptimizeCssAssetsPlugin, запускай через npm run prod
    // Также, так как мы переопределяем блок оптимизации, для продакшена мы добавляем минификатор js-файла -UglifyJs
    // Помни, что UglifyJsPlugin нативно работает лишь с ES5 синтаксисом, поэтому для использования классов и прочего,
    // нужно сразу же использовать babel - то есть раскомментируй его лоадер ниже, иначе будет ошибка типа ERROR in bundle.js from UglifyJs
    // Unexpected token: keyword «const»
    optimization: {
        minimizer: [
            new UglifyJsPlugin(),
            new OptimizeCssAssetsPlugin({
                //cssProcessor: require('cssnano'), - эту задачу выполняет css-nano из лоадера ниже, этот блок
                // только для того, чтобы удалять комменты, которые nano не удаляет/пропускает
                cssProcessorPluginOptions: {
                    preset: ['default', {discardComments: {removeAll: true}}],
                },
                canPrint: true
            })
        ],
    },
    plugins: [
        // HtmlWebPackPlugin - основной плагин для генерации html через webpack
        new HtmlWebpackPlugin({
            template: path.resolve(__dirname, 'src/tpl/index.hbs') // Плагин, для обработки файлов с расширением hbs
        }),
        new HtmlWebpackPlugin({  // Генерируем любын другие файлы html, первым выше, по-умолчанию, будет index.html
            filename: 'page.html',
            template: path.resolve(__dirname, 'src/tpl/page.hbs')
        }),
        new HtmlWebpackPlugin({  // Генерируем любын другие файлы html, первым выше, по-умолчанию, будет index.html
            filename: '404.html',
            template: path.resolve(__dirname, 'src/tpl/404.hbs')
        }),

        // MiniCssExtractPlugin - создает отдельный файл css для того, что импортировано в основной js-файл. Заменяет
        // style-loader, который включает стили инлайн в блок style, что как правило не нужно
        new MiniCssExtractPlugin({
            filename: '[name].css',
            //filename: '[hash].css', //- вариант для формирования уникальных имен выходных файлов
        }),
        /**
         * Перемещаем в выходную папку иконку сайта
         */
        new CopyWebpackPlugin({
            patterns: [
                {
                    from: path.resolve(__dirname, "src/assets/img/favicon/"),
                    to: './'
                },
                {
                    from: path.resolve(__dirname, "src/js/data.php"),
                    to: './'
                },
            ],
        }),

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

            // При обработке css/scss верхним (то есть последним) выполняется MiniCssExtractPlugin, он создает css файл и
            // перемещает его в корень выходной папки, то есть dist
            {
                test: /\.scss$/,
                use: [
                    MiniCssExtractPlugin.loader,
                    "css-loader",
                    {
                        loader: 'postcss-loader', // пропускаем через autoprefixer наш css полученный из sass
                        options: {
                            plugins: () => [autoprefixer(), cssnano({
                                discardComments: {removeAll: true}
                            })]
                        }
                    },
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
            {
                test: /\.(woff(2)?|ttf|eot|svg)(\?v=\d+\.\d+\.\d+)?$/,
                use: [
                    {
                        loader: 'file-loader',
                        options: {
                            name: '[name].[ext]',
                            outputPath: 'assets/fonts'
                        }
                    }
                ]
            },
            /*
            * Тут мы подключаем babel, закомментируй при обычной разработке. Также помни, что должен быть
            * файл .bablerc в корне проекта, иначе ничего траспилироваться не будет
            * Включи его для корректной работы UglifyJS
            * */
            {
                test: /\.js$/, exclude: /node_modules/,
                loader: "babel-loader"
            },

            /*
            *   Правила обработки изображений такие:
            *   1. Опция outputPath указывает, куда будут помещены картинки, тут это будет внутри dist: img/pic.jpeg
            *   2. Сначала файлы будут пропущены через минифицирующий лоадер img-loader, а потом file-loader их переместит
            *   3. Чтобы картинки были обработаны, они должны быть импортированы в базовый js-файл: require.context('../img/', true, /\.jpe?g$|.png$|.svg$|.gif$/);
            *   4. Все минификаторы, такие как imageminGifsicle/imageminMozjpeg/etc должны быть установлены через npm
            * */
            {
                test: /\.(jpg|jpeg|png|gif|svg)$/i,
                use: [
                    {
                        loader: 'file-loader',
                        options: {
                            outputPath: 'assets/img',
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
                                        {removeTitle: true},
                                        {convertPathData: false}
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