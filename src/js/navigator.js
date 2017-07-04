import deepEql from "deep-eql";
import anime from "animejs";

import Loader from "./loader/loader.js";

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
            if (!(this._prevHash !== window.location.hash &&
                this._prevPath === window.location.pathName)) {
                this._state = e.state;
            }

            this._prevPath = window.location.pathName;
            this._prevHash = window.location.hash;

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
        return new Promise(resolve => {
            const pageName = getCurrentPageName();
            const samePageAsBefore = pageName === this._loadedPageName;

            if (!samePageAsBefore) Loader.show();

            // Content Update
            const loadPromise = samePageAsBefore ? Promise.resolve() : this._loadPage(pageName);
            loadPromise.then(() => {
                if (!samePageAsBefore) document.body.scrollTop = 0;
                // State Update
                if (this._currentScript && this._currentScript.state) {
                    if (!deepEql(this._prevState, this._state)) {
                        this._currentScript.state(this._state || {});
                        this._prevState = this._state;
                    }
                }

                Loader.hide();
                resolve();
            });
        });
    }

    _loadPage(pageName) {
        if (getUrl() === "home") {
            pageName = "thisPageAbsolutelyDoesNotExistBecauseThisIsAGoodHack :)";
            // Patches welcome, lol xD
        }
        const show = page => {
            const { meta, html, script } = page;

            this._shell.expandContent = meta.expandContent;
            document.title = `${meta.title} - Magnon`;

            this._content.innerHTML = html;
            delegateLinks(href => goToUrl(href));

            if (script) script.default();

            this._currentScript = script;
            this._loadedPageName = pageName;
        };

        return fetchPage(pageName).then(page => {
            show(page);
            return Promise.resolve();
        }).catch(e => {
            console.error(e);
            return fetchErrorPage("404").then(page => {
                show(page);
                return Promise.resolve();
            });
        });
    }

    goToUrl(url, replace, state) {
        // Fade out
        const content = this._shell.root.querySelector("#content-container");
        anime({
            targets: content,
            translateY: "10vh",
            opacity: 0,
            easing: "easeInOutQuad",
            duration: 300
        }).finished.then(() => {
            this._state = state;

            const pageName = getPageNameFromUrl(url);

            if (replace || pageName === this._loadedPageName) {
                history.replaceState(state, null, url);
            } else {
                history.pushState(state, null, url);
            }

            return this._update();
        }).then(() => {
            // Fade in
            anime({
                targets: content,
                translateY: ["-10vh", "0"],
                opacity: 1,
                easing: "easeInOutQuad",
                duration: 300
            });
        });
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
    return import(`../pages/${page}/meta.json`).then(fetchedMeta => {
        meta = fetchedMeta;
        return import(`../pages/${page}/${page}.html`);
    }).then(fetchedHtml => {
        html = fetchedHtml;
        return import(`../pages/${page}/${page}.js`)
            .then(js => Promise.resolve(js))
            .catch(() => Promise.resolve());
    }).then(fetchedScript => {
        script = fetchedScript;
        return Promise.resolve({ meta, html, script});
    });
};

const fetchErrorPage = (page = "404") => {
    return import(`../error/${page}.html`).then(html => {
        return Promise.resolve({
            meta: {
                title: page
            },
            html
        });
    });
};

const delegateLinks = callback => {
    const main = `${location.protocol}//${location.host}`;
    const mainPath = `${main}${location.pathname}`;

    const capture = a => {
        if (a.href.startsWith(main) && a.href !== mainPath) {
            a.onclick = e => {
                e.preventDefault();

                let url = a.href.match(/.+?:\/\/.+?\/(.*)/)[1];
                if (url === "") url = "/";

                callback(url);
            };
        }
    };

    const searchForAChild = el => {
        for (let child of el.children) {
            if (child.tagName === "A" && child.href) {
                capture(child);
            }

            if (child.root) searchForAChild(child.root);
            searchForAChild(child);
        }
    };

    searchForAChild(document.body);
};

let navigator;
export const goToUrl = (url, replace, state) => {
    navigator.goToUrl(url, replace, state);
};
export const initNavigator = shell => {
    navigator = new Navigator(shell);
};
