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
          patterns: '*',
          exclude: '*.js',
          rootDir: 'src/'
        })
    ]
  },
  {

    input: {
      'content_script_bilibili_video': 'src/content_script_bilibili_video.js',
    },
    output: {
      ...commonOutput,
      format: 'iife',
      entryFileNames: '[name].js',
    },
  },
];
