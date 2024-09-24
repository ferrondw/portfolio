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
        shader: "Shader (Graph)"
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
        const finishedProjects = projects.filter(project => project.finished);
        const unfinishedProjects = projects.filter(project => !project.finished);

        finishedProjects.forEach((project) => {
            const projectElement = createProjectElement(project, true);
            projectsContainer.appendChild(projectElement);
        });

        unfinishedProjects.forEach((project) => {
            const projectElement = createProjectElement(project, false);
            projectsContainer.appendChild(projectElement);
        });
    }


    function createProjectElement(project, isFinished) {
        const projectElement = document.createElement("div");
        projectElement.classList.add("project");

        if (!isFinished) {
            projectElement.classList.add("unfinished");
        }
        else {
            projectElement.addEventListener("click", () => {
                window.location.href = project.path;
            });
        }

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