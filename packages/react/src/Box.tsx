import type { ElementType, HTMLAttributes, ReactNode } from 'react'

type Padding = 'none' | 'tight' | 'related' | 'distinct' | 'section'
type Border = 'none' | 'thin' | 'medium' | 'thick'
type Pattern = 'card' | 'filled' | 'well'

export interface BoxProps extends HTMLAttributes<HTMLElement> {
  /** Internal padding */
  padding?: Padding
  /** Border width */
  border?: Border
  /** Invert colors (dark background, light text) */
  invert?: boolean
  /** Common box patterns */
  pattern?: Pattern
  /** HTML element to render as */
  as?: ElementType
  children: ReactNode
}

/**
 * Box - Padding container with optional border/background
 *
 * Handles intrinsic box styles: padding, border, background.
 * Use Box for individual elements, Stack/Cluster for spacing between elements.
 *
 * @example
 * ```tsx
 * <Box padding="distinct">
 *   <p>Padded content</p>
 * </Box>
 * ```
 *
 * @example
 * Card pattern
 * ```tsx
 * <Box pattern="card">
 *   <h3>Card Title</h3>
 *   <p>Card content with shadow</p>
 * </Box>
 * ```
 *
 * @example
 * Inverted box
 * ```tsx
 * <Box invert padding="related">
 *   <p>Light text on dark background</p>
 * </Box>
 * ```
 */
export function Box({
  padding,
  border,
  invert,
  pattern,
  as: Tag = 'div',
  children,
  className = '',
  ...props
}: BoxProps) {
  return (
    <Tag
      className={`box ${className}`.trim()}
      data-padding={padding}
      data-border={border}
      data-invert={invert || undefined}
      data-pattern={pattern}
      {...props}>
      {children}
    </Tag>
  )
}
