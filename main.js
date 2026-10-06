/* ============================================
   LAITH JAROUDI PORTFOLIO - JAVASCRIPT
   ============================================ */

document.addEventListener('DOMContentLoaded', () => {
  // Initialize all components
  initMobileNav();
  initScrollReveal();
  initWorkFilters();
  initSmoothScroll();
  initNavHighlight();
});

/* ============================================
   MOBILE NAVIGATION
   ============================================ */

function initMobileNav() {
  const toggle = document.querySelector('.nav__toggle');
  const links = document.querySelector('.nav__links');

  if (!toggle || !links) return;

  toggle.addEventListener('click', () => {
    links.classList.toggle('open');
    toggle.classList.toggle('active');

    // Animate hamburger to X
    const spans = toggle.querySelectorAll('span');
    if (toggle.classList.contains('active')) {
      spans[0].style.transform = 'rotate(45deg) translate(5px, 5px)';
      spans[1].style.opacity = '0';
      spans[2].style.transform = 'rotate(-45deg) translate(7px, -6px)';
    } else {
      spans[0].style.transform = 'none';
      spans[1].style.opacity = '1';
      spans[2].style.transform = 'none';
    }
  });

  // Close menu when clicking a link
  links.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
      links.classList.remove('open');
      toggle.classList.remove('active');
      const spans = toggle.querySelectorAll('span');
      spans[0].style.transform = 'none';
      spans[1].style.opacity = '1';
      spans[2].style.transform = 'none';
    });
  });

  // Close menu when clicking outside
  document.addEventListener('click', (e) => {
    if (!toggle.contains(e.target) && !links.contains(e.target)) {
      links.classList.remove('open');
      toggle.classList.remove('active');
      const spans = toggle.querySelectorAll('span');
      spans[0].style.transform = 'none';
      spans[1].style.opacity = '1';
      spans[2].style.transform = 'none';
    }
  });
}

/* ============================================
   SCROLL REVEAL ANIMATIONS
   Fallback for when GSAP is not available
   ============================================ */

function initScrollReveal() {
  // Skip if GSAP ScrollTrigger is available (animations.js will handle it)
  if (typeof gsap !== 'undefined' && typeof ScrollTrigger !== 'undefined') {
    return;
  }

  const reveals = document.querySelectorAll('.reveal');

  if (!reveals.length) return;

  const observerOptions = {
    root: null,
    rootMargin: '0px',
    threshold: 0.1
  };

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry, index) => {
      if (entry.isIntersecting) {
        // Add staggered delay based on element position
        setTimeout(() => {
          entry.target.classList.add('revealed');
        }, index * 100);

        // Stop observing once revealed
        observer.unobserve(entry.target);
      }
    });
  }, observerOptions);

  reveals.forEach(el => observer.observe(el));
}

/* ============================================
   WORK PAGE FILTERS
   Handled by animations.js when GSAP is available
   ============================================ */

function initWorkFilters() {
  // Skip if GSAP is available (animations.js handles filters with animations)
  if (typeof gsap !== 'undefined') return;

  const filterBtns = document.querySelectorAll('.filter-btn');
  const workItems = document.querySelectorAll('.work-item');

  if (!filterBtns.length || !workItems.length) return;

  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      // Update active button
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      const filter = btn.dataset.filter;

      workItems.forEach(item => {
        const category = item.dataset.category || '';

        if (filter === 'all' || category.includes(filter)) {
          item.style.display = 'grid';
          item.classList.remove('revealed');
          setTimeout(() => item.classList.add('revealed'), 50);
        } else {
          item.style.display = 'none';
        }
      });
    });
  });
}

/* ============================================
   SMOOTH SCROLL FOR ANCHOR LINKS
   ============================================ */

function initSmoothScroll() {
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
      const targetId = this.getAttribute('href');

      if (targetId === '#') return;

      const target = document.querySelector(targetId);

      if (target) {
        e.preventDefault();
        target.scrollIntoView({
          behavior: 'smooth',
          block: 'start'
        });
      }
    });
  });
}

/* ============================================
   NAVIGATION HIGHLIGHT ON SCROLL
   ============================================ */

function initNavHighlight() {
  const nav = document.querySelector('.nav');

  if (!nav) return;

  window.addEventListener('scroll', () => {
    if (window.pageYOffset > 100) {
      nav.classList.add('nav--scrolled');
    } else {
      nav.classList.remove('nav--scrolled');
    }
  });
}

/* ============================================
   UTILITY: Debounce function
   ============================================ */

function debounce(func, wait = 20) {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
}

/* ============================================
   PAGE LOAD ANIMATION
   ============================================ */

// Add loaded class after page is ready
window.addEventListener('load', () => {
  document.body.classList.add('loaded');
});
