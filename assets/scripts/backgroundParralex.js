window.addEventListener('scroll', function() {
    let scrollPosition = window.scrollY;
    let bg = document.querySelector('.bg');
    bg.style.transform = `translateY(${-scrollPosition * 0.05}px) rotateX(30deg)`;
});