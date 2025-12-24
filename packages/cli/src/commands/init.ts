import * as p from '@clack/prompts'
import fs from 'fs-extra'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import pc from 'picocolors'

const __dirname = path.dirname(fileURLToPath(import.meta.url))

interface InitOptions {
  yes?: boolean
}

interface Config {
  cssPath: string
  useReact: boolean
  reactPath: string
  typescript: boolean
}

const DEFAULT_CONFIG: Config = {
  cssPath: './styles/joinery',
  useReact: true,
  reactPath: './components/joinery',
  typescript: true,
}

const CSS_FILES = {
  'tokens/spacing.css': `/**
 * Joinery Spacing Tokens
 */
:root {
  --joinery-space-tight: 0.25rem;
  --joinery-space-related: 0.75rem;
  --joinery-space-distinct: 1.5rem;
  --joinery-space-section: 3rem;
  --joinery-space-page: 6rem;
}`,

  'tokens/measure.css': `/**
 * Joinery Measure Tokens
 */
:root {
  --joinery-measure-narrow: 45ch;
  --joinery-measure-prose: 65ch;
  --joinery-measure-wide: 85ch;
  --joinery-measure: var(--joinery-measure-prose);
}`,

  'tokens/typography.css': `/**
 * Joinery Typography Tokens
 */
:root {
  --joinery-text-xs: clamp(0.75rem, 0.7rem + 0.25vw, 0.875rem);
  --joinery-text-sm: clamp(0.875rem, 0.825rem + 0.25vw, 1rem);
  --joinery-text-base: clamp(1rem, 0.95rem + 0.25vw, 1.125rem);
  --joinery-text-lg: clamp(1.125rem, 1.05rem + 0.375vw, 1.25rem);
  --joinery-text-xl: clamp(1.25rem, 1.15rem + 0.5vw, 1.5rem);
  --joinery-text-2xl: clamp(1.5rem, 1.3rem + 1vw, 2rem);
  --joinery-text-3xl: clamp(1.875rem, 1.55rem + 1.625vw, 2.5rem);
  --joinery-text-4xl: clamp(2.25rem, 1.75rem + 2.5vw, 3.5rem);
  
  --joinery-leading-tight: 1.2;
  --joinery-leading-snug: 1.35;
  --joinery-leading-normal: 1.5;
  --joinery-leading-relaxed: 1.65;
  
  --joinery-weight-normal: 400;
  --joinery-weight-medium: 500;
  --joinery-weight-semibold: 600;
  --joinery-weight-bold: 700;
}`,

  'tokens/elevation.css': `/**
 * Joinery Elevation Tokens
 */
:root {
  --joinery-shadow-inset: inset 0 1px 2px 0 rgb(0 0 0 / 0.075);
  --joinery-shadow-flat: none;
  --joinery-shadow-raised: 0 1px 2px 0 rgb(0 0 0 / 0.05), 0 1px 3px 0 rgb(0 0 0 / 0.1);
  --joinery-shadow-floating: 0 4px 6px -1px rgb(0 0 0 / 0.1), 0 10px 15px -3px rgb(0 0 0 / 0.1);
  
  --joinery-elevation-inset: var(--joinery-shadow-inset);
  --joinery-elevation-flat: var(--joinery-shadow-flat);
  --joinery-elevation-raised: var(--joinery-shadow-raised);
  --joinery-elevation-floating: var(--joinery-shadow-floating);
}`,

  'tokens/radius.css': `/**
 * Joinery Radius Tokens
 */
:root {
  --joinery-radius-none: 0;
  --joinery-radius-subtle: 0.25rem;
  --joinery-radius-rounded: 0.5rem;
  --joinery-radius-pill: 9999px;
  --joinery-radius-full: 50%;
}`,
}

