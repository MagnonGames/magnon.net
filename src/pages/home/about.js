import anime from "animejs";

import { atElement } from "../../js/scroll-utils/scroll-utils.js";

export default () => {
    atElement("#about", () => {
        anime({
            targets: "#team",
            translateY: [-100, 0],
            opacity: [0, 1],
            easing: "easeOutQuad",
            duration: 1000
        });

        anime({
            targets: "#members > magnon-image",
            translateY: [250, 0],
            scale: [0.5, 1],
            opacity: {
                value: [0, 1],
                easing: "linear"
            },
            duration: 500,
            elasticity: 500,
            easing: "easeOutElastic",
            delay: (n, i) => 1250 + i * 400
        });
    });
};
