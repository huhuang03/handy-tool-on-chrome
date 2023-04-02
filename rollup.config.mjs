import ts from 'rollup-plugin-ts'
import resolve from '@rollup/plugin-node-resolve';
import {copy} from '@web/rollup-plugin-copy'

const commonOutput = {
  "dir": "dist"
}

export default [
  {
    input: {
      'content_script_main': 'src/content_script_main.js',
    },
    output: {
      ...commonOutput,
      format: 'iife',
      entryFileNames: '[name].js',
    },
    plugins: [
        copy({
          patterns: '**/*',
          exclude: ['*.js', '*.ts'],
          rootDir: 'src/'
        })
    ]
  },
  {
    plugins: [resolve(), ts()],
    input: {
      'content_script_bilibili_video': 'src/content_script_bilibili_video.ts',
    },
    output: {
      ...commonOutput,
      format: 'iife',
      entryFileNames: '[name].js',
    },
  },
];
