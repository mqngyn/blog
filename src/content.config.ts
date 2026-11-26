import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

const posts = defineCollection({
  loader: glob({
    pattern: '**/[^_]*.md',
    base: './src/content/posts',
    // foo.md -> foo, foo/index.md -> foo (lowercase, no extension)
    generateId: ({ entry }) =>
      entry
        .replace(/\\/g, '/')
        .replace(/\.md$/i, '')
        .replace(/\/index$/i, '')
        .trim()
        .toLowerCase()
        .replace(/\s+/g, '-'),
  }),
  schema: ({ image }) =>
    z.object({
      title: z.string(),
      description: z.string(),
      pubDate: z.coerce.date(),
      updatedDate: z.coerce.date().optional(),
      category: z.string(),
      tags: z.array(z.string()).default([]),
      thumbnail: image().optional(),
      thumbnailAlt: z.string().optional(),
      difficulty: z.enum(['Easy', 'Medium', 'Hard', 'Insane']).optional(),
      event: z.string().optional(),
      points: z.number().optional(),
      math: z.boolean().optional(),
      draft: z.boolean().default(false),
    }),
});

export const collections = { posts };
