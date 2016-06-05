export default class SideBar {
	constructor() {
		this.navigation = document.getElementById("sideBar");

		this.blackout = document.createElement("span");
		this.blackout.id = "blackout";
		document.body.appendChild(this.blackout);

		this.swipeArea = 3 * window.devicePixelRatio;
		this.startX = 0;
		this.lastX = 0;
		this.lastDirection = 0;
		this.offset = 0;
		this.swiping = false;
		this.out = false;

		this.setUpListeners();
	}

	setUpListeners() {
		document.body.getElementsByClassName("topOverflow")[0]
			.addEventListener("click", this.open.bind(this));
		this.blackout.addEventListener("click", this.close.bind(this))

		window.addEventListener("touchstart", this.touchStart.bind(this));
		window.addEventListener("touchmove", this.touchMove.bind(this));
		window.addEventListener("touchend", this.touchEnd.bind(this));
	}

	touchStart(e) {
		let x = e.changedTouches[0].clientX;
		if (x < this.swipeArea || (this.out && x > this.getEndPosition())) {
			this.startX = x;
			this.navigation.style.transition = "none";
			this.blackout.style.transition = "none";
			this.blackout.style.display = "block";
			this.swiping = true;
			if (this.out) {
				this.offset = x - this.getEndPosition();
			} else {
				this.offset = 0;
			}
			e.preventDefault();
			e.stopPropagation();
		}
		if (this.out && x > this.getEndPosition()) {
			e.preventDefault();
			e.stopPropagation();
			this.startX = x;
		}
	}

	touchMove(e) {
		if (this.swiping) {
			let x = e.changedTouches[0].clientX - this.offset;
			this.navigation.style.left =
				Math.min((x - this.navigation.offsetWidth), 0) + "px";
			if (x > this.lastX) {
				this.lastDirection = 1;
			} else if (x < this.lastX) {
				this.lastDirection = -1;
			}
			this.lastX = x;

			this.blackout.style.opacity = ((this.navigation.offsetLeft * -1) /
				this.navigation.offsetWidth) * -1 + 1;

			e.preventDefault();
			e.stopPropagation();
		} else if (e.changedTouches[0].clientX < this.getEndPosition()) {
			this.startX = e.changedTouches[0].clientX;
			this.navigation.style.transition = "none";
			this.blackout.style.transition = "none";
			this.blackout.style.display = "block";
			this.swiping = true;
			this.offset = e.changedTouches[0].clientX - this.getEndPosition();
		}
		if (this.out && e.changedTouches[0].clientX > this.getEndPosition()) {
			e.preventDefault();
			e.stopPropagation();
		}
	}

	touchEnd(e) {
		if (this.swiping) {
			if (this.startX !== e.changedTouches[0].clientX) {
				let x = e.changedTouches[0].clientX - this.offset;
				if (this.lastDirection >= 0) {
					this.open();
				} else {
					this.close();
				}
			}
			this.swiping = false;
			this.lastDirection = 0;
			e.preventDefault();
			e.stopPropagation();
		}
		if (this.out && e.changedTouches[0].clientX > this.getEndPosition()) {
			e.preventDefault();
			e.stopPropagation();
			if (this.startX == e.changedTouches[0].clientX) {
				this.close();
			}
		}
	}

	getEndPosition() {
		return this.navigation.offsetLeft + this.navigation.offsetWidth;
	}

	open() {
		this.navigation.style.transition = "left 0.2s";
		this.blackout.style.opacity = 0;
		this.blackout.style.transition = "opacity 0.2s";
		this.blackout.style.display = "block";
		this.navigation.style.left = "0px";
		window.setTimeout(function () { blackout.style.opacity = 1; }, 10);
		this.out = true;
	}

	close() {
		this.navigation.style.transition = "left 0.2s";
		this.blackout.style.transition = "opacity 0.2s";
		this.navigation.style.left = -this.navigation.offsetWidth + "px";
		this.blackout.style.opacity = 0;
		window.setTimeout(() => { this.blackout.style.display = "none"; }, 200);
		this.out = false;
	}
}
