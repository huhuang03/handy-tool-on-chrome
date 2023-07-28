import ts from 'rollup-plugin-ts'
import resolve from '@rollup/plugin-node-resolve'
import { copy } from '@web/rollup-plugin-copy'
import alias from '@rollup/plugin-alias'
import path from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const commonOutput = {
  'dir': 'dist'
}

const commonPlugins = [
  ts(),
  alias({
    entries: [
      { find: '@', replacement: path.resolve(__dirname, 'src') }
    ]
  })
]

export default [
  {
    input: {
      'content_script_main': 'src/content_script_main.ts'
    },
    output: {
      ...commonOutput,
      format: 'iife',
      entryFileNames: '[name].js'
    },
    plugins: [
      copy({
        patterns: '**/*',
        exclude: ['*.js', '*.ts'],
        rootDir: 'src/'
      }),
      resolve(),
      ...commonPlugins
    ]
  }
]
