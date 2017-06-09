import anime from "animejs";

import { atElement } from "../../js/scroll-utils/scroll-utils.js";

import pkImage from "./pillowKnights.png";

export default () => {
    const container = document.querySelector(".game-container");

    container.style.backgroundImage = `url(${pkImage})`;

    atElement("#games", () => anime({
        targets: container,
        scale: {
            value: [0, 1],
            easing: "easeOutElastic",
            elasticity: 650,
            duration: 1000
        }
    }));
};
