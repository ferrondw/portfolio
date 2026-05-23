const banners = [
    "2d2d",
    "custom-volume-overrides",
    "fever-dream",
    "hedge-runner",
    "ma-bird",
    "master-cappuccinos-cafe",
    "operation-starfall",
    "the-clockwork",
    "waypoint-system",
    "wiskunde-keuzedeel-platformer"
]

const bannerElement = document.getElementById("bannerImg");
bannerElement.style.opacity = 0;

function assignRandomBanner() {
    const banner = banners[Math.floor(Math.random() * banners.length)];
    bannerElement.src = `assets/images/banners/${banner}.gif`;
}

function cycleBanner() {
    bannerElement.style.opacity = 1;

    setTimeout(() => {
        bannerElement.style.opacity = 0;
        setTimeout(() => {
            assignRandomBanner();
            cycleBanner();
        }, 1000);
    }, 8000);
}

assignRandomBanner();
cycleBanner();