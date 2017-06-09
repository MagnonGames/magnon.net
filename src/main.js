import "@webcomponents/webcomponentsjs/webcomponents-sd-ce.js";

import "@magnon/components/magnon-shell/magnon-shell.html";
import "@magnon/components/magnon-notifications/magnon-notifications.html";
import "@magnon/components/magnon-icon/magnon-icon.html";
import "@magnon/components/magnon-spinner/magnon-spinner.html";
import "@magnon/components/magnon-card/magnon-card.html";
import "@magnon/components/magnon-image/magnon-image.html";

import { initNavigator } from "./js/navigator/navigator.js";
import { buildShell } from "./js/shell/shell.js";

import cookieNotification from "./notifications/cookies.html";

/* globals MagnonNotifications */
class MagnonWebsite {
    init() {
        this.setUpShell();
        initNavigator(this.shell);

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

        document.body.appendChild(this.shell);
    }
}

const website = new MagnonWebsite();
website.init();
