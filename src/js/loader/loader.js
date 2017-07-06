import html from "./loader.html";

class Loader {
    constructor() {
        const temp = document.createElement("div");
        temp.innerHTML = html;
        for (let child of temp.childNodes) {
            document.body.appendChild(child);
        }

        this._progressBar = document.querySelector("#loading-overlay > magnon-progress-bar");
        this._progressBar.visible = false;
    }

    show() {
        this._progressBar.animate = true;
        this._progressBar.visible = true;
    }

    hide() {
        this._progressBar.visible = false;
        setTimeout(() => {
            this._progressBar.animate = false;
            this._progressBar.progress = 0;
        }, 200);
    }

    setProgress(value) {
        this._progressBar.progress = value;
    }
}

export default (new Loader());
