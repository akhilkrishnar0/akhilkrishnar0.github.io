/* Tiny enhancements only: the website works without JavaScript. */
(() => {
  const themeButton = document.getElementById('theme-toggle');
  const themeLabel = document.getElementById('theme-label');
  const saveTheme = (theme) => { try { localStorage.setItem('akhil-site-theme', theme); } catch (_) {} };
  const getTheme = () => { try { return localStorage.getItem('akhil-site-theme'); } catch (_) { return null; } };
  function applyTheme(dark) {
    document.body.classList.toggle('dark', dark);
    themeButton?.setAttribute('aria-pressed', String(dark));
    themeButton?.setAttribute('aria-label', dark ? 'Switch to light theme' : 'Switch to dark theme');
    if (themeLabel) themeLabel.textContent = dark ? 'Light mode' : 'Dark mode';
    if (themeButton?.firstElementChild) themeButton.firstElementChild.textContent = dark ? '☀' : '☾';
    document.querySelector('meta[name="theme-color"]')?.setAttribute('content', dark ? '#101b23' : '#f6f8fa');
  }
  const saved = getTheme();
  applyTheme(saved ? saved === 'dark' : window.matchMedia?.('(prefers-color-scheme: dark)').matches);
  themeButton?.addEventListener('click', () => {
    const dark = !document.body.classList.contains('dark');
    applyTheme(dark);
    saveTheme(dark ? 'dark' : 'light');
  });
  const year = document.getElementById('year');
  if (year) year.textContent = new Date().getFullYear();
  const links = [...document.querySelectorAll('.nav-link')];
  if ('IntersectionObserver' in window) {
    const observer = new IntersectionObserver((entries) => {
      const visible = entries.filter(e => e.isIntersecting).sort((a,b) => b.intersectionRatio-a.intersectionRatio);
      if (visible.length) {
        links.forEach(a => {
          const active = a.getAttribute('href') === `#${visible[0].target.id}`;
          a.classList.toggle('active', active);
          if (active) a.setAttribute('aria-current', 'location'); else a.removeAttribute('aria-current');
        });
      }
    }, {rootMargin:'-18% 0px -55% 0px', threshold:[0,.15,.35]});
    document.querySelectorAll('.anchor-section').forEach(el => observer.observe(el));
  }
})();
