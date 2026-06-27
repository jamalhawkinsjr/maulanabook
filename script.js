/* ============================================= */
/*  CRAYON DOODLE ART — JAVASCRIPT               */
/*  Bringing the doodles to life!                */
/* ============================================= */

document.addEventListener('DOMContentLoaded', () => {

  // ─── DARK MODE TOGGLE ───
  const themeToggle = document.getElementById('theme-toggle');
  const iconSun = document.querySelector('.icon-sun');
  const iconMoon = document.querySelector('.icon-moon');

  const savedTheme = localStorage.getItem('theme');
  if (savedTheme === 'dark' || (!savedTheme && window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
    document.body.classList.add('dark-mode');
    if (iconSun && iconMoon) {
      iconSun.style.display = 'none';
      iconMoon.style.display = 'block';
    }
  }

  let transitionRunning = false;

  function playChime(isDark) {
    if (!audioCtx) {
      try {
        audioCtx = new (window.AudioContext || window.webkitAudioContext)();
      } catch (e) {
        return;
      }
    }
    if (audioCtx.state === 'suspended') {
      audioCtx.resume();
    }
    const now = audioCtx.currentTime;
    if (isDark) {
      // Gentle descending notes for sleep time
      playMusicBoxNote(audioCtx, 392.00, now, 0.4); // G4
      playMusicBoxNote(audioCtx, 329.63, now + 0.12, 0.4); // E4
      playMusicBoxNote(audioCtx, 261.63, now + 0.24, 0.6); // C4
    } else {
      // Bright ascending notes for daytime
      playMusicBoxNote(audioCtx, 261.63, now, 0.4); // C4
      playMusicBoxNote(audioCtx, 329.63, now + 0.12, 0.4); // E4
      playMusicBoxNote(audioCtx, 392.00, now + 0.24, 0.6); // G4
    }
  }

  function spawnParticles(x, y, color, parent) {
    const particles = ['★', '✦', '♥', '〰', '●', '✿'];
    for (let i = 0; i < 8; i++) {
      const p = document.createElement('div');
      p.className = 'transition-particle';
      p.textContent = particles[Math.floor(Math.random() * particles.length)];
      p.style.color = color;
      p.style.left = `${x}px`;
      p.style.top = `${y}px`;
      p.style.transform = 'translate(-50%, -50%) scale(0)';
      parent.appendChild(p);

      requestAnimationFrame(() => {
        const angle = Math.random() * Math.PI * 2;
        const distance = Math.random() * 100 + 50;
        const tx = Math.cos(angle) * distance;
        const ty = Math.sin(angle) * distance;
        p.style.opacity = '0.95';
        p.style.transform = `translate(-50%, -50%) translate(${tx}px, ${ty}px) scale(${Math.random() * 0.7 + 0.6}) rotate(${Math.random() * 360}deg)`;
      });

      setTimeout(() => {
        p.style.opacity = '0';
      }, 450);
    }
  }

  if (themeToggle) {
    themeToggle.addEventListener('click', (e) => {
      if (transitionRunning) return;
      transitionRunning = true;

      // Determine click coordinates
      let clickX = e.clientX;
      let clickY = e.clientY;

      // If keyboard navigation or no coords
      if (clickX === undefined || clickY === undefined || (clickX === 0 && clickY === 0)) {
        const rect = themeToggle.getBoundingClientRect();
        clickX = rect.left + rect.width / 2;
        clickY = rect.top + rect.height / 2;
      }

      const isDark = !document.body.classList.contains('dark-mode');

      // Play cute synthesizer chime
      playChime(isDark);

      // Colors
      const targetColor = isDark ? '#1e1e22' : '#FFF8E7';
      const crayonColor = isDark ? 'var(--crayon-purple)' : 'var(--crayon-yellow)';
      const mascotColor = isDark ? '#B068C8' : '#F7D547';

      // 1. Create overlay container
      const overlay = document.createElement('div');
      overlay.className = 'theme-transition-overlay';
      document.body.appendChild(overlay);

      // 2. Create SVG circular curtain
      const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
      svg.setAttribute('class', 'theme-transition-svg');
      
      const circle = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
      circle.setAttribute('class', 'transition-circle');
      circle.setAttribute('cx', '0');
      circle.setAttribute('cy', '0');
      circle.setAttribute('r', '100');
      circle.setAttribute('fill', targetColor);
      circle.setAttribute('filter', 'url(#crayon-heavy)');
      
      circle.style.transform = `translate(${clickX}px, ${clickY}px) scale(0)`;
      svg.appendChild(circle);
      overlay.appendChild(svg);

      // 3. Create cartoon crayon mascot
      const mascot = document.createElement('div');
      mascot.className = 'crayon-mascot';
      mascot.style.left = `${clickX}px`;
      mascot.style.top = `${clickY}px`;
      mascot.style.setProperty('--crayon-color', crayonColor);

      // Sleepy vs Happy eyes markup
      const eyeMarkup = isDark 
        ? `<path d="M 21 66 Q 24 62, 27 66" stroke="var(--crayon-brown)" stroke-width="2.5" fill="none" stroke-linecap="round" />
           <path d="M 33 66 Q 36 62, 39 66" stroke="var(--crayon-brown)" stroke-width="2.5" fill="none" stroke-linecap="round" />`
        : `<circle cx="23" cy="65" r="2.5" fill="var(--crayon-brown)" />
           <circle cx="37" cy="65" r="2.5" fill="var(--crayon-brown)" />`;

      mascot.innerHTML = `
        <svg viewBox="0 0 60 120" width="100%" height="100%">
          <!-- Crayon Tip -->
          <path d="M 15 30 L 30 5 L 45 30 Z" fill="${mascotColor}" stroke="var(--crayon-brown)" stroke-width="2.5" stroke-linejoin="round" />
          <!-- Crayon Body -->
          <rect x="15" y="30" width="30" height="80" rx="3" fill="${mascotColor}" stroke="var(--crayon-brown)" stroke-width="2.5" />
          <!-- Paper Wrapper -->
          <rect x="15" y="45" width="30" height="50" fill="#fff" stroke="var(--crayon-brown)" stroke-width="2" />
          <!-- Wrapper Details -->
          <path d="M 15 55 Q 30 60, 45 55 M 15 85 Q 30 90, 45 85" stroke="${mascotColor}" stroke-width="2" fill="none" />
          <!-- Face -->
          ${eyeMarkup}
          <!-- Cheeks -->
          <circle cx="19" cy="71" r="2.5" fill="var(--crayon-pink)" opacity="0.7" />
          <circle cx="41" cy="71" r="2.5" fill="var(--crayon-pink)" opacity="0.7" />
          <!-- Mouth -->
          <path d="M 27 72 Q 30 76, 33 72" stroke="var(--crayon-brown)" stroke-width="2" fill="none" stroke-linecap="round" />
        </svg>
      `;
      overlay.appendChild(mascot);

      // 4. Create wobbly speech bubble
      const bubble = document.createElement('div');
      bubble.className = 'speech-bubble';
      bubble.style.left = `${clickX}px`;
      bubble.style.top = `${clickY}px`;
      
      const cutePhrases = isDark 
        ? ["Yuk bobok! 😴", "Selamat malam! 🌙", "Matikan lampu! 💤", "Waktunya tidur! ✨", "Malam... 🌌"]
        : ["Pagi! ☀️", "Main yuk! 🎨", "Terang benderang! ✨", "Halo dunia! 🌸", "Halo matahari! ☀️"];
      
      bubble.textContent = cutePhrases[Math.floor(Math.random() * cutePhrases.length)];
      overlay.appendChild(bubble);

      // Calculate max scale factor to cover the screen
      const dx = Math.max(clickX, window.innerWidth - clickX);
      const dy = Math.max(clickY, window.innerHeight - clickY);
      const maxDist = Math.hypot(dx, dy);
      const targetScale = (maxDist / 100) * 1.05;

      // Force layout calculation
      overlay.offsetHeight;

      // Step A: Mascot enters with bounce
      mascot.classList.add('active');

      setTimeout(() => {
        // Step B: Mascot wiggles/draws and spawns particles
        mascot.classList.add('drawing');
        spawnParticles(clickX, clickY, crayonColor, overlay);

        // Step C: Circle scales up to wipe screen
        circle.style.transform = `translate(${clickX}px, ${clickY}px) scale(${targetScale})`;
      }, 300);

      // Step D: Swap themes at maximum screen coverage
      setTimeout(() => {
        document.body.classList.toggle('dark-mode');
        
        if (isDark) {
          iconSun.style.display = 'none';
          iconMoon.style.display = 'block';
          localStorage.setItem('theme', 'dark');
        } else {
          iconSun.style.display = 'block';
          iconMoon.style.display = 'none';
          localStorage.setItem('theme', 'light');
        }

        // Mascot does a celebratory spin
        mascot.classList.remove('drawing');
        mascot.classList.add('tada');

        // Speech bubble pops up
        bubble.classList.add('active');
      }, 700);

      // Step E: Fade out transition curtain
      setTimeout(() => {
        overlay.style.opacity = '0';
      }, 1600);

      // Step F: Destroy DOM elements and free state
      setTimeout(() => {
        overlay.remove();
        transitionRunning = false;
      }, 2100);
    });
  }


  // ─── SMOOTH SCROLL FOR ALL ANCHOR LINKS ───
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', (e) => {
      const targetId = anchor.getAttribute('href');
      if (targetId === '#') {
        e.preventDefault();
        return;
      }

      // Check if we are switching views
      const targetIsGallery = targetId === '#gallery';
      const currentIsGallery = window.location.hash === '#gallery';

      if (targetIsGallery !== currentIsGallery) {
        // Let hash change naturally so router handles showing/hiding
        const navLinks = document.getElementById('nav-links');
        const navToggle = document.getElementById('nav-toggle');
        if (navLinks && navToggle) {
          navLinks.classList.remove('open');
          navToggle.classList.remove('active');
        }
        return;
      }

      // If in same view, do smooth scroll
      e.preventDefault();
      const target = document.querySelector(targetId);
      if (target) {
        window.scrollTo({
          top: target.offsetTop - 70,
          behavior: 'smooth'
        });
        // Update URL hash manually
        history.pushState(null, null, targetId);
        
        // Close mobile menu if open
        const navLinks = document.getElementById('nav-links');
        const navToggle = document.getElementById('nav-toggle');
        if (navLinks && navToggle) {
          navLinks.classList.remove('open');
          navToggle.classList.remove('active');
        }
      }
    });
  });

  // ─── MOBILE NAV TOGGLE ───
  const navToggle = document.getElementById('nav-toggle');
  const navLinks = document.getElementById('nav-links');

  if (navToggle && navLinks) {
    navToggle.addEventListener('click', () => {
      navLinks.classList.toggle('open');
      navToggle.classList.toggle('active');
    });

    // Close mobile nav when clicking outside
    document.addEventListener('click', (e) => {
      if (!navToggle.contains(e.target) && !navLinks.contains(e.target)) {
        navLinks.classList.remove('open');
        navToggle.classList.remove('active');
      }
    });
  }

  // ─── HEADER SCROLL SHADOW ───
  const header = document.getElementById('header');
  let lastScroll = 0;

  window.addEventListener('scroll', () => {
    const currentScroll = window.scrollY;
    if (header) {
      if (currentScroll > 50) {
        header.classList.add('scrolled');
      } else {
        header.classList.remove('scrolled');
      }
    }
    lastScroll = currentScroll;
  }, { passive: true });

  // ─── SCROLL REVEAL / INTERSECTION OBSERVER ───
  // Animate elements as they come into viewport
  const revealElements = [
    ...document.querySelectorAll('.skill-card'),
    ...document.querySelectorAll('.timeline-entry'),
    ...document.querySelectorAll('.project-card'),
    ...document.querySelectorAll('.polaroid-card'),
    document.querySelector('.notebook-paper'),
    ...document.querySelectorAll('.crayon-scene-divider'),
    document.querySelector('.about-doodle'),
    document.querySelector('.projects-doodle'),
  ].filter(Boolean);

  // Add 'reveal' class to all elements
  revealElements.forEach(el => {
    el.classList.add('reveal');
  });

  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry, index) => {
      if (entry.isIntersecting) {
        // Stagger the animation
        setTimeout(() => {
          entry.target.classList.add('visible');
        }, index * 100);
        revealObserver.unobserve(entry.target);
      }
    });
  }, {
    threshold: 0.15,
    rootMargin: '0px 0px -50px 0px'
  });

  revealElements.forEach(el => revealObserver.observe(el));

  // ─── SECTION TITLE ANIMATION ───
  // Animate the scribble underline when title comes into view
  const sectionTitles = document.querySelectorAll('.section-title');

  const titleObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('animated');
        titleObserver.unobserve(entry.target);
      }
    });
  }, {
    threshold: 0.15,
    rootMargin: '0px 0px -50px 0px'
  });

  sectionTitles.forEach(title => titleObserver.observe(title));

  // ─── HERO TITLE LETTER-BY-LETTER ANIMATION ───
  const heroTitle = document.getElementById('hero-title');
  if (heroTitle) {
    // Add a small delay, then make visible
    heroTitle.style.opacity = '0';
    heroTitle.style.transform = 'translateY(20px)';
    heroTitle.style.transition = 'opacity 0.8s ease, transform 0.8s ease';

    setTimeout(() => {
      heroTitle.style.opacity = '1';
      heroTitle.style.transform = 'translateY(0)';
    }, 300);
  }

  // ─── SUBTLE PARALLAX FOR HERO DOODLES ───
  const heroSun = document.querySelector('.hero-sun');
  const heroCloud = document.querySelector('.hero-cloud');
  const heroCloud2 = document.querySelector('.hero-cloud-2');
  const heroRainbow = document.querySelector('.hero-rainbow');
  const heroLandscape = document.querySelector('.hero-landscape');

  window.addEventListener('mousemove', (e) => {
    const mouseX = (e.clientX / window.innerWidth - 0.5) * 2;
    const mouseY = (e.clientY / window.innerHeight - 0.5) * 2;

    if (heroSun) {
      heroSun.style.transform = `translate(${mouseX * 8}px, ${mouseY * 5}px)`;
    }
    if (heroCloud) {
      heroCloud.style.transform = `translate(${mouseX * -12}px, ${mouseY * -6}px)`;
    }
    if (heroCloud2) {
      heroCloud2.style.transform = `translate(${mouseX * 10}px, ${mouseY * -4}px)`;
    }
    if (heroRainbow) {
      heroRainbow.style.transform = `translateX(-50%) translate(${mouseX * 5}px, ${mouseY * 3}px)`;
    }
    if (heroLandscape) {
      heroLandscape.style.transform = `translateY(${mouseY * 3}px)`;
    }
  }, { passive: true });

  // ─── ACTIVE NAV LINK HIGHLIGHTING ───
  const sections = document.querySelectorAll('section[id]');
  const navLinkElements = document.querySelectorAll('.nav-link');

  function updateActiveNavLink() {
    // If we are on the gallery view, always highlight the Gallery link and clear others
    if (window.location.hash === '#gallery') {
      navLinkElements.forEach(link => {
        if (link.getAttribute('href') === '#gallery') {
          link.classList.add('active');
        } else {
          link.classList.remove('active');
        }
      });
      return;
    }

    let currentActive = '';
    const scrollPosition = window.scrollY + 150; // offset for fixed header + buffer

    sections.forEach(section => {
      const sectionTop = section.offsetTop;
      if (scrollPosition >= sectionTop) {
        currentActive = section.getAttribute('id');
      }
    });

    // Check if we are at the bottom of the page to force projects active
    if ((window.innerHeight + window.scrollY) >= document.body.offsetHeight - 50) {
      currentActive = 'projects';
    }

    navLinkElements.forEach(link => {
      // Ignore gallery link on homepage scroll
      if (link.getAttribute('href') === '#gallery') {
        link.classList.remove('active');
        return;
      }
      
      link.classList.remove('active');
      if (link.getAttribute('href') === `#${currentActive}`) {
        link.classList.add('active');
      }
    });
  }

  // Throttle scroll event using requestAnimationFrame
  let isScrolling = false;
  window.addEventListener('scroll', () => {
    if (!isScrolling) {
      window.requestAnimationFrame(() => {
        updateActiveNavLink();
        isScrolling = false;
      });
      isScrolling = true;
    }
  }, { passive: true });

  // Initial call on load
  updateActiveNavLink();

  // ─── RANDOM SUBTLE ROTATION ON SKILL CARDS ───
  // Give each card a slightly different rotation for more organic feel
  document.querySelectorAll('.skill-card').forEach(card => {
    const randomRotation = (Math.random() - 0.5) * 3; // -1.5 to 1.5 degrees
    card.style.setProperty('--initial-rotation', `${randomRotation}deg`);
  });

  // ─── EASTER EGG: CLICK LOGO TO TRIGGER CONFETTI DOODLES ───
  const logo = document.getElementById('logo');
  if (logo) {
    logo.addEventListener('click', (e) => {
      e.preventDefault();
      createCrayonBurst(e.clientX, e.clientY);
      // Navigate back to homepage/top
      window.location.hash = '';
    });
  }

  function createCrayonBurst(x, y) {
    const colors = [
      'var(--crayon-red)', 'var(--crayon-orange)', 'var(--crayon-yellow)',
      'var(--crayon-green)', 'var(--crayon-blue)', 'var(--crayon-purple)'
    ];
    const emojis = ['✦', '♥', '★', '✿', '⚡', '🖍️', '〰', '❀'];

    for (let i = 0; i < 12; i++) {
      const particle = document.createElement('div');
      particle.textContent = emojis[Math.floor(Math.random() * emojis.length)];
      particle.style.cssText = `
        position: fixed;
        left: ${x}px;
        top: ${y}px;
        font-size: ${Math.random() * 16 + 12}px;
        pointer-events: none;
        z-index: 10000;
        opacity: 1;
        transition: all ${Math.random() * 0.5 + 0.6}s ease-out;
        color: ${colors[Math.floor(Math.random() * colors.length)]};
      `;
      document.body.appendChild(particle);

      // Animate outward
      requestAnimationFrame(() => {
        const angle = (Math.PI * 2 * i) / 12;
        const distance = Math.random() * 80 + 50;
        particle.style.transform = `translate(${Math.cos(angle) * distance}px, ${Math.sin(angle) * distance - 30}px) rotate(${Math.random() * 360}deg)`;
        particle.style.opacity = '0';
      });

      // Clean up
      setTimeout(() => particle.remove(), 1200);
    }
  }

  // Active nav link styles are now declared in style.css for better performance and maintainability

  // ─── KIDS MUSIC BOX (WEB AUDIO API SYNTHESIZER - AUTOPLAY ON INTERACTION) ───
  // Melody: "Pelangi-Pelangi" (Indonesian Kids' Song - perfect for the crayon rainbow theme!)
  const melody = [
    { note: 'C4', dur: 0.5 }, { note: 'E4', dur: 0.5 }, { note: 'G4', dur: 1 },
    { note: 'G4', dur: 0.5 }, { note: 'G4', dur: 1.5 }, { note: 'rest', dur: 0.5 },
    
    { note: 'A4', dur: 0.5 }, { note: 'G4', dur: 0.5 }, { note: 'F4', dur: 0.5 }, { note: 'E4', dur: 0.5 },
    { note: 'D4', dur: 2 }, { note: 'rest', dur: 1 },
    
    { note: 'E4', dur: 0.5 }, { note: 'F4', dur: 0.5 }, { note: 'G4', dur: 1 },
    { note: 'E4', dur: 0.5 }, { note: 'C4', dur: 1.5 }, { note: 'rest', dur: 0.5 },
    
    { note: 'D4', dur: 0.5 }, { note: 'E4', dur: 0.5 }, { note: 'F4', dur: 0.5 }, { note: 'D4', dur: 0.5 },
    { note: 'G4', dur: 2 }, { note: 'rest', dur: 1 },
    
    { note: 'G4', dur: 0.5 }, { note: 'G4', dur: 0.5 }, { note: 'A4', dur: 0.5 }, { note: 'G4', dur: 0.5 },
    { note: 'F4', dur: 2 }, { note: 'rest', dur: 1 },
    
    { note: 'E4', dur: 0.5 }, { note: 'D4', dur: 0.5 }, { note: 'E4', dur: 0.5 }, { note: 'F4', dur: 0.5 },
    { note: 'G4', dur: 2 }, { note: 'rest', dur: 1 },
    
    { note: 'C4', dur: 0.5 }, { note: 'E4', dur: 0.5 }, { note: 'G4', dur: 1 },
    { note: 'G4', dur: 0.5 }, { note: 'G4', dur: 1.5 }, { note: 'rest', dur: 0.5 },
    
    { note: 'A4', dur: 0.5 }, { note: 'G4', dur: 0.5 }, { note: 'B4', dur: 0.5 }, { note: 'C5', dur: 2.5 },
    { note: 'rest', dur: 3 } // Long pause before looping
  ];

  const noteFrequencies = {
    'C4': 261.63, 'D4': 293.66, 'E4': 329.63, 'F4': 349.23,
    'G4': 392.00, 'A4': 440.00, 'B4': 493.88, 'C5': 523.25,
    'rest': 0
  };

  let audioCtx = null;
  let nextNoteTime = 0;
  let noteIndex = 0;
  let musicPlaying = false;
  let schedulerTimeoutId = null;

  const tempo = 100; // Calming, slow music-box speed
  const beatDuration = 60 / tempo;

  function playMusicBoxNote(ctx, freq, startTime, duration) {
    if (freq === 0) return; // Silent rest note

    // 1. Fundamental chime
    const osc1 = ctx.createOscillator();
    const gain1 = ctx.createGain();
    osc1.type = 'triangle';
    osc1.frequency.setValueAtTime(freq, startTime);
    
    gain1.gain.setValueAtTime(0, startTime);
    gain1.gain.linearRampToValueAtTime(0.04, startTime + 0.01); // Soft volume
    gain1.gain.exponentialRampToValueAtTime(0.001, startTime + duration - 0.02);
    
    osc1.connect(gain1);
    gain1.connect(ctx.destination);
    osc1.start(startTime);
    osc1.stop(startTime + duration);

    // 2. High-pitched bell chime (overtone)
    const osc2 = ctx.createOscillator();
    const gain2 = ctx.createGain();
    osc2.type = 'sine';
    osc2.frequency.setValueAtTime(freq * 2, startTime);
    
    gain2.gain.setValueAtTime(0, startTime);
    gain2.gain.linearRampToValueAtTime(0.02, startTime + 0.01); // Very soft bell sound
    gain2.gain.exponentialRampToValueAtTime(0.001, startTime + duration - 0.05);
    
    osc2.connect(gain2);
    gain2.connect(ctx.destination);
    osc2.start(startTime);
    osc2.stop(startTime + duration);
  }

  function musicScheduler() {
    if (!musicPlaying) return;
    while (nextNoteTime < audioCtx.currentTime + 0.1) {
      const currentNote = melody[noteIndex];
      playMusicBoxNote(audioCtx, noteFrequencies[currentNote.note], nextNoteTime, currentNote.dur * beatDuration);
      
      nextNoteTime += currentNote.dur * beatDuration;
      noteIndex = (noteIndex + 1) % melody.length;
    }
    schedulerTimeoutId = setTimeout(musicScheduler, 25);
  }

  function startMusicAutoplay() {
    if (musicPlaying) return;

    try {
      // Initialize audio context
      if (!audioCtx) {
        audioCtx = new (window.AudioContext || window.webkitAudioContext)();
      }

      // Resume if context is suspended (handling promise)
      if (audioCtx.state === 'suspended') {
        audioCtx.resume().then(() => {
          if (!musicPlaying) {
            musicPlaying = true;
            nextNoteTime = audioCtx.currentTime + 0.1;
            noteIndex = 0;
            musicScheduler();
          }
        });
      } else {
        musicPlaying = true;
        nextNoteTime = audioCtx.currentTime + 0.1;
        noteIndex = 0;
        musicScheduler();
      }

      // Clean up all autoplay triggers
      ['click', 'mousedown', 'touchstart', 'keydown'].forEach(event => {
        document.removeEventListener(event, startMusicAutoplay);
      });
    } catch (e) {
      console.warn("Failed to start audio context:", e);
    }
  }

  // Bind to valid user interactions to bypass browser autoplay restrictions (excluding scroll)
  ['click', 'mousedown', 'touchstart', 'keydown'].forEach(event => {
    document.addEventListener(event, startMusicAutoplay, { passive: true });
  });

  // ─── SINGLE PAGE ROUTING FOR GALLERY ───
  const homeView = document.getElementById('home-view');
  const galleryView = document.getElementById('gallery-view');

  function checkRoute() {
    const hash = window.location.hash;
    if (hash === '#gallery') {
      if (homeView && galleryView) {
        homeView.style.display = 'none';
        galleryView.style.display = 'block';
        window.scrollTo({ top: 0 });
      }
    } else {
      if (homeView && galleryView) {
        homeView.style.display = 'block';
        galleryView.style.display = 'none';
      }
      
      // If navigating to a specific section on home view
      if (hash && hash !== '#' && hash !== '#home') {
        const target = document.querySelector(hash);
        if (target) {
          setTimeout(() => {
            window.scrollTo({
              top: target.offsetTop - 70,
              behavior: 'smooth'
            });
          }, 100);
        }
      }
    }
    updateActiveNavLink();
  }

  window.addEventListener('hashchange', checkRoute);
  // Initial check on load
  checkRoute();

});

