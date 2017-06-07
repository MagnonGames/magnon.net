import anime from "animejs";

let hasScrolled = false, hasHinted = false;

const scrollListener = () => {
    if (!hasHinted) {
        hasScrolled = true;
    } else {
        document.querySelector("#intro-hint").style.transition = "0.3s opacity";
        document.querySelector("#intro-hint").style.opacity = "0";
    }
    document.removeEventListener("scroll", scrollListener);
};
document.addEventListener("scroll", scrollListener);

const textContainer = document.querySelector("#intro-text");
const text = textContainer.textContent;

const spans = [];

textContainer.innerHTML = "";
text.trim().split(" ").forEach(s => {
    const span = document.createElement("span");
    span.textContent = s;
    textContainer.appendChild(span);
    spans.push(span);
});

anime({
    targets: spans,
    translateY: [30, 0],
    opacity: [0, 1],
    duration: 300,
    easing: "easeOutQuad",
    delay: (n, i) => 1000 + i * 130 + (i >= 5 ? 300 : 0)
});

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

setTimeout(() => {
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
}, 7000);
