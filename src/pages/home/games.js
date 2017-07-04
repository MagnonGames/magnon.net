import anime from "animejs";

import { atElement } from "../../js/scroll-utils.js";

import pkImage from "./pillowKnights.png";

export default () => {
    const container = document.querySelector(".game-container");

    container.style.backgroundImage = `url(${pkImage})`;

    atElement("#games", () => anime({
        targets: container.querySelector("magnon-card"),
        translateX: [-500, 0],
        opacity: [0, 1],
        easing: "easeInOutQuad",
        duration: 500
    }));
};
