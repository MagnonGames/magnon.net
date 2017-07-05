import websiteImage from "./magnon-net.png";
import dtileImage from "./dtile.png";
import pillowKnightsImage from "./pillow-knights.png";

export default () => {
    document.querySelector("#magnonnet").headerImage = websiteImage;
    document.querySelector("#dtile").headerImage = dtileImage;
    document.querySelector("#pillowknights").headerImage = pillowKnightsImage;
};
