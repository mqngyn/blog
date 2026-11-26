// Client-side Mermaid rendering. Loaded only when a `pre.mermaid` exists.
type MermaidApi = typeof import('mermaid').default;

let mermaidPromise: Promise<MermaidApi> | null = null;
let queue: Promise<void> = Promise.resolve();
let counter = 0;

const currentTheme = () => (document.documentElement.dataset.theme === 'dark' ? 'dark' : 'default');
const nodes = () => Array.from(document.querySelectorAll<HTMLElement>('pre.mermaid'));

function loadMermaid(): Promise<MermaidApi> {
  mermaidPromise ??= import('mermaid').then((m) => m.default);
  return mermaidPromise;
}

async function renderAll() {
  const list = nodes();
  if (!list.length) return;
  const mermaid = await loadMermaid();
  mermaid.initialize({
    startOnLoad: false,
    securityLevel: 'strict',
    theme: currentTheme(),
    fontFamily: '"Inter Variable", Inter, system-ui, sans-serif',
  });

  for (const node of list) {
    const src = node.dataset.mermaidSrc ?? node.textContent ?? '';
    // restore the source first so a failed render still shows readable text
    node.textContent = src;
    node.classList.remove('mermaid-error');
    node.removeAttribute('data-processed');
    try {
      const { svg } = await mermaid.render(`mermaid-svg-${++counter}`, src);
      node.innerHTML = svg;
      node.dataset.rendered = 'true';
      node.setAttribute('data-processed', 'true');
    } catch (err) {
      console.error('[mermaid] render failed', err);
      node.textContent = src;
      node.classList.add('mermaid-error');
      delete node.dataset.rendered;
      node.setAttribute('data-processed', 'true');
    }
  }
}

// Serialize renders: a theme change during a render waits for it, then re-renders once.
let pending = false;
function schedule() {
  if (pending) return;
  pending = true;
  queue = queue
    .then(() => {
      pending = false;
      return renderAll();
    })
    .catch((err) => {
      pending = false;
      console.error('[mermaid]', err);
    });
}

if (nodes().length) {
  schedule();
  window.addEventListener('themechange', schedule);
}
