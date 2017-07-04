const navigation = [
    ["Home", "/"],
    ["Projects", "/projects"],
    ["Blog", "https://blog.magnon.net"]
];

const footerNavigation = [
    ["Home", "/"],
    ["Projects", "/projects"],
    ["Contact", "/contact"],
    ["Blog", "https://blog.magnon.net"]
];

const buildNavigationElements = (navigationList, slot) => {
    return navigationList.map(nav => {
        const a = document.createElement("a");
        a.textContent = nav[0];
        a.href = nav[1];
        a.slot = slot;
        return a;
    });
};

const buildTextElement = (text, slot) => {
    const el = document.createElement("span");
    el.innerHTML = text;
    el.slot = slot;
    return el;
};

export function buildShell() {
    const navigationElements = buildNavigationElements(navigation, "nav");
    const footerNavigationElements = buildNavigationElements(footerNavigation, "footer-navigation");

    const announcementTitleElement = buildTextElement("Open-source on GitHub", "announcement-title");
    const announcementElement = buildTextElement(`
        Did you know that most of our projects are open-source, including
        this website? Well, now you do! You can find them all
        <a href="https://github.com/theMagnon" style="color: white">right here on GitHub</a>!
    `, "announcement");
    const licenceElement = buildTextElement(`
        This work, unless otherwise noted, is licensed under a
        <a rel="license" href="http://creativecommons.org/licenses/by/4.0/"
        style="color: white">Creative Commons Attribution 4.0 International License</a>.
    `, "license");

    const shell = document.createElement("magnon-shell");
    navigationElements.forEach(nav => shell.appendChild(nav));
    footerNavigationElements.forEach(nav => shell.appendChild(nav));
    shell.appendChild(announcementTitleElement);
    shell.appendChild(announcementElement);
    shell.appendChild(licenceElement);

    return shell;
};
