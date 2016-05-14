/* global initParallax, docCookies */

var done,

	overflow,
	navigation,
	blackout,
	notifications,

	startX = 0,
	lastX = 0,
	lastDirection = 0,
	offset = 0,
	swiping = false,
	out = false,
	swipeArea = 10;

function openNav() {
	"use strict";

	navigation.style.transition = "left 0.2s";
	blackout.style.opacity = 0;
	blackout.style.transition = "opacity 0.2s";
	blackout.style.display = "block";
	navigation.style.left = "0px";
	window.setTimeout(function () { blackout.style.opacity = 1; }, 10);
	out = true;
}

function closeNav() {
	"use strict";

	navigation.style.transition = "left 0.2s";
	blackout.style.transition = "opacity 0.2s";
	navigation.style.left = -navigation.offsetWidth + "px";
	blackout.style.opacity = 0;
	window.setTimeout(function () { blackout.style.display = "none"; }, 200);
	out = false;
}

function touchStart(e) {
	"use strict";

	var x = e.changedTouches[0].clientX;
	if (x < swipeArea || (out && x > navigation.offsetLeft + navigation.offsetWidth)) {
		startX = x;
		navigation.style.transition = "none";
		blackout.style.transition = "none";
		blackout.style.display = "block";
		swiping = true;
		if (out) {
			offset = x - navigation.offsetWidth + navigation.offsetLeft;
		} else {
			offset = 0;
		}
		e.preventDefault();
		e.stopPropagation();
	}
	if (out && x > navigation.offsetLeft + navigation.offsetWidth) {
		e.preventDefault();
		e.stopPropagation();
		startX = x;
	}
}

function touchMove(e) {
	"use strict";

	if (swiping) {
		var x = e.changedTouches[0].clientX - offset;
		navigation.style.left = Math.min((x - navigation.offsetWidth), 0) + "px";
		if (x > lastX) {
			lastDirection = 1;
		} else if (x < lastX) {
			lastDirection = -1;
		}
		lastX = x;

		blackout.style.opacity = ((navigation.offsetLeft * -1) / navigation.offsetWidth) * -1 + 1;

		e.preventDefault();
		e.stopPropagation();
	} else if (e.changedTouches[0].clientX < navigation.offsetLeft + navigation.offsetWidth) {
		startX = e.changedTouches[0].clientX;
		navigation.style.transition = "none";
		blackout.style.transition = "none";
		blackout.style.display = "block";
		swiping = true;
		offset = e.changedTouches[0].clientX - navigation.offsetWidth + navigation.offsetLeft;
	}
	if (out && e.changedTouches[0].clientX > navigation.offsetLeft + navigation.offsetWidth) {
		e.preventDefault();
		e.stopPropagation();
	}
}

function touchEnd(e) {
	"use strict";

	if (swiping) {
		if (startX !== e.changedTouches[0].clientX) {
			var x = e.changedTouches[0].clientX - offset;
			if (lastDirection >= 0) {
				openNav();
			} else {
				closeNav();
			}
		}
		swiping = false;
		lastDirection = 0;
		e.preventDefault();
		e.stopPropagation();
	}
	if (out && e.changedTouches[0].clientX > navigation.offsetLeft + navigation.offsetWidth) {
		e.preventDefault();
		e.stopPropagation();
		if (startX == e.changedTouches[0].clientX) {
			closeNav();
		}
	}
}

function showNotification(title, text, onclose) {
	var notification = document.createElement("div"),
		etitle = document.createElement("span"),
		etext = document.createElement("span"),
		closeButton = document.createElement("span"),
		time = 500,
		add = function() {
			notification.classList.add("off");
			notification.classList.add("s");

			notification.appendChild(etitle);
			notification.appendChild(closeButton);
			notification.appendChild(etext);

			notifications.appendChild(notification);

			window.setTimeout(function() {
				notification.classList.remove("s");
				window.setTimeout(function() {
					notification.classList.remove("off");
				}, time);
			}, 100);
		};

	etitle.innerHTML = title;
	etext.innerHTML = text;

	notification.className = "notification";
	etitle.className = "title";
	etext.className = "text";
	closeButton.className = "close";

	closeButton.addEventListener("click", function() {
		notification.classList.add("off");
		window.setTimeout(function() {
			notification.classList.add("s");
			window.setTimeout(function() {
				notification.parentElement.removeChild(notification);
			}, time);
		}, time);
		if (typeof onclose == 'function') {
			onclose();
		}
	});

	add();
}

function init() {
	"use strict";

	document.body.addEventListener("touchstart", touchStart);
	document.body.addEventListener("touchmove", touchMove);
	document.body.addEventListener("touchend", touchEnd);

	overflow = document.getElementsByClassName("topOverflow")[0];
	navigation = document.getElementById("sideBar");

	blackout = document.createElement("span");
	blackout.id = "blackout";
	document.body.appendChild(blackout);

	notifications = document.createElement("div");
	notifications.id = "notifications";
	document.body.appendChild(notifications);

	if (!(docCookies.hasItem("cwa") && docCookies.getItem("cwa") == "true")) {
		showNotification("Cookies", "We use cookies to provide you with a better experience. " +
				"By staying on this website, you agree with our <a href='/cookies'>cookie policy</a>.",
				function() {
					docCookies.setItem("cwa", "true", Infinity, "/");
				});
	}

	overflow.addEventListener("click", openNav);
	blackout.addEventListener("click", closeNav);

	typeof initParallax == 'function' ? initParallax():null;
}

if (done) {
	init();
}
