const path = require("path");
const webpack = require("webpack");

const CleanWebpackPlugin = require("clean-webpack-plugin");
const BabiliWebpackPlugin = require("babili-webpack-plugin");

const generateHtmlPlugins = require("./webpack/html-plugin-generator.js");
const FaviconGenerator = require("./webpack/favicon-generator.js");

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
        new BabiliWebpackPlugin(),
        new webpack.optimize.OccurrenceOrderPlugin(),
        new webpack.optimize.MinChunkSizePlugin({ minChunkSize: 10000 })
    ];
})();
const productionImageLoaderOptions = (() => {
    if (!production) return {};
    return {
        optipng: {
            optimizationLevel: 7
        },
        pngquant: {
            quality: "65-90",
            speed: 4
        }
    };
})();

const hash = production ? "-[hash]" : "";

module.exports = new Promise((resolve, reject) => {
    generateHtmlPlugins().then(htmlPlugins => {
        resolve({
            entry: "./src/main.js",
            output: {
                path: path.resolve(__dirname, "out/static"),
                publicPath: "static/",
                filename: `bundle${hash}.js`
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
                        loaders: [
                            "file-loader",
                            {
                                loader: "image-webpack-loader",
                                query: productionImageLoaderOptions
                            }
                        ]
                    },
                    { test: /\.yml$/, loaders: ["json-loader", "yaml-loader"] }
                ]
            },
            plugins: [
                ...productionPlugins,
                ...htmlPlugins,

                new webpack.SourceMapDevToolPlugin(),
                new FaviconGenerator({
                    icon: "./assets/icon.svg",
                    color: "#2F79BE", altColor: "white", background: "#2F79BE"
                })
            ],
            watch: process.env.WEBPACK_WATCH === "true"
        });
    });
});
