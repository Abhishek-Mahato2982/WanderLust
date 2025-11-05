const scroll = new LocomotiveScroll({
    el: document.querySelector('#main'),
    smooth: true,
    smartphone: {
        smooth: false
    },
    tablet: {
        smooth: false
    }
});

// Prevent Locomotive from affecting body/html
document.body.style.overflow = 'visible';
document.documentElement.style.overflow = 'visible';
