import Cookies from "cookies-js";

import Notifications from "./main/notifications.js";
import SideBar from "./main/sideBar.js";

class Main {
	constructor() {
		this.notifications = new Notifications();
		this.sideBar = new SideBar();

		if (Cookies.get("cwa") != "true") {
			this.notifications.showNotification("Cookies",
				"We use cookies to provide you with a better experience. " +
				"By staying on this website, you agree with our " +
				"<a href='/cookies'>cookie policy</a>.",
				() => {
					Cookies.set("cwa", "true", { expires: Infinity });
				});
		}
	}
}

function init() {
	window.main = new Main();
}

if (document.readyState != "loading") init();
else document.addEventListener("DOMContentLoaded", init);
