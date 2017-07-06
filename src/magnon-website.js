/* eslint-disable */
import {
    MagnonShell, MagnonNotifications, MagnonNotification, MagnonIcon,
    MagnonProgressBar, MagnonCard, MagnonImage
} from "@magnon/components";
/* eslint-enable */

import { initNavigator } from "./js/navigator.js";
import { buildShell } from "./js/shell.js";
import "./js/analytics.js";

import cookieNotification from "./notifications/cookies.html";

export class MagnonWebsite {
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
