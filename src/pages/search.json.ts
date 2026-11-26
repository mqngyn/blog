import type { APIRoute } from 'astro';
import { getPublishedPosts } from '../utils/posts';

function toPlain(md: string): string {
  return md
    .replace(/^---[\s\S]*?---\s*/, '')
    .replace(/```[^\n]*\n/g, ' ') // fence lines (keep code text)
    .replace(/```/g, ' ')
    .replace(/\$\$/g, ' ')
    .replace(/\$([^$\n]+)\$/g, ' $1 ')
    .replace(/\\[a-zA-Z]+/g, ' ')
    .replace(/<[^>]+>/g, ' ')
    .replace(/!\[([^\]]*)\]\([^)]*\)/g, '$1')
    .replace(/\[([^\]]*)\]\([^)]*\)/g, '$1')
    .replace(/^\s{0,3}#{1,6}\s+/gm, '')
    .replace(/^\s*>\s?/gm, '')
    .replace(/^\s*[-*+]\s+/gm, '')
    .replace(/^\s*\d+\.\s+/gm, '')
    .replace(/\|/g, ' ')
    .replace(/[*_`~#>{}\\]/g, '')
    .replace(/\s+/g, ' ')
    .trim();
}

export const GET: APIRoute = async () => {
  const posts = await getPublishedPosts();
  const data = posts.map((p) => ({
    id: p.id,
    title: p.data.title,
    description: p.data.description,
    category: p.data.category,
    tags: p.data.tags,
    body: toPlain(p.body ?? '').slice(0, 5000),
  }));
  return new Response(JSON.stringify(data), {
    headers: { 'Content-Type': 'application/json; charset=utf-8' },
  });
};
