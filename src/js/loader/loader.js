import html from "./loader.html";

class Loader {
    constructor() {
        document.body.innerHTML += html;

        this._container = document.querySelector("#loading-overlay");
        this._backdrop = document.querySelector("#loading-backdrop");
    }

    show() {
        this._container.style.pointerEvents = "all";
        this._container.style.opacity = "1";
        this._backdrop.style.opacity = "0.5";
    }

    hide() {
        setTimeout(() => {
            this._container.style.pointerEvents = "none";
            this._container.style.opacity = "0";
        }, 100);
    }
}

export default (new Loader());
