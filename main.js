// ===== NAVBAR SCROLL =====
const navbar = document.getElementById('navbar');
if (navbar) {
  let scrollScheduled = false;
  window.addEventListener('scroll', () => {
    if (scrollScheduled) return;
    scrollScheduled = true;
    requestAnimationFrame(() => {
      navbar.classList.toggle('scrolled', window.scrollY > 50);
      scrollScheduled = false;
    });
  }, { passive: true });
}

// ===== MOBILE MENU =====
const menuToggle = document.getElementById('menu-toggle');
const navLinks = document.getElementById('nav-links');
if (menuToggle && navLinks) {
  menuToggle.addEventListener('click', () => {
    navLinks.classList.toggle('open');
  });
  navLinks.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => navLinks.classList.remove('open'));
  });
}

// ===== ACTIVE NAV LINK ON SCROLL =====
if (navLinks) {
  const sections = document.querySelectorAll('section[id]');
  const navItems = navLinks.querySelectorAll('a:not(.nav-cta)');
  let activeScheduled = false;
  window.addEventListener('scroll', () => {
    if (activeScheduled) return;
    activeScheduled = true;
    requestAnimationFrame(() => {
      let current = '';
      sections.forEach(section => {
        const top = section.offsetTop - 120;
        if (window.scrollY >= top) current = section.id;
      });
      navItems.forEach(a => {
        a.classList.toggle('active', a.getAttribute('href') === '#' + current);
      });
      activeScheduled = false;
    });
  }, { passive: true });
}

// ===== PROJECTS SLIDER =====
const track = document.getElementById('projects-track');
if (track) {
  const prevBtn = document.getElementById('slider-prev');
  const nextBtn = document.getElementById('slider-next');
  const dotsContainer = document.getElementById('slider-dots');
  if (prevBtn && nextBtn && dotsContainer) {
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

    function updateBoundaries() {
      const total = getTotalSlides();
      prevBtn.disabled = currentIndex <= 0;
      nextBtn.disabled = currentIndex >= total - 1;
    }

    function goToSlide(index) {
      const total = getTotalSlides();
      currentIndex = Math.max(0, Math.min(index, total - 1));
      const card = cards[0];
      const gap = window.innerWidth <= 768 ? 16 : 30;
      const cardWidth = card.offsetWidth + gap;
      track.style.transform = `translateX(-${currentIndex * cardWidth}px)`;
      dotsContainer.querySelectorAll('.slider-dot').forEach((dot, i) => {
        dot.classList.toggle('active', i === currentIndex);
      });
      updateBoundaries();
    }

    prevBtn.addEventListener('click', () => goToSlide(currentIndex - 1));
    nextBtn.addEventListener('click', () => goToSlide(currentIndex + 1));

    let resizeTimer = null;
    window.addEventListener('resize', () => {
      if (resizeTimer) clearTimeout(resizeTimer);
      resizeTimer = setTimeout(() => {
        const newPerView = window.innerWidth > 1024 ? 2 : 1;
        if (newPerView !== cardsPerView) {
          cardsPerView = newPerView;
          currentIndex = 0;
          buildDots();
        }
        goToSlide(currentIndex);
      }, 150);
    });

    // Touch support — claim the gesture before links fire
    let touchStartX = 0;
    let touchStartY = 0;
    track.addEventListener('touchstart', e => {
      touchStartX = e.changedTouches[0].screenX;
      touchStartY = e.changedTouches[0].screenY;
    }, { passive: true });
    track.addEventListener('touchmove', e => {
      const dx = e.changedTouches[0].screenX - touchStartX;
      const dy = e.changedTouches[0].screenY - touchStartY;
      if (Math.abs(dx) > Math.abs(dy) && Math.abs(dx) > 10) {
        e.preventDefault();
      }
    }, { passive: false });
    track.addEventListener('touchend', e => {
      const dx = touchStartX - e.changedTouches[0].screenX;
      if (Math.abs(dx) > 50) {
        dx > 0 ? goToSlide(currentIndex + 1) : goToSlide(currentIndex - 1);
      }
    });

    buildDots();
    updateBoundaries();
  }
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