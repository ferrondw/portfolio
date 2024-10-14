const root = document.documentElement;
let isRandomized = false;
const originalPrimary = getComputedStyle(root).getPropertyValue('--primary');
const originalSecondary = getComputedStyle(root).getPropertyValue('--secondary');

function randomHueColor(hue, val, sat) {
    return `hsl(${hue}, ${sat}, ${val})`;
}

loadColors();
function loadColors() {
    const storedColors = localStorage.getItem('colors');
    if (storedColors && storedColors.length > 4) {
        [newPrimary, newSecondary] = JSON.parse(storedColors);
        root.style.setProperty('--primary', newPrimary);
        root.style.setProperty('--secondary', newSecondary);
        isRandomized = true;
    }
}

function toggleRandomColors() {
    const hue = Math.floor(Math.random() * 360);
    if (isRandomized) {
        root.style.setProperty('--primary', originalPrimary);
        root.style.setProperty('--secondary', originalSecondary);
        localStorage.setItem('colors', []);
    } else {

        const newPrimary = randomHueColor(hue, '12%', '100%');
        const newSecondary = randomHueColor(hue, '35%', '50%');
        const colors = [newPrimary, newSecondary];

        root.style.setProperty('--primary', newPrimary);
        root.style.setProperty('--secondary', newSecondary);
        localStorage.setItem('colors', JSON.stringify(colors));
    }
    isRandomized = !isRandomized;
}