/* ============================================= */
/*  GALLERY SWIPE CAROUSEL — Mobile only         */
/* ============================================= */
(function () {
  const MOBILE_BREAKPOINT = 768;

  // Elements
  const wrapper   = document.getElementById('gallery-swipe-wrapper');
  const grid      = document.getElementById('gallery-grid');
  const prevBtn   = document.getElementById('swipe-prev');
  const nextBtn   = document.getElementById('swipe-next');
  const dotsEl    = document.getElementById('swipe-dots');
  const counterEl = document.getElementById('swipe-counter');

  if (!wrapper || !grid || !prevBtn || !nextBtn || !dotsEl || !counterEl) return;

  let cards     = [];
  let current   = 0;
  let total     = 0;
  let dots      = [];
  let isActive  = false; // only true on mobile

  // ─── Setup ───────────────────────────────────────────
  function buildDots() {
    dotsEl.innerHTML = '';
    dots = [];
    for (let i = 0; i < total; i++) {
      const d = document.createElement('button');
      d.className = 'swipe-dot';
      d.setAttribute('role', 'tab');
      d.setAttribute('aria-label', `Photo ${i + 1}`);
      d.addEventListener('click', () => goTo(i));
      dotsEl.appendChild(d);
      dots.push(d);
    }
  }

  function refreshCards() {
    cards = Array.from(grid.querySelectorAll('.polaroid-card'));
    total = cards.length;
  }

  function init() {
    refreshCards();
    if (total === 0) return;
    buildDots();
    goTo(0, true);
  }

  // ─── Navigation ──────────────────────────────────────
  function goTo(index, instant) {
    if (index < 0) index = 0;
    if (index >= total) index = total - 1;
    current = index;

    // Translate the grid so the target card is centered
    // Each card takes up 100% of the wrapper width (flex: 0 0 85% + 7.5% margin each side = 100%)
    const offset = current * 100; // percentage units relative to wrapper
    if (instant) {
      grid.style.transition = 'none';
    } else {
      grid.style.transition = '';
    }
    grid.style.transform = `translateX(-${offset}%)`;

    // Active class
    cards.forEach((c, i) => c.classList.toggle('swipe-active', i === current));

    // Dots
    dots.forEach((d, i) => d.classList.toggle('active', i === current));

    // Counter
    counterEl.textContent = `${current + 1} / ${total}`;

    // Buttons
    prevBtn.disabled = current === 0;
    nextBtn.disabled = current === total - 1;
  }

  function prev() { goTo(current - 1); }
  function next() { goTo(current + 1); }

  // ─── Button listeners ────────────────────────────────
  prevBtn.addEventListener('click', prev);
  nextBtn.addEventListener('click', next);

  // ─── Keyboard ────────────────────────────────────────
  document.addEventListener('keydown', (e) => {
    if (!isActive) return;
    // Only when gallery view is visible
    const galleryView = document.getElementById('gallery-view');
    if (!galleryView || galleryView.style.display === 'none') return;
    if (e.key === 'ArrowLeft')  { prev(); e.preventDefault(); }
    if (e.key === 'ArrowRight') { next(); e.preventDefault(); }
  });

  // ─── Touch / Pointer swipe ───────────────────────────
  let touchStartX = null;
  let touchStartY = null;
  let isDragging  = false;
  const SWIPE_THRESHOLD = 50; // px to count as a swipe

  wrapper.addEventListener('touchstart', (e) => {
    if (!isActive) return;
    touchStartX = e.touches[0].clientX;
    touchStartY = e.touches[0].clientY;
    isDragging  = true;
  }, { passive: true });

  wrapper.addEventListener('touchmove', (e) => {
    if (!isActive || !isDragging || touchStartX === null) return;
    const dx = e.touches[0].clientX - touchStartX;
    const dy = e.touches[0].clientY - touchStartY;
    // If horizontal movement dominates, prevent page scroll
    if (Math.abs(dx) > Math.abs(dy)) {
      e.preventDefault();
    }
  }, { passive: false });

  wrapper.addEventListener('touchend', (e) => {
    if (!isActive || !isDragging || touchStartX === null) return;
    const dx = e.changedTouches[0].clientX - touchStartX;
    if (Math.abs(dx) >= SWIPE_THRESHOLD) {
      dx < 0 ? next() : prev();
    }
    touchStartX = null;
    touchStartY = null;
    isDragging  = false;
  }, { passive: true });

  // ─── Responsive toggle ───────────────────────────────
  function checkBreakpoint() {
    const mobile = window.innerWidth <= MOBILE_BREAKPOINT;
    if (mobile && !isActive) {
      isActive = true;
      // Reset any desktop transform that may linger
      grid.style.transform = '';
      init();
    } else if (!mobile && isActive) {
      isActive = false;
      // Clear mobile transform so desktop grid renders normally
      grid.style.transform = '';
      grid.style.transition = '';
      cards.forEach(c => c.classList.remove('swipe-active'));
    }
  }

  // Debounced resize
  let resizeTimer;
  window.addEventListener('resize', () => {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(checkBreakpoint, 120);
  }, { passive: true });

  // Initial check (runs after DOM is ready)
  checkBreakpoint();

  // Also re-initialise when the gallery view is shown (hash navigation)
  window.addEventListener('hashchange', () => {
    if (window.location.hash === '#gallery' && isActive) {
      // Small delay so the view is visible before measuring
      setTimeout(() => { refreshCards(); buildDots(); goTo(0, true); }, 50);
    }
  });
}());

