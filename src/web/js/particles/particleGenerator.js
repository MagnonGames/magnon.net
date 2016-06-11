import * as Particles from "pixi-particles";

export default class ParticleGenerator {
	getNewBackgroundEmitter(container, width, height) {
		return new Particles.Emitter(
			container, [PIXI.Texture.fromImage("/images/circle.png")],
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
					x: 0, y: height, w: width, h: 10
				},
				pos: {
					x: 0, y: 0
				}
		    }
		);
	}

	getNewSplashEmitter(container, x, y, emitterScale) {
		return new Particles.Emitter(
			container, [PIXI.Texture.fromImage("/images/circle.png")],
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
	}
}
