import type { ElementType, HTMLAttributes, ReactNode } from 'react'

type Gap = 'none' | 'tight' | 'related' | 'distinct' | 'section' | 'page'

export interface StackProps extends HTMLAttributes<HTMLElement> {
  /** Semantic gap between children */
  gap?: Gap
  /** Apply spacing recursively to all descendants */
  recursive?: boolean
  /** Push elements after this index to the bottom (1-5) */
  splitAfter?: 1 | 2 | 3 | 4 | 5
  /** HTML element to render as */
  as?: ElementType
  children: ReactNode
}

/**
 * Stack - Vertical rhythm between child elements
 *
 * Injects consistent vertical space between children using the
 * "owl selector" (* + *). No trailing margins, no double-spacing.
 *
 * @example
 * ```tsx
 * <Stack gap="section">
 *   <header>...</header>
 *   <main>...</main>
 *   <footer>...</footer>
 * </Stack>
 * ```
 *
 * @example
 * Split stack (push actions to bottom)
 * ```tsx
 * <Stack splitAfter={2}>
 *   <h2>Title</h2>
 *   <p>Description</p>
 *   <button>Action pushed to bottom</button>
 * </Stack>
 * ```
 */
export function Stack({ gap, recursive, splitAfter, as: Tag = 'div', children, className = '', ...props }: StackProps) {
  return (
    <Tag
      className={`stack ${className}`.trim()}
      data-gap={gap}
      data-recursive={recursive || undefined}
      data-split-after={splitAfter}
      {...props}>
      {children}
    </Tag>
  )
}
