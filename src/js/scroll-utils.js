import anime from "animejs";

const scrollListeners = new Map();

const scrollingElement = document.scrollingElement || document.documentElement;

const getScrollTop = () => {
    return scrollingElement.scrollTop;
};

export const atElement = (el, callback) => {
    el = toElement(el);

    listenFor(el, () => {
        if (getScrollTop() + window.innerHeight / 2 >= el.getBoundingClientRect().top + getScrollTop()) {
            callback();
            stopListenFor(el);
        }
    });
};

export const scrollTo = el => {
    const isNumber = typeof el === "number";
    if (!isNumber) el = toElement(el);
    anime({
        targets: scrollingElement,
        scrollTop: isNumber ? el : centerScroll(el),
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
    top += getScrollTop();
    height = Math.min(height, window.innerHeight);
    return Math.round(top - (window.innerHeight - height) / 2);
};
