// ScrollSpy for the table of contents (desktop sidebar + mobile <details>).
const headings = Array.from(
  document.querySelectorAll<HTMLElement>('.prose h2[id], .prose h3[id]'),
);
const links = Array.from(document.querySelectorAll<HTMLAnchorElement>('.toc-link'));

if (headings.length && links.length) {
  const byId = new Map<string, HTMLAnchorElement[]>();
  for (const a of links) {
    const id = decodeURIComponent((a.getAttribute('href') || '').replace(/^#/, ''));
    if (!id) continue;
    byId.set(id, [...(byId.get(id) || []), a]);
  }

  let current = '';
  const setActive = (id: string) => {
    if (id === current) return;
    current = id;
    for (const a of links) {
      const on = decodeURIComponent((a.getAttribute('href') || '').slice(1)) === id;
      a.classList.toggle('is-active', on);
      if (on) a.setAttribute('aria-current', 'true');
      else a.removeAttribute('aria-current');
    }
    // keep active item visible inside the sidebar scroller without scrolling the page
    const a = byId.get(id)?.find((el) => el.offsetParent !== null);
    const box = a?.closest<HTMLElement>('.sidebar-scroll');
    if (a && box) {
      const ar = a.getBoundingClientRect();
      const br = box.getBoundingClientRect();
      if (ar.top < br.top + 8 || ar.bottom > br.bottom - 8) {
        box.scrollTo({
          top: box.scrollTop + (ar.top - br.top) - box.clientHeight / 3,
          behavior: 'auto',
        });
      }
    }
  };

  const visible = new Set<string>();
  const lastHeadingId = headings[headings.length - 1].id;
  const update = () => {
    // at the very bottom, the last heading wins (short tail sections never reach the top band)
    if (window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - 4) {
      setActive(lastHeadingId);
      return;
    }
    const first = headings.find((h) => visible.has(h.id));
    if (first) {
      setActive(first.id);
      return;
    }
    // none in band: pick last heading above the viewport top; before the first heading, default to the first item
    let last = headings[0].id;
    for (const h of headings) {
      if (h.getBoundingClientRect().top < 120) last = h.id;
    }
    setActive(last);
  };
  const observer = new IntersectionObserver(
    (entries) => {
      for (const e of entries) {
        if (e.isIntersecting) visible.add(e.target.id);
        else visible.delete(e.target.id);
      }
      update();
    },
    { rootMargin: '-88px 0px -65% 0px', threshold: 0 },
  );
  headings.forEach((h) => observer.observe(h));
  window.addEventListener('scroll', update, { passive: true });
  update();

  for (const a of links) {
    a.addEventListener('click', () => {
      const d = a.closest('details');
      if (d) d.open = false;
      const id = decodeURIComponent((a.getAttribute('href') || '').slice(1));
      if (id) setActive(id);
    });
  }
}
