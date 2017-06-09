import Navigator from "../navigator/navigator.js";

const navigation = [
    ["Home", "/"],
    ["Games", { href: "/", value: { scroll: "#games" }}],
    ["About Us", { href: "/", value: { scroll: "#about" }}],
    ["Blog", "https://blog.magnon.net"]
];

export function buildShell() {
    const navigationElements = navigation.map(nav => {
        const a = document.createElement("a");
        a.textContent = nav[0];

        const link = nav[1];
        if (typeof link === "string") {
            a.href = link;
        } else {
            a.onclick = () => {
                Navigator.goToPage(link.href, false, link.value);
            };
        }
        a.slot = "nav";
        return a;
    });

    const shell = document.createElement("magnon-shell");
    navigationElements.forEach(nav => {
        shell.appendChild(nav);
    });

    return shell;
};
