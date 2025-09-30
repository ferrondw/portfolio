const renderer = {
    link(href, title, text) {
        const link = marked.Renderer.prototype.link.call(this, href, title, text);
        return link.replace("<a", "<a target='_blank' rel='noreferrer' ");
    }
};

marked.use({
    renderer
});