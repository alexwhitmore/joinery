import * as p from '@clack/prompts'
import fs from 'fs-extra'
import pc from 'picocolors'

interface Config {
  cssPath: string
  reactPath: string | null
  typescript: boolean
  primitives: string[]
}

const AVAILABLE_PRIMITIVES = [
  'stack',
  'cluster',
  'grid',
  'center',
  'box',
  // TODO: Add remaining primitives
  // 'sidebar',
  // 'switcher',
  // 'cover',
  // 'frame',
  // 'reel',
  // 'surface',
]

export async function add(primitives: string[], options: { all?: boolean }) {
  if (!(await fs.pathExists('joinery.json'))) {
    p.log.error('Joinery not initialized. Run `joinery init` first.')
    process.exit(1)
  }

  const config: Config = await fs.readJson('joinery.json')

  let toAdd: string[]

  if (options.all) {
    toAdd = AVAILABLE_PRIMITIVES
  } else if (primitives.length === 0) {
    const selected = await p.multiselect({
      message: 'Which primitives do you want to add?',
      options: AVAILABLE_PRIMITIVES.map((name) => ({
        value: name,
        label: name.charAt(0).toUpperCase() + name.slice(1),
        hint: config.primitives.includes(name) ? 'already installed' : undefined,
      })),
      required: true,
    })

    if (p.isCancel(selected)) {
      p.cancel('Cancelled.')
      process.exit(0)
    }

    toAdd = selected as string[]
  } else {
    const invalid = primitives.filter((p) => !AVAILABLE_PRIMITIVES.includes(p))
    if (invalid.length > 0) {
      p.log.error(`Unknown primitives: ${invalid.join(', ')}`)
      p.log.info(`Available: ${AVAILABLE_PRIMITIVES.join(', ')}`)
      process.exit(1)
    }
    toAdd = primitives
  }

  const newPrimitives = toAdd.filter((p) => !config.primitives.includes(p))

  if (newPrimitives.length === 0) {
    p.log.info('All selected primitives are already installed.')
    return
  }

  const s = p.spinner()
  s.start(`Adding ${newPrimitives.join(', ')}`)

  config.primitives = [...new Set([...config.primitives, ...newPrimitives])]

  await fs.writeJson('joinery.json', config, { spaces: 2 })

  s.stop(`Added ${newPrimitives.join(', ')}`)

  p.log.success(pc.green('✓ Primitives added!'))
  p.log.info("Don't forget to import any new CSS files.")
}
