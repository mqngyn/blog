import remarkMath from 'remark-math';
import rehypeKatex from 'rehype-katex';
import rehypeSlug from 'rehype-slug';
import rehypeAutolinkHeadings from 'rehype-autolink-headings';
import { remarkNormalizeEol } from './remark-normalize-eol.mjs';
import { rehypeToc } from './rehype-toc.mjs';
import { remarkMermaid } from './remark-mermaid.mjs';
import { remarkCallouts } from './remark-callouts.mjs';
import { rehypeCodeBlock } from './rehype-code-block.mjs';
import { rehypeImageFigure, rehypeTableWrap, rehypeExternalLinks } from './rehype-misc.mjs';
import { mqDark } from './shiki-theme.mjs';
import { metaTransformer } from './shiki-transformer.mjs';

/**
 * Plugin order (Astro runs: remark -> remark-rehype -> Shiki -> user rehype -> Astro heading ids/images -> raw):
 *  remark : math, mermaid (replace fence before Shiki), callouts
 *  rehype : katex, slug, autolink (h2-h4, empty content), code-block wrapper (needs highlighted <pre>),
 *           image figure, table wrap, external links
 */
export const markdownConfig = {
  syntaxHighlight: { type: 'shiki', excludeLangs: ['mermaid', 'math'] },
  shikiConfig: {
    theme: mqDark,
    wrap: false,
    langAlias: { terminal: 'bash', sage: 'python' },
    transformers: [metaTransformer()],
  },
  remarkPlugins: [remarkNormalizeEol, remarkMath, remarkMermaid, remarkCallouts],
  rehypePlugins: [
    // Slug before KaTeX so heading ids come from the LaTeX source, not the
    // rendered MathML + HTML (which would repeat the text 3 times).
    rehypeSlug,
    [
      rehypeKatex,
      {
        output: 'htmlAndMathml',
        throwOnError: false,
        strict: false,
        macros: {
          '\\Z': '\\mathbb{Z}',
          '\\N': '\\mathbb{N}',
          '\\F': '\\mathbb{F}',
          '\\lcm': '\\operatorname{lcm}',
          '\\ord': '\\operatorname{ord}',
        },
      },
    ],
    [
      rehypeAutolinkHeadings,
      {
        behavior: 'prepend',
        test: ['h2', 'h3', 'h4'],
        properties: { className: ['heading-anchor'], ariaLabel: 'Link to this section' },
        content: [],
      },
    ],
    rehypeToc,
    rehypeCodeBlock,
    rehypeImageFigure,
    rehypeTableWrap,
    rehypeExternalLinks,
  ],
};
