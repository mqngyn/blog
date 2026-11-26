import { visit } from 'unist-util-visit';

const TITLES = {
  note: 'Note',
  tip: 'Tip',
  warning: 'Warning',
  important: 'Important',
  caution: 'Caution',
};
const MARKER = /^\[!(NOTE|TIP|WARNING|IMPORTANT|CAUTION)\][ \t]*\r?\n?/i;

/** GitHub-style alerts: `> [!NOTE]` -> <div class="callout callout-note">. */
export function remarkCallouts() {
  return (tree) => {
    visit(tree, 'blockquote', (node) => {
      const first = node.children[0];
      if (!first || first.type !== 'paragraph') return;
      const text = first.children[0];
      if (!text || text.type !== 'text') return;
      const m = MARKER.exec(text.value);
      if (!m) return;
      const kind = m[1].toLowerCase();

      text.value = text.value.slice(m[0].length);
      if (!text.value) first.children.shift();
      if (first.children[0]?.type === 'break') first.children.shift();
      if (first.children.length === 0) node.children.shift();

      node.children.unshift({
        type: 'paragraph',
        data: { hName: 'p', hProperties: { className: ['callout-title'] } },
        children: [{ type: 'text', value: TITLES[kind] }],
      });
      node.data = {
        ...(node.data || {}),
        hName: 'div',
        hProperties: { className: ['callout', `callout-${kind}`] },
      };
    });
  };
}
