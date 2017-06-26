// eslint-disable-next-line
import { MagnonLogo, MagnonStarContainer, MagnonButton } from "@magnon/components";

import { scrollTo } from "../../js/scroll-utils/scroll-utils.js";
import members from "../../members.yml";

import intro from "./intro.js";
import games from "./games.js";
import about from "./about.js";

export default () => {
    createSocialBubbles();

    intro();
    games();
    about();
};

export const state = state => {
    if (state.scroll) {
        scrollTo(state.scroll);
    }
};

const createSocialBubbles = () => {
    const container = document.querySelector("#members");

    container.innerHTML += members.map(member => {
        member.socialMedia = member.socialMedia || {};
        return `<magnon-image disable-image-url show-alt
            alt="${member.name} - ${member.alias}" src="${member.image}?s=500">
            <h3 slot="description-title">${member.descriptionTitle}</h3>
            ${member.description}
            <div class="user-social">
                ${Object.keys(member.socialMedia).map(socialMedia => {
                    const name = `magnon-${socialMedia}-button`;
                    return `<${name} user="${member.socialMedia[socialMedia]}"></${name}>`;
                }).join(" ")}
            </div>
        </magnon-image>`;
    }).join(" ");
};
