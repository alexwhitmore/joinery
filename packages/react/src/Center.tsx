import type { ElementType, HTMLAttributes, ReactNode } from 'react'

type Measure = 'narrow' | 'prose' | 'wide' | 'full'
type Gutters = 'none' | 'related' | 'distinct' | 'section'

export interface CenterProps extends HTMLAttributes<HTMLElement> {
  /** Maximum width of centered content */
  measure?: Measure
  /** Center child elements based on their content width */
  intrinsic?: boolean
  /** Center text alignment as well */
  textCenter?: boolean
  /** Gutter size (minimum space on sides) */
  gutters?: Gutters
  /** Remove gutters entirely */
  noGutters?: boolean
  /** HTML element to render as */
  as?: ElementType
  children: ReactNode
}

/**
 * Center - Horizontally centered content column
 *
 * Centers content with a max-width for readability. Uses auto margins
 * for centering and optional gutters for narrow viewports.
 *
 * @example
 * ```tsx
 * <Center>
 *   <article>Centered content with readable measure</article>
 * </Center>
 * ```
 *
 * @example
 * Wide content
 * ```tsx
 * <Center measure="wide">
 *   <table>...</table>
 * </Center>
 * ```
 *
 * @example
 * Intrinsic centering (centers narrow children)
 * ```tsx
 * <Center intrinsic>
 *   <button>Centered button</button>
 * </Center>
 * ```
 */
export function Center({
  measure,
  intrinsic,
  textCenter,
  gutters,
  noGutters,
  as: Tag = 'div',
  children,
  className = '',
  ...props
}: CenterProps) {
  return (
    <Tag
      className={`center ${className}`.trim()}
      data-measure={measure}
      data-intrinsic={intrinsic || undefined}
      data-text-center={textCenter || undefined}
      data-gutters={gutters}
      data-no-gutters={noGutters || undefined}
      {...props}>
      {children}
    </Tag>
  )
}
