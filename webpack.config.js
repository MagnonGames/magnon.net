const path = require("path");
const webpack = require("webpack");

const CleanWebpackPlugin = require("clean-webpack-plugin");

const HtmlCompiler = require("./webpack/html-compiler.js");

const production = process.env.NODE_ENV === "production";

const productionLoaders = (() => {
    if (!production) return [];
    return [
        { test: /\.js$/, loader: "babel-loader" }
    ];
})();
const productionPlugins = (() => {
    if (!production) return [];
    return [
        new CleanWebpackPlugin(["out"]),
        new webpack.optimize.UglifyJsPlugin({ comments: false }),
        new webpack.optimize.OccurrenceOrderPlugin(),
        new webpack.optimize.MinChunkSizePlugin({ minChunkSize: 10000 })
    ];
})();

module.exports = {
    entry: "./src/main.js",
    output: {
        path: path.resolve(__dirname, "out/static"),
        publicPath: "static/",
        filename: "bundle.js"
    },
    module: {
        loaders: [
            ...productionLoaders,

            {
                test: /magnon.components\/.+?\.html$/,
                loader: production ? "babel-loader!wc-loader?minify=true" : "wc-loader"
            },
            { test: /src\/.*?\.html$/, loader: "html-loader" },
            {
                test: /\.(jpe?g|png|gif|svg)$/,
                loaders: ["file-loader", "image-webpack-loader"]
            },
            { test: /\.yml$/, loaders: ["json-loader", "yaml-loader"] }
        ]
    },
    plugins: [
        ...productionPlugins,

        new webpack.SourceMapDevToolPlugin(),
        new HtmlCompiler({
            outPath: "../html",
            template: "src/template.html",
            metaTest: /src\/pages\/(\w+?)\/meta\.json/,
            indexMeta: {
                title: "Magnon"
            }
        })
    ],
    watch: process.env.WEBPACK_WATCH === "true"
};
