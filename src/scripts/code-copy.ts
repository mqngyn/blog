// Copy-to-clipboard for `.code-copy` buttons (event delegation, no deps).
const CHECK_ICON =
  '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M20 6 9 17l-5-5"/></svg>';

let liveRegion: HTMLElement | null = null;
const timers = new WeakMap<HTMLElement, number>();

function announce(message: string) {
  if (!liveRegion) {
    liveRegion = document.createElement('span');
    liveRegion.className = 'sr-only';
    liveRegion.setAttribute('aria-live', 'polite');
    liveRegion.setAttribute('role', 'status');
    document.body.appendChild(liveRegion);
  }
  liveRegion.textContent = '';
  // re-set on next frame so repeated identical messages are announced
  requestAnimationFrame(() => {
    if (liveRegion) liveRegion.textContent = message;
  });
}

async function writeClipboard(text: string): Promise<boolean> {
  try {
    if (navigator.clipboard?.writeText) {
      await navigator.clipboard.writeText(text);
      return true;
    }
  } catch {
    /* fall through to legacy path */
  }
  const ta = document.createElement('textarea');
  ta.value = text;
  ta.setAttribute('readonly', '');
  ta.style.cssText = 'position:fixed;top:0;left:0;opacity:0;';
  document.body.appendChild(ta);
  ta.select();
  let ok = false;
  try {
    ok = document.execCommand('copy');
  } catch {
    ok = false;
  }
  ta.remove();
  return ok;
}

document.addEventListener('click', async (event) => {
  const target = event.target as Element | null;
  const button = target?.closest<HTMLButtonElement>('.code-copy');
  if (!button) return;
  const block = button.closest('.code-block');
  const code = block?.querySelector('pre code');
  if (!code) return;

  // textContent keeps the real newlines between .line spans (innerText can double them
  // when lines are display:block).
  const text = (code.textContent ?? '').replace(/\r/g, '').replace(/\n$/, '');
  const ok = await writeClipboard(text);
  if (!ok) {
    announce('Copy failed');
    return;
  }

  if (!button.dataset.originalHtml) button.dataset.originalHtml = button.innerHTML;
  button.innerHTML = CHECK_ICON;
  button.setAttribute('aria-label', 'Copied');
  button.classList.add('copied');
  announce('Copied to clipboard');

  const prev = timers.get(button);
  if (prev) window.clearTimeout(prev);
  timers.set(
    button,
    window.setTimeout(() => {
      button.innerHTML = button.dataset.originalHtml ?? button.innerHTML;
      button.setAttribute('aria-label', 'Copy code');
      button.classList.remove('copied');
    }, 1500),
  );
});
