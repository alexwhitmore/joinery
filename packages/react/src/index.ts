/**
 * Joinery React Components
 *
 * Thin wrappers around Joinery CSS primitives.
 * These components output the correct classes and data attributes.
 *
 * Requires: @joinery/primitives CSS to be imported in your app
 *
 * @example
 * ```tsx
 * import { Stack, Cluster, Grid, Center, Box } from '@joinery/react'
 *
 * function Page() {
 *   return (
 *     <Center>
 *       <Stack gap="section">
 *         <header>...</header>
 *         <main>...</main>
 *       </Stack>
 *     </Center>
 *   )
 * }
 * ```
 */

export { Stack } from './Stack'
export type { StackProps } from './Stack'

export { Cluster } from './Cluster'
export type { ClusterProps } from './Cluster'

export { Grid } from './Grid'
export type { GridProps } from './Grid'

export { Center } from './Center'
export type { CenterProps } from './Center'

export { Box } from './Box'
export type { BoxProps } from './Box'
