const isBrowser = window;

const supportsSD = "attachShadow" in Element.prototype && "getRootNode" in Element.prototype;
const supportsCE = window.customElements;

const init = async() => {
    if (isBrowser && !supportsSD || !supportsCE) {
        await import("@webcomponents/webcomponentsjs/webcomponents-sd-ce.js");
        console.log("Loaded SD and CE polyfills");
    }

    const { MagnonWebsite } = await import("./magnon-website.js");
    const website = new MagnonWebsite();
    website.init();
};

init();
