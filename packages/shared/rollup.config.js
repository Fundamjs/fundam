const baseRollupConfig = require('../../scripts/rollup.base')
const pkg = require('./package.json')

module.exports = baseRollupConfig({ filename: 'index', targetName: pkg.name, plugins: [] })

