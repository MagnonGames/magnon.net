export default class Konami {
	constructor(callbackOnEntered) {
		this.konamiCode = [38, 38, 40, 40, 37, 39, 37, 39, 66, 65, 13];
		this.keys = [];

		document.addEventListener("keydown", e => {
			this.keys.push(e.keyCode);

			if (this.check() && this.keys.length == this.konamiCode.length) {
				this.keys = [];
				callbackOnEntered();
			}
		});
	}

	check() {
		for (let i = 0; i < this.keys.length; i++) {
			if (this.keys[i] != this.konamiCode[i]) {
				return false;
			}
		}
		return true;
	}
}
