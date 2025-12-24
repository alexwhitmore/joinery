import type { ElementType, HTMLAttributes, ReactNode } from 'react'

type Gap = 'none' | 'tight' | 'related' | 'distinct'
type Justify = 'start' | 'center' | 'end' | 'between' | 'around' | 'evenly'
type Align = 'start' | 'center' | 'end' | 'stretch' | 'baseline'
type Pattern = 'header' | 'center' | 'actions'

export interface ClusterProps extends HTMLAttributes<HTMLElement> {
  /** Semantic gap between children */
  gap?: Gap
  /** Horizontal alignment */
  justify?: Justify
  /** Vertical alignment */
  align?: Align
  /** Common layout patterns */
  pattern?: Pattern
  /** HTML element to render as */
  as?: ElementType
  children: ReactNode
}

/**
 * Cluster - Horizontal grouping with automatic wrapping
 *
 * Groups elements horizontally using flexbox. Elements wrap naturally
 * when space runs out. Perfect for tags, buttons, nav items.
 *
 * @example
 * ```tsx
 * <Cluster gap="tight">
 *   <Tag>React</Tag>
 *   <Tag>TypeScript</Tag>
 *   <Tag>CSS</Tag>
 * </Cluster>
 * ```
 *
 * @example
 * Header pattern (logo left, nav right)
 * ```tsx
 * <Cluster pattern="header">
 *   <Logo />
 *   <Nav />
 * </Cluster>
 * ```
 */
export function Cluster({
  gap,
  justify,
  align,
  pattern,
  as: Tag = 'div',
  children,
  className = '',
  ...props
}: ClusterProps) {
  return (
    <Tag
      className={`cluster ${className}`.trim()}
      data-gap={gap}
      data-justify={justify}
      data-align={align}
      data-pattern={pattern}
      {...props}>
      {children}
    </Tag>
  )
}
