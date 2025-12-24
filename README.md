# Joinery

**Intent-driven layout primitives for the modern web.**

Stop fighting CSS. Express _what_ something is, not _how_ it looks.

```jsx
<Center measure='wide'>
  <Stack gap='section'>
    <Header />
    <Grid min='md' gap='related'>
      <Box pattern='card'>Revenue</Box>
      <Box pattern='card'>Users</Box>
      <Box pattern='card'>Growth</Box>
    </Grid>
  </Stack>
</Center>
```

## Why Joinery?

**Semantic spacing** — Use `gap="related"` instead of `gap-4`. Express relationships, not pixels.

**Composable primitives** — Small layouts that combine into any interface. Stack, Cluster, Grid, Center, Box.

**Zero runtime** — Pure CSS. Works with React, Vue, Svelte, or vanilla HTML.

**~3KB gzipped** — No dependencies. Ships what you need, nothing more.

## Quick Start

```bash
npx joinery init
```

This adds the CSS files to your project. Import them:

```css
@import './joinery/tokens.css';
@import './joinery/reset.css';
@import './joinery/primitives.css';
```

Or use the React components:

```bash
npx joinery add react
```

```jsx
import { Stack, Grid, Box } from './joinery/react'
```

## Primitives

| Primitive   | Purpose                                  |
| ----------- | ---------------------------------------- |
| **Stack**   | Vertical flow with consistent spacing    |
| **Cluster** | Horizontal grouping that wraps           |
| **Grid**    | Auto-fit responsive columns              |
| **Center**  | Horizontally centered content            |
| **Box**     | Padding container with border/background |

## Spacing Tokens

| Token      | Use for                            |
| ---------- | ---------------------------------- |
| `tight`    | Icon + text, tightly coupled items |
| `related`  | Items that belong together         |
| `distinct` | Separate but grouped items         |
| `section`  | Major content divisions            |
| `page`     | Page-level separation              |

## Examples

### Stack

```html
<div class="stack" data-gap="related">
  <h2>Title</h2>
  <p>Description</p>
  <button>Action</button>
</div>
```

### Cluster

```html
<div class="cluster" data-justify="between">
  <div class="logo">Brand</div>
  <nav>Links</nav>
</div>
```

### Grid

```html
<div class="grid" data-min="md" data-gap="related">
  <div>Card 1</div>
  <div>Card 2</div>
  <div>Card 3</div>
</div>
```

### Center

```html
<div class="center" data-measure="wide">
  <article>Centered content</article>
</div>
```

### Box

```html
<div class="box" data-padding="distinct" data-pattern="card">Card content</div>
```

## Philosophy

Joinery is built on [Every Layout](https://every-layout.dev) principles:

1. **Style the context, not the element** — Spacing belongs to containers, not children
2. **Be the browser's mentor, not its micromanager** — Let CSS do what it does best
3. **Semantic intent over arbitrary values** — `gap="related"` communicates meaning

## License

MIT
