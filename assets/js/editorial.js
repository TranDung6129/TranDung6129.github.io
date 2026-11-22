/* The Epistemic Diary — site behaviour (P3-01).
 * Theme switch (storage key "theme", data-theme="dark" on <html>, same as the pre-Phase-3 site),
 * mobile navigation, search over the per-language search.json, code-block copy buttons and
 * table-of-contents highlighting. No dependencies. */
(() => {
  const root = document.documentElement;
  const t = (key, fallback) => (window.EDITORIAL_I18N && window.EDITORIAL_I18N[key]) || fallback;

  // ---- Theme ----------------------------------------------------------------------------
  const themeButtons = document.querySelectorAll('[data-theme-toggle]');
  const isDark = () => root.dataset.theme === 'dark';
  function syncThemeButtons() {
    themeButtons.forEach(b => {
      b.setAttribute('aria-pressed', String(isDark()));
      b.setAttribute('aria-label', isDark() ? t('themeLight', 'Switch to light theme') : t('themeDark', 'Switch to dark theme'));
    });
    const meta = document.querySelector('meta[name="theme-color"]');
    if (meta) meta.setAttribute('content', isDark() ? '#1a1816' : '#f7f5f0');
  }
  function setTheme(dark) {
    if (dark) root.dataset.theme = 'dark'; else delete root.dataset.theme;
    try { localStorage.setItem('theme', dark ? 'dark' : 'light'); } catch (_) {}
    syncThemeButtons();
    document.dispatchEvent(new CustomEvent('editorial:themechange', { detail: { dark } }));
  }
  themeButtons.forEach(b => b.addEventListener('click', () => setTheme(!isDark())));
  syncThemeButtons();

  // ---- Navigation -----------------------------------------------------------------------
  const menu = document.querySelector('.menu-toggle');
  const nav = document.getElementById('site-nav');
  function setMenu(open) {
    if (!menu || !nav) return;
    menu.setAttribute('aria-expanded', String(open));
    nav.classList.toggle('is-open', open);
  }
  if (menu && nav) {
    menu.addEventListener('click', () => setMenu(menu.getAttribute('aria-expanded') !== 'true'));
    nav.addEventListener('click', e => { if (e.target.closest('a')) setMenu(false); });
  }

  // ---- Search ---------------------------------------------------------------------------
  const toggle = document.querySelector('.search-toggle');
  const panel = document.getElementById('search-panel');
  const input = document.getElementById('site-search');
  const status = panel && panel.querySelector('.search-status');
  const list = panel && panel.querySelector('.search-results');
  const fold = s => String(s || '').normalize('NFD').replace(/[̀-ͯ]/g, '').replace(/đ/g, 'd').replace(/Đ/g, 'D').toLowerCase();
  function closeSearch(returnFocus) {
    if (!panel || panel.hidden) return;
    panel.hidden = true;
    toggle.setAttribute('aria-expanded', 'false');
    if (returnFocus) toggle.focus();
  }
  document.addEventListener('keydown', e => {
    if (e.key !== 'Escape') return;
    if (panel && !panel.hidden) closeSearch(true);
    else if (menu && menu.getAttribute('aria-expanded') === 'true') { setMenu(false); menu.focus(); }
  });
  if (toggle && panel && input) {
    toggle.addEventListener('click', () => {
      const opening = panel.hidden;
      panel.hidden = !opening;
      toggle.setAttribute('aria-expanded', String(opening));
      if (opening) input.focus();
    });
    let index; let request = 0;
    async function loadIndex() {
      if (index) return index;
      const response = await fetch(panel.dataset.index);
      if (!response.ok) throw new Error('search index ' + response.status);
      const seen = new Map();
      for (const item of await response.json()) {
        const key = item.uri;
        const entry = seen.get(key) || { uri: item.uri, title: item.title, date: item.date, content: '' };
        entry.content += ' ' + (item.content || '');
        seen.set(key, entry);
      }
      index = [...seen.values()].map(e => ({ ...e, ft: fold(e.title), fc: fold(e.content) }));
      return index;
    }
    function snippet(text, query) {
      const plain = String(text || '').replace(/\s+/g, ' ').trim();
      const at = fold(plain).indexOf(query);
      if (at < 0) return plain.slice(0, 140);
      const start = Math.max(0, at - 50);
      return (start ? '… ' : '') + plain.slice(start, start + 160) + '…';
    }
    input.addEventListener('input', async () => {
      const current = ++request;
      const query = fold(input.value.trim());
      list.replaceChildren();
      if (query.length < 2) { status.textContent = t('searchHint', 'Type at least two characters.'); return; }
      try {
        const items = await loadIndex();
        if (current !== request) return;
        const hits = items.filter(i => i.ft.includes(query) || i.fc.includes(query))
          .sort((a, b) => Number(b.ft.includes(query)) - Number(a.ft.includes(query))).slice(0, 8);
        for (const hit of hits) {
          const li = document.createElement('li');
          const a = document.createElement('a');
          a.href = new URL(hit.uri, location.origin).pathname;
          a.textContent = hit.title;
          const p = document.createElement('p');
          p.textContent = snippet(hit.content, query);
          li.append(a, p);
          list.append(li);
        }
        status.textContent = hits.length ? t('searchFound', '{n} articles found.').replace('{n}', hits.length) : t('searchNone', 'No articles found.');
      } catch (_) {
        if (current === request) status.textContent = t('searchError', 'Search is unavailable right now.');
      }
    });
  }

  // ---- Code blocks: copy button -------------------------------------------------------------
  document.querySelectorAll('.prose .highlight').forEach(block => {
    const code = block.querySelector('code[data-lang]') || block.querySelector('td:last-child code') || block.querySelector('pre code');
    if (!code) return;
    const bar = document.createElement('div');
    bar.className = 'code-bar';
    const lang = document.createElement('span');
    lang.textContent = code.dataset.lang || 'code';
    const button = document.createElement('button');
    button.type = 'button';
    button.className = 'code-copy';
    button.textContent = t('copy', 'Copy');
    button.setAttribute('aria-label', t('copyLabel', 'Copy code to clipboard'));
    button.addEventListener('click', async () => {
      try {
        await navigator.clipboard.writeText(code.innerText.replace(/\n$/, ''));
        button.textContent = t('copied', 'Copied');
      } catch (_) {
        button.textContent = t('copyFailed', 'Copy failed');
      }
      setTimeout(() => { button.textContent = t('copy', 'Copy'); }, 1800);
    });
    bar.append(lang, button);
    block.prepend(bar);
  });

  // ---- D1 table of contents and article-only progress ---------------------------------------
  // Hugo keeps the source heading tree/anchors authoritative. We add controls around its nested
  // list at runtime, so every heading link remains usable if script is unavailable.
  const toc = document.querySelector('.d1-article .toc');
  const tocLinks = [...document.querySelectorAll('.d1-article .toc a[href^="#"]')];
  const setOpen = (section, open, manual = false) => {
    if (!section) return;
    const list = section.querySelector(':scope > ul');
    const button = section.querySelector(':scope > .toc-toggle');
    if (!list || !button) return;
    list.hidden = !open;
    button.setAttribute('aria-expanded', String(open));
    if (manual) section.dataset.manual = 'true';
  };
  if (toc) {
    [...toc.querySelectorAll('nav > ul > li')].forEach((section, index) => {
      const nested = section.querySelector(':scope > ul');
      const anchor = section.querySelector(':scope > a');
      if (!nested || !anchor) return;
      section.classList.add('toc-section');
      const button = document.createElement('button');
      button.type = 'button'; button.className = 'toc-toggle';
      button.setAttribute('aria-label', `Toggle subsections for ${anchor.textContent.trim()}`);
      button.setAttribute('aria-expanded', String(index === 0));
      button.textContent = '⌄';
      nested.hidden = index !== 0;
      button.addEventListener('click', () => setOpen(section, nested.hidden, true));
      anchor.insertAdjacentElement('afterend', button);
    });
  }
  // Active heading = the last one whose top has passed 30% of the viewport, recomputed on scroll
  // so it is right in both directions and after a deep link. Its section opens and the other
  // sections fold away again, unless the reader toggled a section by hand (data-manual), which
  // is then left as the reader set it.
  if (toc && tocLinks.length) {
    const targets = tocLinks
      .map(a => ({ a, el: document.getElementById(decodeURIComponent(a.getAttribute('href').slice(1))) }))
      .filter(t => t.el);
    const sections = [...toc.querySelectorAll('.toc-section')];
    let current = null, queued = false;
    const keepVisible = link => {
      const box = toc.getBoundingClientRect(), r = link.getBoundingClientRect();
      if (r.top < box.top + 24) toc.scrollTop -= box.top + 24 - r.top;
      else if (r.bottom > box.bottom - 24) toc.scrollTop += r.bottom - box.bottom + 24;
    };
    const updateActive = () => {
      queued = false;
      const line = window.innerHeight * 0.3;
      let active = null;
      for (const t of targets) { if (t.el.getBoundingClientRect().top <= line) active = t; else break; }
      const link = active ? active.a : null;
      if (link === current) return;
      current = link;
      tocLinks.forEach(a => a.removeAttribute('aria-current'));
      if (!link) return;
      link.setAttribute('aria-current', 'location');
      const own = link.closest('.toc-section');
      sections.forEach(section => { if (!section.dataset.manual) setOpen(section, section === own); });
      if (toc.scrollHeight > toc.clientHeight) keepVisible(link);
    };
    const queue = () => { if (!queued) { queued = true; requestAnimationFrame(updateActive); } };
    addEventListener('scroll', queue, { passive: true });
    addEventListener('resize', queue, { passive: true });
    addEventListener('hashchange', queue);
    updateActive();
  }
  const prose = document.querySelector('.d1-article .prose');
  const progress = document.querySelector('.d1-article .reading-progress');
  if (prose && progress) {
    const fill = progress.querySelector('span');
    const updateProgress = () => {
      const start = prose.getBoundingClientRect().top + window.scrollY;
      const end = start + prose.offsetHeight - window.innerHeight;
      const value = end <= start ? 100 : Math.max(0, Math.min(100, ((window.scrollY - start) / (end - start)) * 100));
      progress.setAttribute('aria-valuenow', String(Math.round(value)));
      if (fill) fill.style.width = `${value}%`;
    };
    addEventListener('scroll', updateProgress, { passive: true });
    addEventListener('resize', updateProgress, { passive: true });
    updateProgress();
  }
})();
