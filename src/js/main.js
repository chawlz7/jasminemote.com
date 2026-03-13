// Mobile nav toggle
const hamburger = document.querySelector('.nav-hamburger');
const navLinks = document.querySelector('.nav-links');

if (hamburger && navLinks) {
  hamburger.addEventListener('click', () => {
    const isOpen = navLinks.classList.toggle('nav-links--open');
    hamburger.setAttribute('aria-expanded', isOpen);
    hamburger.textContent = isOpen ? '✕' : '☰';
  });
}
