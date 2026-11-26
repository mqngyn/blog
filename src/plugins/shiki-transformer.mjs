const NO_LINENUMS_LANGS = new Set([
  'text', 'plaintext', 'txt', 'plain', 'ansi',
  'bash', 'sh', 'shell', 'shellscript', 'shellsession', 'console', 'zsh',
  'powershell', 'ps1', 'pwsh', 'terminal', 'fish', 'cmd', 'bat',
]);

/**
 * Reads the fence meta (```python nolinenums title="x.py") and stores the result
 * as data attributes on <pre>; rehype-code-block.mjs consumes and removes them.
 */
export function metaTransformer() {
  return {
    name: 'mq-meta',
    pre(node) {
      const raw = String(this.options.meta?.__raw ?? '');
      const lang = String(this.options.lang ?? 'text').toLowerCase();

      let lineNumbers = !NO_LINENUMS_LANGS.has(lang);
      if (/(^|\s)nolinenums(\s|$)/i.test(raw)) lineNumbers = false;
      else if (/(^|\s)linenums(\s|$)/i.test(raw)) lineNumbers = true;

      node.properties.dataLinenums = lineNumbers ? 'true' : 'false';

      const t = /title=(?:"([^"]*)"|'([^']*)')/.exec(raw);
      const title = t ? (t[1] ?? t[2]) : '';
      if (title) node.properties.dataTitle = title;
    },
  };
}
