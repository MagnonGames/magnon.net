import anime from "animejs";

import { scrollTo } from "../../js/scroll-utils.js";

let hasScrolled, hasHinted, timeoutId;

const scrollListener = () => {
    if (!hasHinted) {
        hasScrolled = true;
    } else {
        const hint = document.querySelector("#intro-hint");
        if (hint) {
            hint.style.transition = "0.3s opacity";
            hint.style.opacity = "0";
        }
    }
    document.removeEventListener("scroll", scrollListener);
};

const hintTimeoutCallback = () => {
    if (!hasScrolled) {
        hasHinted = true;

        anime({
            targets: "#intro-hint",
            translateY: [-50, 0],
            opacity: [0, 1],
            duration: 1000,
            easing: "easeOutQuad"
        });

        anime({
            targets: "#intro-hint > magnon-icon",
            translateY: [
                { value: -20, duration: 400, easing: "easeInOutQuad" },
                { value: 0, duration: 600, delay: 400, easing: "bounceOut" }
            ],
            delay: 1500,
            loop: true
        });
    }
};

export default () => {
    hasScrolled = hasHinted = false;

    document.querySelector(".to-games").addEventListener("click", () => scrollTo("#games"));
    document.querySelector(".to-about").addEventListener("click", () => scrollTo("#about"));

    document.addEventListener("scroll", scrollListener);

    anime.easings["bounceOut"] = t => {
        if (t < (1 / 2.75)) {
            return (7.5625 * t * t);
        } else if (t < (2 / 2.75)) {
            return (7.5625 * (t -= (1.5 / 2.75)) * t + 0.75);
        } else if (t < (2.5 / 2.75)) {
            return (7.5625 * (t -= (2.25 / 2.75)) * t + 0.9375);
        } else {
            return (7.5625 * (t -= (2.625 / 2.75)) * t + 0.984375);
        }
    };

    timeoutId = setTimeout(hintTimeoutCallback, 7000);

    runAnimation();
};

export const away = () => {
    document.removeEventListener("scroll", scrollListener);
    clearTimeout(timeoutId);
};

const runAnimation = async() => {
    const textContainer = document.querySelector("#intro-text");
    const introNavigation = document.querySelector("#intro-navigation");

    const lines = [...textContainer.querySelectorAll(".line")];
    const lineTexts = lines.map(line => line.textContent);

    const spans = [];

    lines.forEach((line, i) => {
        line.innerHTML = "";
        lineTexts[i].trim().split(" ").forEach(s => {
            const span = document.createElement("span");
            span.textContent = s;
            line.appendChild(span);
            spans.push(span);
        });
    });

    await anime({
        targets: spans,
        translateY: [30, 0],
        opacity: [0, 1],
        duration: 300,
        easing: "easeOutQuad",
        delay: (n, i) => 1000 + i * 130 + (i >= 5 ? 300 : 0)
    }).finished;

    await wait(1000);

    anime({
        targets: textContainer,
        opacity: 0,
        easing: "linear",
        duration: 300
    });

    await wait(500);

    introNavigation.style.opacity = 1;
    await anime({
        targets: introNavigation,
        rotateX: ["180deg", "0deg"],
        duration: 1500
    }).finished;
};

const wait = ms => {
    return new Promise(resolve => setTimeout(resolve, ms));
};
