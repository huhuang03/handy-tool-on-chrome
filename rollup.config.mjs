import virtual from '@rollup/plugin-virtual'
import typescript from '@rollup/plugin-typescript'
import resolve from '@rollup/plugin-node-resolve'
import commonjs from '@rollup/plugin-commonjs' // 加这个！
import copy from 'rollup-plugin-copy'
import alias from '@rollup/plugin-alias'
import path from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const commonOutput = {
  dir: 'dist'
}

const commonPlugins = [
  resolve({
    browser: true,
    extensions: ['.ts', '.js']
  }),
  commonjs(),
  alias({
    entries: [
      { find: '@', replacement: path.resolve(__dirname, 'src') }
    ]
  }),
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
      copy({
        targets: [
            { src: ['src/**/*.json', 'src/**/*.css', 'src/**/*.html'], dest: 'dist' },
        ]
      })
    ],
    output: {
      dir: 'dist'
    }
  },

  // 实际构建 content_script_main.ts
  {
    input: {
      'content_script_main': 'src/content_script_main.ts'
    },
    output: {
      ...commonOutput,
      format: 'iife',
      entryFileNames: '[name].js'
    },
    plugins: commonPlugins
  }
]
