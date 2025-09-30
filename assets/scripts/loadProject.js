(async () => {
    let params = new URLSearchParams(window.location.search);
    let id = params.get("id") || "fetch will fail";

    let projectResponse = await fetch(`/assets/projects/${id}.md`);
    if (!projectResponse.ok) {
        document.querySelector(".projectHeader .description").innerHTML = "<p>Project not found.</p>";
        document.querySelector(".tableOfContents").style.display = "none";
        return;
    }
    let rawText = await projectResponse.text();

    let infoResponse = await fetch(`/projects/list.json`);
    let infoData = await infoResponse.json();
    let info = (infoData.projects || []).find(p => p.id === id) || {};

    let title = info.title;
    let description = info.description;
    let content = rawText;

    if (title) document.querySelector(".projectHeader .nameTitle").textContent = title;
    if (description) document.querySelector(".projectHeader .description").textContent = description;

    document.title = `fdw.fyi - ${title}`;

    let output = document.querySelector(".markdownOutput");
    output.innerHTML = marked.parse(content);

    let tocList = document.querySelector(".tableOfContents ul");
    tocList.innerHTML = "";

    let headings = output.querySelectorAll("h1, h2, h3");
    headings.forEach(heading => {
        heading.addEventListener("click", () => {
            location.href = `#${heading.id}`;
        });

        let id = heading.textContent.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, ""); // we <3 kebab-case
        heading.id = id;

        let li = document.createElement("li");
        li.innerHTML = `<a href="#${id}">${heading.textContent}</a>`;
        tocList.appendChild(li);
    });

    hljs.highlightAll();

    setTimeout(() => { // this needs a fix, images load too late so scroll position is off
        // force scroll to hash because loading the markdown fucks with that
        let hash = window.location.hash;
        if (!hash) return;
        window.location.href = `${hash}`;
    }, 100);
})();

/*
- projects 3 wide?
- projects meer fullscreen laten zien?? // strak (studiozoetekauw)
- banner in project.html?
- contra-color for underline/bold text/h1
- images clicken en animaten voor list view (artstation maar dan beter)
*/