const htmlMinifier = require("html-minifier");
const CleanCSS = require("clean-css");

const htmlMinify = htmlMinifier.minify;
const ccss = new CleanCSS();

const htmlOptions = {
    removeAttributeQuotes: true,
    collapseWhitespace: true,
    html5: true,
    minifyCSS: true,
    removeComments: true
};

module.exports = function(content) {
    const callback = this.async();

    let result = content;

    result = result.replace(/html`([\s\S]*?)`/g, (match, html) => {
        return "html`" + htmlMinify(html, htmlOptions) + "`";
    });
    result = result.replace(/css`([\s\S]*?)`/g, (match, css) => {
        return "css`" + ccss.minify(css).styles + "`";
    });

    callback(null, result);
};
