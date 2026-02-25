import virtual from '@rollup/plugin-virtual'
import typescript from '@rollup/plugin-typescript'
import resolve from '@rollup/plugin-node-resolve'
import commonjs from '@rollup/plugin-commonjs'
import { copy } from '@web/rollup-plugin-copy'
import path from 'path'
import { fileURLToPath } from 'url'
import { unlink } from 'fs/promises'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const commonOutput = {
  dir: 'dist'
}

function deleteVirtualOutputPlugin() {
  return {
    name: 'delete-virtual-output',
    closeBundle: async() => {
      const fileToDelete = path.resolve(__dirname,
          'dist/_virtual_placeholder.js')
      try {
        await unlink(fileToDelete)
        console.log(`Deleted ${fileToDelete}`)
      } catch (e) {
        if (e.code !== 'ENOENT') {
          console.warn(`Failed to delete ${fileToDelete}:`, e)
        }
      }
    }
  }
}

const commonPlugins = [
  resolve({
    browser: true,
  }),
  commonjs(),
  typescript({
    tsconfig: './tsconfig.json'
  })
]

export default [
  // 虚拟构建任务，只用来执行 copy
  {
    input: 'placeholder.js',
    plugins: [
      virtual({
        'placeholder.js': ''
      }),
      copy({ patterns: '**/*.{svg,jpg,json,png,html}', rootDir: './src' }),
      deleteVirtualOutputPlugin()
    ],
    output: {
      dir: 'dist'
    }
  },
  {
    input: 'src/options/index.ts',
    output: {
      file: 'dist/options/index.js',
      format: 'iife',
      sourcemap: true
    },
    plugins: commonPlugins
  },
  {
    input: 'src/content_script_main.ts',
    output: {
      file: 'dist/content_script_main.js',
      format: 'iife',
      sourcemap: true
    },
    plugins: commonPlugins
  },
  {
    input: {
      'service_worker': 'src/background/service_worker.ts'
    },
    output: {
      ...commonOutput,
      format: 'iife',
      entryFileNames: '[name].js'
    },
    plugins: commonPlugins
  }
]
