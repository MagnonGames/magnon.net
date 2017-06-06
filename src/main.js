import "@webcomponents/webcomponentsjs/webcomponents-sd-ce.js";

import "@magnon/components/magnon-shell/magnon-shell.html";
import "@magnon/components/magnon-notifications/magnon-notifications.html";
import "@magnon/components/magnon-icon/magnon-icon.html";
import "@magnon/components/magnon-spinner/magnon-spinner.html";
import "@magnon/components/magnon-card/magnon-card.html";

import Loader from "./js/loader/loader.js";
import { buildShell } from "./js/shell/shell.js";

import cookieNotification from "./notifications/cookies.html";

/* globals MagnonNotifications */
class MagnonWebsite {
    init() {
        this.setUpShell();
        this.updatePage();

        const historyStateListener = () => {
            Loader.show();
            this.updatePage();
        };
        window.addEventListener("popstate", historyStateListener);

        window.addEventListener("load", () => {
            if (!localStorage.getItem("goodWidthCookies")) {
                const notification = MagnonNotifications.send(cookieNotification);
                notification.addEventListener("close", () => {
                    localStorage.setItem("goodWidthCookies", true);
                });
            }
        });
    }

    setUpShell() {
        this.shell = buildShell();
        this.content = document.createElement("div");
        this.content.slot = "content";

        this.shell.appendChild(this.content);
        document.body.appendChild(this.shell);
    }

    goToPage(page, replace) {
        if ((page === "" ? "home" : page) === this.currentPage) return;
        if (page === "") page = "/";

        Loader.show();

        if (replace) {
            history.replaceState(null, null, page);
        } else {
            history.pushState(null, null, page);
        }

        this.updatePage();
    }

    updatePage() {
        let page = location.pathname.match(/\/(.*)/)[1];
        if (page === "") page = "home";
        else if (page === "home") {
            this.show404();
            return;
        }

        this.currentPage = page;

        this.loadPage(page);
    }

    loadPage(page) {
        import(`./pages/${page}/meta.json`).then(meta => {
            import(`./pages/${page}/${page}.html`).then(html => {
                this.content.innerHTML = html;
                this._delegateLinks(href => this.goToPage(href));
                Loader.hide();
            });
        }).catch(() => {
            this.show404();
        });
    }

    show404() {
        import("./error/404.html").then(html => {
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

const website = new MagnonWebsite();
website.init();
