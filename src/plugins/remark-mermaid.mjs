import { visit } from 'unist-util-visit';

const escapeHtml = (s) =>
  s
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');

/**
 * Turns ```mermaid fences into a raw `<pre class="mermaid">` node so that
 * Shiki never sees them. The client script (src/scripts/mermaid.ts) renders them.
 */
export function remarkMermaid() {
  return (tree) => {
    visit(tree, 'code', (node, index, parent) => {
      if (!parent || index == null) return;
      if ((node.lang || '').toLowerCase() !== 'mermaid') return;
      const src = node.value;
      parent.children[index] = {
        type: 'html',
        value: `<pre class="mermaid" data-mermaid-src="${escapeHtml(src)}">${escapeHtml(src)}</pre>`,
      };
    });
  };
}