export async function init(options: InitOptions) {
  console.clear()

  p.intro(pc.bgCyan(pc.black(' joinery ')))

  let config: Config

  if (options.yes) {
    config = DEFAULT_CONFIG
    p.log.info('Using default configuration')
  } else {
    const answers = await p.group(
      {
        cssPath: () =>
          p.text({
            message: 'Where should CSS files go?',
            placeholder: './styles/joinery',
            defaultValue: './styles/joinery',
          }),
        useReact: () =>
          p.confirm({
            message: 'Are you using React?',
            initialValue: true,
          }),
        reactPath: ({ results }) => {
          if (!results.useReact) return Promise.resolve('')
          return p.text({
            message: 'Where should React components go?',
            placeholder: './components/joinery',
            defaultValue: './components/joinery',
          })
        },
        typescript: ({ results }) => {
          if (!results.useReact) return Promise.resolve(false)
          return p.confirm({
            message: 'Are you using TypeScript?',
            initialValue: true,
          })
        },
      },
      {
        onCancel: () => {
          p.cancel('Setup cancelled.')
          process.exit(0)
        },
      }
    )

    config = answers as Config
  }

  const s = p.spinner()

  s.start('Creating directories')
  await fs.ensureDir(config.cssPath)
  if (config.useReact && config.reactPath) {
    await fs.ensureDir(config.reactPath)
  }
  s.stop('Directories created')
  s.start('Writing CSS files')

  for (const [filePath, content] of Object.entries(CSS_FILES)) {
    const fullPath = path.join(config.cssPath, filePath)
    await fs.ensureDir(path.dirname(fullPath))
    await fs.writeFile(fullPath, content)
  }

  const indexContent = `/**
 * Joinery - Import this file for all styles
 */

/* Tokens */
@import './tokens/spacing.css';
@import './tokens/measure.css';
@import './tokens/typography.css';
@import './tokens/elevation.css';
@import './tokens/radius.css';

/* Primitives */
@import './primitives/stack.css';
@import './primitives/cluster.css';
@import './primitives/grid.css';
@import './primitives/center.css';
@import './primitives/box.css';
`
  await fs.writeFile(path.join(config.cssPath, 'index.css'), indexContent)

  const primitivesDir = path.join(config.cssPath, 'primitives')
  await fs.ensureDir(primitivesDir)

  await fs.writeFile(
    path.join(primitivesDir, 'stack.css'),
    `/**
 * Joinery Stack Primitive
 */
.stack {
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
}
.stack > * { margin-block: 0; }
.stack > * + * {
  margin-block-start: var(--joinery-stack-gap, var(--joinery-space-related, 0.75rem));
}
.stack[data-gap="none"] { --joinery-stack-gap: 0; }
.stack[data-gap="tight"] { --joinery-stack-gap: var(--joinery-space-tight, 0.25rem); }
.stack[data-gap="related"] { --joinery-stack-gap: var(--joinery-space-related, 0.75rem); }
.stack[data-gap="distinct"] { --joinery-stack-gap: var(--joinery-space-distinct, 1.5rem); }
.stack[data-gap="section"] { --joinery-stack-gap: var(--joinery-space-section, 3rem); }
.stack[data-gap="page"] { --joinery-stack-gap: var(--joinery-space-page, 6rem); }
.stack[data-recursive] * + * {
  margin-block-start: var(--joinery-stack-gap, var(--joinery-space-related, 0.75rem));
}
.stack:only-child { block-size: 100%; }
.stack[data-split-after="1"] > :nth-child(1) { margin-block-end: auto; }
.stack[data-split-after="2"] > :nth-child(2) { margin-block-end: auto; }
.stack[data-split-after="3"] > :nth-child(3) { margin-block-end: auto; }
`
  )

  await fs.writeFile(
    path.join(primitivesDir, 'cluster.css'),
    `/**
 * Joinery Cluster Primitive
 */
.cluster {
  display: flex;
  flex-wrap: wrap;
  gap: var(--joinery-cluster-gap, var(--joinery-space-related, 0.75rem));
  justify-content: flex-start;
  align-items: center;
}
.cluster[data-gap="none"] { --joinery-cluster-gap: 0; }
.cluster[data-gap="tight"] { --joinery-cluster-gap: var(--joinery-space-tight, 0.25rem); }
.cluster[data-gap="related"] { --joinery-cluster-gap: var(--joinery-space-related, 0.75rem); }
.cluster[data-gap="distinct"] { --joinery-cluster-gap: var(--joinery-space-distinct, 1.5rem); }
.cluster[data-justify="start"] { justify-content: flex-start; }
.cluster[data-justify="center"] { justify-content: center; }
.cluster[data-justify="end"] { justify-content: flex-end; }
.cluster[data-justify="between"] { justify-content: space-between; }
.cluster[data-align="start"] { align-items: flex-start; }
.cluster[data-align="center"] { align-items: center; }
.cluster[data-align="end"] { align-items: flex-end; }
.cluster[data-align="stretch"] { align-items: stretch; }
`
  )

  await fs.writeFile(
    path.join(primitivesDir, 'grid.css'),
    `/**
 * Joinery Grid Primitive
 */
.grid {
  display: grid;
  gap: var(--joinery-grid-gap, var(--joinery-space-related, 0.75rem));
  --joinery-grid-min: 15rem;
}
@supports (width: min(var(--joinery-grid-min), 100%)) {
  .grid {
    grid-template-columns: repeat(auto-fit, minmax(min(var(--joinery-grid-min), 100%), 1fr));
  }
}
.grid[data-min="sm"] { --joinery-grid-min: 10rem; }
.grid[data-min="md"] { --joinery-grid-min: 15rem; }
.grid[data-min="lg"] { --joinery-grid-min: 20rem; }
.grid[data-min="xl"] { --joinery-grid-min: 25rem; }
.grid[data-gap="none"] { --joinery-grid-gap: 0; }
.grid[data-gap="tight"] { --joinery-grid-gap: var(--joinery-space-tight, 0.25rem); }
.grid[data-gap="related"] { --joinery-grid-gap: var(--joinery-space-related, 0.75rem); }
.grid[data-gap="distinct"] { --joinery-grid-gap: var(--joinery-space-distinct, 1.5rem); }
`
  )

  await fs.writeFile(
    path.join(primitivesDir, 'center.css'),
    `/**
 * Joinery Center Primitive
 */
.center {
  box-sizing: content-box;
  max-inline-size: var(--joinery-center-measure, var(--joinery-measure-prose, 65ch));
  margin-inline: auto;
  padding-inline: var(--joinery-center-gutters, var(--joinery-space-related, 0.75rem));
}
.center[data-measure="narrow"] { --joinery-center-measure: var(--joinery-measure-narrow, 45ch); }
.center[data-measure="prose"] { --joinery-center-measure: var(--joinery-measure-prose, 65ch); }
.center[data-measure="wide"] { --joinery-center-measure: var(--joinery-measure-wide, 85ch); }
.center[data-measure="full"] { --joinery-center-measure: none; }
.center[data-intrinsic] {
  display: flex;
  flex-direction: column;
  align-items: center;
}
.center[data-no-gutters] { padding-inline: 0; }
`
  )

  await fs.writeFile(
    path.join(primitivesDir, 'box.css'),
    `/**
 * Joinery Box Primitive
 */
.box {
  padding: var(--joinery-box-padding, var(--joinery-space-related, 0.75rem));
  border: var(--joinery-box-border-width, 1px) solid var(--border, currentColor);
  border-radius: var(--joinery-radius-rounded, 0.5rem);
  color: inherit;
  background-color: transparent;
}
.box * { color: inherit; }
.box[data-padding="none"] { --joinery-box-padding: 0; }
.box[data-padding="tight"] { --joinery-box-padding: var(--joinery-space-tight, 0.25rem); }
.box[data-padding="related"] { --joinery-box-padding: var(--joinery-space-related, 0.75rem); }
.box[data-padding="distinct"] { --joinery-box-padding: var(--joinery-space-distinct, 1.5rem); }
.box[data-border="none"] { border: none; }
.box[data-invert] {
  color: var(--background, #ffffff);
  background-color: var(--foreground, #1a1a1a);
}
.box[data-pattern="card"] {
  border: none;
  background-color: var(--card, var(--background, #ffffff));
  box-shadow: var(--joinery-elevation-raised);
}
`
  )

  s.stop('CSS files written')

  if (config.useReact && config.reactPath) {
    s.start('Writing React components')

    const ext = config.typescript ? 'tsx' : 'jsx'
    const typeImport = config.typescript
      ? "import type { ElementType, ReactNode, HTMLAttributes, CSSProperties } from 'react'"
      : ''
    const propsType = config.typescript ? ': Props' : ''

    await fs.writeFile(
      path.join(config.reactPath, `Stack.${ext}`),
      `${typeImport}

${
  config.typescript
    ? `type Gap = 'none' | 'tight' | 'related' | 'distinct' | 'section' | 'page'

interface Props extends HTMLAttributes<HTMLElement> {
  gap?: Gap
  recursive?: boolean
  splitAfter?: 1 | 2 | 3 | 4 | 5
  as?: ElementType
  children: ReactNode
}`
    : ''
}

export function Stack({
  gap,
  recursive,
  splitAfter,
  as: Tag = 'div',
  children,
  className = '',
  ...props
}${propsType}) {
  return (
    <Tag
      className={\`stack \${className}\`.trim()}
      data-gap={gap}
      data-recursive={recursive || undefined}
      data-split-after={splitAfter}
      {...props}
    >
      {children}
    </Tag>
  )
}
`
    )

    await fs.writeFile(
      path.join(config.reactPath, `Cluster.${ext}`),
      `${typeImport}

${
  config.typescript
    ? `type Gap = 'none' | 'tight' | 'related' | 'distinct'
type Justify = 'start' | 'center' | 'end' | 'between'
type Align = 'start' | 'center' | 'end' | 'stretch'

interface Props extends HTMLAttributes<HTMLElement> {
  gap?: Gap
  justify?: Justify
  align?: Align
  as?: ElementType
  children: ReactNode
}`
    : ''
}

export function Cluster({
  gap,
  justify,
  align,
  as: Tag = 'div',
  children,
  className = '',
  ...props
}${propsType}) {
  return (
    <Tag
      className={\`cluster \${className}\`.trim()}
      data-gap={gap}
      data-justify={justify}
      data-align={align}
      {...props}
    >
      {children}
    </Tag>
  )
}
`
    )

    await fs.writeFile(
      path.join(config.reactPath, `Grid.${ext}`),
      `${typeImport}

${
  config.typescript
    ? `type MinWidth = 'sm' | 'md' | 'lg' | 'xl'
type Gap = 'none' | 'tight' | 'related' | 'distinct'

interface Props extends HTMLAttributes<HTMLElement> {
  min?: MinWidth
  minWidth?: string
  gap?: Gap
  as?: ElementType
  children: ReactNode
}`
    : ''
}

export function Grid({
  min,
  minWidth,
  gap,
  as: Tag = 'div',
  children,
  className = '',
  style,
  ...props
}${propsType}) {
  const customStyle${config.typescript ? ': CSSProperties' : ''} = {
    ...style,
    ...(minWidth && { '--joinery-grid-min': minWidth }),
  }

  return (
    <Tag
      className={\`grid \${className}\`.trim()}
      data-min={minWidth ? undefined : min}
      data-gap={gap}
      style={minWidth ? customStyle : style}
      {...props}
    >
      {children}
    </Tag>
  )
}
`
    )

    await fs.writeFile(
      path.join(config.reactPath, `Center.${ext}`),
      `${typeImport}

${
  config.typescript
    ? `type Measure = 'narrow' | 'prose' | 'wide' | 'full'

interface Props extends HTMLAttributes<HTMLElement> {
  measure?: Measure
  intrinsic?: boolean
  noGutters?: boolean
  as?: ElementType
  children: ReactNode
}`
    : ''
}

export function Center({
  measure,
  intrinsic,
  noGutters,
  as: Tag = 'div',
  children,
  className = '',
  ...props
}${propsType}) {
  return (
    <Tag
      className={\`center \${className}\`.trim()}
      data-measure={measure}
      data-intrinsic={intrinsic || undefined}
      data-no-gutters={noGutters || undefined}
      {...props}
    >
      {children}
    </Tag>
  )
}
`
    )

    await fs.writeFile(
      path.join(config.reactPath, `Box.${ext}`),
      `${typeImport}

${
  config.typescript
    ? `type Padding = 'none' | 'tight' | 'related' | 'distinct'
type Border = 'none' | 'thin' | 'medium' | 'thick'
type Pattern = 'card' | 'filled' | 'well'

interface Props extends HTMLAttributes<HTMLElement> {
  padding?: Padding
  border?: Border
  invert?: boolean
  pattern?: Pattern
  as?: ElementType
  children: ReactNode
}`
    : ''
}

export function Box({
  padding,
  border,
  invert,
  pattern,
  as: Tag = 'div',
  children,
  className = '',
  ...props
}${propsType}) {
  return (
    <Tag
      className={\`box \${className}\`.trim()}
      data-padding={padding}
      data-border={border}
      data-invert={invert || undefined}
      data-pattern={pattern}
      {...props}
    >
      {children}
    </Tag>
  )
}
`
    )

    await fs.writeFile(
      path.join(config.reactPath, `index.${config.typescript ? 'ts' : 'js'}`),
      `export { Stack } from './Stack'
export { Cluster } from './Cluster'
export { Grid } from './Grid'
export { Center } from './Center'
export { Box } from './Box'
`
    )

    s.stop('React components written')
  }

  s.start('Writing config')
  await fs.writeFile(
    'joinery.json',
    JSON.stringify(
      {
        cssPath: config.cssPath,
        reactPath: config.useReact ? config.reactPath : null,
        typescript: config.typescript,
        primitives: ['stack', 'cluster', 'grid', 'center', 'box'],
      },
      null,
      2
    )
  )
  s.stop('Config written')

  p.outro(pc.green('✓ Joinery initialized!'))

  console.log('')
  console.log(pc.dim('Next steps:'))
  console.log('')
  console.log(`  ${pc.cyan('1.')} Import the CSS in your app:`)
  console.log(pc.dim(`     @import '${config.cssPath}/index.css';`))
  console.log('')
  if (config.useReact) {
    console.log(`  ${pc.cyan('2.')} Use the components:`)
    console.log(pc.dim(`     import { Stack, Center } from '${config.reactPath}'`))
    console.log('')
  }
}
