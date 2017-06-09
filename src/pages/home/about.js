import anime from "animejs";

import { atElement } from "../../js/scroll-utils/scroll-utils.js";

export default () => {
    atElement("#about", () => {
        anime({
            targets: "#team",
            translateY: [-100, 0],
            opacity: [0, 1],
            easing: "easeOutQuad",
            duration: 500
        });

        anime({
            targets: "#members > magnon-image",
            opacity: {
                value: [0, 1],
                easing: "linear"
            },
            duration: 500,
            delay: (n, i) => 650 + i * 200
        });
    });
};
