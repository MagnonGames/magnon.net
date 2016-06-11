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

		xhr.open("GET", "https://api.twitch.tv/kraken/streams/themagnon", true);
		xhr.send();
	}
}
