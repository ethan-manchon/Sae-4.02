// script.js

document.addEventListener('DOMContentLoaded', () => {
    const container = document.querySelector('.scroll');

    container.addEventListener('wheel', (event) => {
        event.preventDefault(); // Empêche le défilement vertical par défaut
        container.scrollBy({
            left: event.deltaY * (window.innerWidth / 100),
            behavior: 'smooth'
        });
    });

    // GSAP Animations
    gsap.from(".titleFont", { 
        opacity: 0, 
        scale: 0, 
        duration: 0.5, 
        ease: "power2.out" 
    });

    gsap.to(".animation", {
        y: "+=30",
        duration: 2,
        repeat: -1,
        yoyo: true,
        ease: "sine.inOut"
    });
    gsap.to(".jump", {
        y: "+=120",
        duration: 1.5,
        repeat: -1,
        yoyo: true,
        ease: "bounce.out",
    });

    gsap.to(".section", {
        backgroundPosition: "50% 60%",
        ease: "none",
        scrollTrigger: {
            trigger: ".section",
            scrub: true
        }
    });

    gsap.to(".idle", {
        scale: 1.05,
        rotation: "+=2",
        y: "+=10",
        duration: 3,
        repeat: -1,
        yoyo: true,
        ease: "ease.out",
    });

    gsap.to(".upgrade", {
        scale: 1.05,
        duration: 3,
        repeat: -1,
        yoyo: true,
        ease: "ease.out",
    });

    gsap.to(".frame", {
        rotation: "+=5",
        duration: 1.5,
        repeat: -1,
        yoyo: true,
        ease: "ease.out",
    });
});
