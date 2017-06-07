import anime from "animejs";

import atScroll from "./at-scroll.js";

import pkImage from "./pillowKnights.png";

const container = document.querySelector(".game-container");

container.style.backgroundImage = `url(${pkImage})`;

atScroll(750, () => anime({
    targets: container,
    scale: {
        value: [0, 1],
        easing: "easeOutElastic",
        elasticity: 650,
        duration: 1000
    }
}));
