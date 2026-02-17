/* ============================================
   ANIMATIONS - Lenis + GSAP
   Smooth scrolling and entrance animations
   ============================================ */

(function() {
  'use strict';

  // Check for reduced motion preference
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ============================================
     LENIS SMOOTH SCROLL
     ============================================ */

  let lenis = null;

  function initLenis() {
    if (prefersReducedMotion) return;

    lenis = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      orientation: 'vertical',
      gestureOrientation: 'vertical',
      smoothWheel: true,
      wheelMultiplier: 1,
      touchMultiplier: 2,
      infinite: false,
    });

    // Connect Lenis to GSAP ScrollTrigger
    lenis.on('scroll', ScrollTrigger.update);

    // Use GSAP ticker for Lenis
    gsap.ticker.add((time) => {
      lenis.raf(time * 1000);
    });

    gsap.ticker.lagSmoothing(0);
  }

  /* ============================================
     GSAP SETUP
     ============================================ */

  function initGSAP() {
    gsap.registerPlugin(ScrollTrigger);

    // Set default ease
    gsap.defaults({
      ease: 'power3.out',
      duration: 0.6
    });
  }

  /* ============================================
     HERO ENTRANCE ANIMATION (Home Page)
     ============================================ */

  function initHeroAnimation() {
    const heroElements = document.querySelectorAll('.hero-anim');

    if (!heroElements.length) return;

    // If reduced motion, just show everything
    if (prefersReducedMotion) {
      heroElements.forEach(el => {
        el.style.opacity = '1';
        el.style.transform = 'none';
      });
      return;
    }

    // Set initial states
    gsap.set('.hero__avatar.hero-anim', {
      scale: 0,
      opacity: 0
    });

    gsap.set('.hero__label.hero-anim', {
      x: -30,
      opacity: 0
    });

    gsap.set('.hero__title.hero-anim', {
      y: 40,
      opacity: 0
    });

    gsap.set('.hero__subtitle.hero-anim', {
      y: 30,
      opacity: 0
    });

    gsap.set('.hero__cta.hero-anim', {
      y: 30,
      opacity: 0
    });

    gsap.set('.hero__glass.hero-anim', {
      x: 50,
      opacity: 0
    });

    // Create timeline
    const tl = gsap.timeline({
      delay: 0.2
    });

    // Avatar pops in
    tl.to('.hero__avatar.hero-anim', {
      scale: 1,
      opacity: 1,
      duration: 0.6,
      ease: 'back.out(1.7)'
    }, 0);

    // Label slides in from left
    tl.to('.hero__label.hero-anim', {
      x: 0,
      opacity: 1,
      duration: 0.5
    }, 0.3);

    // Title fades up
    tl.to('.hero__title.hero-anim', {
      y: 0,
      opacity: 1,
      duration: 0.7
    }, 0.5);

    // Subtitle fades up
    tl.to('.hero__subtitle.hero-anim', {
      y: 0,
      opacity: 1,
      duration: 0.6
    }, 0.7);

    // CTA buttons fade up
    tl.to('.hero__cta.hero-anim', {
      y: 0,
      opacity: 1,
      duration: 0.6
    }, 0.9);

    // Philosophy card slides in from right
    tl.to('.hero__glass.hero-anim', {
      x: 0,
      opacity: 1,
      duration: 0.8
    }, 0.6);
  }

  /* ============================================
     PROJECT CARDS - Staggered Scroll Entrance
     ============================================ */

  function initProjectCards() {
    const cards = gsap.utils.toArray('.project-card');

    if (!cards.length) return;

    if (prefersReducedMotion) {
      cards.forEach(card => {
        card.style.opacity = '1';
        card.style.transform = 'none';
      });
      return;
    }

    // Set initial state
    gsap.set(cards, {
      y: 60,
      opacity: 0
    });

    // Check if cards are already in view
    const firstCard = cards[0];
    if (firstCard) {
      const rect = firstCard.getBoundingClientRect();
      if (rect.top < window.innerHeight * 0.9) {
        // Cards already in view, animate immediately with stagger
        gsap.to(cards, {
          y: 0,
          opacity: 1,
          duration: 0.7,
          ease: 'power3.out',
          stagger: 0.15,
          delay: 0.3
        });
        return;
      }
    }

    // Animate cards with stagger on scroll
    ScrollTrigger.batch(cards, {
      start: 'top 90%',
      onEnter: (batch) => {
        gsap.to(batch, {
          y: 0,
          opacity: 1,
          duration: 0.7,
          ease: 'power3.out',
          stagger: 0.15
        });
      },
      once: true
    });
  }

  /* ============================================
     WORK PAGE - Header & Filters Animation
     ============================================ */

  function initWorkPageHeader() {
    const pageHeader = document.querySelector('.page-header');
    const filters = document.querySelectorAll('.filter-btn');

    if (!pageHeader) return;

    // If reduced motion, ensure visibility
    if (prefersReducedMotion) {
      pageHeader.style.opacity = '1';
      filters.forEach(f => f.style.opacity = '1');
      return;
    }

    const title = pageHeader.querySelector('.page-header__title');
    const subtitle = pageHeader.querySelector('.page-header__subtitle');

    if (title) {
      gsap.fromTo(title,
        { y: 30, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.6, delay: 0.2 }
      );
    }

    if (subtitle) {
      gsap.fromTo(subtitle,
        { y: 20, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.6, delay: 0.4 }
      );
    }

    // Filter buttons stagger
    if (filters.length) {
      gsap.fromTo(filters,
        { y: 15, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.5, stagger: 0.1, delay: 0.5 }
      );
    }
  }

  /* ============================================
     WORK ITEMS - Scroll Entrance Animation
     ============================================ */

  function initWorkItems() {
    const workItems = gsap.utils.toArray('.work-item');

    if (!workItems.length) return;

    // If reduced motion, ensure visibility
    if (prefersReducedMotion) {
      workItems.forEach(item => {
        item.style.opacity = '1';
        const children = item.querySelectorAll('.work-item__image, .work-item__tag, .work-item__title, .work-item__desc, .work-item__details, .work-item__btn, .work-item__year');
        children.forEach(child => {
          child.style.opacity = '1';
          child.style.transform = 'none';
        });
      });
      return;
    }

    workItems.forEach((item, index) => {
      const image = item.querySelector('.work-item__image');
      const tags = item.querySelectorAll('.work-item__tag');
      const year = item.querySelector('.work-item__year');
      const title = item.querySelector('.work-item__title');
      const desc = item.querySelector('.work-item__desc');
      const details = item.querySelector('.work-item__details');
      const btn = item.querySelector('.work-item__btn');

      // Determine slide direction based on layout (even items are RTL)
      const isEven = index % 2 === 1;
      const imageX = isEven ? 40 : -40;

      // Set initial states immediately
      if (image) gsap.set(image, { x: imageX, opacity: 0 });
      if (tags.length) gsap.set(tags, { y: 15, opacity: 0 });
      if (year) gsap.set(year, { y: 10, opacity: 0 });
      if (title) gsap.set(title, { y: 30, opacity: 0 });
      if (desc) gsap.set(desc, { y: 20, opacity: 0 });
      if (details) gsap.set(details, { y: 20, opacity: 0 });
      if (btn) gsap.set(btn, { y: 15, opacity: 0 });

      // Create timeline for this item
      const tl = gsap.timeline({
        paused: true
      });

      // Image slides in from side
      if (image) {
        tl.to(image, { x: 0, opacity: 1, duration: 0.8, ease: 'power3.out' }, 0);
      }

      // Tags stagger in
      if (tags.length) {
        tl.to(tags, { y: 0, opacity: 1, duration: 0.4, stagger: 0.05 }, 0.1);
      }

      // Year fades in
      if (year) {
        tl.to(year, { y: 0, opacity: 1, duration: 0.4 }, 0.15);
      }

      // Title fades up
      if (title) {
        tl.to(title, { y: 0, opacity: 1, duration: 0.6 }, 0.2);
      }

      // Description fades up
      if (desc) {
        tl.to(desc, { y: 0, opacity: 1, duration: 0.6 }, 0.3);
      }

      // Details box fades up
      if (details) {
        tl.to(details, { y: 0, opacity: 1, duration: 0.6 }, 0.4);
      }

      // Button fades up
      if (btn) {
        tl.to(btn, { y: 0, opacity: 1, duration: 0.5 }, 0.5);
      }

      // Create ScrollTrigger to play the timeline
      ScrollTrigger.create({
        trigger: item,
        start: 'top 90%',
        once: true,
        onEnter: () => {
          tl.play();
        }
      });

      // Check if already in view (for first items visible on load)
      const rect = item.getBoundingClientRect();
      if (rect.top < window.innerHeight * 0.9) {
        tl.play();
      }
    });
  }

  /* ============================================
     FOOTER WATERMARK - Parallax Effect
     ============================================ */

  function initFooterParallax() {
    const watermark = document.querySelector('.footer__display-name');

    if (!watermark || prefersReducedMotion) return;

    gsap.to(watermark, {
      y: -50,
      ease: 'none',
      scrollTrigger: {
        trigger: '.footer',
        start: 'top bottom',
        end: 'bottom top',
        scrub: 1
      }
    });
  }

  /* ============================================
     SCROLL-TRIGGERED REVEAL ANIMATIONS
     ============================================ */

  function initScrollReveal() {
    const reveals = document.querySelectorAll('.reveal');

    if (!reveals.length) return;

    // If reduced motion, show everything immediately
    if (prefersReducedMotion) {
      reveals.forEach(el => {
        el.classList.add('revealed');
        el.style.opacity = '1';
        el.style.transform = 'none';
      });
      return;
    }

    // Skip elements that will be animated by specific functions
    const filteredReveals = Array.from(reveals).filter(el => {
      return !el.classList.contains('project-card') &&
             !el.classList.contains('work-item') &&
             !el.classList.contains('page-header') &&
             !el.classList.contains('work-filters');
    });

    filteredReveals.forEach((el) => {
      gsap.fromTo(el,
        {
          y: 40,
          opacity: 0
        },
        {
          y: 0,
          opacity: 1,
          duration: 0.8,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: el,
            start: 'top 85%',
            toggleActions: 'play none none none',
            once: true
          }
        }
      );
    });
  }

  /* ============================================
     FILTER FUNCTIONALITY WITH ANIMATION
     ============================================ */

  function initFilterAnimation() {
    const filterBtns = document.querySelectorAll('.filter-btn');
    const workItems = document.querySelectorAll('.work-item');

    if (!filterBtns.length || !workItems.length) return;

    filterBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        // Update active state
        filterBtns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');

        const filter = btn.dataset.filter;

        // Animate items
        workItems.forEach(item => {
          const category = item.dataset.category || '';

          if (filter === 'all' || category.includes(filter)) {
            // Show item
            if (prefersReducedMotion) {
              item.style.display = 'grid';
              item.style.opacity = '1';
            } else {
              item.style.display = 'grid';
              gsap.fromTo(item,
                { opacity: 0, scale: 0.95 },
                { opacity: 1, scale: 1, duration: 0.4, ease: 'power2.out' }
              );
            }
          } else {
            // Hide item
            if (prefersReducedMotion) {
              item.style.display = 'none';
            } else {
              gsap.to(item, {
                opacity: 0,
                scale: 0.95,
                duration: 0.3,
                ease: 'power2.in',
                onComplete: () => {
                  item.style.display = 'none';
                }
              });
            }
          }
        });
      });
    });
  }

  /* ============================================
     ABOUT PAGE - Hero Entrance Animation
     ============================================ */

  function initAboutHero() {
    const aboutHero = document.querySelector('.about-hero');
    if (!aboutHero) return;

    const label = aboutHero.querySelector('.section__label.about-anim');
    const name = aboutHero.querySelector('h1.about-anim');
    const bioParas = aboutHero.querySelectorAll('.about-bio-p.about-anim');
    const actions = aboutHero.querySelector('.about-hero__actions.about-anim');
    const photo = aboutHero.querySelector('.about-hero__image.about-anim');
    const detailItems = aboutHero.querySelectorAll('.about-hero__detail-item.about-anim');

    // If reduced motion, show everything
    if (prefersReducedMotion) {
      [label, name, ...bioParas, actions, photo, ...detailItems].forEach(el => {
        if (el) {
          el.style.opacity = '1';
          el.style.transform = 'none';
        }
      });
      return;
    }

    // Set initial states
    if (label) gsap.set(label, { y: 20, opacity: 0 });
    if (name) gsap.set(name, { y: 40, opacity: 0 });
    if (bioParas.length) gsap.set(bioParas, { y: 30, opacity: 0 });
    if (actions) gsap.set(actions, { y: 30, opacity: 0 });
    if (photo) gsap.set(photo, { scale: 0.9, opacity: 0 });
    if (detailItems.length) gsap.set(detailItems, { x: 30, opacity: 0 });

    // Create timeline
    const tl = gsap.timeline({ delay: 0.2 });

    // Label fades in
    if (label) {
      tl.to(label, { y: 0, opacity: 1, duration: 0.5 }, 0);
    }

    // Name fades up
    if (name) {
      tl.to(name, { y: 0, opacity: 1, duration: 0.7, ease: 'power3.out' }, 0.2);
    }

    // Photo scales in
    if (photo) {
      tl.to(photo, { scale: 1, opacity: 1, duration: 0.8, ease: 'power2.out' }, 0.3);
    }

    // Detail items stagger from right
    if (detailItems.length) {
      tl.to(detailItems, { x: 0, opacity: 1, duration: 0.5, stagger: 0.1 }, 0.4);
    }

    // Bio paragraphs stagger
    if (bioParas.length) {
      tl.to(bioParas, { y: 0, opacity: 1, duration: 0.6, stagger: 0.15 }, 0.5);
    }

    // Actions fade up
    if (actions) {
      tl.to(actions, { y: 0, opacity: 1, duration: 0.6 }, 0.8);
    }
  }

  /* ============================================
     ABOUT PAGE - Stats Counter Animation
     ============================================ */

  function initStatsCounter() {
    const stats = document.querySelectorAll('.about-stat.stat-anim');
    if (!stats.length) return;

    // If reduced motion, show final values
    if (prefersReducedMotion) {
      stats.forEach(stat => {
        const numEl = stat.querySelector('.about-stat__number');
        if (numEl) {
          const value = numEl.dataset.value || '0';
          const suffix = numEl.dataset.suffix || '';
          numEl.textContent = value + suffix;
        }
        stat.style.opacity = '1';
      });
      return;
    }

    // Set initial states
    gsap.set(stats, { y: 40, opacity: 0 });

    // Create ScrollTrigger for the stats section
    ScrollTrigger.create({
      trigger: '.about-stats',
      start: 'top 85%',
      once: true,
      onEnter: () => {
        // Fade in stats with stagger
        gsap.to(stats, {
          y: 0,
          opacity: 1,
          duration: 0.6,
          stagger: 0.15,
          ease: 'power3.out',
          onComplete: () => {
            // Animate the numbers after fade in
            stats.forEach((stat, index) => {
              const numEl = stat.querySelector('.about-stat__number');
              if (numEl) {
                const targetValue = parseInt(numEl.dataset.value) || 0;
                const suffix = numEl.dataset.suffix || '';

                // Animate number counting up
                gsap.to({ val: 0 }, {
                  val: targetValue,
                  duration: 1.5,
                  delay: index * 0.1,
                  ease: 'power2.out',
                  onUpdate: function() {
                    numEl.textContent = Math.round(this.targets()[0].val) + suffix;
                  }
                });
              }
            });
          }
        });
      }
    });

    // Check if already in view
    const statsSection = document.querySelector('.about-stats');
    if (statsSection) {
      const rect = statsSection.getBoundingClientRect();
      if (rect.top < window.innerHeight * 0.85) {
        gsap.to(stats, {
          y: 0,
          opacity: 1,
          duration: 0.6,
          stagger: 0.15,
          ease: 'power3.out',
          onComplete: () => {
            stats.forEach((stat, index) => {
              const numEl = stat.querySelector('.about-stat__number');
              if (numEl) {
                const targetValue = parseInt(numEl.dataset.value) || 0;
                const suffix = numEl.dataset.suffix || '';
                gsap.to({ val: 0 }, {
                  val: targetValue,
                  duration: 1.5,
                  delay: index * 0.1,
                  ease: 'power2.out',
                  onUpdate: function() {
                    numEl.textContent = Math.round(this.targets()[0].val) + suffix;
                  }
                });
              }
            });
          }
        });
      }
    }
  }

  /* ============================================
     ABOUT PAGE - Education Section Animation
     ============================================ */

  function initEducationAnimation() {
    const educationSection = document.querySelector('.education-section');
    if (!educationSection) return;

    const title = educationSection.querySelector('.section-title-anim');
    const items = educationSection.querySelectorAll('.education-anim');

    if (prefersReducedMotion) {
      if (title) title.style.opacity = '1';
      items.forEach(item => {
        item.style.opacity = '1';
        item.style.transform = 'none';
      });
      return;
    }

    // Set initial states
    if (title) gsap.set(title, { y: 30, opacity: 0 });
    items.forEach(item => {
      const logo = item.querySelector('.education-item__logo');
      const content = item.querySelector('.education-item__content');
      if (logo) gsap.set(logo, { scale: 0, rotation: -180, opacity: 0 });
      if (content) gsap.set(content, { x: -30, opacity: 0 });
    });

    // Create ScrollTrigger
    ScrollTrigger.create({
      trigger: educationSection,
      start: 'top 80%',
      once: true,
      onEnter: () => {
        const tl = gsap.timeline();

        // Title fades up
        if (title) {
          tl.to(title, { y: 0, opacity: 1, duration: 0.6 }, 0);
        }

        // Animate each education item
        items.forEach((item, index) => {
          const logo = item.querySelector('.education-item__logo');
          const content = item.querySelector('.education-item__content');

          // Logo spins in
          if (logo) {
            tl.to(logo, {
              scale: 1,
              rotation: 0,
              opacity: 1,
              duration: 0.6,
              ease: 'back.out(1.7)'
            }, 0.3 + index * 0.2);
          }

          // Content slides in
          if (content) {
            tl.to(content, {
              x: 0,
              opacity: 1,
              duration: 0.6
            }, 0.4 + index * 0.2);
          }
        });
      }
    });
  }

  /* ============================================
     ABOUT PAGE - Skills Section Animation
     ============================================ */

  function initSkillsAnimation() {
    const skillsSection = document.querySelector('.skills-section');
    if (!skillsSection) return;

    const title = skillsSection.querySelector('.section-title-anim');
    const categories = skillsSection.querySelectorAll('.skill-anim');
    const description = skillsSection.querySelector('.skill-desc-anim');

    if (prefersReducedMotion) {
      if (title) title.style.opacity = '1';
      categories.forEach(cat => {
        cat.style.opacity = '1';
        cat.style.transform = 'none';
      });
      if (description) description.style.opacity = '1';
      return;
    }

    // Set initial states
    if (title) gsap.set(title, { y: 30, opacity: 0 });
    gsap.set(categories, { y: 50, opacity: 0 });
    if (description) gsap.set(description, { x: 40, opacity: 0 });

    // Create ScrollTrigger
    ScrollTrigger.create({
      trigger: skillsSection,
      start: 'top 80%',
      once: true,
      onEnter: () => {
        const tl = gsap.timeline();

        // Title fades up
        if (title) {
          tl.to(title, { y: 0, opacity: 1, duration: 0.6 }, 0);
        }

        // Skill categories stagger in
        tl.to(categories, {
          y: 0,
          opacity: 1,
          duration: 0.7,
          stagger: 0.12,
          ease: 'power3.out'
        }, 0.3);

        // Description slides in from right
        if (description) {
          tl.to(description, {
            x: 0,
            opacity: 1,
            duration: 0.7
          }, 0.5);
        }

        // Animate individual skill items within each category
        categories.forEach((category, catIndex) => {
          const items = category.querySelectorAll('li');
          gsap.set(items, { x: -20, opacity: 0 });
          gsap.to(items, {
            x: 0,
            opacity: 1,
            duration: 0.4,
            stagger: 0.05,
            delay: 0.6 + catIndex * 0.1,
            ease: 'power2.out'
          });
        });
      }
    });
  }

  /* ============================================
     ABOUT PAGE - Timeline Animation
     ============================================ */

  function initTimelineAnimation() {
    const timelineSection = document.querySelector('.timeline-section');
    if (!timelineSection) return;

    const title = timelineSection.querySelector('.section-title-anim');
    const timeline = timelineSection.querySelector('.timeline-anim');
    const markers = timelineSection.querySelectorAll('.timeline-marker-anim');
    const contents = timelineSection.querySelectorAll('.timeline-content-anim');

    if (prefersReducedMotion) {
      if (title) title.style.opacity = '1';
      markers.forEach(m => {
        m.style.opacity = '1';
        m.style.transform = 'none';
      });
      contents.forEach(c => {
        c.style.opacity = '1';
        c.style.transform = 'none';
      });
      return;
    }

    // Set initial states
    if (title) gsap.set(title, { y: 30, opacity: 0 });
    gsap.set(markers, { scale: 0, opacity: 0 });
    gsap.set(contents, { x: -40, opacity: 0 });

    // For the timeline line, we'll use CSS clip-path
    if (timeline) {
      timeline.style.setProperty('--line-height', '0%');
    }

    // Create ScrollTrigger
    ScrollTrigger.create({
      trigger: timelineSection,
      start: 'top 80%',
      once: true,
      onEnter: () => {
        const tl = gsap.timeline();

        // Title fades up
        if (title) {
          tl.to(title, { y: 0, opacity: 1, duration: 0.6 }, 0);
        }

        // Animate line drawing down (using custom property)
        if (timeline) {
          tl.to(timeline, {
            '--line-height': '100%',
            duration: 1.5,
            ease: 'power2.inOut'
          }, 0.3);
        }

        // Markers pop in with stagger
        tl.to(markers, {
          scale: 1,
          opacity: 1,
          duration: 0.4,
          stagger: 0.2,
          ease: 'back.out(2)'
        }, 0.4);

        // Content slides in with stagger
        tl.to(contents, {
          x: 0,
          opacity: 1,
          duration: 0.6,
          stagger: 0.2,
          ease: 'power3.out'
        }, 0.5);
      }
    });
  }

  /* ============================================
     ABOUT PAGE - Personal Section Animation
     ============================================ */

  function initPersonalAnimation() {
    const personalSection = document.querySelector('.personal-anim');
    if (!personalSection) return;

    const title = personalSection.querySelector('.personal-title-anim');
    const paragraphs = personalSection.querySelectorAll('.personal-p-anim');

    if (prefersReducedMotion) {
      personalSection.style.opacity = '1';
      if (title) title.style.opacity = '1';
      paragraphs.forEach(p => p.style.opacity = '1');
      return;
    }

    // Set initial states
    gsap.set(personalSection, { y: 60, opacity: 0 });
    if (title) gsap.set(title, { y: 30, opacity: 0 });
    gsap.set(paragraphs, { y: 20, opacity: 0 });

    // Create ScrollTrigger
    ScrollTrigger.create({
      trigger: personalSection,
      start: 'top 85%',
      once: true,
      onEnter: () => {
        const tl = gsap.timeline();

        // Card fades up
        tl.to(personalSection, {
          y: 0,
          opacity: 1,
          duration: 0.8,
          ease: 'power3.out'
        }, 0);

        // Title fades up
        if (title) {
          tl.to(title, { y: 0, opacity: 1, duration: 0.6 }, 0.2);
        }

        // Paragraphs stagger in
        tl.to(paragraphs, {
          y: 0,
          opacity: 1,
          duration: 0.6,
          stagger: 0.15
        }, 0.4);
      }
    });
  }

  /* ============================================
     ABOUT PAGE - Main Initializer
     ============================================ */

  function initAboutPage() {
    // Check if we're on the about page
    if (!document.querySelector('.about-hero')) return;

    initAboutHero();
    initStatsCounter();
    initEducationAnimation();
    initSkillsAnimation();
    initTimelineAnimation();
    initPersonalAnimation();
  }

  /* ============================================
     CONTACT PAGE - Entrance Animations
     ============================================ */

  function initContactPage() {
    const contactPage = document.querySelector('.contact-page');
    if (!contactPage) return;

    const label = contactPage.querySelector('.section__label.contact-anim');
    const photo = contactPage.querySelector('.contact-photo.contact-anim');
    const headline = contactPage.querySelector('.contact-info h1.contact-anim');
    const bio = contactPage.querySelector('.contact-bio.contact-anim');
    const links = contactPage.querySelectorAll('.contact-link-anim');
    const footer = contactPage.querySelector('.contact-footer-anim');
    const banner = contactPage.querySelector('.contact-banner-anim');

    // If reduced motion, show everything
    if (prefersReducedMotion) {
      [label, photo, headline, bio, ...links, footer, banner].forEach(el => {
        if (el) {
          el.style.opacity = '1';
          el.style.transform = 'none';
        }
      });
      return;
    }

    // Set initial states
    if (label) gsap.set(label, { y: 20, opacity: 0 });
    if (photo) gsap.set(photo, { scale: 0.95, opacity: 0 });
    if (headline) gsap.set(headline, { y: 40, opacity: 0 });
    if (bio) gsap.set(bio, { y: 30, opacity: 0 });
    if (links.length) gsap.set(links, { x: -30, opacity: 0 });
    if (footer) gsap.set(footer, { y: 20, opacity: 0 });
    if (banner) gsap.set(banner, { y: 30, opacity: 0 });

    // Create timeline
    const tl = gsap.timeline({ delay: 0.2 });

    // Label fades in
    if (label) {
      tl.to(label, { y: 0, opacity: 1, duration: 0.5 }, 0);
    }

    // Photo scales in
    if (photo) {
      tl.to(photo, { scale: 1, opacity: 1, duration: 0.7, ease: 'power2.out' }, 0.1);
    }

    // Headline fades up
    if (headline) {
      tl.to(headline, { y: 0, opacity: 1, duration: 0.6, ease: 'power3.out' }, 0.3);
    }

    // Bio fades up
    if (bio) {
      tl.to(bio, { y: 0, opacity: 1, duration: 0.6 }, 0.4);
    }

    // Links stagger in
    if (links.length) {
      tl.to(links, {
        x: 0,
        opacity: 1,
        duration: 0.5,
        stagger: 0.1,
        ease: 'power3.out'
      }, 0.5);
    }

    // Footer fades in
    if (footer) {
      tl.to(footer, { y: 0, opacity: 1, duration: 0.5 }, 0.7);
    }

    // Banner fades up
    if (banner) {
      tl.to(banner, { y: 0, opacity: 1, duration: 0.6 }, 0.8);
    }
  }

  /* ============================================
     INITIALIZATION
     ============================================ */

  function init() {
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', onReady);
    } else {
      onReady();
    }
  }

  function onReady() {
    // Initialize GSAP first
    initGSAP();

    // Initialize Lenis smooth scroll
    initLenis();

    // Run animations after page load
    window.addEventListener('load', () => {
      // Home page animations
      initHeroAnimation();
      initProjectCards();

      // Work page animations
      initWorkPageHeader();
      initWorkItems();
      initFilterAnimation();

      // About page animations
      initAboutPage();

      // Contact page animations
      initContactPage();

      // Global animations
      initScrollReveal();
      initFooterParallax();

      // Refresh ScrollTrigger after all animations are set up
      ScrollTrigger.refresh();
    });
  }

  // Start
  init();

})();
