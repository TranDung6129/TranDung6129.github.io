// D3 prototype behaviour (merged into assets/js/editorial.js on implementation).
(() => {
  const root = document.documentElement;
  // Sidenotes: fold behind their number on narrow screens; in the margin on wide ones.
  const notes = [...document.querySelectorAll('.sn')];
  if (notes.length) {
    root.classList.add('sn-ready');
    const wide = matchMedia('(min-width: 1240px)');
    const sync = () => notes.forEach(n => { const b = n.querySelector('.sn-mark'); b.setAttribute('aria-expanded', String(wide.matches || n.classList.contains('is-open'))); });
    notes.forEach(n => n.querySelector('.sn-mark').addEventListener('click', () => { if (wide.matches) return; n.classList.toggle('is-open'); sync(); }));
    wide.addEventListener('change', sync); sync();
  }
  // Citation preview: the full reference appears near the citation on hover or keyboard focus.
  // It is visual only (aria-hidden); activating the link goes to the full entry, which links back.
  // Focus via Tab scrolls the page, so the card follows its citation on scroll instead of closing.
  let card = null, anchor = null;
  const place = () => {
    if (!card || !anchor) return;
    const r = anchor.getBoundingClientRect(), w = card.offsetWidth;
    card.style.left = `${Math.max(16, Math.min(scrollX + r.left, scrollX + innerWidth - w - 16))}px`;
    card.style.top = `${scrollY + r.bottom + 8}px`;
  };
  const hide = () => { if (card) card.remove(); card = null; anchor = null; };
  const show = a => {
    hide();
    const entry = document.getElementById(a.getAttribute('href').slice(1));
    if (!entry) return;
    card = document.createElement('div'); card.className = 'cite-preview'; card.setAttribute('aria-hidden', 'true');
    card.innerHTML = entry.querySelector('.ref-text').innerHTML;
    document.body.append(card); anchor = a; place();
  };
  document.querySelectorAll('a.cite').forEach(a => {
    a.addEventListener('mouseenter', () => show(a)); a.addEventListener('focus', () => show(a));
    a.addEventListener('mouseleave', () => { if (document.activeElement !== a) hide(); }); a.addEventListener('blur', hide);
  });
  addEventListener('keydown', e => { if (e.key === 'Escape') hide(); });
  addEventListener('scroll', place, { passive: true });
  addEventListener('resize', place, { passive: true });
})();
