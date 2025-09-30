(async () => {
    let data;
    try {
        const r = await fetch('/assets/projects/list.json', { cache: 'no-store' }); // fuckass json started caching
        data = await r.json();
    }
    catch (e) {
        console.error("Failed to load project list:", e);
        return;
    }

    const html = (data.projects || []).map(project => {
        return `
      <div class="projectCard ${project.hidden ? 'hidden' : ''}" onclick="window.location.href='/project.html?id=${project.id || ''}'">
        <img src="${`assets/images/covers/${project.id || ''}.png`}" alt="Project cover" onerror="this.src='assets/images/covers/default.png'">
        <div class="background"></div>
        <div class="info">
          <h2>${project.title || ''}</h2>
          <p>${project.description || ''}</p>
          <div class="tags">${(project.tags || []).map(t => `<span class="tag">${t}</span>`).join('')}</div>
        </div>
      </div>
    `;
    }).join('');

    document.querySelector('.projects').innerHTML = html;
})();