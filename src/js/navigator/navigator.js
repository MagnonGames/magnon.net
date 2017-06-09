import Loader from "../loader/loader.js";

class Navigator {
    constructor(shell) {
        this._loadedPageName = null;
        this._currentScript = () => {};
        this._meta = {};
        this._state = {};

        this._shell = shell;
        this._content = null;

        this._initShell();
        this._setUpHistoryListener();

        this._update();
    }

    _setUpHistoryListener() {
        const historyStateListener = e => {
            this._state = e.state;
            this._update();
        };
        window.addEventListener("popstate", historyStateListener);
    }

    _initShell() {
        this._content = document.createElement("div");
        this._content.slot = "content";

        this._shell.appendChild(this._content);
    }

    _update() {
        const pageName = getCurrentPageName();
        const samePageAsBefore = pageName === this._loadedPageName;

        if (!samePageAsBefore) Loader.show();

        // Content Update
        const loadPromise = samePageAsBefore ? Promise.resolve() : this._loadPage(pageName);
        loadPromise.then(() => {
            document.body.scrollTop = 0;
            // State Update
            if (this._currentScript && this._currentScript.state) {
                this._currentScript.state(this._state || {});
            }

            Loader.hide();
        });
    }

    _loadPage(pageName) {
        return fetchPage(pageName).then(page => {
            const { meta, html, script } = page;

            this._shell.expandContent = meta.expandContent;
            document.title = `${meta.title} - Magnon`;

            this._content.innerHTML = html;
            delegateLinks(href => this.goToUrl(href));

            if (script) script.default();

            this._currentScript = script;
            this._loadedPageName = pageName;

            return Promise.resolve();
        });
    }

    _show404() {
        this._shell.expandContent = false;
        import("../../error/404.html").then(html => {
            this.meta = {};
            this._content.innerHTML = html;
            Loader.hide();
        });
    }

    goToUrl(url, replace, state) {
        this._state = state;

        if (replace || getPageNameFromUrl(url) === this._loadedPageName) {
            history.replaceState(state, null, url);
        } else {
            history.pushState(state, null, url);
        }

        if (url === "home") {
            this._show404();
        }

        this._update();
    }
}

const getUrl = () => {
    return location.pathname.match(/\/(.*)/)[1];
};

export const getPageNameFromUrl = url => {
    if (url === "/") url = "";
    return url === "" ? "home" : url;
};

export const getCurrentPageName = () => {
    return getPageNameFromUrl(getUrl());
};

const fetchPage = page => {
    let meta, html, script;
    return import(`../../pages/${page}/meta.json`).then(fetchedMeta => {
        meta = fetchedMeta;
        return import(`../../pages/${page}/${page}.html`);
    }).then(fetchedHtml => {
        html = fetchedHtml;
        return import(`../../pages/${page}/${page}.js`)
            .then(js => Promise.resolve(js))
            .catch(() => Promise.resolve());
    }).then(fetchedScript => {
        script = fetchedScript;
        return Promise.resolve({ meta, html, script});
    }).catch(() => {
        this.show404();
    });
};

const delegateLinks = callback => {
    const anchors = [...document.querySelectorAll("a[href]")];

    anchors.map(a => {
        if (a.href.startsWith(`${location.protocol}//${location.host}/`)) {
            a.addEventListener("click", e => {
                e.preventDefault();

                callback(a.href.match(/.+?:\/\/.+?\/(.*)/)[1]);
            });
        }
    });
};

let navigator;
export const goToUrl = (url, replace, state) => {
    navigator.goToUrl(url, replace, state);
};
export const initNavigator = shell => {
    navigator = new Navigator(shell);
};
