export default function atScroll(amount, callback) {
    if (document.body.scrollTop >= amount) {
        callback();
        return;
    }

    const scrollListener = () => {
        if (document.body.scrollTop >= amount) {
            requestAnimationFrame(callback);
            document.removeEventListener("scroll", scrollListener);
        }
    };

    document.addEventListener("scroll", scrollListener);
}
