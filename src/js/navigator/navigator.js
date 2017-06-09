import Loader from "../loader/loader.js";

class Navigator {
    constructor() {
        this.state = {};

        const historyStateListener = e => {
            this.state = e.state;
            if (this.currentPage === (this.page === "" ? "home" : this.page)) return;
            this.updatePage();
        };
        window.addEventListener("popstate", historyStateListener);
    }

    set shell(shell) {
        this._shell = shell;

        this._content = document.createElement("div");
        this._content.slot = "content";

        this._shell.appendChild(this._content);
    }

    get page() {
        return location.pathname.match(/\/(.*)/)[1];
    }

    goToPage(page, replace, state) {
        if ((page === "" ? "home" : page) === this.currentPage) return;

        const url = page === "" ? "/" : page;

        Loader.show();

        if (replace) {
            history.replaceState(state, null, url);
        } else {
            history.pushState(state, null, url);
        }
        this.state = state;

        this.updatePage();
    }

    updatePage() {
        let page = this.page;
        if (page === "") page = "home";
        else if (page === "home") {
            this.show404();
            return;
        }

        if (page === this.currentPage) {
            if (this._currentJs.state) this._currentJs.state(this.state || {});
            Loader.hide();
            return;
        }
        this.currentPage = page;

        this.loadPage(page);
    }

    loadPage(page) {
        const loadingDone = () => {
            Loader.hide();
        };

        import(`../../pages/${page}/meta.json`).then(meta => {
            this._shell.expandContent = meta.expandContent;
            import(`../../pages/${page}/${page}.html`).then(html => {
                this._content.innerHTML = html;
                this._delegateLinks(href => this.goToPage(href));
                if (meta.js) {
                    import(`../../pages/${page}/${page}.js`).then(js => {
                        this._currentJs = js;
                        if (js.default) js.default();
                        if (js.state) js.state(this.state || {});
                        loadingDone();
                    });
                } else {
                    loadingDone();
                }
            });
        }).catch(() => {
            this.show404();
        });
    }

    show404() {
        this._shell.expandContent = false;
        import("../../error/404.html").then(html => {
            this.content.innerHTML = html;
            Loader.hide();
        });
    }

    _delegateLinks(callback) {
        const anchors = [...document.querySelectorAll("a[href]")];

        anchors.map(a => {
            if (a.href.startsWith(`${location.protocol}//${location.host}/`)) {
                a.addEventListener("click", e => {
                    e.preventDefault();

                    callback(a.href.match(/.+?:\/\/.+?\/(.*)/)[1]);
                });
            }
        });
    }
}

export default (new Navigator());
