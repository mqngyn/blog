import { visit } from 'unist-util-visit';

export const TERMINAL = new Set([
  'bash', 'sh', 'shell', 'shellscript', 'shellsession', 'console', 'zsh',
  'powershell', 'ps1', 'pwsh', 'terminal', 'fish', 'cmd', 'bat',
]);

const PRETTY = {
  py: 'Python', python: 'Python', js: 'JavaScript', javascript: 'JavaScript',
  ts: 'TypeScript', typescript: 'TypeScript', c: 'C', cpp: 'C++', 'c++': 'C++',
  cs: 'C#', csharp: 'C#', java: 'Java', go: 'Go', rust: 'Rust', rs: 'Rust',
  asm: 'Assembly', nasm: 'Assembly', x86asm: 'Assembly', json: 'JSON',
  yaml: 'YAML', yml: 'YAML', toml: 'TOML', html: 'HTML', css: 'CSS',
  sql: 'SQL', php: 'PHP', ruby: 'Ruby', rb: 'Ruby', sage: 'Sage', diff: 'Diff',
  latex: 'LaTeX', tex: 'LaTeX', md: 'Markdown', markdown: 'Markdown',
  xml: 'XML', ini: 'INI', makefile: 'Makefile', dockerfile: 'Dockerfile',
  text: 'Text', plaintext: 'Text', txt: 'Text', plain: 'Text', ansi: 'Text',
  solidity: 'Solidity', lua: 'Lua', perl: 'Perl', kotlin: 'Kotlin', swift: 'Swift',
  jsx: 'JSX', tsx: 'TSX', http: 'HTTP', graphql: 'GraphQL', regex: 'Regex',
};

const el = (tagName, properties = {}, children = []) => ({ type: 'element', tagName, properties, children });

const copyIcon = () =>
  el(
    'svg',
    {
      xmlns: 'http://www.w3.org/2000/svg', width: 16, height: 16, viewBox: '0 0 24 24',
      fill: 'none', stroke: 'currentColor', strokeWidth: 2, strokeLinecap: 'round',
      strokeLinejoin: 'round', ariaHidden: 'true', className: ['lucide', 'lucide-copy'],
    },
    [
      el('rect', { width: 14, height: 14, x: 8, y: 8, rx: 2, ry: 2 }),
      el('path', { d: 'M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2' }),
    ],
  );

function classList(props) {
  const raw = props.className ?? props.class ?? [];
  return Array.isArray(raw) ? raw.map(String) : String(raw).split(/\s+/).filter(Boolean);
}

function prettyName(lang) {
  const k = lang.toLowerCase();
  return PRETTY[k] ?? (k ? k.charAt(0).toUpperCase() + k.slice(1) : 'Text');
}

/** Wraps Shiki's <pre class="astro-code"> in the contract's <figure class="code-block">. */
export function rehypeCodeBlock() {
  return (tree) => {
    visit(tree, 'element', (node, index, parent) => {
      if (node.tagName !== 'pre' || !parent || index == null) return;
      if (parent.type === 'element' && parent.tagName === 'figure') return;
      const classes = classList(node.properties ?? {});
      if (!classes.includes('astro-code')) return;

      const props = node.properties;
      const lang = String(props.dataLanguage ?? 'text');
      const terminal = TERMINAL.has(lang.toLowerCase());
      const title = props.dataTitle ? String(props.dataTitle) : '';
      const label = title || (terminal ? 'Terminal' : prettyName(lang));

      if (props.dataLinenums === 'true') classes.push('has-line-numbers');
      delete props.dataLinenums;
      delete props.dataTitle;
      delete props.class;
      props.className = classes;
      // let theme CSS variables control background/foreground (light + dark)
      if (typeof props.style === 'string') {
        const style = props.style
          .split(';')
          .map((s) => s.trim())
          .filter((s) => s && !/^(background-color|color)\s*:/i.test(s))
          .join('; ');
        if (style) props.style = style;
        else delete props.style;
      }

      const header = el('figcaption', { className: ['code-header'] }, [
        ...(terminal ? [el('span', { className: ['code-dots'], ariaHidden: 'true' })] : []),
        el('span', { className: ['code-lang'] }, [{ type: 'text', value: label }]),
        el('button', { className: ['code-copy'], type: 'button', ariaLabel: 'Copy code' }, [copyIcon()]),
      ]);

      const figProps = { className: ['code-block'], dataLang: lang };
      if (terminal) figProps.dataTerminal = '';
      parent.children[index] = el('figure', figProps, [header, node]);
      return 'skip';
    });
  };
}
