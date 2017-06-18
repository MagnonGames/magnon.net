import anime from "animejs";

const scrollListeners = new Map();

export const atElement = (el, callback) => {
    el = toElement(el);

    listenFor(el, () => {
        if (document.body.scrollTop + window.innerHeight / 2 >= el.getBoundingClientRect().top + window.scrollY) {
            callback();
            stopListenFor(el);
        }
    });
};

export const scrollTo = el => {
    el = toElement(el);
    anime({
        targets: document.body,
        scrollTop: centerScroll(el),
        duration: 500,
        easing: "easeInOutQuad",
        update: scrollListener
    });
};

export const listenFor = (el, callback) => {
    scrollListeners.set(el, callback);
    scrollListener();
};

export const stopListenFor = el => {
    scrollListeners.delete(el);
};

let calledThisFrame = false;
const scrollListener = () => {
    if (calledThisFrame) return;
    calledThisFrame = true;
    requestAnimationFrame(() => {
        scrollListeners.forEach(s => s());
        calledThisFrame = false;
    });
};
document.addEventListener("scroll", scrollListener);

const toElement = el => {
    if (typeof el === "string") return document.querySelector(el);
    else return el;
};

const centerScroll = el => {
    let { top, height } = el.getBoundingClientRect();
    top += window.scrollY;
    return Math.round(top - (window.innerHeight - height) / 2);
};
