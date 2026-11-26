import { defineConfig } from 'astro/config';
import { markdownConfig } from './src/plugins/markdown.mjs';

// https://astro.build/config
export default defineConfig({
  site: process.env.SITE || 'https://example.github.io',
  base: process.env.BASE_PATH || '/',
  trailingSlash: 'always',
  build: { format: 'directory' },
  markdown: markdownConfig,
});
