import rss from '@astrojs/rss';
import type { APIContext } from 'astro';
import { SITE } from '../config';
import { getPublishedPosts, postUrl } from '../utils/posts';

export async function GET(context: APIContext) {
  const posts = await getPublishedPosts();
  const site = context.site ?? new URL('https://example.github.io');
  return rss({
    title: SITE.title,
    description: SITE.description,
    site,
    trailingSlash: false,
    items: posts.map((p) => ({
      title: p.data.title,
      description: p.data.description,
      pubDate: p.data.pubDate,
      link: new URL(postUrl(p), site).href,
      categories: [p.data.category, ...p.data.tags],
    })),
    customData: `<language>${SITE.lang}</language>`,
  });
}
