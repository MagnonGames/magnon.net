import anime from "animejs";

import scrollAt from "./at-scroll.js";

scrollAt(1500, () => {
    anime({
        targets: "#team",
        translateY: [-100, 0],
        opacity: [0, 1],
        easing: "easeOutQuad",
        duration: 1000
    });

    const faceAnimation = anime({
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

    faceAnimation.complete = () => {
        [...document.querySelectorAll("#members > magnon-image")].forEach((face, i) => {
            setTimeout(() => {
                anime({
                    targets: face,
                    translateY: 10,
                    duration: 2000,
                    easing: "easeInOutQuad",
                    loop: true,
                    direction: "alternate"
                });
            }, i * 2000 / 3);
        });
    };
});
