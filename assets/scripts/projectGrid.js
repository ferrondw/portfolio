(async () => {
    let data;
    try {
        let response = await fetch(`${inGitHubPages()}/projects/list.json`, { cache: 'no-store' });
        data = await response.json();
    }
    catch (e) {
        console.error("Failed to load project list:", e);
        return;
    }

    const html = (data.projects || []).filter(project => !project.hidden).map(project => {
        return `
            <div class="projectCard ${project.hidden ? 'hidden' : ''}" onclick="window.location.href='project.html?id=${project.id || ''}'">
                <img src="${`assets/images/covers/${project.id || ''}.png`}" alt="Project cover" onerror="this.src='assets/images/covers/default.png'">
                <div class="background"></div>
                <div class="info">
                <h2>${project.title || ''}</h2>
                <p>${project.description || ''}</p>
                <div class="tags">${(project.tags || []).map(t => `<span class="tag">${t}</span>`).join('')}</div>
                </div>
            </div>`;
    }).join('');

    document.querySelector('.projects').innerHTML = html;
})();

function inGitHubPages() {
    return window.location.href.includes("github.io") ? '/portfolio' : '';
}