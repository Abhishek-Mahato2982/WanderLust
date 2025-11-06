const scroll = new LocomotiveScroll({
    el: document.querySelector('#main'),
    smooth: true,
    multiplier: 1,
    class: 'is-reveal', // Add reveal class for scroll animations
    lerp: 0.1, // Smoothness factor (0.1 is quite smooth)
    getSpeed: true,
    getDirection: true,
});

