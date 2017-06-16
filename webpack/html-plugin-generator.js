const glob = require("glob");
const fs = require("fs");

const HtmlWebpackPlugin = require("html-webpack-plugin");

const getMetaFilePaths = () => {
    return new Promise((resolve, reject) => {
        glob("./src/pages/*/meta.json", (err, files) => {
            if (err) reject(err);
            resolve(files);
        });
    });
};

const getMetas = () => {
    return getMetaFilePaths().then(paths => {
        return Promise.all(paths.map(path => {
            return new Promise((resolve, reject) => {
                fs.readFile(path, "utf8", (err, json) => {
                    if (err) reject(err);
                    const meta = JSON.parse(json);
                    meta.pageName = path.match(/\/(\w+?)\/meta\.json$/)[1];
                    resolve(meta);
                });
            });
        }));
    });
};

module.exports = minify => {
    return getMetas().then(metas => {
        metas.push({
            title: "Magnon",
            pageName: "index"
        });
        return metas.map(meta => {
            return new HtmlWebpackPlugin({
                title: meta.title === "Magnon" ? "Magnon" : `${meta.title} - Magnon`,
                description: meta.description,
                filename: `../html/${meta.pageName}.html`,
                template: "./src/template.ejs",
                inject: "head",
                minify,
                hash: true
            });
        });
    });
};
