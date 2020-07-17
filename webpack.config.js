const path = require("path");
const NunjucksWebpackPlugin = require("nunjucks-webpack-plugin");
const {CleanWebpackPlugin} = require('clean-webpack-plugin');
const miniCssExtractPlugin = require ("mini-css-extract-plugin");
const htmlWebpackPlugin = require("html-webpack-plugin");
const ScriptExtHtmlWebpackPlugin = require("script-ext-html-webpack-plugin");

module.exports = {
    context: path.resolve(__dirname, "src/assets/js"),
    mode: "development",
    entry: "./bugs.js",
    output: {
        filename: "bundle.[hash].js",
        path: path.resolve(__dirname, "dist")
    },
    devServer: {
        port: 8080,
        contentBase: './dist',
        watchContentBase: true

    },
    resolve: {
        alias: {
            "@html": path.resolve(__dirname, 'dist')
        }
    },
    //watch: true,
    module: {
        rules: [
            {
                test: /\.s[ac]ss$/i,
                use: [
                    miniCssExtractPlugin.loader,
                    // Translates CSS into CommonJS
                    'css-loader',
                    // Compiles Sass to CSS
                    'sass-loader',
                ],
            },
            {
                test: /\.js$/,
                exclude: /node_modules/,
                loader: {
                    loader: "babel-loader",
                    options: {
                        presets : ["@babel/preset-env"]
                    }
                }
            },
            {
                test: /\.(njk|nunjucks)$/,
                loader: 'nunjucks-loader'
            }
        ],
    },
    plugins: [

        new htmlWebpackPlugin({
            filename: "index.html",
            template: "../../../inc/test-index.njk",
            minify: {
                removeComments: true,
                collapseWhitespace: true
            }
        }),

        new ScriptExtHtmlWebpackPlugin({
            defaultAttribute: "defer",
            module: /\.js$/i,
        }),

        new miniCssExtractPlugin({
            filename: "bundle.[hash].css"
        }),

        // new NunjucksWebpackPlugin({
        //     templates: [
        //         {
        //             from: "inc/test-index.njk",
        //             to: "../inc/template.html"
        //         }
        //     ]
        // }),

        new CleanWebpackPlugin()
    ],


/*
    plugins: [

        new htmlWebpackPlugin({
            filename: "index.html",
            template: path.resolve(__dirname, "dist/template.html"),
            minify: {
                removeComments: true,
                collapseWhitespace: true
            }
        }),
        new ScriptExtHtmlWebpackPlugin({
            defaultAttribute: "defer",
            module: /\.js$/i,
        }),

        new miniCssExtractPlugin({
            filename: "bundle.[hash].css"
        }),

        new NunjucksWebpackPlugin({
            templates: [
                {
                    from: "inc/test-index.njk",
                    to: "./template.html"
                }
            ]
        }),
        new CleanWebpackPlugin()
    ]

*/

};