"use strict";

const path = require("path");

module.exports = {
    mode: "development",
    entry: path.resolve(__dirname, "inc/webpack/dev-js/main.js"),
    output: {
        filename: "bundle.js",
        path: path.resolve(__dirname, "inc/webpack/out")
    },
};