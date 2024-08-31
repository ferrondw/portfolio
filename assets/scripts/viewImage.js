document.addEventListener("DOMContentLoaded", function () {
    const modal = document.getElementById('imageModal');
    const modalImg = document.getElementById('modalImage');
    const images = document.querySelectorAll('#project .interactable');
    const closeBtn = document.querySelector('.close');

    images.forEach(image => {
        image.addEventListener('click', function () {
            modal.style.display = 'block';
            modalImg.src = this.src;
            modalImg.classList.remove('zoomed');
        });
    });

    closeBtn.addEventListener('click', function () {
        modal.style.display = 'none';
    });

    modal.addEventListener('click', function (e) {
        modal.style.display = 'none';
    });

});