/* ============================================
   刘洋 · 作品集  —  交互脚本
   ============================================ */

(function () {
  'use strict';

  /* ---------- 导航栏滚动状态 ---------- */
  const nav = document.getElementById('nav');
  let ticking = false;

  function onScroll() {
    if (!ticking) {
      window.requestAnimationFrame(() => {
        if (window.scrollY > 40) nav.classList.add('scrolled');
        else nav.classList.remove('scrolled');
        ticking = false;
      });
      ticking = true;
    }
  }
  window.addEventListener('scroll', onScroll, { passive: true });

  /* ---------- 滚动渐入 ---------- */
  const reveals = document.querySelectorAll('.reveal');
  // 把 data-delay 写入 CSS 变量
  reveals.forEach(el => {
    const d = el.getAttribute('data-delay');
    if (d) el.style.setProperty('--d', d + 'ms');
  });

  const io = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('in');
        io.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12, rootMargin: '0px 0px -8% 0px' });

  reveals.forEach(el => io.observe(el));

  /* ---------- Hero 文字逐行入场 ---------- */
  const heroLines = document.querySelectorAll('.hero-title .line');
  heroLines.forEach((line, i) => {
    line.style.transition = 'opacity 1s ease, transform 1s cubic-bezier(.2,.7,.2,1)';
    line.style.transitionDelay = (180 + i * 160) + 'ms';
    line.style.opacity = '0';
    line.style.transform = 'translateY(40%)';
  });
  window.addEventListener('load', () => {
    requestAnimationFrame(() => {
      heroLines.forEach(line => {
        line.style.opacity = '1';
        line.style.transform = 'none';
      });
    });
  });

  /* ---------- 项目轮播(通用,支持多个) ---------- */
  const carousels = document.querySelectorAll('.carousel');
  carousels.forEach(carousel => {
    const slides = carousel.querySelectorAll('.carousel-slide');
    const dots = carousel.querySelectorAll('.carousel-dot');
    if (slides.length === 0) return;
    let current = 0;
    let timer = null;

    function show(idx) {
      slides.forEach((s, i) => s.classList.toggle('active', i === idx));
      dots.forEach((d, i) => d.classList.toggle('active', i === idx));
      current = idx;
    }
    function next() {
      show((current + 1) % slides.length);
    }
    function startAuto() {
      stopAuto();
      timer = setInterval(next, 2500);
    }
    function stopAuto() {
      if (timer) { clearInterval(timer); timer = null; }
    }
    dots.forEach(dot => {
      dot.addEventListener('click', () => {
        const idx = parseInt(dot.getAttribute('data-slide'), 10);
        show(idx);
        startAuto();
      });
    });
    const carIO = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) startAuto();
        else stopAuto();
      });
    }, { threshold: 0.3 });
    carIO.observe(carousel);
    carousel.addEventListener('mouseenter', stopAuto);
    carousel.addEventListener('mouseleave', startAuto);
  });

  /* ---------- 平滑滚动(修正导航高度偏移) ---------- */
  document.querySelectorAll('a[href^="#"]').forEach(link => {
    link.addEventListener('click', (e) => {
      const id = link.getAttribute('href');
      if (id.length <= 1) return;
      const target = document.querySelector(id);
      if (!target) return;
      e.preventDefault();
      const top = target.getBoundingClientRect().top + window.scrollY - 60;
      window.scrollTo({ top, behavior: 'smooth' });
    });
  });

  /* ---------- 当前年份 ---------- */
  // 已在 HTML 中硬编码 2026,无需替换

})();
