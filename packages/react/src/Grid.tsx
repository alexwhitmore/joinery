import type { CSSProperties, ElementType, HTMLAttributes, ReactNode } from 'react'

type MinWidth = 'sm' | 'md' | 'lg' | 'xl' | 'prose'
type Gap = 'none' | 'tight' | 'related' | 'distinct' | 'section'
type Cols = '2' | '3' | '4'
type Align = 'start' | 'center' | 'end'

export interface GridProps extends HTMLAttributes<HTMLElement> {
  /** Preset minimum column width */
  min?: MinWidth
  /** Custom minimum column width (CSS value) */
  minWidth?: string
  /** Gap between grid items */
  gap?: Gap
  /** Fixed column count (use sparingly) */
  cols?: Cols
  /** Vertical alignment of items */
  align?: Align
  /** HTML element to render as */
  as?: ElementType
  children: ReactNode
}

/**
 * Grid - Auto-fit responsive grid
 *
 * Creates a grid that automatically adjusts column count based on
 * available space. No breakpoints needed.
 *
 * @example
 * ```tsx
 * <Grid min="md" gap="related">
 *   <Card>Item 1</Card>
 *   <Card>Item 2</Card>
 *   <Card>Item 3</Card>
 * </Grid>
 * ```
 *
 * @example
 * Custom minimum width
 * ```tsx
 * <Grid minWidth="300px" gap="distinct">
 *   ...
 * </Grid>
 * ```
 */
export function Grid({
  min,
  minWidth,
  gap,
  cols,
  align,
  as: Tag = 'div',
  children,
  className = '',
  style,
  ...props
}: GridProps) {
  const customStyle: CSSProperties = {
    ...style,
    ...(minWidth && ({ '--joinery-grid-min': minWidth } as CSSProperties)),
  }

  return (
    <Tag
      className={`grid ${className}`.trim()}
      data-min={minWidth ? undefined : min}
      data-gap={gap}
      data-cols={cols}
      data-align={align}
      style={minWidth ? customStyle : style}
      {...props}>
      {children}
    </Tag>
  )
}
