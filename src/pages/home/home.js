import "@magnon/components/magnon-logo/magnon-logo.html";
import "@magnon/components/magnon-star-container/magnon-star-container.html";
import "@magnon/components/magnon-button/magnon-button.html";

import { scrollTo } from "../../js/scroll-utils/scroll-utils.js";

import intro from "./intro.js";
import games from "./games.js";
import about from "./about.js";

export default () => {
    intro();
    games();
    about();
};

export const state = state => {
    if (state.scroll) {
        scrollTo(state.scroll);
    }
};
