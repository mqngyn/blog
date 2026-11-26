import { visit } from 'unist-util-visit';

/** Strips carriage returns from code/inlineCode values (CRLF-saved posts) before Shiki runs. */
export function remarkNormalizeEol() {
  return (tree) => {
    visit(tree, ['code', 'inlineCode'], (node) => {
      if (typeof node.value === 'string') node.value = node.value.replace(/\r\n?/g, '\n');
    });
  };
}
