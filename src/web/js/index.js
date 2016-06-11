import {
	splashFromArray,
	effects,
	interpolation
} from "splasher.js";

import BackgroundParticles from "./particles";

function init() {
	let splashElement = document.getElementById("splash"),
		hello = splashElement.getElementsByClassName("hello")[0],
		welcome = splashElement.getElementsByClassName("welcome")[0],
		links = splashElement.getElementsByClassName("links")[0],
		paths = splashElement.getElementsByTagName("path"),

		timers = [];

	for (let i = 0; i < paths.length; i++) {
		let path = paths[i];

		path.style.strokeWidth = "0.5px";
		path.style.fillOpacity = 0;
		if (i < paths.length - 3) {
			path.style.stroke = "white";
		}

		let baseDelay = 3 + (i * 0.2);

		timers.push({
			delay: baseDelay, in: 1,
			effects: [
				new effects.DrawSVG(path, {
					toFillFade: true, toFillDelay: 0.7
				})
			]
		});
	}

	timers.push({
		delay: 0.5, in: 0.2, stay: 1, out: 0.3,
		effects: [
			new effects.GrowAndShrink(hello, {
				min: 0.5, max: 1
			}),
			new effects.FadeInAndOut(hello)
		]
	});

	timers.push({
		delay: 2, in: 0.5, stay: 1.5, out: 0.3,
		effects: [
			new effects.TranslateFromPosition(welcome, {
				y: -100, interpolation: new interpolation.Bounce()
			}),
			new effects.FadeInAndOut(welcome)
		]
	});

	timers.push({
		delay: 5, in: 0.4,
		effects: [
			new effects.FadeInAndOut(links)
		]
	})

	let splash = splashFromArray(timers);
	splash.run();

	splashElement.style.display = "block";

	let backgroundParticles = new BackgroundParticles(
		document.getElementById("backgroundParticlesContainer")
	);

	backgroundParticles.run();
}

if (document.readyState != "loading") init();
else document.addEventListener("DOMContentLoaded", init);
