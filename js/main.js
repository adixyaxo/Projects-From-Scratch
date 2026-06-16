/* ═══════════════════════════════════════════
   Minimal interactions — no animated grain
═══════════════════════════════════════════ */

(function initIssueDate() {
  const el = document.getElementById('issue-date');
  if (!el) return;
  const now = new Date();
  const months = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
  el.textContent = `Vol. I · ${months[now.getMonth()]} ${now.getFullYear()}`;
})();


(function initScrollReveal() {
  const cells = document.querySelectorAll('.cell');
  if (!cells.length) return;

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.06, rootMargin: '0px 0px -32px 0px' }
  );

  cells.forEach((cell, i) => {
    cell.style.transitionDelay = `${Math.min(i * 0.04, 0.32)}s`;
    observer.observe(cell);
  });
})();


(function initSmoothScroll() {
  document.querySelectorAll('a[href^="#"]').forEach((link) => {
    link.addEventListener('click', (e) => {
      const href = link.getAttribute('href');
      if (!href || href === '#') return;
      const target = document.querySelector(href);
      if (target) {
        e.preventDefault();
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    });
  });
})();


(function updateYear() {
  const el = document.getElementById('current-year');
  if (el) el.textContent = `© ${new Date().getFullYear()}`;
})();

/* Scroll minimap rail — lines + L-shaped cursor */
(function initScrollRail() {
  const rail = document.querySelector('.scroll-rail');
  const linesEl = document.getElementById('scroll-rail-lines');
  const indicator = document.querySelector('.scroll-rail__indicator');
  if (!rail || !linesEl || !indicator) return;

  const LINE_COUNT = 36;
  const widths = [88, 62, 74, 48, 92, 55, 70, 40, 85, 58, 78, 45, 90, 52, 68, 38, 82, 60, 75, 44, 88, 56, 72, 42, 86, 64, 76, 50, 94, 54, 66, 46, 80, 59, 73, 41];

  widths.slice(0, LINE_COUNT).forEach((w, i) => {
    const line = document.createElement('span');
    line.className = 'scroll-rail__line';
    const indent = (i % 5 === 2 || i % 7 === 4) ? 8 : (i % 4 === 1 ? 4 : 0);
    line.style.width = `${w}%`;
    line.style.marginLeft = `${indent}px`;
    linesEl.appendChild(line);
  });

  const lines = linesEl.querySelectorAll('.scroll-rail__line');
  let raf = 0;
  let scrollTimer = 0;
  let lastScrollTop = 0;

  function setRailGlass(intensity) {
    const blur = 12 + intensity * 12;
    const opacity = 0.46 + intensity * 0.18;
    rail.style.setProperty('--rail-blur', `${blur.toFixed(1)}px`);
    rail.style.setProperty('--rail-opacity', opacity.toFixed(2));
    rail.classList.toggle('is-scrolling', intensity > 0.15);
  }

  function update() {
    raf = 0;

    const doc = document.documentElement;
    const maxScroll = Math.max(1, doc.scrollHeight - doc.clientHeight);
    const progress = Math.min(1, Math.max(0, doc.scrollTop / maxScroll));
    const velocity = Math.abs(doc.scrollTop - lastScrollTop);
    lastScrollTop = doc.scrollTop;

    setRailGlass(Math.min(1, velocity / 24));

    clearTimeout(scrollTimer);
    scrollTimer = setTimeout(() => setRailGlass(0), 180);

    const idx = Math.round(progress * (lines.length - 1));
    const line = lines[idx];
    if (!line) return;

    const lineRect = line.getBoundingClientRect();
    const railRect = rail.getBoundingClientRect();
    const y = lineRect.top - railRect.top + lineRect.height / 2;
    const highlight = indicator.querySelector('.scroll-rail__highlight');

    indicator.style.top = `${y}px`;
    highlight.style.width = line.style.width;
    highlight.style.marginLeft = line.style.marginLeft || '0';
  }

  function schedule() {
    if (raf) return;
    raf = requestAnimationFrame(update);
  }

  window.addEventListener('scroll', schedule, { passive: true });
  window.addEventListener('resize', schedule);
  schedule();
})();


document.addEventListener('DOMContentLoaded', () => {
  document.body.classList.add('js-ready');
});

/* ═══════════════════════════════════════════
   MAGNETIC ELEMENTS
═══════════════════════════════════════════ */
(function initMagnetic() {
  const magnets = document.querySelectorAll('.btn-pill, .masthead-links a, .link-minimal');
  
  magnets.forEach((magnet) => {
    magnet.addEventListener('mousemove', (e) => {
      const position = magnet.getBoundingClientRect();
      const x = e.clientX - position.left - position.width / 2;
      const y = e.clientY - position.top - position.height / 2;
      
      magnet.style.transform = `translate(${x * 0.25}px, ${y * 0.25}px)`;
      magnet.style.transition = 'none';
    });
    
    magnet.addEventListener('mouseleave', () => {
      magnet.style.transform = 'translate(0px, 0px)';
      magnet.style.transition = 'transform 0.5s cubic-bezier(0.25, 1, 0.5, 1)';
    });
  });
})();

/* ═══════════════════════════════════════════
   REALISTIC 3D CELL TILT
═══════════════════════════════════════════ */
(function init3DTilt() {
  const cells = document.querySelectorAll('.cell');
  
  cells.forEach(cell => {
    if (window.matchMedia('(hover: hover)').matches) {
      let rafId;
      let isHovering = false;
      let targetX = 0, targetY = 0;
      let currentX = 0, currentY = 0;

      function updateTilt() {
        if (!isHovering) return;
        
        // Smooth interpolation (lerp)
        currentX += (targetX - currentX) * 0.15;
        currentY += (targetY - currentY) * 0.15;

        cell.style.transform = `perspective(1400px) scale3d(1.02, 1.02, 1.02) rotateX(${currentX}deg) rotateY(${currentY}deg)`;
        rafId = requestAnimationFrame(updateTilt);
      }

      cell.addEventListener('mouseenter', () => {
        isHovering = true;
        cell.style.transition = 'box-shadow 0.4s ease, z-index 0s';
        updateTilt();
      });

      cell.addEventListener('mousemove', (e) => {
        const rect = cell.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        
        const centerX = rect.width / 2;
        const centerY = rect.height / 2;
        
        targetX = ((y - centerY) / centerY) * -4;
        targetY = ((x - centerX) / centerX) * 4;
      });

      cell.addEventListener('mouseleave', () => {
        isHovering = false;
        cancelAnimationFrame(rafId);
        currentX = 0;
        currentY = 0;
        cell.style.transform = ''; 
        cell.style.transition = 'transform 0.5s cubic-bezier(0.25, 1, 0.5, 1), box-shadow 0.4s ease, z-index 0s';
      });
    }
  });
})();
