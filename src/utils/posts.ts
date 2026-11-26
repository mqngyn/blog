import { getCollection, type CollectionEntry } from 'astro:content';
import readingTime from 'reading-time';
import { withBase } from './url';

export type Post = CollectionEntry<'posts'>;

export async function getPublishedPosts(): Promise<Post[]> {
  const posts = await getCollection('posts', ({ data }) => (import.meta.env.PROD ? !data.draft : true));
  return posts.sort((a, b) => b.data.pubDate.valueOf() - a.data.pubDate.valueOf());
}

export function postUrl(post: Post): string {
  return withBase(`/posts/${post.id}/`);
}

export function readingMinutes(post: Post): number {
  const minutes = Math.ceil(readingTime(post.body ?? '').minutes);
  return Math.max(1, minutes);
}

export function formatDate(d: Date): string {
  return new Intl.DateTimeFormat('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    timeZone: 'UTC',
  }).format(d);
}

export function tagSlug(tag: string): string {
  return tag
    .trim()
    .toLowerCase()
    .replace(/\s+/g, '-')
    .replace(/[^\p{L}\p{N}_-]+/gu, '')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '');
}

function countBy(values: string[]) {
  const map = new Map<string, number>();
  for (const v of values) map.set(v, (map.get(v) ?? 0) + 1);
  return [...map.entries()]
    .map(([name, count]) => ({ name, slug: tagSlug(name), count }))
    .sort((a, b) => b.count - a.count || a.name.localeCompare(b.name));
}

export function getAllTags(posts: Post[]): { tag: string; slug: string; count: number }[] {
  return countBy(posts.flatMap((p) => [...new Set(p.data.tags)])).map(({ name, slug, count }) => ({
    tag: name,
    slug,
    count,
  }));
}

export function getAllCategories(posts: Post[]): { name: string; slug: string; count: number }[] {
  return countBy(posts.map((p) => p.data.category));
}

export function getRelatedPosts(post: Post, posts: Post[], limit = 3): Post[] {
  const mine = new Set(post.data.tags.map(tagSlug));
  const cat = tagSlug(post.data.category);
  return posts
    .filter((p) => p.id !== post.id)
    .map((p) => {
      const shared = [...new Set(p.data.tags.map(tagSlug))].filter((t) => mine.has(t)).length;
      const score = (tagSlug(p.data.category) === cat ? 2 : 0) + shared;
      return { p, score };
    })
    .filter((x) => x.score > 0)
    .sort((a, b) => b.score - a.score || b.p.data.pubDate.valueOf() - a.p.data.pubDate.valueOf())
    .slice(0, limit)
    .map((x) => x.p);
}
