export default class TwitchChecker {
	constructor() {
		this.dots = document.getElementsByClassName("streamStatusDot");

		this.fetchSteamStatus(online => {
			if (online) {
				for (let dot of this.dots) {
					dot.style.fill = "#E53935";
				}
			}
		});
	}

	fetchSteamStatus(callback) {
		let xhr = new XMLHttpRequest();

		xhr.onload = () => {
			let resp = JSON.parse(xhr.responseText);
			callback(resp.stream != null);
		};

		xhr.open("GET", "https://api.twitch.tv/kraken/streams/themagnon", true);
		xhr.setRequestHeader("Client-ID", "4q9kg6kuvdragw2stqq4lkrqvullu59");
		xhr.send();
	}
}
