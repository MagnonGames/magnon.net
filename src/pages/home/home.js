// eslint-disable-next-line
import { MagnonLogo, MagnonStarContainer, MagnonButton, MagnonImage } from "@magnon/components";

import { scrollTo } from "../../js/scroll-utils.js";
import members from "../../members.yml";

import intro, { away as introAway } from "./intro.js";
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

export const away = () => {
    introAway();
};

const createSocialBubbles = () => {
    const container = document.querySelector("#members");

    members.forEach(member => {
        const memberDiv = document.createElement("div");
        memberDiv.className = "member";
        memberDiv.innerHTML += `
            <img src="${member.image}?s=500" alt="${member.name}">
            <div>
                <h3>${member.name} - ${member.alias}</h3>
                <div class="user-social">
                    ${Object.keys(member.socialMedia || {}).map(socialMedia => {
                        const name = `magnon-${socialMedia}-button`;
                        return `
                            <${name}
                                user="${member.socialMedia[socialMedia]}">
                            </${name}>
                        `;
                    }).join("")}
                </div>
            </div>
        `;
        container.appendChild(memberDiv);
    });
};
