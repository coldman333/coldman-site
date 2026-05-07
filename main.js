// ===== NAVBAR SCROLL =====
const navbar = document.getElementById('navbar');
window.addEventListener('scroll', () => {
  navbar.classList.toggle('scrolled', window.scrollY > 50);
});

// ===== MOBILE MENU =====
const menuToggle = document.getElementById('menu-toggle');
const navLinks = document.getElementById('nav-links');
menuToggle.addEventListener('click', () => {
  navLinks.classList.toggle('open');
});
// Close menu when a link is clicked
navLinks.querySelectorAll('a').forEach(link => {
  link.addEventListener('click', () => navLinks.classList.remove('open'));
});

// ===== ACTIVE NAV LINK ON SCROLL =====
const sections = document.querySelectorAll('section[id]');
const navItems = navLinks.querySelectorAll('a:not(.nav-cta)');
window.addEventListener('scroll', () => {
  let current = '';
  sections.forEach(section => {
    const top = section.offsetTop - 120;
    if (scrollY >= top) current = section.id;
  });
  navItems.forEach(a => {
    a.classList.toggle('active', a.getAttribute('href') === '#' + current);
  });
});

// ===== PROJECTS SLIDER =====
const track = document.getElementById('projects-track');
if (track) {
  const prevBtn = document.getElementById('slider-prev');
  const nextBtn = document.getElementById('slider-next');
  const dotsContainer = document.getElementById('slider-dots');
  const cards = track.querySelectorAll('.project-card');
  let currentIndex = 0;
  let cardsPerView = window.innerWidth > 1024 ? 2 : 1;

  function getTotalSlides() {
    return Math.max(1, cards.length - cardsPerView + 1);
  }

  function buildDots() {
    dotsContainer.innerHTML = '';
    const total = getTotalSlides();
    for (let i = 0; i < total; i++) {
      const dot = document.createElement('button');
      dot.className = 'slider-dot' + (i === currentIndex ? ' active' : '');
      dot.setAttribute('aria-label', `Go to slide ${i + 1}`);
      dot.addEventListener('click', () => goToSlide(i));
      dotsContainer.appendChild(dot);
    }
  }

  function goToSlide(index) {
    const total = getTotalSlides();
    currentIndex = Math.max(0, Math.min(index, total - 1));
    const card = cards[0];
    const gap = window.innerWidth <= 768 ? 16 : 30;
    const cardWidth = card.offsetWidth + gap;
    track.style.transform = `translateX(-${currentIndex * cardWidth}px)`;
    // Update dots
    dotsContainer.querySelectorAll('.slider-dot').forEach((dot, i) => {
      dot.classList.toggle('active', i === currentIndex);
    });
  }

  prevBtn.addEventListener('click', () => goToSlide(currentIndex - 1));
  nextBtn.addEventListener('click', () => goToSlide(currentIndex + 1));

  // Recalculate on resize
  window.addEventListener('resize', () => {
    const newPerView = window.innerWidth > 1024 ? 2 : 1;
    if (newPerView !== cardsPerView) {
      cardsPerView = newPerView;
      currentIndex = 0;
      buildDots();
    }
    goToSlide(currentIndex);
  });

  // Touch support
  let touchStartX = 0;
  let touchEndX = 0;
  track.addEventListener('touchstart', e => { touchStartX = e.changedTouches[0].screenX; }, { passive: true });
  track.addEventListener('touchend', e => {
    touchEndX = e.changedTouches[0].screenX;
    const diff = touchStartX - touchEndX;
    if (Math.abs(diff) > 50) {
      diff > 0 ? goToSlide(currentIndex + 1) : goToSlide(currentIndex - 1);
    }
  });

  buildDots();
}

// ===== SCROLL REVEAL =====
const revealElements = document.querySelectorAll('.reveal');
const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
      revealObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.15 });
revealElements.forEach(el => revealObserver.observe(el));

// ===== ANIMATED COUNTER =====
function animateCounter(el, target) {
  let current = 0;
  const increment = target / 60;
  const timer = setInterval(() => {
    current += increment;
    if (current >= target) {
      current = target;
      clearInterval(timer);
    }
    el.textContent = Math.floor(current) + '+';
  }, 16);
}

const statElements = document.querySelectorAll('.stat h3');
const statObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      const text = entry.target.textContent;
      const num = parseInt(text);
      if (!isNaN(num)) animateCounter(entry.target, num);
      statObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.5 });
statElements.forEach(el => statObserver.observe(el));
