# mq — Technical Blog Design System

**Version:** 1.0  
**Status:** Approved visual direction; implementation specification  
**Purpose:** Single source of truth for frontend development and coding agents.

## 1. Design direction

Modern Minimal Technical Blog for Computer Science, Cryptography, Web Security and CTF write-ups. Use Emerald/Forest Green as the primary brand, Sky Blue and Teal as secondary accents, and Slate/Navy for text and code. Prioritize readability, technical content, whitespace and consistent components. Avoid excessive animation, glassmorphism and decorative clutter.

### Approved visual references

- `Modern Green-Blue Security Blog UI(1).png`: Posts and Me pages.
- `pwnable_orw CTF Write-up Blog Mockup(1).png`: article detail page.

These filenames refer to the approved reference images supplied in the conversation; keep copies alongside this document in the repository if desired. The images are not embedded in this Markdown file. Color values and fonts below are normalized implementation recommendations, not exact measurements or identified source fonts. Dark mode and Tags page are proposed extensions of the approved design. Example articles and profile content in the mockups are placeholders, not verified personal information.

## 2. Brand palette

| Token | HEX | Usage |
|---|---|---|
| Forest Green | `#14532D` | Logo, brand identity |
| Emerald Green | `#16A34A` | Primary accent, heading indicators |
| Mint Green | `#DCFCE7` | Active navigation, soft tags |
| Teal | `#14B8A6` | Gradient transition |
| Ocean Blue | `#0284C7` | Secondary accent |
| Sky Blue | `#38BDF8` | Hero decoration |
| Light Blue | `#DBEAFE` | Secondary tags |
| Deep Navy | `#0F172A` | Primary typography |

### Semantic colors

| Role | Light | Dark |
|---|---|---|
| Page background | `#F8FAFC` | `#0B1120` |
| Surface | `#FFFFFF` | `#111827` |
| Secondary surface | `#F1F5F9` | `#1E293B` |
| Primary text | `#0F172A` | `#F1F5F9` |
| Secondary text | `#475569` | `#CBD5E1` |
| Muted text | `#64748B` | `#94A3B8` |
| Border | `#E2E8F0` | `#263449` |
| Accent | `#15803D` | `#4ADE80` |
| Link | `#2563EB` | `#60A5FA` |
| Code background | `#1E293B` | `#080F1C` |

Use a subtle green-to-blue gradient line beneath the navbar and a pale gradient with overlapping translucent SVG waves on the right of hero banners. Keep the left side quiet for text. Dark mode uses deep navy rather than pure black.

## 3. Typography

