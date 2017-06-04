const navigation = [
    ["Home", "/"],
    ["Games", "/games"],
    ["About Us", "/about"],
    ["Blog", "https://blog.magnon.net"]
];

export function buildShell() {
    const navigationElements = navigation.map(nav => {
        const a = document.createElement("a");
        a.textContent = nav[0];
        a.href = nav[1];
        a.slot = "nav";
        return a;
    });

    const shell = document.createElement("magnon-shell");
    navigationElements.forEach(nav => {
        shell.appendChild(nav);
    });

    return shell;
};
