export default class Notifications {
	constructor() {
		this.notifications = document.createElement("div");
		this.notifications.id = "notifications";
		document.body.appendChild(this.notifications);
	}

	// I'm quite aware this is a mess. I made this quite a while ago, so that's
	// gonna be my excuse. Anyway, I would have done react here, but that seems
	// a bit too drastic considering this would be the only thing it would be
	// used for. Feel free to send suggestions to @magnontobi on Twitter!
	showNotification(title, text, onclose) {
		let notification = document.createElement("div"),
			titleElement = document.createElement("span"),
			textElement = document.createElement("span"),
			closeButton = document.createElement("span"),
			time = 500;

		let appendNotification = () => {
			notification.classList.add("off");
			notification.classList.add("s");

			notification.appendChild(titleElement);
			notification.appendChild(closeButton);
			notification.appendChild(textElement);

			this.notifications.appendChild(notification);

			window.setTimeout(function() {
				notification.classList.remove("s");
				window.setTimeout(function() {
					notification.classList.remove("off");
				}, time);
			}, 100);
		};

		titleElement.innerHTML = title;
		textElement.innerHTML = text;

		notification.className = "notification";
		titleElement.className = "title";
		textElement.className = "text";
		closeButton.className = "close";

		closeButton.addEventListener("click", function() {
			notification.classList.add("off");
			window.setTimeout(function() {
				notification.classList.add("s");
				window.setTimeout(function() {
					notification.parentElement.removeChild(notification);
				}, time);
			}, time);
			if (typeof onclose === "function") {
				onclose();
			}
		});

		appendNotification();
	}
}
