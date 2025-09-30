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

const banner = banners[Math.floor(Math.random() * banners.length)];
document.getElementById("bannerImg").src = `assets/images/banners/${banner}.gif`;