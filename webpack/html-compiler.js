const fs = require("fs");
const ejs = require("ejs");

class HtmlCompiler {
    constructor(options = { outPath: "." }) {
        this.outPath = options.outPath;
        this.template = options.template;
        this.metaTest = options.metaTest;

        if (this.outPath.endsWith("/")) this.outPath = this.outPath.substring(0, this.outPath.length - 1);

        this.startTime = Date.now();
        this.prevTimestamps = {};

        this.metas = {};

        if (options.indexMeta) {
            this.metas.index = options.indexMeta;
        }

        this.reloadTemplate();
    }

    apply(compiler) {
        compiler.plugin("emit", (compilation, callback) => {
            const changedFiles = compilation.fileDependencies.filter(wf => {
                const previous = this.prevTimestamps[wf] || this.startTime;
                const current = compilation.fileTimestamps[wf] || Infinity;
                return previous < current;
            });

            let metaChanged = false;

            for (let filename of changedFiles) {
                const metaMatch = filename.match(this.metaTest);
                if (metaMatch) {
                    const name = metaMatch[1];
                    const json = fs.readFileSync(filename, { encoding: "utf8" });
                    this.metas[name] = JSON.parse(json);
                    metaChanged = true;
                }
            }

            if (!metaChanged) return;

            const mainOut = compilation.mainTemplate.outputOptions;
            const jsPath = `/${mainOut.publicPath}${mainOut.filename}`;

            for (let page in this.metas) {
                const meta = this.metas[page];
                const data = {
                    src: jsPath, meta
                };
                const source = ejs.render(this.templateSource, data);
                compilation.assets[`${this.outPath}/${page}.html`] = {
                    source() {
                        return source;
                    },
                    size() {
                        return source.length;
                    }
                };
            }

            callback();
        });
    }

    reloadTemplate() {
        this.templateSource = fs.readFileSync(this.template, { encoding: "utf8" });
    }
}

module.exports = HtmlCompiler;
