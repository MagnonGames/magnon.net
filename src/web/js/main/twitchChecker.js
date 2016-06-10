export default class TwitchChecker {
	constructor() {
		this.dot = document.getElementById("streamStatusDot");

		this.fetchSteamStatus(online => {
			if (online) {
				this.dot.style.fill = "#4CAF50";
			}
		});
	}

	fetchSteamStatus(callback) {
		let xhr = new XMLHttpRequest();

		xhr.onload = () => {
			let resp = JSON.parse(xhr.responseText)
			callback(resp.stream != null);
		}

		xhr.onerror = () => {
			window.main.notifications.showNotification("An Error Occured!",
				"Twitch stream status failed to check! " +
				"This is most likely because of a problem with your internet " +
				"connection, but it might also be a fault of Twitch.");
		}

		xhr.open("GET", "https://api.twitch.tv/kraken/streams/themagnon", true);
		xhr.send();
	}
}
