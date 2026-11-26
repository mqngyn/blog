import { visit } from 'unist-util-visit';

const classes = (node) => {
  const c = node.properties?.className;
  return Array.isArray(c) ? c : typeof c === 'string' ? c.split(/\s+/) : [];
};

function textOf(node) {
  if (node.type === 'text') return node.value;
  if (node.type !== 'element') return node.children ? node.children.map(textOf).join('') : '';
  const cls = classes(node);
  if (cls.includes('katex-mathml') || cls.includes('heading-anchor')) return '';
  return node.children.map(textOf).join('');
}

/** Collects h2/h3 headings into file.data.astro.frontmatter.toc = [{ depth, slug, text }]. Must run last among heading plugins. */
export function rehypeToc() {
  return (tree, file) => {
    const toc = [];
    visit(tree, 'element', (node) => {
      if (node.tagName !== 'h2' && node.tagName !== 'h3') return;
      const slug = node.properties?.id;
      if (!slug) return;
      const text = textOf(node).replace(/\s+/g, ' ').trim();
      toc.push({ depth: Number(node.tagName[1]), slug: String(slug), text });
    });
    file.data.astro ??= {};
    file.data.astro.frontmatter ??= {};
    file.data.astro.frontmatter.toc = toc;
  };
}
