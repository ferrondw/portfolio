document.addEventListener("DOMContentLoaded", function () {

    const projectsContainer = document.getElementById("projects");
    const searchBar = document.querySelector(".search-bar");
    const tagFilter = document.getElementById("tag-filter");

    let projectData;

    const tagMap = {
        unity: "Unity",
        csharp: "C#",
        github: "GitHub",
        html: "HTML",
        css: "CSS",
        js: "JavaScript",
        websockets: "WebSockets",
        python: "Python",
        networking: "Networking / Multiplayer",
        shader: "Shader (Graph)",
        jam: "Game Jam",
        unfinished: "Incomplete project page"
    };

    fetch("assets/json/projects.json")
        .then((response) => response.json())
        .then((jsonData) => {
            projectData = jsonData;
            const tags = new Set();
            projectData.forEach((project) => {
                project.tags.forEach((tag) => tags.add(tag));
            });
            tags.forEach((tag) => {
                const option = document.createElement("option");
                option.value = tag;
                option.textContent = tagMap[tag] || tag;
                tagFilter.appendChild(option);
            });

            renderProjects(projectData);

            searchBar.addEventListener("input", filterProjects);
            tagFilter.addEventListener("change", filterProjects);
        })
        .catch((error) => console.error("Error fetching data:", error));

    function renderProjects(projects) {
        projectsContainer.innerHTML = "";
        const finishedAndHighlightedProjects = projects.filter(project => project.finished && project.highlighted);
        const finishedProjects = projects.filter(project => project.finished && !project.highlighted);
        const unfinishedProjects = projects.filter(project => !project.finished);

        finishedAndHighlightedProjects.forEach((project) => {
            const projectElement = createProjectElement(project);
            projectsContainer.appendChild(projectElement);
        });

        finishedProjects.forEach((project) => {
            const projectElement = createProjectElement(project);
            projectsContainer.appendChild(projectElement);
        });

        unfinishedProjects.forEach((project) => {
            const projectElement = createProjectElement(project);
            projectsContainer.appendChild(projectElement);
        });
    }

    function createProjectElement(project) {
        const projectElement = document.createElement("div");
        projectElement.classList.add("project");

        projectElement.innerHTML = `
        <img src="${project.thumbnailPath}" alt="Project Image">
        <div class="info">
          <h2 class="title">${project.title}</h2>
          <p class="description">${project.description}</p>
          <div class="tags">
          ${project.tags.map(tag => `<img src="assets/icons/${tag}.png" alt="Tag">`).join('')}
        </div>
        </div>
      `;

        if (project.finished && project.highlighted) {
                const div = document.createElement('div');
                div.classList = 'border';
                projectElement.appendChild(div);
                projectElement.classList.add("highlighted");
        }
        else if(!project.finished) {
            projectElement.classList.add("unfinished");
        }

        projectElement.addEventListener("click", () => {
            window.location.href = project.path;
        });

        if(project.spotlightLabel.length > 0){
            const p = document.createElement('p');
            p.textContent = project.spotlightLabel;
            p.classList = 'spotlight';
            projectElement.appendChild(p);
        }

        return projectElement;
    }

    function filterProjects() {
        if (!projectData) return;
        const searchText = searchBar.value.toLowerCase();
        const selectedTag = tagFilter.value;
        const filteredProjects = projectData.filter((project) => {
            const matchesSearch = project.title.toLowerCase().includes(searchText) || project.description.toLowerCase().includes(searchText);
            const matchesTag = selectedTag === "all" || project.tags.includes(selectedTag);
            return matchesSearch && matchesTag;
        });
        renderProjects(filteredProjects);
    }
});