| Family | Purpose | Weights |
|---|---|---|
| [Inter](https://fonts.google.com/specimen/Inter) | UI, headings, article body | 400, 500, 600, 700, 800 |
| [JetBrains Mono](https://fonts.google.com/specimen/JetBrains+Mono) | Code, terminal, inline code | 400, 500, 700 |
| [Caveat](https://fonts.google.com/specimen/Caveat) | Handwritten logo fallback | 400–700 |

Logo: lowercase `mq`, handwritten, slightly slanted, with an underline stroke. Prefer a custom SVG matching the approved Posts/Me mockup; use Caveat 700 until the logo is available. Apply this same logo to every page, including article detail (which shows an older logo in the reference). Alternatives: Kalam, Kaushan Script, Allura, Permanent Marker.

| Element | Size | Weight |
|---|---:|---:|
| Logo | 40–44px | 700 |
| Navbar | 15–16px | 600 |
| Page title | 40px | 800 |
| Article title | 36–40px | 800 |
| Post card title | 20px | 700 |
| H2 | 26px | 700 |
| H3 | 21px | 600 |
| Article body | 17px | 400 |
| Post description | 15px | 400 |
| Sidebar title | 18px | 700 |
| Metadata | 13–14px | 400 |
| Tags | 12–13px | 500 |
| Code block | 14px | 400 |
| Inline code | 15px | 500 |

Article line-height: 1.75; code line-height: 1.6. Self-host fonts in production if practical. Ensure Vietnamese glyph coverage where necessary.

## 4. Shared components

### Navbar

- Height 64px; logo left; Posts, Tags, Me and sun/moon theme toggle right.
- Active tab uses a mint pill with dark-green text; dark mode uses soft forest background and light-green text.
- Thin green/teal/blue gradient underline; shared across all pages.
- Theme toggle should persist user preference, respect system preference on first visit and avoid theme flash.
- Use semantic navigation, keyboard focus and accessible labels for icon-only buttons.

### Hero

Full-width gradient banner, 170–200px minimum on listing pages; allow article header to grow with title length. Page title and description on left with vertical green indicator on Posts/Me/Tags; article header contains category, tags, title, description and metadata. Decorative SVG waves on right, hidden from assistive technology.

### Cards and tags

Cards: 1px border, 12px radius, 16px padding, subtle shadow; hover shadow and border transition (180ms). Primary category pill: `#15803D` background, white text in light mode. Secondary tag: `#DBEAFE` background, `#1D4ED8` text. Other tags: `#DCFCE7` background, `#166534` text. Dark mode use semantic soft/accent text tokens. Avoid arbitrary per-category colors.

### Code and terminal

Use Shiki for syntax highlighting. Include language label, copy button, optional line numbers and horizontal scroll. Inline code uses a soft slate background. Terminal panels may use a simple terminal header. Preserve whitespace and avoid page-level overflow.

| Syntax token | HEX |
|---|---|
| Background | `#1E293B` |
| Default text | `#F8FAFC` |
| Keyword | `#C084FC` |
| Function | `#67E8F9` |
| String | `#A3E635` |
| Number | `#FBBF24` |
| Comment | `#94A3B8` |
| Error | `#F87171` |

Use Lucide Icons consistently (calendar, clock, tag, search, sun, moon, copy, list, info, layers, social links).

## 5. Page layouts

### 5.1 Posts (homepage)

```text
[ mq                           Posts  Tags  Me  Theme ]
[ Posts — description                      SVG waves ]
[ Search posts...                         All Tags v ]
[ Thumbnail | Category / Tags                       ]
[           | Post title                             ]
[           | Short description                     ]
[           | Published date · Reading time          ]
[ Next post card                                     ]
```

Single-column list of horizontal cards, newest first. No profile sidebar, Featured Post or Popular Posts sections. Profile belongs exclusively to Me. Search should match post titles/content and combine with tag filtering. Show a useful empty state when no posts match. Thumbnail is 3:2, recommended 224 × 150px; allow a neutral fallback for posts without thumbnails. Card list max-width 1000px, centered; gap 16–20px; search height 48px. On mobile stack thumbnail and text.

### 5.2 Article detail

```text
[ mq                           Posts  Tags  Me  Theme ]
[ Category / Tags                                    ]
[ Article title                                      ]
[ Description                                        ]
[ Date · Reading time · Difficulty (when relevant)   ]
[ Article content              | Table of Contents   ]
[ # 1. Overview                | Post Info           ]
[ Paragraphs, images, math     | Related Posts       ]
[ # 2. Analysis                |                     ]
[ Code / terminal              |                     ]
```

Use two columns on desktop: article 860–880px maximum, sidebar 300–320px, gap 40px; total container max-width 1280px. Main article left aligned. Section spacing 32px, paragraph spacing 16px, code radius 8px. Sidebar sticky top offset 88px (use viewport-aware height/scroll if needed). TOC supports anchor navigation and ScrollSpy. On mobile use collapsible TOC above the article; move supplementary info and related posts below. Show difficulty/event/points only for relevant CTF posts. Related posts should use actual shared tags/categories, not fabricated popularity.

Article renderer should support Markdown headings, lists, links, tables, images, captions, blockquotes, fenced code, inline code, LaTeX math, diagrams and accessible anchor links.

### 5.3 Me

Single column, max-width 1000px, centered. Sections:

1. Hero: Me and short description.
2. Profile Card: avatar/illustration, name, role, biography, social links.
3. Interests: green and blue topic tags.
4. Currently: learning, practicing, building.
5. More About Me: education, community, CV link.
6. Quote: personal statement, optional within More About Me.

Use user-provided personal details and actual links; do not publish mockup placeholders as facts.

### 5.4 Tags (proposed)

Same navbar/hero; centered tag collection, optional post counts derived from actual content. Selecting a tag navigates to a filtered Posts list or dedicated tag archive. Keep typography and color tokens consistent.

## 6. Layout, spacing and responsive behavior

| Token | Value |
|---|---|
| Main container | 1280px max |
| Posts / Me container | 1000px max |
| Article / sidebar max | 880px / 320px |
| Desktop column gap | 40px |
| Navbar | 64px |
| Hero | 170–200px, flexible |
| Card padding | 16px |
| Card radius | 12px |
| Code radius | 8px |
| Spacing scale | 4, 8, 12, 16, 24, 32, 40, 48, 64px |

| Breakpoint | Behavior |
|---|---|
| ≥1280px | Full desktop layout |
| 1024–1279px | Reduced horizontal padding, flexible sidebar |
| 768–1023px | Single-column article and collapsible TOC |
| 480–767px | Vertical post cards, compact navbar |
| <480px | Reduce heading sizes/spacing, wrap filters and tags |

Use fluid widths and `minmax(0, 1fr)` for article grid to prevent overflow. Max-width values are ceilings, not fixed widths. Support keyboard navigation, visible focus, adequate contrast, reduced-motion preference and meaningful image alt text.

## 7. Implementation: CSS design tokens

Suggested file: `src/styles/theme.css`.

```css
:root {
  color-scheme: light;
  --brand-green: #16A34A;
  --brand-forest: #14532D;
  --brand-teal: #14B8A6;
  --brand-blue: #38BDF8;
  --background: #F8FAFC;
  --surface: #FFFFFF;
  --surface-secondary: #F1F5F9;
  --border: #E2E8F0;
  --text-primary: #0F172A;
  --text-secondary: #475569;
  --text-muted: #64748B;
  --accent: #15803D;
  --accent-hover: #166534;
  --accent-soft: #DCFCE7;
  --accent-text: #166534;
  --link: #2563EB;
  --link-hover: #1D4ED8;
  --blue-soft: #DBEAFE;
  --blue-text: #1D4ED8;
  --logo-color: #14532D;
  --code-background: #1E293B;
  --code-header: #263449;
  --code-text: #F8FAFC;
  --inline-code-bg: #E2E8F0;
  --gradient-brand: linear-gradient(90deg, #22C55E, #14B8A6, #38BDF8);
  --gradient-hero: linear-gradient(120deg, #F0FDF4, #F0F9FF, #E0F2FE);
  --font-sans: "Inter", sans-serif;
  --font-mono: "JetBrains Mono", monospace;
  --font-logo: "Caveat", cursive;
  --font-size-body: 17px;
  --font-size-small: 14px;
  --line-height-body: 1.75;
  --container-width: 1280px;
  --post-list-width: 1000px;
  --article-width: 880px;
  --sidebar-width: 320px;
  --navbar-height: 64px;
  --layout-gap: 40px;
  --space-xs: 4px;
  --space-sm: 8px;
  --space-md: 16px;
  --space-lg: 24px;
  --space-xl: 32px;
  --space-2xl: 48px;
  --radius-sm: 6px;
  --radius-md: 8px;
  --radius-lg: 12px;
  --radius-xl: 16px;
  --radius-full: 9999px;
  --shadow-card: 0 1px 3px rgb(15 23 42 / 0.05);
  --shadow-hover: 0 4px 16px rgb(15 23 42 / 0.08);
  --transition: 180ms ease;
}
[data-theme="dark"] {
  color-scheme: dark;
  --background: #0B1120;
  --surface: #111827;
  --surface-secondary: #1E293B;
  --border: #263449;
  --text-primary: #F1F5F9;
  --text-secondary: #CBD5E1;
  --text-muted: #94A3B8;
  --accent: #4ADE80;
  --accent-hover: #86EFAC;
  --accent-soft: #14532D;
  --accent-text: #BBF7D0;
  --link: #60A5FA;
  --link-hover: #93C5FD;
  --blue-soft: #1E3A5F;
  --blue-text: #BFDBFE;
  --logo-color: #4ADE80;
  --code-background: #080F1C;
  --code-header: #111827;
  --code-text: #F1F5F9;
  --inline-code-bg: #263449;
  --gradient-hero: linear-gradient(120deg, #0B211B, #0F1E32, #102A43);
  --shadow-card: 0 1px 3px rgb(0 0 0 / 0.15);
  --shadow-hover: 0 4px 16px rgb(0 0 0 / 0.25);
}
*, *::before, *::after { box-sizing: border-box; }
body {
  margin: 0;
  background: var(--background);
  color: var(--text-primary);
  font-family: var(--font-sans);
  font-size: var(--font-size-body);
  line-height: var(--line-height-body);
}
a { color: var(--link); transition: color var(--transition); }
a:hover { color: var(--link-hover); }
code, pre { font-family: var(--font-mono); }
pre { overflow-x: auto; font-size: 14px; line-height: 1.6; }
::selection { background: var(--accent-soft); color: var(--accent-text); }
:focus-visible { outline: 2px solid var(--link); outline-offset: 3px; }
```

### Font import

```html
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&family=JetBrains+Mono:wght@400;500;600;700&family=Caveat:wght@400;500;600;700&display=swap" rel="stylesheet">
```

### Hero wave SVG example

```svg
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 680 160" aria-hidden="true">
  <path d="M210 160 C330 150 370 70 450 97 S570 28 680 48 V160Z" fill="#38BDF8" opacity=".22"/>
  <path d="M340 160 C420 125 480 22 550 48 S630 62 680 16 V160Z" fill="#14B8A6" opacity=".30"/>
  <path d="M450 160 Q540 85 600 80 T680 40 V160Z" fill="#22C55E" opacity=".20"/>
</svg>
```

## 8. Recommended tech stack

| Technology | Role |
|---|---|
| Astro | Static site generation |
| TypeScript | Type safety |
| Tailwind CSS | Styling and responsive layout (optional alongside CSS tokens) |
| Markdown / MDX | Content authoring |
| Astro Content Collections | Content schema and metadata |
| Shiki | Syntax highlighting |
| KaTeX | Math and cryptography notation |
| Mermaid | Protocol and workflow diagrams |
| Lucide Icons | Consistent icons |
| Pagefind | Static full-text search |
| GitHub Pages | Static hosting |

This is a recommended stack, not a mandatory framework decision. Verify package compatibility when implementing.

## 9. Implementation checklist for coding agents

- [ ] Use approved screenshots and this specification as visual references.
- [ ] Create shared theme tokens, typography, spacing and dark mode before page styling.
- [ ] Implement shared navbar, handwritten mq logo and hero wave component.
- [ ] Build Posts list, search, tag filter and empty state; no Featured/Popular/profile sidebar.
- [ ] Build article layout, Markdown/MDX renderer, code copy, math, sticky TOC and related posts.
- [ ] Build Me profile sections and Tags archive.
- [ ] Use real content/metadata; hide optional fields when absent.
- [ ] Test responsive layouts, keyboard interaction, focus, contrast, theme persistence and long code blocks.
- [ ] Compare final screenshots against the approved references in both desktop and mobile widths.
- [ ] Document deviations from this specification rather than silently redesigning the UI.

