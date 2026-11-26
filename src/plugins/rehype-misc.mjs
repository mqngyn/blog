import { visit } from 'unist-util-visit';

const el = (tagName, properties = {}, children = []) => ({ type: 'element', tagName, properties, children });
const isWs = (n) => n.type === 'text' && !n.value.trim();

/** <img title="cap"> alone in a paragraph -> <figure><img><figcaption>; lazy-load all images. */
export function rehypeImageFigure() {
  return (tree) => {
    visit(tree, 'element', (node) => {
      if (node.tagName === 'img') {
        node.properties.loading ??= 'lazy';
        node.properties.decoding ??= 'async';
      }
    });
    visit(tree, 'element', (node, index, parent) => {
      if (node.tagName !== 'p' || !parent || index == null) return;
      const kids = node.children.filter((c) => !isWs(c));
      if (kids.length !== 1) return;
      let img = kids[0];
      let link = null;
      if (img.type === 'element' && img.tagName === 'a' && img.children.filter((c) => !isWs(c)).length === 1) {
        link = img;
        img = img.children.find((c) => !isWs(c));
      }
      if (img.type !== 'element' || img.tagName !== 'img') return;
      const title = img.properties?.title;
      if (!title) return;
      delete img.properties.title;
      parent.children[index] = el('figure', {}, [
        link ?? img,
        el('figcaption', {}, [{ type: 'text', value: String(title) }]),
      ]);
    });
  };
}

/** Wrap <table> in a horizontally scrollable container. */
export function rehypeTableWrap() {
  return (tree) => {
    visit(tree, 'element', (node, index, parent) => {
      if (node.tagName !== 'table' || !parent || index == null) return;
      parent.children[index] = el('div', { className: ['table-wrap'] }, [node]);
      return 'skip';
    });
  };
}

/** External links open in a new tab safely. */
export function rehypeExternalLinks() {
  return (tree) => {
    visit(tree, 'element', (node) => {
      if (node.tagName !== 'a') return;
      const href = node.properties?.href;
      if (typeof href === 'string' && /^(https?:)?\/\//i.test(href)) {
        node.properties.target = '_blank';
        node.properties.rel = ['noopener', 'noreferrer'];
      }
    });
  };
}
