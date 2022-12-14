const baseRollupConfig = require('../../scripts/rollup.base')
const postcss = require('rollup-plugin-postcss')
const NpmImport = require('less-plugin-npm-import')
const pkg = require('./package.json')

module.exports = baseRollupConfig({
  filename: 'index',
  targetName: pkg.name,
  input: 'src/index.tsx',
  plugins: [
    postcss({
      minimize: true,
      extract: true,
      use: {
        less: {
          plugins: [new NpmImport({ prefix: '~' })],
          javascriptEnabled: true,
        },
      },
    }),
  ],
})
