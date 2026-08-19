/* ======================================================
   HITESH ARORA — QUANT PORTFOLIO v3
   Warm Cream Theme — Premium Animations & Interactions
   ====================================================== */

;(function () {
  'use strict';

  /* ─── State ─── */
  let scrollY = 0;
  let targetScrollY = 0;
  let currentScrollY = 0;
  const lerp = (a, b, t) => a + (b - a) * t;

  /* ─── Init ─── */
  document.addEventListener('DOMContentLoaded', () => {
    preloader();
    smoothScroll();
    scrollProgress();
    heroSequence();
    heroParallax();
    liquidWaves();
    navigation();
    scrollReveal();
    staggerReveal();
    counters();
    wordHighlight();
    magneticButtons();
    anchorScroll();
    customCursor();
    textScramble();
    tiltCards();
    scrollToTop();
    horizontalScroll();
    sectionDividers();
  });

  /* ══════════════════════════════════════════════
     1. PRELOADER
     ══════════════════════════════════════════════ */
  function preloader() {
    const el = document.getElementById('preloader');
    if (!el) return;

    const spans = el.querySelectorAll('span');
    spans.forEach((s, i) => {
      s.style.animationDelay = `${0.05 * i}s`;
    });

    document.body.style.overflow = 'hidden';

    setTimeout(() => {
      el.classList.add('done');
      document.body.style.overflow = '';
    }, 1400);
  }

  /* ══════════════════════════════════════════════
     2. SMOOTH SCROLL (Lenis-like momentum)
     ══════════════════════════════════════════════ */
  function smoothScroll() {
    if (window.matchMedia('(pointer: coarse)').matches) return;

    function update() {
      targetScrollY = window.scrollY;
      currentScrollY = lerp(currentScrollY, targetScrollY, 0.1);

      document.querySelectorAll('[data-speed]').forEach(el => {
        const speed = parseFloat(el.dataset.speed) || 0;
        const y = -(currentScrollY * speed);
        el.style.transform = `translate3d(0, ${y}px, 0)`;
      });

      scrollY = currentScrollY;
      requestAnimationFrame(update);
    }

    update();
  }

  /* ══════════════════════════════════════════════
     3. SCROLL PROGRESS BAR
     ══════════════════════════════════════════════ */
  function scrollProgress() {
    const bar = document.getElementById('scrollProgress');
    if (!bar) return;

    let ticking = false;

    function updateBar() {
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      const pct = (window.scrollY / docHeight) * 100;
      bar.style.width = `${pct}%`;
      ticking = false;
    }

    window.addEventListener('scroll', () => {
      if (!ticking) {
        requestAnimationFrame(updateBar);
        ticking = true;
      }
    }, { passive: true });
  }

  /* ══════════════════════════════════════════════
     4. HERO CINEMATIC SEQUENCE
     ══════════════════════════════════════════════ */
  function heroSequence() {
    const line1 = document.getElementById('line1');
    const line2 = document.getElementById('line2');
    const eyebrow = document.getElementById('heroEyebrow');
    const title = document.getElementById('heroTitle');
    const stats = document.getElementById('heroStats');
    const resumeBtn = document.getElementById('resumeBtn');

    const t = 1500;

    setTimeout(() => { if (line1) line1.classList.add('visible'); }, t);
    setTimeout(() => { if (line2) line2.classList.add('visible'); }, t + 120);

    setTimeout(() => {
      if (eyebrow) typeWriter(eyebrow);
    }, t + 400);

    setTimeout(() => { if (title) title.classList.add('visible'); }, t + 700);
    setTimeout(() => { if (stats) stats.classList.add('visible'); }, t + 900);
    setTimeout(() => { if (resumeBtn) resumeBtn.classList.add('visible'); }, t + 1100);
  }

  function typeWriter(el) {
    const text = el.textContent;
    el.textContent = '';
    el.classList.add('visible');

    let i = 0;
    function tick() {
      if (i < text.length) {
        el.textContent += text.charAt(i);
        i++;
        setTimeout(tick, 20);
      }
    }
    tick();
  }

  /* ══════════════════════════════════════════════
     5. HERO PARALLAX
     ══════════════════════════════════════════════ */
  function heroParallax() {
    const hero = document.querySelector('.hero-content');
    const grid = document.querySelector('.hero-grid');
    const cue = document.querySelector('.scroll-cue');

    if (!hero) return;

    let ticking = false;

    window.addEventListener('scroll', () => {
      if (!ticking) {
        requestAnimationFrame(() => {
          const s = window.scrollY;
          const vh = window.innerHeight;

          if (s < vh * 1.2) {
            const ratio = s / vh;
            hero.style.transform = `translate3d(0, ${s * 0.35}px, 0)`;
            hero.style.opacity = 1 - ratio * 0.9;
            if (grid) grid.style.transform = `translate3d(0, ${s * 0.15}px, 0)`;
            if (cue) cue.style.opacity = Math.max(0, 1 - ratio * 3);
          }

          ticking = false;
        });
        ticking = true;
      }
    }, { passive: true });
  }

  /* ══════════════════════════════════════════════
     6. LIQUID WAVES BACKGROUND — Topographic Contour Waves
        Inspired by landonorris.com flowing wave aesthetic
        Visible across ALL sections of the page
     ══════════════════════════════════════════════ */
  function liquidWaves() {
    const canvas = document.getElementById('heroCanvas');
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    let W, H, docH;
    let time = 0;
    let mouse = { x: -9999, y: -9999, tx: -9999, ty: -9999 };
    let dpr = Math.min(window.devicePixelRatio || 1, 2);
    let scrollYPos = 0;

    function resize() {
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      W = window.innerWidth;
      H = window.innerHeight;
      docH = document.documentElement.scrollHeight;

      // Canvas covers the full viewport (fixed position)
      canvas.width = W * dpr;
      canvas.height = H * dpr;
      canvas.style.width = W + 'px';
      canvas.style.height = H + 'px';
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    }

    resize();
    window.addEventListener('resize', resize);

    // Track scroll position for shifting wave centers
    window.addEventListener('scroll', () => {
      scrollYPos = window.scrollY;
    }, { passive: true });

    document.addEventListener('mousemove', e => {
      mouse.tx = e.clientX;
      mouse.ty = e.clientY;
    });

    /* ── Simplex-like noise (fast 2D) ── */
    function noise2D(x, y) {
      const s1 = Math.sin(x * 0.8 + y * 0.6) * 0.5;
      const s2 = Math.sin(x * 1.3 - y * 0.9) * 0.3;
      const s3 = Math.cos(x * 0.5 + y * 1.4) * 0.2;
      const s4 = Math.sin(x * 2.1 + y * 0.3) * 0.15;
      const s5 = Math.cos(x * 0.3 - y * 2.0) * 0.12;
      return s1 + s2 + s3 + s4 + s5;
    }

    /* ── Catmull-Rom spline through points for buttery smooth curves ── */
    function catmullRomSpline(points, tension) {
      tension = tension || 0.5;
      const n = points.length;
      if (n < 2) return;

      ctx.moveTo(points[0].x, points[0].y);

      for (let i = 0; i < n; i++) {
        const p0 = points[(i - 1 + n) % n];
        const p1 = points[i];
        const p2 = points[(i + 1) % n];
        const p3 = points[(i + 2) % n];

        const cp1x = p1.x + (p2.x - p0.x) * tension / 3;
        const cp1y = p1.y + (p2.y - p0.y) * tension / 3;
        const cp2x = p2.x - (p3.x - p1.x) * tension / 3;
        const cp2y = p2.y - (p3.y - p1.y) * tension / 3;

        ctx.bezierCurveTo(cp1x, cp1y, cp2x, cp2y, p2.x, p2.y);
      }
    }

    /* ── Draw one smooth contour ring ── */
    function drawContour(cx, cy, baseRadius, timeOffset, color, lineW) {
      const segments = 80;
      const points = [];

      for (let i = 0; i < segments; i++) {
        const angle = (i / segments) * Math.PI * 2;

        // Multi-octave organic noise deformation
        const noiseVal = noise2D(
          Math.cos(angle) * 2.5 + timeOffset * 0.4,
          Math.sin(angle) * 2.5 + timeOffset * 0.3
        );

        const deform = noiseVal * baseRadius * 0.12;

        // Secondary slow undulation
        const wave2 = Math.sin(angle * 5 + timeOffset * 0.7) * baseRadius * 0.02;
        const wave3 = Math.cos(angle * 3 - timeOffset * 0.5) * baseRadius * 0.03;

        // Mouse proximity ripple
        const px = cx + Math.cos(angle) * baseRadius;
        const py = cy + Math.sin(angle) * baseRadius;
        const dx = px - mouse.x;
        const dy = py - mouse.y;
        const dist = Math.sqrt(dx * dx + dy * dy);

        let mouseRipple = 0;
        if (dist < 350) {
          const force = Math.pow((350 - dist) / 350, 2);
          mouseRipple = Math.sin(dist * 0.025 - timeOffset * 2) * 40 * force;
        }

        const r = baseRadius + deform + wave2 + wave3 + mouseRipple;
        points.push({
          x: cx + Math.cos(angle) * r,
          y: cy + Math.sin(angle) * r
        });
      }

      ctx.beginPath();
      catmullRomSpline(points, 0.5);
      ctx.closePath();
      ctx.strokeStyle = color;
      ctx.lineWidth = lineW;
      ctx.stroke();
    }

    /* ── Main render loop ── */
    function draw() {
      ctx.clearRect(0, 0, W, H);
      time += 0.008; // Very slow, dreamy motion

      // Smooth mouse lerp
      if (mouse.x === -9999) {
        mouse.x = mouse.tx;
        mouse.y = mouse.ty;
      } else {
        mouse.x += (mouse.tx - mouse.x) * 0.06;
        mouse.y += (mouse.ty - mouse.y) * 0.06;
      }

      // Scroll-based vertical offset so waves "move" as you scroll
      // This creates the illusion of waves existing in 3D space behind content
      const scrollOffset = scrollYPos * 0.3;

      // Focal centers — positioned across the FULL document space
      // Mapped to viewport coordinates by subtracting scrollOffset
      const centers = [
        {
          cx: -W * 0.15,
          cy: -H * 0.1 - scrollOffset * 0.5,
          color: [44, 62, 107],    // Deep navy
          opacity: 0.14,
          spacing: 80,
          startR: 80
        },
        {
          cx: W * 1.15,
          cy: H * 0.4 - scrollOffset * 0.3,
          color: [74, 111, 165],   // Steel blue
          opacity: 0.10,
          spacing: 90,
          startR: 100
        },
        {
          cx: W * 0.5,
          cy: H * 1.3 - scrollOffset * 0.2,
          color: [58, 90, 140],    // Ocean blue
          opacity: 0.09,
          spacing: 85,
          startR: 90
        },
        {
          cx: -W * 0.1,
          cy: H * 2.0 - scrollOffset * 0.35,
          color: [91, 123, 165],   // Slate blue
          opacity: 0.08,
          spacing: 95,
          startR: 110
        },
        {
          cx: W * 1.1,
          cy: H * 3.0 - scrollOffset * 0.25,
          color: [30, 77, 110],    // Petrol blue
          opacity: 0.08,
          spacing: 88,
          startR: 100
        }
      ];

      const maxDim = Math.max(W, H);

      centers.forEach((center, cIdx) => {
        const maxR = maxDim * 2.0;
        let ringIndex = 0;

        for (let r = center.startR; r < maxR; r += center.spacing) {
          // Fade opacity as rings expand outward
          const distFactor = 1 - (r / maxR) * 0.5;
          const alpha = center.opacity * distFactor;

          // Skip very faint rings for performance
          if (alpha < 0.01) continue;

          // Line width: thicker lines for visibility, with subtle variation
          const lw = 0.8 + Math.sin(ringIndex * 0.4) * 0.4;

          const colorStr = `rgba(${center.color[0]},${center.color[1]},${center.color[2]},${alpha.toFixed(4)})`;
          const tOff = time + ringIndex * 0.12 + cIdx * 3;

          drawContour(center.cx, center.cy, r, tOff, colorStr, lw);
          ringIndex++;
        }
      });

      requestAnimationFrame(draw);
    }

    draw();
  }

  /* ══════════════════════════════════════════════
     7. NAVIGATION
     ══════════════════════════════════════════════ */
  function navigation() {
    const nav = document.getElementById('nav');
    const hamburger = document.getElementById('hamburger');
    const mobileNav = document.getElementById('mobileNav');

    let ticking = false;
    window.addEventListener('scroll', () => {
      if (!ticking) {
        requestAnimationFrame(() => {
          nav.classList.toggle('scrolled', window.scrollY > 60);
          ticking = false;
        });
        ticking = true;
      }
    }, { passive: true });

    hamburger.addEventListener('click', () => {
      hamburger.classList.toggle('active');
      mobileNav.classList.toggle('open');
      document.body.style.overflow = mobileNav.classList.contains('open') ? 'hidden' : '';
    });

    mobileNav.querySelectorAll('a').forEach(a => {
      a.addEventListener('click', () => {
        hamburger.classList.remove('active');
        mobileNav.classList.remove('open');
        document.body.style.overflow = '';
      });
    });

    // Active nav highlighting — getBoundingClientRect for reliability
    const navLinks = document.querySelectorAll('.nav-link');
    const sectionIds = ['about', 'education', 'skills', 'projects', 'certs'];

    function updateActiveNav() {
      let activeId = '';
      const threshold = window.innerHeight * 0.4;

      for (const id of sectionIds) {
        const section = document.getElementById(id);
        if (!section) continue;
        const rect = section.getBoundingClientRect();
        if (rect.top <= threshold) {
          activeId = id;
        }
      }

      navLinks.forEach(link => {
        link.classList.toggle('active', link.getAttribute('href') === `#${activeId}`);
      });
    }

    let navTicking = false;
    window.addEventListener('scroll', () => {
      if (!navTicking) {
        requestAnimationFrame(() => {
          updateActiveNav();
          navTicking = false;
        });
        navTicking = true;
      }
    }, { passive: true });

    updateActiveNav();
  }

  /* ══════════════════════════════════════════════
     8. SCROLL REVEAL
     ══════════════════════════════════════════════ */
  function scrollReveal() {
    const els = document.querySelectorAll('.r:not(.skill-row):not(.cert-row):not(.proj-card), .r-left, .r-right, .r-scale');

    const observer = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('show');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.1, rootMargin: '0px 0px -80px 0px' });

    els.forEach(el => observer.observe(el));
  }

  /* ══════════════════════════════════════════════
     9. STAGGER CHILDREN ON SCROLL
     ══════════════════════════════════════════════ */
  function staggerReveal() {
    const groups = [
      { parent: '.skills-rows', children: '.skill-row' },
      { parent: '.certs-rows', children: '.cert-row' },
    ];

    groups.forEach(({ parent, children }) => {
      const container = document.querySelector(parent);
      if (!container) return;

      const items = container.querySelectorAll(children);

      const obs = new IntersectionObserver(entries => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            items.forEach((item, i) => {
              setTimeout(() => {
                item.classList.add('show');
              }, i * 120);
            });
            obs.unobserve(entry.target);
          }
        });
      }, { threshold: 0.1, rootMargin: '0px 0px -60px 0px' });

      obs.observe(container);
    });
  }

  /* ══════════════════════════════════════════════
     10. COUNTER ANIMATION
     ══════════════════════════════════════════════ */
  function counters() {
    const els = document.querySelectorAll('[data-target]');

    const obs = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          animateCount(entry.target);
          obs.unobserve(entry.target);
        }
      });
    }, { threshold: 0.6 });

    els.forEach(el => obs.observe(el));
  }

  function animateCount(el) {
    const target = parseInt(el.dataset.target, 10);
    const suffix = el.dataset.suffix || '';
    const dur = 2200;
    const start = performance.now();

    function step(now) {
      const t = Math.min((now - start) / dur, 1);
      const eased = 1 - Math.pow(2, -12 * t);
      el.textContent = Math.floor(eased * target) + suffix;

      if (t < 1) requestAnimationFrame(step);
      else el.textContent = target + suffix;
    }

    requestAnimationFrame(step);
  }

  /* ══════════════════════════════════════════════
     11. ABOUT TEXT — WORD-BY-WORD HIGHLIGHT
     ══════════════════════════════════════════════ */
  function wordHighlight() {
    const statement = document.querySelector('.about-statement');
    if (!statement) return;

    wrapWords(statement);

    const words = statement.querySelectorAll('.word');
    if (!words.length) return;

    words.forEach(w => w.classList.add('dim'));

    let ticking = false;

    window.addEventListener('scroll', () => {
      if (!ticking) {
        requestAnimationFrame(() => {
          const rect = statement.getBoundingClientRect();
          const vh = window.innerHeight;
          const start = vh * 0.85;
          const end = vh * 0.25;
          const progress = (start - rect.top) / (start - end + rect.height * 0.5);
          const clamped = Math.max(0, Math.min(1, progress));
          const litCount = Math.floor(clamped * words.length);

          words.forEach((w, i) => {
            if (i < litCount) {
              w.classList.add('lit');
              w.classList.remove('dim');
            } else {
              w.classList.remove('lit');
              w.classList.add('dim');
            }
          });

          ticking = false;
        });
        ticking = true;
      }
    }, { passive: true });
  }

  function wrapWords(el) {
    const walker = document.createTreeWalker(el, NodeFilter.SHOW_TEXT, null);
    const textNodes = [];

    while (walker.nextNode()) textNodes.push(walker.currentNode);

    textNodes.forEach(node => {
      const text = node.textContent;
      if (!text.trim()) return;

      const frag = document.createDocumentFragment();
      const parts = text.split(/(\s+)/);

      parts.forEach(part => {
        if (/^\s+$/.test(part)) {
          frag.appendChild(document.createTextNode(part));
        } else if (part) {
          const span = document.createElement('span');
          span.className = 'word';
          span.textContent = part;
          frag.appendChild(span);
        }
      });

      node.parentNode.replaceChild(frag, node);
    });
  }

  /* ══════════════════════════════════════════════
     12. MAGNETIC BUTTONS
     ══════════════════════════════════════════════ */
  function magneticButtons() {
    if (window.matchMedia('(pointer: coarse)').matches) return;

    const btns = document.querySelectorAll('.nav-cta-btn, .contact-link, .resume-btn');

    btns.forEach(btn => {
      btn.addEventListener('mousemove', e => {
        const rect = btn.getBoundingClientRect();
        const x = e.clientX - rect.left - rect.width / 2;
        const y = e.clientY - rect.top - rect.height / 2;
        btn.style.transform = `translate(${x * 0.2}px, ${y * 0.3}px)`;
      });

      btn.addEventListener('mouseleave', () => {
        btn.style.transform = '';
        btn.style.transition = 'transform 0.5s cubic-bezier(0.22, 1, 0.36, 1)';
        setTimeout(() => { btn.style.transition = ''; }, 500);
      });
    });
  }

  /* ══════════════════════════════════════════════
     13. ANCHOR SMOOTH SCROLL
     ══════════════════════════════════════════════ */
  function anchorScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(a => {
      a.addEventListener('click', e => {
        e.preventDefault();
        const target = document.querySelector(a.getAttribute('href'));
        if (!target) return;
        const y = target.getBoundingClientRect().top + window.scrollY - 80;
        window.scrollTo({ top: y, behavior: 'smooth' });
      });
    });
  }

  /* ══════════════════════════════════════════════
     14. CUSTOM CURSOR
     ══════════════════════════════════════════════ */
  function customCursor() {
    if (window.matchMedia('(pointer: coarse)').matches) return;

    const dot = document.getElementById('cursorDot');
    const ring = document.getElementById('cursorRing');
    if (!dot || !ring) return;

    let mouseX = -100, mouseY = -100;
    let ringX = -100, ringY = -100;

    document.addEventListener('mousemove', e => {
      mouseX = e.clientX;
      mouseY = e.clientY;
      dot.style.left = mouseX + 'px';
      dot.style.top = mouseY + 'px';
    });

    // Ring follows with lerp lag
    function animateRing() {
      ringX = lerp(ringX, mouseX, 0.15);
      ringY = lerp(ringY, mouseY, 0.15);
      ring.style.left = ringX + 'px';
      ring.style.top = ringY + 'px';
      requestAnimationFrame(animateRing);
    }
    animateRing();

    // Hover detection
    const hoverTargets = 'a, button, .proj-card, .skill-row, .cert-row, .about-item, .marquee-item, input, textarea';

    document.addEventListener('mouseover', e => {
      if (e.target.closest(hoverTargets)) {
        dot.classList.add('hovering');
        ring.classList.add('hovering');
      }
    });

    document.addEventListener('mouseout', e => {
      if (e.target.closest(hoverTargets)) {
        dot.classList.remove('hovering');
        ring.classList.remove('hovering');
      }
    });

    // Hide when mouse leaves window
    document.addEventListener('mouseleave', () => {
      dot.style.opacity = '0';
      ring.style.opacity = '0';
    });
    document.addEventListener('mouseenter', () => {
      dot.style.opacity = '1';
      ring.style.opacity = '0.4';
    });
  }

  /* ══════════════════════════════════════════════
     15. TEXT SCRAMBLE EFFECT
     ══════════════════════════════════════════════ */
  function textScramble() {
    if (window.matchMedia('(pointer: coarse)').matches) return;

    const chars = '!<>-_\\/[]{}—=+*^?#αβγδΣΔπ∑∂∫$£€¥';
    const targets = document.querySelectorAll('.proj-name, .section-heading');

    targets.forEach(el => {
      const originalHTML = el.innerHTML;
      const originalText = el.textContent;

      el.addEventListener('mouseenter', () => {
        let iteration = 0;
        const length = originalText.length;

        const interval = setInterval(() => {
          el.textContent = originalText
            .split('')
            .map((char, i) => {
              if (char === '\n' || char === ' ') return char;
              if (i < iteration) return originalText[i];
              return chars[Math.floor(Math.random() * chars.length)];
            })
            .join('');

          if (iteration >= length) {
            clearInterval(interval);
            el.innerHTML = originalHTML;
          }
          iteration += 1.5;
        }, 20);
      });
    });
  }

  /* ══════════════════════════════════════════════
     16. 3D TILT ON PROJECT CARDS
     ══════════════════════════════════════════════ */
  function tiltCards() {
    if (window.matchMedia('(pointer: coarse)').matches) return;

    const cards = document.querySelectorAll('.proj-card');

    cards.forEach(card => {
      const shine = card.querySelector('.proj-card-shine');

      card.addEventListener('mousemove', e => {
        const rect = card.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        const centerX = rect.width / 2;
        const centerY = rect.height / 2;

        const rotateX = (y - centerY) / centerY * -4;
        const rotateY = (x - centerX) / centerX * 4;

        card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale(1.02)`;

        if (shine) {
          shine.style.background = `radial-gradient(circle at ${x}px ${y}px, rgba(255,255,255,0.12), transparent 60%)`;
        }
      });

      card.addEventListener('mouseleave', () => {
        card.style.transform = '';
        card.style.transition = 'transform 0.6s cubic-bezier(0.22, 1, 0.36, 1)';
        if (shine) {
          shine.style.background = 'transparent';
        }
        setTimeout(() => { card.style.transition = ''; }, 600);
      });
    });
  }

  /* ══════════════════════════════════════════════
     17. SCROLL-TO-TOP BUTTON
     ══════════════════════════════════════════════ */
  function scrollToTop() {
    const btn = document.getElementById('scrollTopBtn');
    if (!btn) return;

    const progressCircle = btn.querySelector('.progress');
    const circumference = 2 * Math.PI * 20; // r=20

    btn.addEventListener('click', () => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });

    let ticking = false;

    window.addEventListener('scroll', () => {
      if (!ticking) {
        requestAnimationFrame(() => {
          const docHeight = document.documentElement.scrollHeight - window.innerHeight;
          const scrollPct = window.scrollY / docHeight;

          // Show/hide button
          btn.classList.toggle('visible', window.scrollY > window.innerHeight * 0.5);

          // Update progress ring
          if (progressCircle) {
            const offset = circumference - (scrollPct * circumference);
            progressCircle.style.strokeDashoffset = offset;
          }

          ticking = false;
        });
        ticking = true;
      }
    }, { passive: true });
  }

  /* ══════════════════════════════════════════════
     18. HORIZONTAL SCROLL — PROJECTS (Scroll & Slider Navigation)
     ══════════════════════════════════════════════ */
  function horizontalScroll() {
    const spacer = document.getElementById('hscrollSpacer');
    const track = document.getElementById('hscrollTrack');
    const prevBtn = document.getElementById('projPrevBtn');
    const nextBtn = document.getElementById('projNextBtn');
    if (!spacer || !track) return;

    const cards = track.querySelectorAll('.proj-card');
    const numCards = cards.length;
    let currentCardIndex = 0;

    function setHeight() {
      if (window.matchMedia('(max-width: 768px)').matches) {
        spacer.style.height = 'auto';
        track.style.transform = 'none';
        return;
      }
      const trackWidth = track.scrollWidth;
      const viewWidth = window.innerWidth;
      spacer.style.height = `${trackWidth - viewWidth + window.innerHeight}px`;
    }

    setHeight();
    window.addEventListener('resize', setHeight);

    let hTicking = false;

    window.addEventListener('scroll', () => {
      if (window.matchMedia('(max-width: 768px)').matches) return;
      if (!hTicking) {
        requestAnimationFrame(() => {
          const rect = spacer.getBoundingClientRect();
          const scrollDistance = spacer.offsetHeight - window.innerHeight;

          if (scrollDistance <= 0) {
            hTicking = false;
            return;
          }

          const progress = Math.max(0, Math.min(1, -rect.top / scrollDistance));
          const maxTranslate = track.scrollWidth - window.innerWidth;
          track.style.transform = `translateX(${-progress * maxTranslate}px)`;

          // Track current active card index for slider buttons based on scroll progress
          currentCardIndex = Math.round(progress * (numCards - 1));

          hTicking = false;
        });
        hTicking = true;
      }
    }, { passive: true });

    // Slider Buttons Functionality
    function scrollToCard(idx) {
      const rect = spacer.getBoundingClientRect();
      const sectionTop = window.scrollY + rect.top;
      const scrollDistance = spacer.offsetHeight - window.innerHeight;
      const targetProgress = idx / (numCards - 1);
      const targetScroll = sectionTop + targetProgress * scrollDistance + 5;

      window.scrollTo({
        top: targetScroll,
        behavior: 'smooth'
      });
      currentCardIndex = idx;
    }

    function slideMobile(idx) {
      if (numCards === 0) return;
      const cardWidth = cards[0].offsetWidth + 24; // Width + gap
      track.scrollTo({
        left: idx * cardWidth,
        behavior: 'smooth'
      });
      currentCardIndex = idx;
    }

    function goToCard(idx) {
      if (idx < 0 || idx >= numCards) return;
      if (window.matchMedia('(max-width: 768px)').matches) {
        slideMobile(idx);
      } else {
        scrollToCard(idx);
      }
    }

    if (prevBtn && nextBtn) {
      prevBtn.addEventListener('click', () => {
        goToCard(currentCardIndex - 1);
      });
      nextBtn.addEventListener('click', () => {
        goToCard(currentCardIndex + 1);
      });
    }

    // Keep active index updated when manual swiping occurs on mobile
    track.addEventListener('scroll', () => {
      if (!window.matchMedia('(max-width: 768px)').matches) return;
      if (numCards === 0) return;
      const cardWidth = cards[0].offsetWidth + 24;
      currentCardIndex = Math.round(track.scrollLeft / cardWidth);
    }, { passive: true });
  }

  /* ══════════════════════════════════════════════
     19. SECTION DIVIDERS
     ══════════════════════════════════════════════ */
  function sectionDividers() {
    const dividers = document.querySelectorAll('.section-divider');

    const obs = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('show');
          obs.unobserve(entry.target);
        }
      });
    }, { threshold: 0.5, rootMargin: '0px 0px -50px 0px' });

    dividers.forEach(d => obs.observe(d));
  }

})();
