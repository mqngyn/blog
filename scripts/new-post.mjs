#!/usr/bin/env node
// Usage:
//   npm run new -- "My Post Title"             -> src/content/posts/my-post-title.md
//   npm run new -- "My Post Title" --folder    -> src/content/posts/my-post-title/index.md
import { existsSync, mkdirSync, writeFileSync } from 'node:fs';
import { dirname, join, relative, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const POSTS_DIR = join(ROOT, 'src', 'content', 'posts');

function slugify(input) {
  return input
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '') // strip combining diacritics
    .replace(/đ|Đ/g, 'd') // these do not decompose under NFD
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

function localToday() {
  const d = new Date();
  const pad = (n) => String(n).padStart(2, '0');
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
}

function fail(message) {
  console.error(`Error: ${message}`);
  console.error('Usage: npm run new -- "My Post Title" [--folder]');
  process.exit(1);
}

const args = process.argv.slice(2);
const useFolder = args.includes('--folder');
const title = args
  .filter((a) => !a.startsWith('--'))
  .join(' ')
  .trim();

if (!title) fail('missing post title.');

const slug = slugify(title);
if (!slug) fail(`could not build a slug from "${title}".`);

const flatPath = join(POSTS_DIR, `${slug}.md`);
const folderPath = join(POSTS_DIR, slug, 'index.md');

// Refuse if either layout already exists: both would produce the same post id.
if (existsSync(flatPath) || existsSync(folderPath)) {
  fail(`a post with slug "${slug}" already exists (${relative(ROOT, existsSync(flatPath) ? flatPath : folderPath)}).`);
}

const today = localToday();
const template = `---
title: ${JSON.stringify(title)}
description: ""
pubDate: ${today}
category: "Cryptography"
tags: []
draft: true
# updatedDate: ${today}
# thumbnail: ./thumbnail.png   # local image next to this file (folder posts)
# thumbnailAlt: ""
# difficulty: Medium           # CTF only: Easy | Medium | Hard | Insane
# event: ""                    # CTF only
# points: 0                    # CTF only
# math: true                   # informational
---

## Overview

Write your introduction here.
`;

const target = useFolder ? folderPath : flatPath;
mkdirSync(dirname(target), { recursive: true });
writeFileSync(target, template, { encoding: 'utf8', flag: 'wx' });

console.log(`Created: ${target}`);
