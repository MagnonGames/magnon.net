import Cookies from "cookies-js";

import Notifications from "./main/notifications.js";
import SideBar from "./main/sideBar.js";
import TwitchChecker from "./main/twitchChecker.js";
import createGA from "./main/googleAnalytics.js";

class Main {
	constructor() {
		this.spreadLinks();

		createGA();

		this.notifications = new Notifications();
		this.sideBar = new SideBar();
		this.twitchChecker = new TwitchChecker();

		if (Cookies.get("cwa") !== "true") {
			this.notifications.showNotification("Cookies",
				"We use cookies to provide you with a better experience. " +
				"By staying on this website, you agree with our " +
				"<a href='/cookies'>cookie policy</a>.",
				() => {
					Cookies.set("cwa", "true", { expires: Infinity });
				});
		}
	}

	spreadLinks() {
		const links = document.querySelectorAll("[data-spread]");
		for (let link of links) {
			let element = link;
			while ((element = element.parentElement) && !element.classList.contains("spreadTarget"));

			element.addEventListener("click", () => {
				window.open(link.href, "_self");
			});
			element.style.cursor = "pointer";
		}
	}
}

function init() {
	window.main = new Main();
}

if (document.readyState !== "loading") init();
else document.addEventListener("DOMContentLoaded", init);
