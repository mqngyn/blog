// Client-side search + tag filter for the Posts / tag archive lists.
interface IndexItem { id: string; title: string; description: string; category: string; tags: string[]; body: string }

const norm = (s: string) =>
  s.normalize('NFD').replace(/[̀-ͯ]/g, '').replace(/đ/g, 'd').replace(/Đ/g, 'D').toLowerCase();

const root = document.querySelector<HTMLElement>('[data-post-search]');
const input = root?.querySelector<HTMLInputElement>('[data-search-input]');
const select = root?.querySelector<HTMLSelectElement>('[data-tag-select]');
const live = root?.querySelector<HTMLElement>('[data-live]');
const cards = Array.from(document.querySelectorAll<HTMLElement>('.post-card'));
const emptyBox = document.querySelector<HTMLElement>('[data-empty]');
const clearBtn = document.querySelector<HTMLElement>('[data-clear]');

if (root && input && select) {
  // Per-card haystack from visible data (instant), content added after index loads.
  const base = new Map<string, string>();
  for (const c of cards) {
    const text = [
      c.querySelector('h2, h3')?.textContent,
      c.querySelector('p')?.textContent,
      c.dataset.tags,
      c.dataset.category,
      c.textContent,
    ].join(' ');
    base.set(c.dataset.postId || '', norm(text));
  }
  const full = new Map<string, string>();
  let loading: Promise<void> | null = null;
  const loadIndex = () => {
    if (loading) return loading;
    const url = root.dataset.searchUrl;
    loading = url
      ? fetch(url)
          .then((r) => (r.ok ? (r.json() as Promise<IndexItem[]>) : []))
          .then((items) => {
            for (const it of items) {
              full.set(it.id, norm([it.title, it.description, it.category, it.tags.join(' '), it.body].join(' ')));
            }
            apply(false);
          })
          .catch(() => {})
      : Promise.resolve();
    return loading;
  };

  const syncUrl = () => {
    const p = new URLSearchParams();
    if (input.value.trim()) p.set('q', input.value.trim());
    if (select.value) p.set('tag', select.value);
    const qs = p.toString();
    history.replaceState(null, '', location.pathname + (qs ? '?' + qs : '') + location.hash);
  };

  function apply(updateUrl = true) {
    const terms = norm(input.value).split(/\s+/).filter(Boolean);
    const tag = select.value;
    let shown = 0;
    for (const c of cards) {
      const id = c.dataset.postId || '';
      const hay = (full.get(id) ?? '') + ' ' + (base.get(id) ?? '');
      const okText = terms.every((t) => hay.includes(t));
      const slugs = (c.dataset.tags || '').split(' ').filter(Boolean);
      const okTag = !tag || slugs.includes(tag) || c.dataset.category === tag;
      const show = okText && okTag;
      c.hidden = !show;
      // keep wrapper (li) in sync if cards are wrapped
      const wrap = c.closest<HTMLElement>('[data-card-wrap]');
      if (wrap) wrap.hidden = !show;
      if (show) shown++;
    }
    if (emptyBox) emptyBox.hidden = shown !== 0;
    if (live) {
      live.textContent = terms.length || tag ? `${shown} ${shown === 1 ? 'post' : 'posts'} found` : '';
    }
    if (updateUrl) syncUrl();
  }

  const clearAll = () => {
    input.value = '';
    select.value = '';
    apply();
    input.focus();
  };

  input.addEventListener('focus', () => void loadIndex(), { once: true });
  input.addEventListener('input', () => {
    void loadIndex();
    apply();
  });
  select.addEventListener('change', () => apply());
  clearBtn?.addEventListener('click', clearAll);

  document.addEventListener('keydown', (e) => {
    const t = e.target as HTMLElement | null;
    const typing = !!t && (t.tagName === 'INPUT' || t.tagName === 'TEXTAREA' || t.tagName === 'SELECT' || t.isContentEditable);
    if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') {
      e.preventDefault();
      input.focus();
      input.select();
    } else if (e.key === '/' && !typing && !e.ctrlKey && !e.metaKey && !e.altKey) {
      e.preventDefault();
      input.focus();
    }
  });
  input.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      if (input.value) {
        input.value = '';
        apply();
      } else {
        input.blur();
      }
    }
  });

  // Initial state from URL (?q=&tag=)
  const params = new URLSearchParams(location.search);
  const q = params.get('q');
  const tag = params.get('tag');
  if (q) input.value = q;
  if (tag) {
    select.value = tag;
    if (select.value !== tag) {
      // tag not in dropdown (e.g. unknown): add so the state is visible
      const o = document.createElement('option');
      o.value = tag;
      o.textContent = tag;
      select.appendChild(o);
      select.value = tag;
    }
  }
  if (q || tag) {
    apply(false);
    if (q) void loadIndex();
  }
}
