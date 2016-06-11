import * as PIXI from "pixi.js";
import * as Particles from "pixi-particles";

export default class BackgroundParticles {
	constructor(element) {
		this.renderer = PIXI.autoDetectRenderer(
			window.innerWidth,
			window.innerHeight,
			{ transparent: true }
		);

		element.appendChild(this.renderer.view);

		this.container = new PIXI.Container();

		let texture = PIXI.Texture.fromImage("/images/circle.png");

		this.emitter = new Particles.Emitter(
			this.container,
			[PIXI.Texture.fromImage("/images/circle.png")],
			{
				scale: {
					start: 0.03,
					end: 0.01
				},
		        color: {
		            start: "#ffffff",
		            end: "#ffffff"
		        },
		        speed: {
		            start: 200,
		            end: 100
		        },
		        startRotation: {
		            min: 260,
		            max: 280
		        },
				lifetime: {
					min: 10,
					max: 15
				},
		        frequency: 0.12,
		        maxParticles: 500,
		        addAtBack: false,
		        spawnType: "rect",
				spawnRect: {
					"x": 0,
					"y": window.innerHeight,
					"w": window.innerWidth,
					"h": 10
				},
				pos: {
					x: 0, y: 0
				}
		    }
		);

		this.smallParticles = [];

		window.addEventListener("resize", () => {
			this.resize(window.innerWidth, window.innerHeight);
		});
		this.resize(window.innerWidth, window.innerHeight);

		window.addEventListener("mousedown", e => {
			this.splash(e.pageX, e.pageY);
		});
		window.addEventListener("touchdown", e => {
			this.splash(e.clientX, e.clientY);
		});
	}

	splash(x, y, emitterScale) {
		emitterScale = emitterScale || 1;

		let emitter = new Particles.Emitter(
			this.container,
			[PIXI.Texture.fromImage("/images/circle.png")],
			{
				scale: {
					start: 0.05,
					end: 0.02
				},
				color: {
					start: "#ffffff",
					end: "#ffffff"
				},
				speed: {
					start: 100,
					end: 50
				},
				startRotation: {
					min: 0,
					max: 360
				},
				lifetime: {
					min: 0.5 * emitterScale,
					max: 0.8 * emitterScale
				},
				frequency: 0.07,
				emitterLifetime: 0.3 * emitterScale,
				maxParticles: 50,
				pos: {
					x, y
				},
				addAtBack: false,
				spawnType: "burst",
				particlesPerWave: 3,
				particleSpacing: 0,
				angleStart: 0
			}
		);

		emitter.emit = true;
		this.smallParticles.push(emitter);

		window.setTimeout(() => {
			this.smallParticles.splice(this.smallParticles.indexOf(emitter), 1);
		}, 1000 * emitterScale);
	}

	resize(width, height) {
		this.emitter.spawnRect = new PIXI.Rectangle(0, height, width, 10);
		this.emitter.minLifetime = (5 * height * 0.001);
		this.emitter.maxLifetime = (7 * height * 0.001);
	}

	run() {
		this.emitter.emit = true;

		this.lastTime = 0;
		this.update();
	}

	update() {
		this.now = window.performance.now();
		this.delta = this.now - this.lastTime;
		this.lastTime = this.now;

		this.emitter.update(this.delta * 0.001);

		for (let emitter of this.smallParticles) {
			emitter.update(this.delta * 0.001);
		}

		this.renderer.render(this.container);

		requestAnimationFrame(this.update.bind(this));
	}
}
