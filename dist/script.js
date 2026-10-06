const header = document.querySelector('.site-header');
const menuButton = document.querySelector('.menu-toggle');
const nav = document.querySelector('.nav');
const navLinks = [...nav.querySelectorAll('a')];
const sections = [...document.querySelectorAll('main > section[id]')];
const mobileMenu = window.matchMedia('(max-width: 680px)');

document.getElementById('year').textContent = new Date().getFullYear();

function setMenu(open) {
  nav.classList.toggle('open', open);
  menuButton.classList.toggle('open', open);
  document.body.classList.toggle('menu-open', open);
  menuButton.setAttribute('aria-expanded', String(open));
  menuButton.setAttribute('aria-label', open ? 'Fermer le menu' : 'Ouvrir le menu');
}

menuButton.addEventListener('click', () => setMenu(menuButton.getAttribute('aria-expanded') !== 'true'));
navLinks.forEach(link => link.addEventListener('click', () => setMenu(false)));
document.querySelector('.brand').addEventListener('click', () => setMenu(false));
mobileMenu.addEventListener('change', () => setMenu(false));

document.addEventListener('keydown', event => {
  if (!nav.classList.contains('open')) return;
  if (event.key === 'Escape') {
    setMenu(false);
    menuButton.focus();
  } else if (event.key === 'Tab') {
    const lastLink = navLinks[navLinks.length - 1];
    if (event.shiftKey && document.activeElement === menuButton) {
      event.preventDefault();
      lastLink.focus();
    } else if (!event.shiftKey && document.activeElement === lastLink) {
      event.preventDefault();
      menuButton.focus();
    }
  }
});

document.addEventListener('click', event => {
  if (nav.classList.contains('open') && !header.contains(event.target)) setMenu(false);
});

function updateNavigation() {
  header.classList.toggle('scrolled', window.scrollY > 16);
  const activeSection = sections.reduce((current, section) => section.getBoundingClientRect().top <= 170 ? section.id : current, 'accueil');
  navLinks.forEach(link => {
    const active = link.getAttribute('href') === `#${activeSection}`;
    link.classList.toggle('active', active);
    if (active) link.setAttribute('aria-current', 'location');
    else link.removeAttribute('aria-current');
  });
}

let scrollScheduled = false;
window.addEventListener('scroll', () => {
  if (scrollScheduled) return;
  scrollScheduled = true;
  window.requestAnimationFrame(() => {
    updateNavigation();
    scrollScheduled = false;
  });
}, { passive: true });
updateNavigation();

if ('IntersectionObserver' in window) {
  const revealObserver = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      entry.target.classList.add('visible');
      revealObserver.unobserve(entry.target);
    });
  }, { threshold: .08 });
  document.querySelectorAll('.reveal').forEach(element => revealObserver.observe(element));
}
