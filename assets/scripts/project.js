(async () => {
    let output = document.querySelector(".markdownOutput");
    let tocList = document.querySelector(".tableOfContents ul");
    let headings = output.querySelectorAll("h1, h2, h3");

    headings.forEach(heading => {
        let id = heading.textContent.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, ""); // we <3 kebab-case
        heading.id = id;

        heading.addEventListener("click", () => {
            const url = `${window.location.origin}${window.location.pathname}#${id}`;
            navigator.clipboard.writeText(url);
        });

        let li = document.createElement("li");
        li.innerHTML = `<a href="#${id}">${heading.textContent}</a>`;
        tocList.appendChild(li);
    });

    let images = output.querySelectorAll("img");
    images.forEach(image => {
        image.addEventListener("click", () => {
            let modalContainer = document.getElementById("modalContainer");
            let modalImage = document.getElementById("modalImage");
            if (modalImage.src !== image.src) modalImage.src = image.src;
            modalContainer.style.display = "flex";
            setTimeout(() => {
                modalContainer.classList.add("open");
            }, 10);
        });
    });

    hljs.highlightAll();

    setTimeout(() => { // this needs a fix, images load too late so scroll position is off
        // force scroll to hash because loading the markdown fucks with that
        let hash = window.location.hash;
        if (!hash) return;
        window.location.href = `${hash}`;
    }, 100);
})();

document.getElementById("modalContainer").addEventListener("click", (e) => {
    if (e.target.id === "modalContainer") {
        window.closeModal();
        document.getElementById("modalImage").classList.remove('zoomed');
    }
});

document.getElementById("modalImage").onclick = function () {
    this.classList.toggle('zoomed');
};

window.closeModal = function () {
    let modalContainer = document.getElementById("modalContainer");
    modalContainer.classList.remove("open");
};

window.addEventListener("keydown", (e) => {
    if (e.key === "Escape") {
        window.closeModal();
    }
});