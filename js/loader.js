// ============================================
// LOADER ANIMATION v3
// Fixes: overflow clipping, animation sequencing, width measurement
// ============================================

(function() {
  'use strict';

  const CONFIG = {
    firstVisitOnly: true,
    storageKey: 'loaderShown'
  };

  document.addEventListener('DOMContentLoaded', function() {
    // ========================================
    // ELEMENTS
    // ========================================
    const loader = document.getElementById('loader');
    const loaderContent = document.querySelector('.loader-content');
    const skipBtn = document.getElementById('skipBtn');
    const pageWrapper = document.querySelector('.page-wrapper');

    // Word containers
    const container1 = document.getElementById('container1');
    const container2 = document.getElementById('container2');

    // Words
    const wordWith = document.getElementById('word-with');
    const wordFor = document.getElementById('word-for');
    const wordMind = document.getElementById('word-mind');
    const wordYou = document.getElementById('word-you');

    let isRunning = true;

    // If no loader, show page
    if (!loader) {
      console.log('No loader element found');
      showPage();
      return;
    }

    // Reduced motion preference
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      console.log('Reduced motion preference detected');
      skipLoader();
      return;
    }

    // Returning visitor (session-based)
    if (CONFIG.firstVisitOnly && sessionStorage.getItem(CONFIG.storageKey)) {
      console.log('Returning visitor, skipping loader');
      skipLoader();
      return;
    }

    // Skip button
    if (skipBtn) {
      skipBtn.addEventListener('click', skipLoader);
    }

    // Keyboard skip
    document.addEventListener('keydown', function(e) {
      if (e.key === 'Escape' || e.key === ' ') {
        e.preventDefault();
        skipLoader();
      }
    });

    // Prevent scrolling
    document.body.style.overflow = 'hidden';

    // Mark as visited
    sessionStorage.setItem(CONFIG.storageKey, 'true');

    // ========================================
    // UTILITY: Promise-based delay
    // ========================================
    function delay(ms) {
      return new Promise(resolve => setTimeout(resolve, ms));
    }

    // ========================================
    // UTILITY: Split text into character spans
    // ========================================
    function splitTextIntoChars(element) {
      const text = element.textContent;
      element.textContent = '';

      [...text].forEach(char => {
        const span = document.createElement('span');
        span.className = 'char';
        span.textContent = char === ' ' ? '\u00A0' : char;
        element.appendChild(span);
      });

      return element.querySelectorAll('.char');
    }

    // ========================================
    // UTILITY: Split element preserving child tags (like <em>)
    // ========================================
    function splitPreservingTags(element) {
      const chars = [];

      function processNode(node) {
        if (node.nodeType === Node.TEXT_NODE) {
          const text = node.textContent;
          const fragment = document.createDocumentFragment();

          [...text].forEach(char => {
            const span = document.createElement('span');
            span.className = 'char';
            span.textContent = char === ' ' ? '\u00A0' : char;
            fragment.appendChild(span);
            chars.push(span);
          });

          node.parentNode.replaceChild(fragment, node);
        } else if (node.nodeType === Node.ELEMENT_NODE) {
          [...node.childNodes].forEach(processNode);
        }
      }

      [...element.childNodes].forEach(processNode);
      return chars;
    }

    // ========================================
    // UTILITY: Get element width (handles hidden elements)
    // ========================================
    function getWidth(element) {
      // Store original state
      const originalOpacity = element.style.opacity;
      const originalPosition = element.style.position;
      const originalVisibility = element.style.visibility;

      // Temporarily show element to measure
      element.style.opacity = '1';
      element.style.position = 'relative';
      element.style.visibility = 'hidden';

      const width = element.getBoundingClientRect().width;

      // Restore original state
      element.style.opacity = originalOpacity;
      element.style.position = originalPosition;
      element.style.visibility = originalVisibility;

      return width;
    }

    // ========================================
    // SKIP LOADER
    // ========================================
    function skipLoader() {
      console.log('Skipping loader...');
      isRunning = false;
      gsap.killTweensOf('*');

      gsap.to(loader, {
        opacity: 0,
        duration: 0.3,
        onComplete: () => {
          loader.style.display = 'none';
          showPage();
          animatePageElements();
        }
      });
    }

    // ========================================
    // SHOW PAGE
    // ========================================
    function showPage() {
      if (pageWrapper) {
        pageWrapper.classList.add('visible');
        gsap.set(pageWrapper, { opacity: 1 });
      }
      document.body.style.overflow = '';
      document.body.classList.add('loaded');
    }

    // ========================================
    // ANIMATION 1: JITTER INTRO
    // Letter-by-letter pop with zoom
    // ========================================
    async function playIntro() {
      console.log('Playing intro...');

      // Split "Design" into characters
      const line1 = document.querySelector('.line-1');
      const line1Chars = splitTextIntoChars(line1);

      // Split visible words into characters (preserving <em> tags)
      const withChars = splitPreservingTags(wordWith);
      const mindChars = splitPreservingTags(wordMind);

      // All characters for intro
      const allChars = [...line1Chars, ...withChars, ...mindChars];

      console.log(`Intro: ${allChars.length} characters to animate`);

      // Initial state: all hidden
      gsap.set(allChars, { opacity: 0 });
      gsap.set([wordFor, wordYou], { opacity: 0 });

      // Create timeline
      const tl = gsap.timeline();

      // Letters pop in (instant, with stagger)
      tl.to(allChars, {
        opacity: 1,
        duration: 0.01,
        stagger: 0.03,
        ease: 'none'
      });

      // Zoom in
      tl.fromTo(loaderContent,
        { scale: 1 },
        { scale: 1.1, duration: 0.4, ease: 'power2.out' },
        0
      );

      // Zoom back
      tl.to(loaderContent, {
        scale: 1,
        duration: 0.5,
        ease: 'power2.inOut'
      });

      // Wait for completion
      await tl.then();
      console.log('Intro complete');

      await delay(400);
    }

    // ========================================
    // ANIMATION 2: SCHITT'S CREEK 3D FLIP
    // "with" → "for"
    // ========================================
    async function playFlip() {
      if (!isRunning) return;
      console.log('Playing flip: with → for');

      const oldWord = wordWith;
      const newWord = wordFor;
      const container = container1;

      // Get the chars from old word (already split)
      const oldChars = oldWord.querySelectorAll('.char');

      // Split new word into chars
      const newChars = splitPreservingTags(newWord);

      // Measure widths
      const oldWidth = getWidth(oldWord);
      const newWidth = getWidth(newWord);

      console.log(`Container 1: ${oldWidth.toFixed(1)}px → ${newWidth.toFixed(1)}px`);

      // Set container to fixed width FIRST
      gsap.set(container, { width: oldWidth });

      // Set initial state for new word and chars
      gsap.set(newWord, {
        rotateX: 90,
        opacity: 0,
        transformOrigin: '50% 100%'
      });
      gsap.set(newChars, { opacity: 0 });

      // Timeline
      const tl = gsap.timeline();

      // Flip OUT old word chars
      tl.to(oldChars, {
        rotateX: -90,
        opacity: 0,
        duration: 0.35,
        stagger: 0.02,
        ease: 'power2.in',
        transformOrigin: '50% 100%'
      });

      // Animate container width
      tl.to(container, {
        width: newWidth,
        duration: 0.4,
        ease: 'power2.inOut'
      }, 0.15);

      // Flip IN new word
      tl.to(newWord, {
        rotateX: 0,
        opacity: 1,
        duration: 0.5,
        ease: 'back.out(1.4)',
        transformOrigin: '50% 100%'
      }, 0.2);

      // Fade in new chars
      tl.to(newChars, {
        opacity: 1,
        duration: 0.25,
        stagger: 0.02
      }, 0.25);

      // After animation: swap positions
      tl.call(() => {
        gsap.set(oldWord, { position: 'absolute', opacity: 0 });
        gsap.set(newWord, { position: 'relative', left: 'auto', top: 'auto' });
        gsap.set(container, { width: 'auto' });
        console.log('Flip positions swapped');
      });

      await tl.then();
      console.log('Flip complete');

      await delay(300);
    }

    // ========================================
    // ANIMATION 3: REACT BITS SLIDE UP
    // "the mind" → "you"
    // ========================================
    async function playSlide() {
      if (!isRunning) return;
      console.log('Playing slide: the mind → you');

      const oldWord = wordMind;
      const newWord = wordYou;
      const container = container2;

      // Get chars from old word (already split in intro)
      const oldChars = oldWord.querySelectorAll('.char');

      // Split new word into chars
      const newChars = splitPreservingTags(newWord);

      // Measure widths
      const oldWidth = getWidth(oldWord);
      const newWidth = getWidth(newWord);

      console.log(`Container 2: ${oldWidth.toFixed(1)}px → ${newWidth.toFixed(1)}px`);

      // Set container to fixed width FIRST
      gsap.set(container, { width: oldWidth });

      // Set initial state for new chars
      gsap.set(newChars, { opacity: 0, y: 40 });
      // Make new word container visible (but chars are hidden)
      gsap.set(newWord, { opacity: 1 });

      // Timeline
      const tl = gsap.timeline();

      // Slide OUT old chars
      tl.to(oldChars, {
        y: -40,
        opacity: 0,
        duration: 0.35,
        stagger: 0.02,
        ease: 'power3.in'
      });

      // Animate container width
      tl.to(container, {
        width: newWidth,
        duration: 0.5,
        ease: 'power2.inOut'
      }, 0.15);

      // Slide IN new chars
      tl.to(newChars, {
        y: 0,
        opacity: 1,
        duration: 0.45,
        stagger: 0.04,
        ease: 'power3.out'
      }, 0.2);

      // After animation: swap positions
      tl.call(() => {
        gsap.set(oldWord, { position: 'absolute', opacity: 0 });
        gsap.set(newWord, { position: 'relative', left: 'auto', top: 'auto' });
        gsap.set(container, { width: 'auto' });
        console.log('Slide positions swapped');
      });

      await tl.then();
      console.log('Slide complete');

      await delay(500);
    }

    // ========================================
    // TRANSITION TO PAGE
    // ========================================
    async function transitionToPage() {
      if (!isRunning) return;
      console.log('Transitioning to page...');

      // Make page wrapper visible
      if (pageWrapper) {
        pageWrapper.classList.add('visible');
      }

      const tl = gsap.timeline();

      // Fade out loader
      tl.to(loader, {
        opacity: 0,
        duration: 0.6,
        ease: 'power2.inOut'
      });

      // Fade in page (overlapping)
      tl.to(pageWrapper, {
        opacity: 1,
        duration: 0.5,
        ease: 'power2.out'
      }, '-=0.3');

      // Remove loader from DOM
      tl.call(() => {
        loader.style.display = 'none';
        document.body.style.overflow = '';
        document.body.classList.add('loaded');
      });

      // Animate page elements
      tl.add(animatePageElements, '-=0.2');

      await tl.then();
      console.log('Page transition complete');
    }

    // ========================================
    // PAGE ELEMENTS ENTRANCE
    // ========================================
    function animatePageElements() {
      const tl = gsap.timeline();

      // Nav
      const nav = document.querySelector('.nav');
      if (nav) {
        tl.fromTo(nav,
          { y: -20, opacity: 0 },
          { y: 0, opacity: 1, duration: 0.5, ease: 'power2.out' }
        );
      }

      // Avatar
      const avatar = document.querySelector('.hero__avatar');
      if (avatar) {
        tl.fromTo(avatar,
          { scale: 0.9, opacity: 0 },
          { scale: 1, opacity: 1, duration: 0.4, ease: 'back.out(1.5)' },
          '-=0.3'
        );
      }

      // Label
      const label = document.querySelector('.hero__label');
      if (label) {
        tl.fromTo(label,
          { x: -15, opacity: 0 },
          { x: 0, opacity: 1, duration: 0.4, ease: 'power2.out' },
          '-=0.2'
        );
      }

      // Subtitle
      const subtitle = document.querySelector('.hero__subtitle');
      if (subtitle) {
        tl.fromTo(subtitle,
          { y: 15, opacity: 0 },
          { y: 0, opacity: 1, duration: 0.4, ease: 'power2.out' },
          '-=0.2'
        );
      }

      // CTA
      const cta = document.querySelector('.hero__cta');
      if (cta) {
        tl.fromTo(cta,
          { y: 15, opacity: 0 },
          { y: 0, opacity: 1, duration: 0.4, ease: 'power2.out' },
          '-=0.2'
        );
      }

      // Glass card
      const glass = document.querySelector('.hero__glass');
      if (glass) {
        tl.fromTo(glass,
          { x: 30, opacity: 0 },
          { x: 0, opacity: 1, duration: 0.5, ease: 'power2.out' },
          '-=0.3'
        );
      }

      return tl;
    }

    // ========================================
    // MAIN SEQUENCE
    // ========================================
    async function runLoader() {
      console.log('Starting loader animation...');

      try {
        await playIntro();

        if (!isRunning) return;
        await playFlip();

        if (!isRunning) return;
        await playSlide();

        if (!isRunning) return;
        await transitionToPage();

        console.log('Loader complete!');
      } catch (error) {
        console.error('Loader error:', error);
        // Fallback: just show the page
        skipLoader();
      }
    }

    // ========================================
    // START (after fonts load)
    // ========================================
    if (document.fonts && document.fonts.ready) {
      document.fonts.ready.then(() => {
        console.log('Fonts loaded, starting loader...');
        runLoader();
      });
    } else {
      // Fallback for browsers without font loading API
      console.log('Font API not available, starting with delay...');
      setTimeout(runLoader, 100);
    }
  });

  // ========================================
  // DEV HELPER
  // ========================================
  window.resetLoader = function() {
    sessionStorage.removeItem(CONFIG.storageKey);
    location.reload();
  };

})();
