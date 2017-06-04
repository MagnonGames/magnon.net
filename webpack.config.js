const path = require("path");

const HtmlWebpackPlugin = require("html-webpack-plugin");
const CleanWebpackPlugin = require("clean-webpack-plugin");

const dev = process.env.NODE_ENV !== "production";

module.exports = {
    entry: "./src/main.js",
    output: {
        path: path.resolve(__dirname, "out/static"),
        publicPath: "static/",
        filename: "bundle.js"
    },
    module: {
        loaders: [
            { test: /magnon.components\/.+?\.html$/, loader: "wc-loader" },
            { test: /src\/.*?\.html$/, loader: "html-loader" }
        ]
    },
    plugins: [
        new CleanWebpackPlugin(["out"]),
        new HtmlWebpackPlugin({
            filename: "../index.html",
            template: "src/index.html"
        })
    ],
    watch: process.env.WEBPACK_WATCH === "true"
};
