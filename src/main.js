import "@webcomponents/webcomponentsjs/webcomponents-sd-ce.js";

/* eslint-disable */
import {
    MagnonShell, MagnonNotifications, MagnonIcon, MagnonSpinner,
    MagnonCard, MagnonImage
} from "@magnon/components";
/* eslint-enable */

import { initNavigator } from "./js/navigator/navigator.js";
import { buildShell } from "./js/shell/shell.js";

import cookieNotification from "./notifications/cookies.html";

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
