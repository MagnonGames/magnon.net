const fs = require("fs");
const SVGO = require("svgo");
const svg2png = require("svg2png");

const svgo = new SVGO();

module.exports = class FaviconGenerator {
    constructor({
        icon = null, outPath = ".",
        color = "black", background = "white",
        bgWhen = size => size > 48, altColor = false,
        icons = [16, 32, 48, 96, 192],
        appleIcons = [180],
        maskIcon = true
    } = {}) {
        this.iconPath = icon;
        this.outPath = outPath;

        this.color = color;
        this.background = background;
        this.altColor = altColor;
        this.bgWhen = bgWhen;

        this.icons = icons;
        this.appleIcons = appleIcons;
        this.maskIcon = maskIcon;

        if (!this.iconPath) throw new Error("An icon path is required");
    }

    apply(compiler) {
        let compiled = { icons: [], appleIcons: [] };

        compiler.plugin("make", (compilation, callback) => {
            this.readIconSvg().then(svg => {
                const iconPromises = [];

                iconPromises.push(...this.generateIconsFrom(svg, this.icons, "icon"));
                iconPromises.push(...this.generateIconsFrom(svg, this.appleIcons, "apple-touch-icon", true));

                Promise.all(iconPromises).then(kvs => {
                    const { icons, appleIcons } = this.addIconsToAssets(compilation, kvs);
                    compiled.icons = icons;
                    compiled.appleIcons = appleIcons;

                    if (this.maskIcon) {
                        this.optimize(this.generateSvgFrom(svg, { overwriteFg: "#000" })).then(svg => {
                            compilation.assets[`${this.outPath}/mask-icon.svg`] = {
                                source: () => svg,
                                size: () => svg.length
                            };
                            callback();
                        });
                    } else callback();
                });
            });
        });

        compiler.plugin("compilation", compilation => {
            const publicPath = compilation.outputOptions.publicPath;

            compilation.plugin("html-webpack-plugin-before-html-processing", (htmlPluginData, callback) => {
                const toRealPath = relativePath => "/" + publicPath + relativePath.substring(2);

                const iconTags = compiled.icons.map(icon => {
                    const sizes = icon.match(/-(\w+?).png$/)[1];
                    return `<link rel="icon" type="image/png" sizes="${sizes}" href="${toRealPath(icon)}">`;
                }).join("");
                const appleTags = compiled.appleIcons.map(icon => {
                    const sizes = icon.match(/-(\w+?).png$/)[1] || Math.max.apply(null, this.appleIcons);
                    return `<link rel="apple-touch-icon" sizes="${sizes}" href="${toRealPath(icon)}">`;
                }).join("");

                const maskTag = `<link rel="mask-icon" href="${toRealPath(`${this.outPath}/mask-icon.svg`)}" color="${this.color}">`;

                const allTags = iconTags + appleTags + maskTag;

                htmlPluginData.html = htmlPluginData.html.replace(/(<\/head>)/i, allTags + "$&");
                callback(null, htmlPluginData);
            });
        });
    }

    readIconSvg() {
        return new Promise((resolve, reject) => {
            fs.readFile(this.iconPath, "utf8", (err, string) => {
                if (err) throw err;
                resolve(string);
            });
        });
    }

    optimize(svg) {
        return new Promise(resolve => {
            svgo.optimize(svg, result => resolve(result.data));
        });
    }

    generateIconsFrom(svg, sizes, prefix, apple) {
        return sizes.map(size => {
            const modifiedSvg = this.generateSvgFrom(svg, { iconSize: size, changeColors: true, solidBg: apple });
            const svgBuffer = Buffer.from(modifiedSvg, "utf8", true);

            return svg2png(svgBuffer, { width: size }).then(buffer => {
                return Promise.resolve(
                    [`${prefix}-${size}x${size}`, {
                        source: () => buffer,
                        size: () => buffer.length
                    }]
                );
            });
        });
    }

    generateSvgFrom(svg, {
        iconSize = 0,
        changeColors = false,
        overwriteFg = false,
        solidBg = false
    } = {}) {
        const showBg = this.bgWhen(iconSize);
        const fgColor = showBg && this.altColor && changeColors ? this.altColor : this.color;
        const bgColor = showBg && changeColors ? this.background : "rgba(0, 0, 0, 0)";
        const scale = showBg ? 0.8 : 1;

        if (solidBg) {
            svg = svg.replace(/<svg.*?>/, `$&<rect x="0" y="0" width="16" height="16"`);
        }

        const translation = (1 - scale) * 8;
        let fgAttributes = "";
        if (showBg) fgAttributes = `fill="${fgColor}" transform="translate(${translation}, ${translation}) scale(${scale})"`;
        else fgAttributes = `fill="${overwriteFg || fgColor}"`;

        let bgAttributes = "";
        if (showBg) bgAttributes = `fill="${bgColor}"`;
        else bgAttributes = `display="none"`;

        svg = svg.replace(/(class="fg")/g, fgAttributes);
        svg = svg.replace(/(class="bg")/g, bgAttributes);

        return svg;
    }

    // A kv here contains [iconName, pngBuffer]
    addIconsToAssets(compilation, kvPairs) {
        let icons = [], appleIcons = [];

        kvPairs.forEach(kv => {
            const type = kv[0].match(/^(.+)-/)[1];
            const sizeString = kv[0].match(/-(\w+?)$/)[1];

            if (type === "icon") {
                const pathName = `${this.outPath}/icon-${sizeString}.png`;
                compilation.assets[pathName] = kv[1];

                icons.push(pathName);
            }

            if (type === "apple-touch-icon") {
                const useSizeString = parseInt(sizeString) !== Math.max.apply(null, this.appleIcons);
                let pathName = `${this.outPath}/apple-touch-icon`;
                if (useSizeString) pathName += `-${sizeString}`;
                pathName += ".png";
                compilation.assets[pathName] = kv[1];

                appleIcons.push(pathName);
            }
        });

        return { icons, appleIcons };
    }
};
